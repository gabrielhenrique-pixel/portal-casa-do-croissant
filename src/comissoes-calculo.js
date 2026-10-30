import {
  carregarClientesRentabilidade
} from './clientes-rentabilidade.js';

import {
  selecionarRegra
} from './comissoes-cadastro.js';

const VERSAO_CALCULO = 'previa-v1';

// Identificação na origem Sankhya.
// Não confundir com o ID interno do cadastro do portal.
const SEM_COMISSAO = new Set(['sankhya:10']);
const FORA_DESTA_ETAPA = new Set(['sankhya:17']);

function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function erro(mensagem, status = 400) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

function validarMes(valor) {
  const mes = String(valor || '').trim();

  if (!/^\d{4}-\d{2}$/.test(mes)) {
    throw erro('Informe o mês no formato AAAA-MM.');
  }

  const [ano, numeroMes] = mes.split('-').map(Number);

  if (
    ano < 2026 ||
    ano > 2100 ||
    numeroMes < 1 ||
    numeroMes > 12 ||
    mes < '2026-10'
  ) {
    throw erro('Informe um mês válido a partir de outubro de 2026.');
  }

  return mes;
}

// Valores monetários são trabalhados como inteiros
// com quatro casas decimais, evitando somas com ponto flutuante.
function valor4(valor) {
  const texto = String(valor ?? '').trim();
  const partes = /^(-?)(\d+)(?:\.(\d{1,4}))?$/.exec(texto);

  if (!partes) {
    throw new Error('Valor monetário inválido.');
  }

  const inteiro =
    BigInt(partes[2]) * 10000n +
    BigInt((partes[3] || '').padEnd(4, '0'));

  return partes[1] === '-' ? -inteiro : inteiro;
}

function decimal4(valor) {
  const negativo = valor < 0n;
  const absoluto = negativo ? -valor : valor;

  return (
    (negativo ? '-' : '') +
    (absoluto / 10000n).toString() +
    '.' +
    (absoluto % 10000n).toString().padStart(4, '0')
  );
}

function aplicarPercentual(base, percentual) {
  // O cadastro armazena 2,50% como 250.
  if (
    !Number.isInteger(percentual) ||
    percentual < 0 ||
    percentual > 10000
  ) {
    throw new Error('Percentual inválido.');
  }

  if (base < 0n) {
    throw new Error('Base negativa.');
  }

  // Arredondamento para quatro casas.
  return (base * BigInt(percentual) + 5000n) / 10000n;
}

function pendente(linha, status, motivo) {
  return {
    ...linha,
    status,
    motivo,
    baseCalculo: null,
    percentual: null,
    regraAplicada: null,
    comissao: null
  };
}

