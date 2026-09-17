export const REDES_RENTABILIDADE = Object.freeze([
  'ALIMAX', 'ANGELONI', 'ANGELONI SC', 'ARCHER', 'ASSAÍ', 'BAVARESCO',
  'BELLA VILLA', 'BOZA', 'CIRCUITO', 'COLATUSSO', 'CONDOR', 'COOP',
  'FESTVAL', 'GEPETTO', 'GIASSI', 'HIPER SELECT', 'HIPPO', 'ITALO',
  'JACOMAR', 'KOCH', 'MUFFATO', 'NO PONTO', 'OBA', 'OUTROS', 'REDE MAX',
  'STRAPASSON', 'SUPER GOLFF', 'TELEMACO', 'TOZETTO', 'VERONA',
  'ZAMPROGNA', 'IMPERATRIZ', 'SEM REDE'
]);

function camposDaLinhaSankhya(linha) {
  if (Array.isArray(linha)) return linha;
  if (linha && Array.isArray(linha.row)) return linha.row;
  if (linha && typeof linha === 'object') return Object.values(linha);
  return [];
}

function numeroPercentualSankhya(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;

  let texto = String(valor).trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) return 0;

  return numero > 1 ? numero / 100 : numero;
}

function redeEditavel(valor) {
  const rede = String(valor || '').trim().toUpperCase() || 'SEM REDE';

  if (!REDES_RENTABILIDADE.includes(rede)) {
  throw new Error('Selecione uma rede válida.');
}

return rede;
}

const DADOS_MANUAIS_CLIENTES = {};

  const DADOS_MANUAIS_CLIENTES = {};

function adicionarClientesManuais(promotoria, rede, codigos) {
  codigos.split(',').forEach((codigo) => {
    DADOS_MANUAIS_CLIENTES[codigo.trim()] = {
      promotoria,
      rede
    };
  });
}

