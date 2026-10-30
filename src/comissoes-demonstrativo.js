import {
  calcularPreviaComissoes
} from './comissoes-calculo.js';

function resposta(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function valor4(valor) {
  const partes = /^(-?)(\d+)(?:\.(\d{1,4}))?$/.exec(
    String(valor ?? '').trim()
  );

  if (!partes) {
    throw new Error('Valor monetário inválido.');
  }

  const numero =
    BigInt(partes[2]) * 10000n +
    BigInt((partes[3] || '').padEnd(4, '0'));

  return partes[1] === '-' ? -numero : numero;
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

export function resumir(linhas) {
  let vendas = 0n;
  let devolucoes = 0n;
  let comissaoVendas = 0n;
  let perdaDevolucoes = 0n;

  let calculados = 0;
  let semComissao = 0;
  let foraDaEtapa = 0;
  let pendentes = 0;

  const notasContadas = new Set();

  for (const linha of linhas) {
    // Uma nota com mais de um financeiro não é somada
    // mais de uma vez nos cards de valor das notas.
    const chaveNota = linha.tipo + ':' + linha.documentoId;

    if (!notasContadas.has(chaveNota)) {
      notasContadas.add(chaveNota);

      if (linha.tipo === 'venda') {
        vendas += valor4(linha.valorNota);
      } else if (linha.tipo === 'devolucao') {
        devolucoes += valor4(linha.valorNota);
      }
    }

    if (linha.status === 'CALCULADO_PREVIA') {
      calculados++;

      if (linha.tipo === 'venda') {
        comissaoVendas += valor4(linha.comissao);
      } else {
        perdaDevolucoes -= valor4(linha.comissao);
      }
    } else if (linha.status === 'SEM_COMISSAO') {
      semComissao++;
    } else if (linha.status === 'FORA_DESTA_ETAPA') {
      foraDaEtapa++;
    } else {
      pendentes++;
    }
  }

  // Não apresenta ausência de cálculo como comissão zero.
  const possuiResultado =
    calculados > 0 ||
    (linhas.length > 0 && semComissao === linhas.length);

  return {
    movimentos: linhas.length,
    calculados,
    semComissao,
    foraDaEtapa,
    pendentes,

    vendas: decimal4(vendas),
    devolucoes: decimal4(devolucoes),

    comissaoVendas: possuiResultado
      ? decimal4(comissaoVendas)
      : null,

    perdaDevolucoes: possuiResultado
      ? decimal4(perdaDevolucoes)
      : null,

    comissaoLiquida: possuiResultado
      ? decimal4(comissaoVendas - perdaDevolucoes)
      : null
  };
}

export async function demonstrativoComissoes(
  request,
  env,
  acesso,
  podeVerTodos,
  codigoVinculado
) {
  if (!acesso?.session || !acesso?.permissions?.view) {
    return resposta({ error: 'Acesso não autorizado.' }, 403);
  }

  if (request.method !== 'GET') {
    return resposta({ error: 'Método não permitido.' }, 405);
  }

  const url = new URL(request.url);
  const solicitado = String(
    url.searchParams.get('vendedor') || ''
  ).trim();

  const codigoProprio = String(codigoVinculado || '').trim();

  if (!podeVerTodos && !codigoProprio) {
    return resposta({
      error: 'Seu usuário não possui código de vendedor vinculado.'
    }, 403);
  }

  if (
    !podeVerTodos &&
    solicitado &&
    solicitado !== codigoProprio
  ) {
    return resposta({
      error: 'Você pode consultar somente suas próprias comissões.'
    }, 403);
  }

  const codigoFiltro = podeVerTodos
    ? solicitado
    : codigoProprio;

  try {
     const mes = url.searchParams.get('mes') || '';

    if (
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) ||
      mes < '2026-10' ||
      mes > '2100-12'
    ) {
      return resposta({
        error: 'Informe um mês válido a partir de outubro de 2026.'
      }, 400);
    }

    // codigoFiltro já foi validado pelas permissões acima.
    const consultaFechados = await env.DB.prepare(`
      SELECT *
      FROM comissao_fechamentos
      WHERE mes = ?
        AND origem = 'sankhya'
        AND status = 'FECHADO'
        AND (? = '' OR codigo_origem = ?)
    `).bind(mes, codigoFiltro, codigoFiltro).all();

    const fechados = consultaFechados.results || [];

    const consultaItens = await env.DB.prepare(`
      SELECT
        I.fechamento_id,
        I.calculo_snapshot
      FROM comissao_fechamento_itens I
      INNER JOIN comissao_fechamentos F
        ON F.id = I.fechamento_id
      WHERE F.mes = ?
        AND F.origem = 'sankhya'
        AND F.status = 'FECHADO'
        AND (? = '' OR F.codigo_origem = ?)
    `).bind(mes, codigoFiltro, codigoFiltro).all();

    const itensFechados = consultaItens.results || [];

    for (const fechamento of fechados) {
      const quantidade = itensFechados.filter(
        item => item.fechamento_id === fechamento.id
      ).length;

      if (quantidade !== fechamento.quantidade_movimentos) {
        throw new Error('Quantidade de itens do fechamento divergente.');
      }
    }

    const linhasFechadas = itensFechados.map(item => ({
      ...JSON.parse(item.calculo_snapshot),
      fechamentoId: item.fechamento_id
    }));

    const codigosFechados = new Set(
      fechados.map(item => item.codigo_origem)
    );

    const soFechado = Boolean(codigoFiltro && fechados.length === 1);

    // Quando o vendedor já está fechado, não recalcula sua comissão.
    const previa = soFechado
      ? null
      : await calcularPreviaComissoes(env, mes);

    const linhasDaPrevia = (previa?.linhas || []).filter(linha =>
      !codigosFechados.has(linha.vendedorCodigo) &&
      (podeVerTodos || linha.vendedorCodigo === codigoProprio)
    );

    const linhasPermitidas = [
      ...linhasDaPrevia,
      ...linhasFechadas
    ];

    const etapa = soFechado
      ? 'FECHADO'
      : fechados.length
        ? linhasDaPrevia.length
          ? 'MISTO'
          : 'FECHADO'
        : 'PREVIA';

    const vendedores = new Map();

    for (const linha of linhasPermitidas) {
      vendedores.set(linha.vendedorCodigo, {
        codigo: linha.vendedorCodigo,
        nome: linha.vendedorNome
      });
    }

    const linhas = codigoFiltro
      ? linhasPermitidas.filter(
          linha => linha.vendedorCodigo === codigoFiltro
        )
      : linhasPermitidas;

    linhas.sort((a, b) =>
      a.dataBaixa.localeCompare(b.dataBaixa) ||
      a.vendedorNome.localeCompare(b.vendedorNome, 'pt-BR') ||
      a.numeroNota.localeCompare(b.numeroNota, 'pt-BR', {
        numeric: true
      })
    );

       return resposta({
      mes,
      etapa,
      podeVerTodos: Boolean(podeVerTodos),
      vendedorSelecionado: codigoFiltro,

      dadosImportadosEm: soFechado
        ? fechados[0].dados_importados_em
        : previa?.dadosImportadosEm || null,

      calculadoEm: soFechado
        ? fechados[0].calculado_em
        : previa?.calculadoEm || null,

      versaoCalculo: soFechado
        ? fechados[0].versao_calculo
        : previa?.versaoCalculo || null,

      fechadoEm: soFechado
        ? fechados[0].fechado_em
        : null,

      vendedores: [...vendedores.values()].sort(
        (a, b) => a.nome.localeCompare(b.nome, 'pt-BR')
      ),

      resumo: soFechado
        ? JSON.parse(fechados[0].resumo_snapshot)
        : resumir(linhas),

      linhas
    });
  } catch (e) {
    return resposta({
      error: e.status
        ? e.message
        : 'Não foi possível carregar o demonstrativo.'
    }, e.status || 500);
  }
}