function calcularMovimento(movimento, contexto) {
  const chaveVendedor =
    movimento.origem + ':' + movimento.vendedorCodigo;

  const linha = {
    chaveOrigem: movimento.chaveOrigem,
    financeiroId: movimento.financeiroId,
    documentoId: movimento.documentoId,
    numeroNota: movimento.numeroNota,
    tipo: movimento.tipo,
    dataBaixa: movimento.dataBaixa,

    vendedorCodigo: movimento.vendedorCodigo,
    vendedorNome: movimento.vendedorNome,

    clienteCodigo: movimento.clienteCodigo,
    clienteNome: movimento.clienteNome,

    valorNota: movimento.valorNota,
    valorTitulo: movimento.valorTitulo,
    valorBaixa: movimento.valorBaixa,
    descontoFinanceiro: movimento.descontoFinanceiro,
    jurosFinanceiro: movimento.jurosFinanceiro,
    multaFinanceira: movimento.multaFinanceira
  };

  if (SEM_COMISSAO.has(chaveVendedor)) {
    return {
      ...linha,
      status: 'SEM_COMISSAO',
      motivo: 'Vendedor definido como não comissionado.',
      baseCalculo: null,
      percentual: null,
      regraAplicada: 'sem_comissao',
      comissao: '0.0000'
    };
  }

  if (
    FORA_DESTA_ETAPA.has(chaveVendedor) ||
    movimento.regraStatus === 'REGRA_PENDENTE'
  ) {
    return pendente(
      linha,
      'FORA_DESTA_ETAPA',
      'Regra específica ainda não implementada.'
    );
  }

  const vendedor = contexto.vendedores.get(chaveVendedor);

  if (!vendedor) {
    return pendente(
      linha,
      'SEM_CADASTRO',
      'Vendedor sem cadastro de comissão no portal.'
    );
  }

  if (vendedor.dados.ativo !== true) {
    return pendente(
      linha,
      'CADASTRO_INATIVO',
      'Cadastro do vendedor está inativo.'
    );
  }

  if (!['venda', 'devolucao'].includes(movimento.tipo)) {
    return pendente(
      linha,
      'CONFERIR_DADOS',
      'Tipo de movimento não reconhecido.'
    );
  }

  if (!Array.isArray(movimento.alertas) || movimento.alertas.length) {
    return pendente(
      linha,
      'CONFERIR_DADOS',
      'Movimento com alerta na importação.'
    );
  }

  const chaveDocumento = movimento.origem + ':' + movimento.documentoId;

  if ((contexto.quantidadePorDocumento.get(chaveDocumento) || 0) > 1) {
    return pendente(
      linha,
      'CONFERIR_PARCELAMENTO',
      'Há mais de um financeiro da mesma nota neste período.'
    );
  }

  const cliente = contexto.clientes.get(movimento.clienteCodigo);
  const rede = String(cliente?.rede || '').trim();

  if (!Array.isArray(vendedor.dados.excecoes)) {
    return pendente(
      linha,
      'CONFERIR_CADASTRO',
      'Lista de exceções do vendedor inválida.'
    );
  }

  const possuiExcecaoCliente = vendedor.dados.excecoes.some(
    item =>
      item.tipo === 'cliente' &&
      item.alvo === movimento.clienteCodigo
  );

  const possuiExcecaoRede = vendedor.dados.excecoes.some(
    item => item.tipo === 'rede'
  );

  // Sem conhecer a rede, não escolhe o padrão quando
  // pode existir uma exceção de rede aplicável.
  if (!possuiExcecaoCliente && possuiExcecaoRede && !rede) {
    return pendente(
      linha,
      'CONFERIR_REDE',
      'Cliente sem rede identificada para selecionar a regra.'
    );
  }

  try {
    const nota = valor4(movimento.valorNota);
    const titulo = valor4(movimento.valorTitulo);
    const baixa = valor4(movimento.valorBaixa);
    const desconto = valor4(movimento.descontoFinanceiro);
    const juros = valor4(movimento.jurosFinanceiro);
    const multa = valor4(movimento.multaFinanceira);
    const jurosNota = valor4(movimento.jurosNota);

    if (
      nota <= 0n ||
      titulo <= 0n ||
      baixa < 0n ||
      desconto < 0n ||
      juros < 0n ||
      multa < 0n
    ) {
      return pendente(
        linha,
        'CONFERIR_DADOS',
        'Valores fora dos casos financeiros já conferidos.'
      );
    }

    if (nota !== titulo) {
      return pendente(
        linha,
        'CONFERIR_BASE',
        'O valor da nota difere do valor do título.'
      );
    }

    if (jurosNota !== 0n) {
      return pendente(
        linha,
        'CONFERIR_BASE',
        'Nota com juros no cabeçalho ainda não validada.'
      );
    }

    if (baixa !== titulo - desconto + juros + multa) {
      return pendente(
        linha,
        'CONFERIR_BAIXA',
        'Os componentes financeiros não reconciliam com a baixa.'
      );
    }

    const regra = selecionarRegra(
      vendedor.dados,
      movimento.clienteCodigo,
      rede,
      movimento.tipo
    );

    // O destaque já compõe o valor da nota.
    // Não somar esse campo novamente.
    const base = movimento.tipo === 'venda'
      ? baixa - juros - multa
      : nota;

    if (base < 0n) {
      return pendente(
        linha,
        'CONFERIR_BASE',
        'A base calculada ficou negativa.'
      );
    }

    const valor = aplicarPercentual(base, regra.percentual);

    const comissao = movimento.tipo === 'devolucao'
      ? -valor
      : valor;

    return {
      ...linha,
      status: 'CALCULADO_PREVIA',
      motivo: null,
      cadastroId: vendedor.id,
      revisaoCadastro: vendedor.revisao,
      rede: rede || null,

      baseCalculo: decimal4(base),
      percentual: regra.percentual / 100,
      regraAplicada: regra.origem,
      comissao: decimal4(comissao)
    };
  } catch {
    return pendente(
      linha,
      'CONFERIR_DADOS',
      'Não foi possível validar os valores ou percentuais deste movimento.'
    );
  }
}