adicionarClientesManuais(0.0286, 'ANGELONI', '34,267,268,266');
adicionarClientesManuais(0.06, 'ANGELONI SC', '1160,1381,1383,2287,2288,1702,1703,2284,1704,1705,1598,1378,2285,1600,1601,1379,1602,1603,1380,1382,2286,1607,1790,1604,2289,2124,1599,1608,1605,1606');
adicionarClientesManuais(null, 'ANGELONI', '1150,264,263');
adicionarClientesManuais(0.06, 'ANGELONI', '265');
adicionarClientesManuais(0.0801, 'ARCHER', '2312,2305,2311,2317,2310,2308,2318,2304,2309,2307,2306,2315');
adicionarClientesManuais(0.0594, 'ASSAÍ', '1297,1283,271,272,269,273,210,211,212,524,213');
adicionarClientesManuais(null, 'BAVARESCO', '1636,1634,1637,1635,1626,1641,1640,1639,1777,1638');
adicionarClientesManuais(null, 'BELLA VILLA', '129,216,375,218,2357,217,283,2417,284');
adicionarClientesManuais(null, 'BOZA', '1462,1463,1464,1465,1466,1467,1468,1469,1470');
adicionarClientesManuais(null, 'CIRCUITO', '168,133,169,170');
adicionarClientesManuais(null, 'COLATUSSO', '220,221,225,222,223,1765,224,226');
adicionarClientesManuais(0.0426, 'CONDOR', '440,587,2014,2071,418,419,420,421,441,422,423,424,425,426,427,428,429,430,431,432,433,434,1999,438,442,443,406,417,1429,597,598,439,588,532,444,1923,589,1597,445,435,436,407,446,1433,450,405,404,408,409,412,410,413,414,1817,415,590,447,599,448,600,411,416,591,533,449,592,2301,2341,451,593,452,453,525,437,594,692,694,2329,2299,454,601,595,596,2153');
adicionarClientesManuais(0.0997, 'COOP', '2380,2377,2396,2402,2401,2399,2370,2387,2372,2393,2384,2371,2382,2397,2373,2392,2378,2388,2385,2379,2395,2386,2400,2253,2398,2394,2391,2375,2383,2390,2374,2381,2376,2389');
adicionarClientesManuais(0.0307, 'FESTVAL', '2057,1547,475,476,459,460,1688,1714,1715,2073,461,462,464,1728,205,465,457,463,1720,466,2111,467,468,1292,469,2090,1983,470,471,1689,458,472,456,477,473,474,206,1716');
adicionarClientesManuais(null, 'GEPETTO', '140,141');
adicionarClientesManuais(0.0521, 'HIPER SELECT', '1878,1879,1880,1881,1882,1883,1884,1885,1886,1887');
adicionarClientesManuais(0.1045, 'HIPPO', '1763,1799,1816,1798');
adicionarClientesManuais(0.0433, 'ITALO', '485,486,492,490,491,478,479,403,2473,143,1893,1888,234,487,2036,480,307,1413,488,481,489,144,482,235,306,483,308,309,495,251,2059,484');
adicionarClientesManuais(0.1921, 'JACOMAR', '579,580,576,581,527,528,577,582,575,1725,583,529,1783,530,531,578,584,585,586,526');
adicionarClientesManuais(0.1223, 'KOCH', '2348,1747,1769,1749,1750,1770,1753,1771,1748,1772,1751,1752,1757,1773,1774,1775,1776,1755,1756,1754,2177,2176,2175,2174');
adicionarClientesManuais(0.0914, 'MUFFATO', '546,242,1428,1425,1426,1427,2350,2351,2352,2353,551,1778,552,909,547,616,548,1067,2078,553,539,540,541,543,544,613,614,542,615,1294,561,554,555,549,560,556,562,2079,2033');
adicionarClientesManuais(null, 'NO PONTO', '503,504,505,506,507,508,509,510,511,512,152,502,513,1721,514,515,516,1331,517,518,519,520');
adicionarClientesManuais(null, 'OBA', '1270,243,563,244,1977,1870');
adicionarClientesManuais(0.0329, 'OUTROS', '1998');
adicionarClientesManuais(0.0377, 'OUTROS', '1173,500,1350,501,497,496,498,499,1525,382');
adicionarClientesManuais(0.1096, 'OUTROS', '1671,1672,1663,1667,1668,1662,1660,1723,1669,1670,1665,2120,1666,1661,1664');
adicionarClientesManuais(0.315, 'OUTROS', '1592,1593');
adicionarClientesManuais(0.2826, 'OUTROS', '2277,2275,2278,2281,2282,2279,2280');
adicionarClientesManuais(0.3721, 'IMPERATRIZ', '2449,2367,2365,2366');
adicionarClientesManuais(0.0594, 'OUTROS', '270');
adicionarClientesManuais(0.0801, 'OUTROS', '2313,2316,2314');
adicionarClientesManuais(0.051, 'OUTROS', '2418');
adicionarClientesManuais(0.1302, 'OUTROS', '2464');
adicionarClientesManuais(0.0668, 'OUTROS', '366');
adicionarClientesManuais(null, 'REDE MAX', '2092');
adicionarClientesManuais(0.0634, 'REDE MAX', '2492,241,534,602,1516,558,603,1648,604,535,605,536,1312,606,1780,617,1163,1515,559,537,550,1313,538,557,2004,2104,2454,2478,2481,2476,2480,2477,2493,2479');
adicionarClientesManuais(null, 'STRAPASSON', '356,357,188,189');
adicionarClientesManuais(null, 'SUPER GOLFF', '1614,361,1439,358,359,360,1266,1691');
adicionarClientesManuais(0.0384, 'TELEMACO', '1543,2327,2326,253,162,364');
adicionarClientesManuais(0.0478, 'TOZETTO', '521,565,564,566,567,568');
adicionarClientesManuais(null, 'VERONA', '1537,1538,1529,1530,1533,1531,1532,1523,1535');
adicionarClientesManuais(0.0384, 'VERONA', '1534,1536');
adicionarClientesManuais(null, 'ZAMPROGNA', '318,260,261,262');

