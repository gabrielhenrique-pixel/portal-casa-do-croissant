export async function listarBscVolumeProduto(request, env) {
  const url = new URL(request.url);
  const hoje = dataHoje();

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    hoje.slice(0, 8) + '01'
  );

  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    return {
      error: 'A integração com o Sankhya ainda não foi configurada.',
      status: 503
    };
  }

  const inicioAnterior = mesmoPeriodoAnoAnterior(inicio);
  const fimAnterior = mesmoPeriodoAnoAnterior(fim);

  const inicioAcumuladoAtual = fim.slice(0, 4) + '-01-01';
  const inicioAcumuladoAnterior =
    fimAnterior.slice(0, 4) + '-01-01';

  const token = await obterTokenSankhya(env);

  const sql = [
    'SELECT',
    '  ITE.CODPROD AS CODIGO_PRODUTO,',
    "  NVL(PRO.DESCRPROD, 'SEM PRODUTO') AS PRODUTO,",

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN NVL(ITE.QTDNEG, 0)',
    '    ELSE 0',
    '  END) AS QUANTIDADE_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN NVL(ITE.QTDNEG, 0)',
    '    ELSE 0',
    '  END) AS QUANTIDADE_ATUAL,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN NVL(ITE.QTDNEG, 0)',
    '    ELSE 0',
    '  END) AS ACUMULADO_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAtual + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN NVL(ITE.QTDNEG, 0)',
    '    ELSE 0',
    '  END) AS ACUMULADO_ATUAL',

    'FROM TGFCAB CAB',
    'INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',

    "WHERE CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    '  AND CAB.CODTIPOPER = 1101',

    'GROUP BY ITE.CODPROD, PRO.DESCRPROD',

    'HAVING SUM(CASE',
    "  WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "   AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '  THEN NVL(ITE.QTDNEG, 0)',
    '  ELSE 0',
    'END) <> 0',

    'OR SUM(CASE',
    "  WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAtual + "', 'YYYY-MM-DD')",
    "   AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '  THEN NVL(ITE.QTDNEG, 0)',
    '  ELSE 0',
    'END) <> 0',

    'ORDER BY PRODUTO'
  ].join('\n');

  const linhas = await executarConsultaSankhya(token, sql);

  const produtos = linhas.map(function(linha) {
    const quantidadeAnterior = numero(linha[2]);
    const quantidadeAtual = numero(linha[3]);
    const acumuladoAnterior = numero(linha[4]);
    const acumuladoAtual = numero(linha[5]);

    return {
      codigoProduto: String(linha[0] || '').trim(),
      produto: String(linha[1] || 'Sem produto').trim(),

      quantidadeAnterior: quantidadeAnterior,
      quantidadeAtual: quantidadeAtual,

      acumuladoAnterior: acumuladoAnterior,
      acumuladoAtual: acumuladoAtual,

      variacao:
        quantidadeAnterior > 0
          ? (quantidadeAtual - quantidadeAnterior) / quantidadeAnterior
          : null,

      variacaoAcumulado:
        acumuladoAnterior > 0
          ? (acumuladoAtual - acumuladoAnterior) / acumuladoAnterior
          : null
    };
  });

  const totalAnterior = produtos.reduce(function(total, produto) {
    return total + produto.quantidadeAnterior;
  }, 0);

  const totalAtual = produtos.reduce(function(total, produto) {
    return total + produto.quantidadeAtual;
  }, 0);

  const totalAcumuladoAnterior = produtos.reduce(function(total, produto) {
    return total + produto.acumuladoAnterior;
  }, 0);

  const totalAcumuladoAtual = produtos.reduce(function(total, produto) {
    return total + produto.acumuladoAtual;
  }, 0);

  return {
    inicio: inicio,
    fim: fim,
    inicioAnterior: inicioAnterior,
    fimAnterior: fimAnterior,

    inicioAcumuladoAnterior: inicioAcumuladoAnterior,
    inicioAcumuladoAtual: inicioAcumuladoAtual,

    produtos: produtos,

    totalAnterior: totalAnterior,
    totalAtual: totalAtual,
    totalAcumuladoAnterior: totalAcumuladoAnterior,
    totalAcumuladoAtual: totalAcumuladoAtual,

    variacaoTotal:
      totalAnterior > 0
        ? (totalAtual - totalAnterior) / totalAnterior
        : null,

    variacaoTotalAcumulado:
      totalAcumuladoAnterior > 0
        ? (totalAcumuladoAtual - totalAcumuladoAnterior) /
          totalAcumuladoAnterior
        : null
  };
}

