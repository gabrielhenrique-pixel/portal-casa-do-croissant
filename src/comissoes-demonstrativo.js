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
    const previa = await calcularPreviaComissoes(
      env,
      url.searchParams.get('mes')
    );

    // Filtra no servidor ANTES de montar os dados da resposta.
    const linhasPermitidas = podeVerTodos
      ? previa.linhas
      : previa.linhas.filter(
          linha => linha.vendedorCodigo === codigoProprio
        );

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
      mes: previa.mes,
      etapa: 'PREVIA',
      podeVerTodos: Boolean(podeVerTodos),
      vendedorSelecionado: codigoFiltro,

      dadosImportadosEm: previa.dadosImportadosEm,
      calculadoEm: previa.calculadoEm,
      versaoCalculo: previa.versaoCalculo,

      vendedores: [...vendedores.values()].sort(
        (a, b) => a.nome.localeCompare(b.nome, 'pt-BR')
      ),

      resumo: resumir(linhas),
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