export async function sincronizarClientesRentabilidadeSankhya(env, linhas) {
  await garantirCadastroClientesRentabilidade(env);

  const clientes = (Array.isArray(linhas) ? linhas : [])
    .map(camposDaLinhaSankhya)
    .map((campos) => {
  const codigoParceiro = String(campos[0] || '').trim();
  const manual = DADOS_MANUAIS_CLIENTES[codigoParceiro];

  return {
    codigoParceiro,
    cliente: String(campos[1] || '').trim(),
    percentualContrato: numeroPercentualSankhya(campos[2]),
    percentualPromotoria: manual ? manual.promotoria : null,
    percentualComissao: numeroPercentualSankhya(campos[3]),
    rede: manual ? manual.rede : 'SEM REDE'
  };
})
    .filter((cliente) => cliente.codigoParceiro && cliente.cliente);

  const agora = new Date().toISOString();
  const tamanhoDoLote = 50;

  for (let inicio = 0; inicio < clientes.length; inicio += tamanhoDoLote) {
    const lote = clientes.slice(inicio, inicio + tamanhoDoLote);

    await env.DB.batch(
      lote.map((cliente) =>
        env.DB.prepare(
          'INSERT INTO rentabilidade_clientes (' +
            'codigo_parceiro, cliente, rede, percentual_contrato, ' +
            'percentual_promotoria, percentual_comissao, created_at, ' +
            'updated_at, updated_by' +
          ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(codigo_parceiro) DO UPDATE SET ' +
            'cliente = excluded.cliente, ' +
            'rede = CASE WHEN rentabilidade_clientes.updated_by IS NULL OR rentabilidade_clientes.updated_by = \'Sankhya\' THEN excluded.rede ELSE rentabilidade_clientes.rede END, ' +
            'percentual_promotoria = CASE WHEN rentabilidade_clientes.updated_by IS NULL OR rentabilidade_clientes.updated_by = \'Sankhya\' THEN excluded.percentual_promotoria ELSE rentabilidade_clientes.percentual_promotoria END, ' +
            'percentual_contrato = excluded.percentual_contrato, ' +
            'percentual_comissao = excluded.percentual_comissao, ' +
            'updated_at = excluded.updated_at, ' +
            'updated_by = excluded.updated_by'
        .bind(
          cliente.codigoParceiro,
          cliente.cliente,
          cliente.rede,
          cliente.percentualContrato,
          'SEM REDE',
          cliente.rede,
          cliente.percentualContrato,
          cliente.percentualPromotoria,
          cliente.percentualComissao,
          agora,
          agora,
          'Sankhya'
        )
      )
    );
  }

  return { totalSincronizado: clientes.length };
}

export async function atualizarClientesRentabilidadeEmLote(
  env,
  codigosRecebidos,
  dadosRecebidos,
  username
) {
  const codigos = Array.from(
    new Set(
      (Array.isArray(codigosRecebidos) ? codigosRecebidos : [])
        .map((codigo) => String(codigo || '').trim())
        .filter(Boolean)
    )
  );

  const dados = dadosRecebidos && typeof dadosRecebidos === 'object'
    ? dadosRecebidos
    : {};

  const alterarRede = possuiCampo(dados, 'rede');
  const alterarDesconto = possuiCampo(dados, 'percentualContrato');
  const alterarPromotoria = possuiCampo(dados, 'percentualPromotoria');
  const alterarComissao = possuiCampo(dados, 'percentualComissao');

  if (!codigos.length) {
    return { status: 400, error: 'Selecione pelo menos um cliente.' };
  }

  if (
    !alterarRede &&
    !alterarDesconto &&
    !alterarPromotoria &&
    !alterarComissao
  ) {
    return { status: 400, error: 'Informe ao menos um campo para editar.' };
  }

  let rede;
  let desconto;
  let promotoria;
  let comissao;

  try {
    rede = alterarRede ? redeEditavel(dados.rede) : null;

    desconto = alterarDesconto
      ? normalizarPercentualRentabilidade(
        dados.percentualContrato,
        'Desconto financeiro'
      )
      : null;

    promotoria = alterarPromotoria
      ? normalizarPercentualRentabilidade(
        dados.percentualPromotoria,
        'Promotoria'
      )
      : null;

    comissao = alterarComissao
      ? normalizarPercentualRentabilidade(
        dados.percentualComissao,
        'Comissão de venda'
      )
      : null;
  } catch (error) {
    return { status: 400, error: error.message };
  }

  await garantirCadastroClientesRentabilidade(env);

  const atualizadoEm = new Date().toISOString();
  const tamanhoDoLote = 50;

  for (let inicio = 0; inicio < codigos.length; inicio += tamanhoDoLote) {
    const lote = codigos.slice(inicio, inicio + tamanhoDoLote);

    await env.DB.batch(
      lote.map((codigoParceiro) =>
        env.DB.prepare(
          'UPDATE rentabilidade_clientes SET ' +
            'rede = CASE WHEN ? = 1 THEN ? ELSE rede END, ' +
            'percentual_contrato = CASE WHEN ? = 1 THEN ? ELSE percentual_contrato END, ' +
            'percentual_promotoria = CASE WHEN ? = 1 THEN ? ELSE percentual_promotoria END, ' +
            'percentual_comissao = CASE WHEN ? = 1 THEN ? ELSE percentual_comissao END, ' +
            'updated_at = ?, updated_by = ? ' +
          'WHERE codigo_parceiro = ?'
        ).bind(
          alterarRede ? 1 : 0,
          rede,
          alterarDesconto ? 1 : 0,
          desconto,
          alterarPromotoria ? 1 : 0,
          promotoria,
          alterarComissao ? 1 : 0,
          comissao,
          atualizadoEm,
          username,
          codigoParceiro
        )
      )
    );
  }

  return {
    status: 200,
    totalAtualizado: codigos.length
  };
}

export async function garantirCadastroClientesRentabilidade(env) {
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS rentabilidade_clientes (' +
      'codigo_parceiro TEXT PRIMARY KEY NOT NULL, ' +
      'cliente TEXT NOT NULL, ' +
      'rede TEXT NOT NULL, ' +
      'percentual_contrato REAL, ' +
      'percentual_promotoria REAL, ' +
      'percentual_comissao REAL, ' +
      'created_at TEXT NOT NULL, ' +
      'updated_at TEXT NOT NULL, ' +
      'updated_by TEXT, ' +
      'CHECK (percentual_contrato IS NULL OR ' +
        '(percentual_contrato >= 0 AND percentual_contrato <= 1)), ' +
      'CHECK (percentual_promotoria IS NULL OR ' +
        '(percentual_promotoria >= 0 AND percentual_promotoria <= 1)), ' +
      'CHECK (percentual_comissao IS NULL OR ' +
        '(percentual_comissao >= 0 AND percentual_comissao <= 1))' +
    ')'
  ).run();

  await env.DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_rentabilidade_clientes_rede ' +
    'ON rentabilidade_clientes (rede)'
  ).run();
}