export async function listarBscDevolucoesVolume(request, env) {
  const url = new URL(request.url);
  const hoje = dataHoje();

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    hoje.slice(0, 8) + '01'
  );

  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    return {
      error: 'A integração com o Sankhya ainda não foi configurada.',
      status: 503
    };
  }

  const inicioAnterior = mesmoPeriodoAnoAnterior(inicio);
  const fimAnterior = mesmoPeriodoAnoAnterior(fim);

  const inicioAcumuladoAtual = fim.slice(0, 4) + '-01-01';
  const inicioAcumuladoAnterior =
    fimAnterior.slice(0, 4) + '-01-01';

  const token = await obterTokenSankhya(env);

  const sql = [
    'SELECT',
    '  ITE.CODPROD AS CODIGO_PRODUTO,',
    "  NVL(PRO.DESCRPROD, 'SEM PRODUTO') AS PRODUTO,",

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN ABS(NVL(ITE.QTDNEG, 0))',
    '    ELSE 0',
    '  END) AS DEVOLUCAO_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN ABS(NVL(ITE.QTDNEG, 0))',
    '    ELSE 0',
    '  END) AS DEVOLUCAO_ATUAL,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN ABS(NVL(ITE.QTDNEG, 0))',
    '    ELSE 0',
    '  END) AS DEVOLUCAO_ACUMULADA_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAtual + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN ABS(NVL(ITE.QTDNEG, 0))',
    '    ELSE 0',
    '  END) AS DEVOLUCAO_ACUMULADA_ATUAL',

    'FROM TGFCAB CAB',
    'INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',

    "WHERE CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '  AND CAB.CODTIPOPER = 1202',
    "  AND CAB.TIPMOV = 'D'",
    "  AND CAB.STATUSNOTA = 'L'",

    'GROUP BY ITE.CODPROD, PRO.DESCRPROD',
    'ORDER BY PRODUTO'
  ].join('\n');

  const linhas = await executarConsultaSankhya(token, sql);

  const devolucoes = linhas.map(function(linha) {
    return {
      codigoProduto: String(linha[0] || '').trim(),
      produto: String(linha[1] || 'Sem produto').trim(),
      devolucaoAnterior: numero(linha[2]),
      devolucaoAtual: numero(linha[3]),
      devolucaoAcumuladaAnterior: numero(linha[4]),
      devolucaoAcumuladaAtual: numero(linha[5])
    };
  });

  const totalAnterior = devolucoes.reduce(function(total, produto) {
    return total + produto.devolucaoAnterior;
  }, 0);

  const totalAtual = devolucoes.reduce(function(total, produto) {
    return total + produto.devolucaoAtual;
  }, 0);

  const totalAcumuladoAnterior = devolucoes.reduce(function(total, produto) {
    return total + produto.devolucaoAcumuladaAnterior;
  }, 0);

  const totalAcumuladoAtual = devolucoes.reduce(function(total, produto) {
    return total + produto.devolucaoAcumuladaAtual;
  }, 0);

  return {
    devolucoes: devolucoes,
    totalAnterior: totalAnterior,
    totalAtual: totalAtual,
    totalAcumuladoAnterior: totalAcumuladoAnterior,
    totalAcumuladoAtual: totalAcumuladoAtual
  };
}

export async function listarBscFinanceiroProduto(request, env) {
  return consultarBscFinanceiroProduto(request, env, false);
}

export async function listarBscDevolucoesFinanceiroProduto(request, env) {
  return consultarBscFinanceiroProduto(request, env, true);
}