export async function calcularPreviaComissoes(env, mesInformado) {
  const mes = validarMes(mesInformado);

  // Captura uma versão específica da importação.
  // Uma sincronização paralela não mistura seus itens nesta leitura.
  const importacao = await env.DB.prepare(`
    SELECT
      R.id,
      R.concluido_em,
      R.resumo
    FROM comissao_importacao_periodos P
    INNER JOIN comissao_importacoes R
      ON R.id = P.importacao_atual
     AND R.status = 'CONCLUIDA'
    WHERE P.origem = 'sankhya'
      AND P.mes = ?
  `).bind(mes).first();

  if (!importacao) {
    throw erro('Este mês ainda não possui uma importação concluída.', 409);
  }

  const [itens, cadastros, clientes] = await Promise.all([
    env.DB.prepare(`
      SELECT dados
      FROM comissao_importacao_itens
      WHERE importacao_id = ?
      ORDER BY vendedor_codigo, data_baixa, financeiro_id
    `).bind(importacao.id).all(),

    env.DB.prepare(`
      SELECT
        id,
        origem,
        codigo_origem,
        revisao,
        dados
      FROM comissao_vendedores
    `).all(),

    carregarClientesRentabilidade(env)
  ]);

  const movimentos = (itens.results || []).map(
    item => JSON.parse(item.dados)
  );

  const resumoImportacao = JSON.parse(importacao.resumo);

  if (movimentos.length !== resumoImportacao.total) {
    throw erro('A quantidade de movimentos da importação está divergente.', 409);
  }

  const vendedores = new Map(
    (cadastros.results || []).map(registro => [
      registro.origem + ':' + registro.codigo_origem,
      {
        ...registro,
        dados: JSON.parse(registro.dados)
      }
    ])
  );

  const clientesPorCodigo = new Map(
    clientes.map(cliente => [
      String(cliente.codigoParceiro),
      cliente
    ])
  );

  const quantidadePorDocumento = new Map();

  for (const movimento of movimentos) {
    const chave = movimento.origem + ':' + movimento.documentoId;

    quantidadePorDocumento.set(
      chave,
      (quantidadePorDocumento.get(chave) || 0) + 1
    );
  }

  const contexto = {
    vendedores,
    clientes: clientesPorCodigo,
    quantidadePorDocumento
  };

  const linhas = movimentos.map(
    movimento => calcularMovimento(movimento, contexto)
  );

  const porStatus = {};
  const grupos = new Map();

  let comissaoVendas = 0n;
  let descontoDevolucoes = 0n;
  let calculados = 0;
  let semComissao = 0;
  let foraDaEtapa = 0;
  let pendentes = 0;

  for (const linha of linhas) {
    porStatus[linha.status] = (porStatus[linha.status] || 0) + 1;

    if (!grupos.has(linha.vendedorCodigo)) {
      grupos.set(linha.vendedorCodigo, {
        codigo: linha.vendedorCodigo,
        vendedor: linha.vendedorNome,
        movimentos: 0,
        calculados: 0,
        semComissao: 0,
        foraDaEtapa: 0,
        pendentes: 0,
        vendas: 0n,
        devolucoes: 0n
      });
    }

    const grupo = grupos.get(linha.vendedorCodigo);
    grupo.movimentos++;

    if (linha.status === 'CALCULADO_PREVIA') {
      calculados++;
      grupo.calculados++;

      const valor = valor4(linha.comissao);

      if (linha.tipo === 'venda') {
        comissaoVendas += valor;
        grupo.vendas += valor;
      } else {
        descontoDevolucoes -= valor;
        grupo.devolucoes -= valor;
      }
    } else if (linha.status === 'SEM_COMISSAO') {
      semComissao++;
      grupo.semComissao++;
    } else if (linha.status === 'FORA_DESTA_ETAPA') {
      foraDaEtapa++;
      grupo.foraDaEtapa++;
    } else {
      pendentes++;
      grupo.pendentes++;
    }
  }

  const porVendedor = [...grupos.values()]
    .sort((a, b) => a.vendedor.localeCompare(b.vendedor, 'pt-BR'))
    .map(grupo => ({
      codigo: grupo.codigo,
      vendedor: grupo.vendedor,
      movimentos: grupo.movimentos,
      calculados: grupo.calculados,
      semComissao: grupo.semComissao,
      foraDaEtapa: grupo.foraDaEtapa,
      pendentes: grupo.pendentes,

      // Sem resultado calculado não é o mesmo que comissão zero.
      comissaoVendas: grupo.calculados
        ? decimal4(grupo.vendas)
        : null,

      descontoDevolucoes: grupo.calculados
        ? decimal4(grupo.devolucoes)
        : null,

      comissaoLiquida: grupo.calculados
        ? decimal4(grupo.vendas - grupo.devolucoes)
        : grupo.semComissao === grupo.movimentos
          ? '0.0000'
          : null
    }));

  return {
    etapa: 'Prévia de cálculo — sem fechamento ou pagamento',
    versaoCalculo: VERSAO_CALCULO,
    mes,
    importacaoId: importacao.id,
    dadosImportadosEm: importacao.concluido_em,
    calculadoEm: new Date().toISOString(),

    resumo: {
      totalMovimentos: linhas.length,
      calculados,
      semComissao,
      foraDaEtapa,
      pendentes,
      porStatus,

      comissaoVendas: decimal4(comissaoVendas),
      descontoDevolucoes: decimal4(descontoDevolucoes),
      comissaoLiquida: decimal4(comissaoVendas - descontoDevolucoes),

      observacao:
        'Os totais consideram somente os movimentos calculados. ' +
        'Não incluem valores dos movimentos pendentes ou fora desta etapa.'
    },

    porVendedor,
    linhas
  };
}

