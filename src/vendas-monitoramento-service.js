const META_MAXIMA = 999999999.99;

export async function listarMonitoramentoVendasSankhya(request, env) {
  const url = new URL(request.url);
  const hoje = new Date();

  const primeiroDiaDoMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    primeiroDiaDoMes
  );

  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );

  const vendedorSelecionado = String(
    url.searchParams.get('vendedor') || ''
  ).trim();

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (vendedorSelecionado && !/^\d+$/.test(vendedorSelecionado)) {
    return {
      error: 'Vendedor inválido.',
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

  await Promise.all([
  garantirTabelaMetasVendedores(env),
  garantirTabelaMetasProdutos(env),
  garantirTabelaMetaEmpresa(env)
]);
  
  const token = await obterTokenSankhya(env);

  const filtroVendedor = vendedorSelecionado
    ? '  AND CAB.CODVEND = ' + Number(vendedorSelecionado)
    : '';

  const sqlVendedores = [
    'SELECT',
    '  CAB.CODVEND AS CODIGO_VENDEDOR,',
    "  NVL(VEN.APELIDO, 'SEM VENDEDOR') AS VENDEDOR,",
    '  SUM((NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0))+ NVL(ITE.VLRSUBST, 0)) AS FATURAMENTO',
    'FROM TGFCAB CAB',
    'INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFVEN VEN ON VEN.CODVEND = CAB.CODVEND',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    '  AND CAB.CODTIPOPER = 1101',
    filtroVendedor,
    'GROUP BY CAB.CODVEND, VEN.APELIDO',
    'ORDER BY FATURAMENTO DESC'
  ].filter(Boolean).join('\n');

  const sqlProdutos = [
  'SELECT',
  '  GRUPO,',
  '  SUM(FATURAMENTO) AS FATURAMENTO',
  'FROM (',
  '  SELECT',
  '    CASE',
  "      WHEN PRO.CODPROD IN (931, 928, 929, 930) THEN 'Croissant TO GO'",
  "      WHEN PRO.CODPROD IN (44, 43, 42) THEN 'Biscoitos'",
  "      WHEN PRO.CODPROD = 917 THEN 'Amêndoas'",
  "      WHEN PRO.CODPROD = 291 THEN 'Pão croissant 10un'",
  "      WHEN PRO.CODPROD = 809 THEN 'Pão Croissant 125g'",
  "      WHEN PRO.CODPROD = 155 THEN 'Pão Croissant 250g'",
  "      ELSE 'OUTROS'",
  '    END AS GRUPO,',
  '    ((NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0))+ NVL(ITE.VLRSUBST, 0)) AS FATURAMENTO',
  '  FROM TGFCAB CAB',
  '  INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA',
  '  LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
  "  WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
  "    AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
  "    AND CAB.TIPMOV = 'V'",
  "    AND CAB.STATUSNOTA = 'L'",
  '    AND CAB.CODTIPOPER = 1101',
  filtroVendedor,
  ')',
  "WHERE GRUPO <> 'OUTROS'",
  'GROUP BY GRUPO',
  'ORDER BY GRUPO'
].filter(Boolean).join('\n');

  const sqlOpcoesVendedores = [
    'SELECT',
    '  CAB.CODVEND AS CODIGO_VENDEDOR,',
    "  NVL(VEN.APELIDO, 'SEM VENDEDOR') AS VENDEDOR",
    'FROM TGFCAB CAB',
    'LEFT JOIN TGFVEN VEN ON VEN.CODVEND = CAB.CODVEND',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    '  AND CAB.CODTIPOPER = 1101',
    'GROUP BY CAB.CODVEND, VEN.APELIDO',
    'ORDER BY VENDEDOR'
  ].join('\n');

  const resultados = await Promise.all([
    executarConsultaSankhya(token, sqlVendedores),
    executarConsultaSankhya(token, sqlProdutos),
    executarConsultaSankhya(token, sqlOpcoesVendedores),
    listarMetasVendedores(env),
    listarMetasProdutos(env),
    carregarMetaEmpresa(env)
  ]);

  const linhasVendedores = resultados[0];
  const linhasProdutos = resultados[1];
  const linhasOpcoesVendedores = resultados[2];
  const metasVendedores = resultados[3];
  const metasProdutos = resultados[4];
  const metaEmpresa = numero(resultados[5]);

  const metasPorVendedor = new Map(
    metasVendedores.map((meta) => [
      String(meta.codigoVendedor),
      numero(meta.meta)
    ])
  );

  const metasPorProduto = new Map(
    metasProdutos.map((meta) => [
      String(meta.codigoProduto),
      numero(meta.meta)
    ])
  );

  const vendedores = linhasVendedores.map((linha) => {
    const codigoVendedor = String(linha[0] || '');
    const meta = metasPorVendedor.get(codigoVendedor) || 0;
    const faturamento = numero(linha[2]);

    return {
      codigoVendedor,
      vendedor: String(linha[1] || 'Sem vendedor').trim(),
      faturamento,
      meta,
      percentualMeta: meta > 0
        ? faturamento / meta
        : null
    };
  });

  const produtos = linhasProdutos.map((linha) => {
  const grupo = String(linha[0] || '').trim();
  const faturamento = numero(linha[1]);

  return {
    codigoProduto: grupo,
    produto: grupo,
    faturamento
  };
});

  const opcoesVendedores = linhasOpcoesVendedores.map((linha) => {
  const codigoVendedor = String(linha[0] || '');

  return {
    codigoVendedor,
    vendedor: String(linha[1] || 'Sem vendedor').trim(),
    meta: metasPorVendedor.get(codigoVendedor) || 0
  };
});
  const totalFaturamento = vendedores.reduce(
    (total, vendedor) => total + vendedor.faturamento,
    0
  );

  const totalMeta = vendedorSelecionado
  ? metasPorVendedor.get(vendedorSelecionado) || 0
  : metaEmpresa;

  return {
    inicio,
    fim,
    vendedores,
    opcoesVendedores,
    produtos,
    totalFaturamento,
    totalMeta,
    percentualMeta: totalMeta > 0
      ? totalFaturamento / totalMeta
      : null
  };
}

export async function salvarMetaVendedor(env, dados) {
  const codigoVendedor = String(
    dados.codigoVendedor || ''
  ).trim();

  const vendedor = String(
    dados.vendedor || ''
  ).trim().toUpperCase();

  const meta = Number(dados.meta);

  if (!/^\d+$/.test(codigoVendedor)) {
    return {
      error: 'Código do vendedor inválido.',
      status: 400
    };
  }

  if (!vendedor) {
    return {
      error: 'Informe o nome do vendedor.',
      status: 400
    };
  }

  if (
    !Number.isFinite(meta) ||
    meta < 0 ||
    meta > META_MAXIMA
  ) {
    return {
      error: 'Informe uma meta válida.',
      status: 400
    };
  }

  await garantirTabelaMetasVendedores(env);

  await env.DB.prepare(
    `INSERT INTO vendas_metas_vendedores
      (codigo_vendedor, vendedor, meta, atualizado_em)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(codigo_vendedor) DO UPDATE SET
       vendedor = excluded.vendedor,
       meta = excluded.meta,
       atualizado_em = excluded.atualizado_em`
  ).bind(
    codigoVendedor,
    vendedor,
    meta,
    new Date().toISOString()
  ).run();

  return {
    codigoVendedor,
    vendedor,
    meta
  };
}

export async function salvarMetaEmpresaVendas(env, meta) {
  const valor = Number(meta);

  if (
    !Number.isFinite(valor) ||
    valor < 0 ||
    valor > META_MAXIMA
  ) {
    return {
      error: 'Informe uma meta total válida.',
      status: 400
    };
  }

  await garantirTabelaMetaEmpresa(env);

  await env.DB.prepare(
    `INSERT INTO vendas_meta_empresa
      (id, meta, atualizado_em)
     VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       meta = excluded.meta,
       atualizado_em = excluded.atualizado_em`
  ).bind(
    valor,
    new Date().toISOString()
  ).run();

  return {
    meta: valor
  };
}

export async function salvarMetaProduto(env, dados) {
  const codigoProduto = String(
    dados.codigoProduto || ''
  ).trim();

  const produto = String(
    dados.produto || ''
  ).trim().toUpperCase();

  const meta = Number(dados.meta);

  if (!/^\d+$/.test(codigoProduto)) {
    return {
      error: 'Código do produto inválido.',
      status: 400
    };
  }

  if (!produto) {
    return {
      error: 'Informe o nome do produto.',
      status: 400
    };
  }

  if (
    !Number.isFinite(meta) ||
    meta < 0 ||
    meta > META_MAXIMA
  ) {
    return {
      error: 'Informe uma meta válida.',
      status: 400
    };
  }

  await garantirTabelaMetasProdutos(env);

  await env.DB.prepare(
    `INSERT INTO vendas_metas_produtos
      (codigo_produto, produto, meta, atualizado_em)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(codigo_produto) DO UPDATE SET
       produto = excluded.produto,
       meta = excluded.meta,
       atualizado_em = excluded.atualizado_em`
  ).bind(
    codigoProduto,
    produto,
    meta,
    new Date().toISOString()
  ).run();

  return {
    codigoProduto,
    produto,
    meta
  };
}

async function carregarMetaEmpresa(env) {
  const resultado = await env.DB.prepare(
    `SELECT meta
     FROM vendas_meta_empresa
     WHERE id = 1`
  ).first();

  return resultado
    ? numero(resultado.meta)
    : 0;
}

async function garantirTabelaMetaEmpresa(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS vendas_meta_empresa (
      id INTEGER PRIMARY KEY,
      meta REAL NOT NULL DEFAULT 0,
      atualizado_em TEXT NOT NULL
    )`
  ).run();
}

async function listarMetasVendedores(env) {
  const resultado = await env.DB.prepare(
    `SELECT
       codigo_vendedor AS codigoVendedor,
       vendedor,
       meta
     FROM vendas_metas_vendedores
     ORDER BY vendedor`
  ).all();

  return resultado.results || [];
}

async function listarMetasProdutos(env) {
  const resultado = await env.DB.prepare(
    `SELECT
       codigo_produto AS codigoProduto,
       produto,
       meta
     FROM vendas_metas_produtos
     ORDER BY produto`
  ).all();

  return resultado.results || [];
}

async function garantirTabelaMetasVendedores(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS vendas_metas_vendedores (
      codigo_vendedor TEXT PRIMARY KEY,
      vendedor TEXT NOT NULL,
      meta REAL NOT NULL DEFAULT 0,
      atualizado_em TEXT NOT NULL
    )`
  ).run();
}