export async function carregarClientesRentabilidade(env) {
  await garantirCadastroClientesRentabilidade(env);

  const resultado = await env.DB.prepare(
    'SELECT ' +
      'codigo_parceiro AS codigoParceiro, ' +
      'cliente, ' +
      'rede, ' +
      'percentual_contrato AS percentualContrato, ' +
      'percentual_promotoria AS percentualPromotoria, ' +
      'percentual_comissao AS percentualComissao, ' +
      'updated_at AS atualizadoEm, ' +
      'updated_by AS atualizadoPor ' +
    'FROM rentabilidade_clientes ' +
    'ORDER BY rede COLLATE NOCASE, cliente COLLATE NOCASE'
  ).all();

  return resultado.results || [];
}

function normalizarPercentualRentabilidade(valor, campo) {
  if (valor === null || valor === '') {
    return null;
  }

  if (
    typeof valor !== 'number' ||
    !Number.isFinite(valor) ||
    valor < 0 ||
    valor > 1
  ) {
    throw new Error(
      campo + ' deve ser um percentual entre 0 e 1, ou ficar vazio.'
    );
  }

  return valor;
}

function possuiCampo(objeto, campo) {
  return Object.prototype.hasOwnProperty.call(objeto, campo);
}

export async function atualizarPercentuaisClienteRentabilidade(
  env,
  codigoDaUrl,
  dadosRecebidos,
  username
) {
  const codigoParceiro = decodeURIComponent(
    String(codigoDaUrl || '')
  ).trim();

  if (!codigoParceiro) {
    return { status: 400, error: 'Código do parceiro inválido.' };
  }

  const dados = dadosRecebidos &&
    typeof dadosRecebidos === 'object' &&
    !Array.isArray(dadosRecebidos)
    ? dadosRecebidos
    : {};

  const possuiContrato = possuiCampo(dados, 'percentualContrato');
  const possuiPromotoria = possuiCampo(dados, 'percentualPromotoria');
  const possuiComissao = possuiCampo(dados, 'percentualComissao');

  if (!possuiContrato && !possuiPromotoria && !possuiComissao) {
    return {
      status: 400,
      error: 'Informe desconto, promotoria ou comissão para atualizar.'
    };
  }

  await garantirCadastroClientesRentabilidade(env);

  const existente = await env.DB.prepare(
    'SELECT ' +
      'codigo_parceiro AS codigoParceiro, ' +
      'cliente, rede, ' +
      'percentual_contrato AS percentualContrato, ' +
      'percentual_promotoria AS percentualPromotoria, ' +
      'percentual_comissao AS percentualComissao ' +
    'FROM rentabilidade_clientes WHERE codigo_parceiro = ?'
  ).bind(codigoParceiro).first();

  if (!existente) {
    return {
      status: 404,
      error: 'Cliente não encontrado no cadastro de rentabilidade.'
    };
  }

  let percentualContrato;
  let percentualPromotoria;
  let percentualComissao;

  try {
    percentualContrato = possuiContrato
      ? normalizarPercentualRentabilidade(
        dados.percentualContrato,
        'Desconto financeiro'
      )
      : existente.percentualContrato;

    percentualPromotoria = possuiPromotoria
      ? normalizarPercentualRentabilidade(
        dados.percentualPromotoria,
        'Promotoria'
      )
      : existente.percentualPromotoria;

    percentualComissao = possuiComissao
      ? normalizarPercentualRentabilidade(
        dados.percentualComissao,
        'Comissão de venda'
      )
      : existente.percentualComissao;
  } catch (error) {
    return { status: 400, error: error.message };
  }

  const atualizadoEm = new Date().toISOString();

  await env.DB.prepare(
    'UPDATE rentabilidade_clientes SET ' +
      'percentual_contrato = ?, ' +
      'percentual_promotoria = ?, ' +
      'percentual_comissao = ?, ' +
      'updated_at = ?, ' +
      'updated_by = ? ' +
    'WHERE codigo_parceiro = ?'
  ).bind(
    percentualContrato,
    percentualPromotoria,
    percentualComissao,
    atualizadoEm,
    username,
    codigoParceiro
  ).run();

  return { status: 200 };
}