export async function conferirCalculoComissoes(request, env, acesso) {
  if (
    !acesso?.session ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.update
  ) {
    return responder({
      error: 'Sem permissão para conferir o cálculo de comissões.'
    }, 403);
  }

  if (request.method !== 'GET') {
    return responder({ error: 'Método não permitido.' }, 405);
  }

  try {
    const url = new URL(request.url);

    const resultado = await calcularPreviaComissoes(
      env,
      url.searchParams.get('mes')
    );

    const financeiro = url.searchParams.get('financeiro');

    if (financeiro) {
      const movimento = resultado.linhas.find(
        linha => linha.financeiroId === financeiro
      );

      if (!movimento) {
        return responder({
          error: 'Financeiro não encontrado na importação deste mês.'
        }, 404);
      }

      return responder({
        mes: resultado.mes,
        versaoCalculo: resultado.versaoCalculo,
        importacaoId: resultado.importacaoId,
        movimento
      });
    }

    const { linhas, ...resumo } = resultado;

    return responder({
      ...resumo,

      casosDeConferencia: linhas.filter(
        linha => ['220369', '214381'].includes(linha.financeiroId)
      ),

      amostraPendencias: linhas.filter(
        linha => ![
          'CALCULADO_PREVIA',
          'SEM_COMISSAO',
          'FORA_DESTA_ETAPA'
        ].includes(linha.status)
      ).slice(0, 20)
    });
  } catch (e) {
    return responder({
      error: e.status
        ? e.message
        : 'Não foi possível concluir a prévia de comissões.'
    }, e.status || 500);
  }
}