async function garantirTabelaMetasProdutos(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS vendas_metas_produtos (
      codigo_produto TEXT PRIMARY KEY,
      produto TEXT NOT NULL,
      meta REAL NOT NULL DEFAULT 0,
      atualizado_em TEXT NOT NULL
    )`
  ).run();
}

async function obterTokenSankhya(env) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/authenticate',
    {
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
    }
  );

  if (!resposta.ok) {
    throw new Error('Autenticação Sankhya recusada.');
  }

  const dados = await resposta.json();

  if (!dados.access_token) {
    throw new Error(
      'O Sankhya não retornou um token de acesso.'
    );
  }

  return dados.access_token;
}

async function executarConsultaSankhya(token, sql) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr' +
      '?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: { sql }
      })
    }
  );

  if (!resposta.ok) {
    throw new Error('Consulta Sankhya recusada.');
  }

  const dados = await resposta.json();

  if (String(dados.status || '') === '0') {
    throw new Error(
      dados.statusMessage ||
      'O Sankhya recusou a consulta.'
    );
  }

  if (!Array.isArray(dados.responseBody?.rows)) {
    throw new Error(
      dados.statusMessage ||
      'O Sankhya retornou uma resposta sem linhas.'
    );
  }

  return dados.responseBody.rows;
}

function dataValida(valor, padrao) {
  const texto = String(valor || '').trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  return padrao.toISOString().slice(0, 10);
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

  return Number.isFinite(convertido)
    ? convertido
    : 0;
}