async function consultarBscFinanceiroProduto(
  request,
  env,
  ehDevolucao
) {
  const url = new URL(request.url);
  const hoje = dataHoje();

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    hoje.slice(0, 8) + '01'
  );

  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    return {
      error: 'A integração com o Sankhya ainda não foi configurada.',
      status: 503
    };
  }

  const inicioAnterior = mesmoPeriodoAnoAnterior(inicio);
  const fimAnterior = mesmoPeriodoAnoAnterior(fim);

  const inicioAcumuladoAtual = fim.slice(0, 4) + '-01-01';
  const inicioAcumuladoAnterior =
    fimAnterior.slice(0, 4) + '-01-01';

  const valor = ehDevolucao
  ? 'ABS(NVL(ITE.VLRTOT, 0))'
  : 'NVL(ITE.VLRTOT, 0)';

  const filtrosOperacao = ehDevolucao
    ? [
        '  AND CAB.CODTIPOPER = 1202',
        "  AND CAB.TIPMOV = 'D'"
      ]
    : [
        '  AND CAB.CODTIPOPER = 1101',
        "  AND CAB.TIPMOV = 'V'"
      ];

  const token = await obterTokenSankhya(env);

  const sql = [
    'SELECT',
    '  ITE.CODPROD AS CODIGO_PRODUTO,',
    "  NVL(PRO.DESCRPROD, 'SEM PRODUTO') AS PRODUTO,",

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN ' + valor,
    '    ELSE 0',
    '  END) AS VALOR_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN ' + valor,
    '    ELSE 0',
    '  END) AS VALOR_ATUAL,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '    THEN ' + valor,
    '    ELSE 0',
    '  END) AS VALOR_ACUMULADO_ANTERIOR,',

    '  SUM(CASE',
    "    WHEN CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAtual + "', 'YYYY-MM-DD')",
    "     AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '    THEN ' + valor,
    '    ELSE 0',
    '  END) AS VALOR_ACUMULADO_ATUAL',

    'FROM TGFCAB CAB',
    'INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',

    "WHERE CAB.DTNEG >= TO_DATE('" + inicioAcumuladoAnterior + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    ...filtrosOperacao,
    "  AND CAB.STATUSNOTA = 'L'",

    'GROUP BY ITE.CODPROD, PRO.DESCRPROD',
    'ORDER BY PRODUTO'
  ].join('\n');

  const linhas = await executarConsultaSankhya(token, sql);

  const itens = linhas.map(function(linha) {
    const anterior = numero(linha[2]);
    const atual = numero(linha[3]);
    const acumuladoAnterior = numero(linha[4]);
    const acumuladoAtual = numero(linha[5]);

    if (ehDevolucao) {
      return {
        codigoProduto: String(linha[0] || '').trim(),
        produto: String(linha[1] || 'Sem produto').trim(),
        devolucaoAnterior: anterior,
        devolucaoAtual: atual,
        devolucaoAcumuladaAnterior: acumuladoAnterior,
        devolucaoAcumuladaAtual: acumuladoAtual
      };
    }

    return {
      codigoProduto: String(linha[0] || '').trim(),
      produto: String(linha[1] || 'Sem produto').trim(),
      quantidadeAnterior: anterior,
      quantidadeAtual: atual,
      acumuladoAnterior: acumuladoAnterior,
      acumuladoAtual: acumuladoAtual,
      variacao:
        anterior > 0 ? (atual - anterior) / anterior : null,
      variacaoAcumulado:
        acumuladoAnterior > 0
          ? (acumuladoAtual - acumuladoAnterior) / acumuladoAnterior
          : null
    };
  });

  const totalAnterior = itens.reduce(function(total, item) {
    return total + (ehDevolucao
      ? item.devolucaoAnterior
      : item.quantidadeAnterior);
  }, 0);

  const totalAtual = itens.reduce(function(total, item) {
    return total + (ehDevolucao
      ? item.devolucaoAtual
      : item.quantidadeAtual);
  }, 0);

  const totalAcumuladoAnterior = itens.reduce(function(total, item) {
    return total + (ehDevolucao
      ? item.devolucaoAcumuladaAnterior
      : item.acumuladoAnterior);
  }, 0);

  const totalAcumuladoAtual = itens.reduce(function(total, item) {
    return total + (ehDevolucao
      ? item.devolucaoAcumuladaAtual
      : item.acumuladoAtual);
  }, 0);

  return {
    produtos: ehDevolucao ? undefined : itens,
    devolucoes: ehDevolucao ? itens : undefined,

    inicio: inicio,
    fim: fim,
    inicioAnterior: inicioAnterior,
    fimAnterior: fimAnterior,

    totalAnterior: totalAnterior,
    totalAtual: totalAtual,
    totalAcumuladoAnterior: totalAcumuladoAnterior,
    totalAcumuladoAtual: totalAcumuladoAtual,

    variacaoTotal:
      totalAnterior > 0
        ? (totalAtual - totalAnterior) / totalAnterior
        : null,

    variacaoTotalAcumulado:
      totalAcumuladoAnterior > 0
        ? (totalAcumuladoAtual - totalAcumuladoAnterior) /
          totalAcumuladoAnterior
        : null
  };
}

async function obterTokenSankhya(env) {
  const resposta = await fetch('https://api.sankhya.com.br/authenticate', {
    method: 'POST',
    headers: {
      'X-Token': env.SANKHYA_X_TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: env.SANKHYA_CLIENT_ID,
      client_secret: env.SANKHYA_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }).toString()
  });

  if (!resposta.ok) {
    throw new Error('Autenticação Sankhya recusada.');
  }

  const dados = await resposta.json();

  if (!dados.access_token) {
    throw new Error('O Sankhya não retornou um token.');
  }

  return dados.access_token;
}

async function executarConsultaSankhya(token, sql) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: { sql: sql }
      })
    }
  );

  if (!resposta.ok) {
    throw new Error('Consulta Sankhya recusada.');
  }

  const dados = await resposta.json();

  if (String(dados.status || '') === '0') {
    throw new Error(
      dados.statusMessage || 'O Sankhya recusou a consulta.'
    );
  }

  if (!Array.isArray(dados.responseBody?.rows)) {
    throw new Error('O Sankhya não retornou produtos.');
  }

  return dados.responseBody.rows;
}

function dataValida(valor, padrao) {
  const texto = String(valor || '').trim();

  return /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ? texto
    : padrao;
}

function mesmoPeriodoAnoAnterior(data) {
  const partes = String(data).split('-');
  const ano = Number(partes[0]) - 1;
  const mes = Number(partes[1]);
  const diaOriginal = Number(partes[2]);
  const ultimoDiaMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const dia = Math.min(diaOriginal, ultimoDiaMes);

  return (
    String(ano) +
    '-' +
    String(mes).padStart(2, '0') +
    '-' +
    String(dia).padStart(2, '0')
  );
}

function dataHoje() {
  const agora = new Date();

  return (
    String(agora.getFullYear()) +
    '-' +
    String(agora.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(agora.getDate()).padStart(2, '0')
  );
}

function numero(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  let texto = String(valor || '').trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const convertido = Number(texto);
  return Number.isFinite(convertido) ? convertido : 0;
}
