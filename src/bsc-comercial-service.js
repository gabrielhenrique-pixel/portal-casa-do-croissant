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
    '  END) AS QUANTIDADE_ATUAL',
    'FROM TGFCAB CAB',
    'INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicioAnterior + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    '  AND CAB.CODTIPOPER = 1101',
    'GROUP BY ITE.CODPROD, PRO.DESCRPROD',
    'HAVING SUM(CASE',
    "  WHEN CAB.DTNEG >= TO_DATE('" + inicioAnterior + "', 'YYYY-MM-DD')",
    "   AND CAB.DTNEG < TO_DATE('" + fimAnterior + "', 'YYYY-MM-DD') + 1",
    '  THEN NVL(ITE.QTDNEG, 0)',
    '  ELSE 0',
    'END) <> 0',
    'OR SUM(CASE',
    "  WHEN CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
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

    return {
      codigoProduto: String(linha[0] || '').trim(),
      produto: String(linha[1] || 'Sem produto').trim(),
      quantidadeAnterior: quantidadeAnterior,
      quantidadeAtual: quantidadeAtual,
      variacao:
        quantidadeAnterior > 0
          ? (quantidadeAtual - quantidadeAnterior) / quantidadeAnterior
          : null
    };
  });

  const totalAnterior = produtos.reduce(function(total, produto) {
    return total + produto.quantidadeAnterior;
  }, 0);

  const totalAtual = produtos.reduce(function(total, produto) {
    return total + produto.quantidadeAtual;
  }, 0);

  return {
    inicio: inicio,
    fim: fim,
    inicioAnterior: inicioAnterior,
    fimAnterior: fimAnterior,
    produtos: produtos,
    totalAnterior: totalAnterior,
    totalAtual: totalAtual,
    variacaoTotal:
      totalAnterior > 0
        ? (totalAtual - totalAnterior) / totalAnterior
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
