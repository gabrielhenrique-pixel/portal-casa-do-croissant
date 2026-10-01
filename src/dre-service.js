import {
  DRE_GRUPOS,
  identificarGrupoDre
} from './dre-config.js';

const DRE_NV2 = Object.freeze({
  receitaBruta: {
    nome: 'Receita Bruta',
    grupos: [1, 2] 
  },
  deducoes: {
    nome: 'Deduções Sobre Receitas',
    grupos: [3, 14]
  },
  custosProducao: {
    nome: 'Custo de Produção',
    grupos: [4, 5]
  },
  despesasGerais: {
    nome: 'Despesas Gerais',
    grupos: [6, 7, 8, 9, 13, 17]
  },
  receitasDespesasFinanceiras: {
    nome: 'Receitas e Despesas Financeiras',
    grupos: [10]
  },
  investimentos: {
    nome: 'Investimentos',
    grupos: [11]
  },
  impostos: {
    nome: 'Impostos',
    grupos: [12]
  },
  emprestimos: {
    nome: 'Emprestimos e Dividas',
    grupos: [15]
  },
  outrasReceitas: {
    nome: 'Outras Receitas e Despesas não Operacionais',
    grupos: [16]
  }
});

export async function listarDre(request, env) {
  const url = new URL(request.url);
  const hoje = new Date();

  const primeiroDiaMes = new Date(
    Date.UTC(
      hoje.getUTCFullYear(),
      hoje.getUTCMonth(),
      1
    )
  );

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    primeiroDiaMes
  );

  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );

  const empresa = String(
    url.searchParams.get('empresa') || ''
  ).trim();

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (empresa && !/^\d+$/.test(empresa)) {
    return {
      error: 'Empresa inválida.',
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

  const inicioComparacao = subtrairUmAno(inicio);
  const token = await obterTokenSankhya(env);

  const sql = montarSqlDre(
    inicioComparacao,
    fim,
    empresa
  );

  const linhas = await executarConsultaSankhya(
    token,
    sql
  );

  const mesesConsulta = listarMeses(
    inicioComparacao,
    fim
  );

  const meses = listarMeses(inicio, fim);

  const valoresPorGrupo = new Map();
const detalhesPorGrupo = new Map();

for (const grupo of Object.keys(DRE_GRUPOS)) {
  valoresPorGrupo.set(
    Number(grupo),
    criarSerieVazia(mesesConsulta)
  );

  detalhesPorGrupo.set(
    Number(grupo),
    new Map()
  );
}

  const naoClassificados = criarSerieVazia(
    mesesConsulta
  );

  for (const linha of linhas) {
    const mes = String(linha[0] || '').slice(0, 7);
    const codigoNatureza = normalizarCodigo(linha[1]);
    const nomeNatureza = String(
          linha[2] || 'Sem descrição'
    ).trim() || 'Sem descrição';
    const valor = numero(linha[3]);
    const grupo = identificarGrupoDre(codigoNatureza);

    if (!mes || !mesesConsulta.includes(mes)) {
      continue;
    }

    if (!grupo) {
      naoClassificados.set(
        mes,
        (naoClassificados.get(mes) || 0) + valor
      );
      continue;
    }

    const serie = valoresPorGrupo.get(grupo);

    serie.set(
      mes,
      (serie.get(mes) || 0) + valor
    );

    const detalhes = detalhesPorGrupo.get(grupo);

if (!detalhes.has(codigoNatureza)) {
  detalhes.set(codigoNatureza, {
    codigo: codigoNatureza,
    nome: nomeNatureza,
    valores: criarSerieVazia(mesesConsulta)
  });
}

    const detalhe = detalhes.get(codigoNatureza);

detalhe.valores.set(
  mes,
  (detalhe.valores.get(mes) || 0) + valor
);
    
  }

  const valoresPorNv2 = new Map();

  for (const [chave, configuracao] of Object.entries(DRE_NV2)) {
    const serie = criarSerieVazia(mesesConsulta);

    for (const grupo of configuracao.grupos) {
      const valores = valoresPorGrupo.get(grupo);

      if (!valores) {
        continue;
      }

      for (const mes of mesesConsulta) {
        serie.set(
          mes,
          (serie.get(mes) || 0) +
            (valores.get(mes) || 0)
        );
      }
    }

    valoresPorNv2.set(chave, serie);
  }

  const receitaLiquida = somarSeries(
    valoresPorNv2.get('receitaBruta'),
    valoresPorNv2.get('deducoes'),
    mesesConsulta
  );

  const resultadoBruto = somarSeries(
    receitaLiquida,
    valoresPorNv2.get('custosProducao'),
    mesesConsulta
  );

  const resultadoOperacional = somarSeries(
    somarSeries(
      valoresPorNv2.get('receitaBruta'),
      valoresPorNv2.get('deducoes'),
      mesesConsulta
    ),
    somarSeries(
      valoresPorNv2.get('custosProducao'),
      valoresPorNv2.get('despesasGerais'),
      mesesConsulta
    ),
    mesesConsulta
  );

  const resultadoLiquido = somarSeries(
  somarSeries(
    somarSeries(
      valoresPorNv2.get('receitaBruta'),
      valoresPorNv2.get('deducoes'),
      mesesConsulta
    ),
    somarSeries(
      valoresPorNv2.get('custosProducao'),
      valoresPorNv2.get('despesasGerais'),
      mesesConsulta
    ),
    mesesConsulta
  ),
  somarSeries(
    valoresPorNv2.get('receitasDespesasFinanceiras'),
    valoresPorNv2.get('outrasReceitas'),
    mesesConsulta
  ),
  mesesConsulta
);

  const resultadoFinal = criarSerieVazia(
    mesesConsulta
  );

  for (const chave of Object.keys(DRE_NV2)) {
    const serie = valoresPorNv2.get(chave);

    for (const mes of mesesConsulta) {
      resultadoFinal.set(
        mes,
        (resultadoFinal.get(mes) || 0) +
          (serie.get(mes) || 0)
      );
    }
  }

  const seriesCalculadas = {
    receitaLiquida,
    resultadoBruto,
    resultadoOperacional,
    resultadoLiquido,
    resultadoFinal
  };

  const receitaBruta = receitaBrutaSerie(
  valoresPorNv2.get('receitaBruta'),
  mesesConsulta
);

const grupos = Array.from(
  valoresPorGrupo.entries()
).map(([codigo, valores]) => {
  const detalhes = Array.from(
    detalhesPorGrupo.get(codigo).values()
  ).sort((primeiro, segundo) =>
    primeiro.codigo.localeCompare(
      segundo.codigo,
      'pt-BR',
      { numeric: true }
    )
  ).map((detalhe) => ({
    codigo: detalhe.codigo,
    nome: detalhe.nome,
    indicadores: calcularIndicadores(
      detalhe.valores,
      meses,
      receitaBruta
    ),
    total: calcularTotalIndicadores(
      detalhe.valores,
      meses,
      receitaBruta
    )
  }));

  return {
    codigo,
    nome: DRE_GRUPOS[codigo].nome,
    nv2: DRE_GRUPOS[codigo].nv2,
    indicadores: calcularIndicadores(
      valores,
      meses,
      receitaBruta
    ),
    total: calcularTotalIndicadores(
      valores,
      meses,
      receitaBruta
    ),
    detalhes
  };
});

  const subtotais = {};

  for (const [chave, valores] of valoresPorNv2.entries()) {
    subtotais[chave] = {
  nome: DRE_NV2[chave].nome,
  valores: valoresVisiveis(valores, meses),
  indicadores: calcularIndicadores(
    valores,
    meses,
    receitaBrutaSerie(
      valoresPorNv2.get('receitaBruta'),
      mesesConsulta
    )
  ),
  total: calcularTotalIndicadores(
    valores,
    meses,
    receitaBrutaSerie(
      valoresPorNv2.get('receitaBruta'),
      mesesConsulta
    )
  )
};
  }

  for (const [chave, valores] of Object.entries(
    seriesCalculadas
  )) {
    subtotais[chave] = {
  nome: nomeResultado(chave),
  valores: valoresVisiveis(valores, meses),
  indicadores: calcularIndicadores(
    valores,
    meses,
    receitaBrutaSerie(
      valoresPorNv2.get('receitaBruta'),
      mesesConsulta
    )
  ),
  total: calcularTotalIndicadores(
    valores,
    meses,
    receitaBrutaSerie(
      valoresPorNv2.get('receitaBruta'),
      mesesConsulta
    )
  )
};
  }

  return {
    origem: 'sankhya',
    inicio,
    fim,
    meses,
    grupos,
    subtotais,
    naoClassificados: valoresVisiveis(
      naoClassificados,
      meses
    )
  };
}

function montarSqlDre(inicio, fim, empresa) {
  const filtroEmpresaFinanceiro = empresa
    ? `  AND FIN.CODEMP = ${Number(empresa)}`
    : '';

  const filtroEmpresaVendas = empresa
    ? `  AND CAB.CODEMP = ${Number(empresa)}`
    : '';

  return [
    'SELECT',
    '  MES,',
    '  CODIGO_NATUREZA,',
    '  NOME_NATUREZA,',
    '  SUM(VALOR) AS VALOR',
    'FROM (',

    '  SELECT',
    "    TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM') AS MES,",
    '    FIN.CODNAT AS CODIGO_NATUREZA,',
    '    NAT.DESCRNAT AS NOME_NATUREZA,',
    '    SUM(',
    '      NVL(FIN.VLRDESDOB, 0) *',
    '      NVL(FIN.RECDESP, 0)',
    '    ) AS VALOR',
    '  FROM TGFFIN TFIN',
    '  LEFT JOIN VGFFINRAT FIN',
    '    ON FIN.NUFIN = TFIN.NUFIN',
    '  LEFT JOIN TGFNAT NAT',
    '    ON NAT.CODNAT = FIN.CODNAT',
    "  WHERE FIN.PROVISAO = 'N'",
    `    AND TFIN.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')`,
    `    AND TFIN.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1`,
    '    AND NVL(FIN.CODNAT, 0) <> 1010000',
    filtroEmpresaFinanceiro,
    '  GROUP BY',
    "    TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM'),",
    '    FIN.CODNAT,',
    '    NAT.DESCRNAT',

    '  UNION ALL',

    '  SELECT',
    "    TO_CHAR(TRUNC(CAB.DTNEG, 'MM'), 'YYYY-MM') AS MES,",
    '    1010000 AS CODIGO_NATUREZA,',
    "    'Receita de Vendas' AS NOME_NATUREZA,",
    '    SUM(',
    '      (NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0)) +',
    '      NVL(ITE.VLRSUBST, 0)',
    '    ) AS VALOR',
    '  FROM TGFCAB CAB',
    '  INNER JOIN TGFITE ITE',
    '    ON ITE.NUNOTA = CAB.NUNOTA',
    `  WHERE CAB.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')`,
    `    AND CAB.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1`,
    "    AND CAB.TIPMOV = 'V'",
    "    AND CAB.STATUSNOTA = 'L'",
    '    AND CAB.CODTIPOPER IN (1101, 1107)',
    filtroEmpresaVendas,
    '  GROUP BY',
    "    TO_CHAR(TRUNC(CAB.DTNEG, 'MM'), 'YYYY-MM')",

    ')',
    'GROUP BY',
    '  MES,',
    '  CODIGO_NATUREZA,',
    '  NOME_NATUREZA',
    'ORDER BY',
    '  MES,',
    '  CODIGO_NATUREZA'
  ].filter(Boolean).join('\n');
}

export async function listarAuditoriaDre(request, env) {
  const url = new URL(request.url);
  const hoje = new Date();
  const primeiroDiaMes = new Date(
    Date.UTC(
      hoje.getUTCFullYear(),
      hoje.getUTCMonth(),
      1
    )
  );

  const inicio = dataValida(
    url.searchParams.get('inicio'),
    primeiroDiaMes
  );
  const fim = dataValida(
    url.searchParams.get('fim'),
    hoje
  );
  const empresa = String(
    url.searchParams.get('empresa') || ''
  ).trim();
  const natureza = String(
    url.searchParams.get('natureza') || ''
  ).trim();

  if (inicio > fim) {
    return {
      error: 'A data inicial não pode ser maior que a data final.',
      status: 400
    };
  }

  if (empresa && !/^\d+$/.test(empresa)) {
    return { error: 'Empresa inválida.', status: 400 };
  }

  if (!/^\d+$/.test(natureza)) {
    return { error: 'Natureza inválida.', status: 400 };
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

  const token = await obterTokenSankhya(env);
  const linhas = await executarConsultaSankhya(
    token,
    montarSqlAuditoriaDre(inicio, fim, empresa, natureza)
  );

  return {
    natureza,
    meses: listarMeses(inicio, fim),
    lancamentos: linhas.map((linha) => ({
      mes: String(linha[0] || ''),
      data: String(linha[1] || ''),
      documento: String(linha[2] || ''),
      parceiro: String(linha[3] || 'Sem parceiro'),
      origem: String(linha[4] || 'Financeiro'),
      valor: numero(linha[5])
    }))
  };
}

function montarSqlAuditoriaDre(inicio, fim, empresa, natureza) {
  const codigoNatureza = Number(natureza);

  if (codigoNatureza === 1010000) {
    const filtroEmpresa = empresa
      ? `  AND CAB.CODEMP = ${Number(empresa)}`
      : '';

    return [
      'SELECT',
      "  TO_CHAR(TRUNC(CAB.DTNEG, 'MM'), 'YYYY-MM') AS MES,",
      "  TO_CHAR(CAB.DTNEG, 'DD/MM/YYYY') AS DATA,",
      '  CAB.NUNOTA AS DOCUMENTO,',
      "  NVL(PAR.NOMEPARC, 'Sem parceiro') AS PARCEIRO,",
      "  'Venda' AS ORIGEM,",
      '  SUM(',
      '    (NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0)) +',
      '    NVL(ITE.VLRSUBST, 0)',
      '  ) AS VALOR',
      'FROM TGFCAB CAB',
      'INNER JOIN TGFITE ITE',
      '  ON ITE.NUNOTA = CAB.NUNOTA',
      'LEFT JOIN TGFPAR PAR',
      '  ON PAR.CODPARC = CAB.CODPARC',
      `WHERE CAB.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')`,
      `  AND CAB.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1`,
      "  AND CAB.TIPMOV = 'V'",
      "  AND CAB.STATUSNOTA = 'L'",
      '  AND CAB.CODTIPOPER IN (1101, 1107)',
      filtroEmpresa,
      'GROUP BY',
      "  TO_CHAR(TRUNC(CAB.DTNEG, 'MM'), 'YYYY-MM'),",
      "  TO_CHAR(CAB.DTNEG, 'DD/MM/YYYY'),",
      '  CAB.NUNOTA,',
      '  PAR.NOMEPARC',
    ].filter(Boolean).join('\n');
  }

  const filtroEmpresa = empresa
    ? `  AND FIN.CODEMP = ${Number(empresa)}`
    : '';

  return [
    'SELECT',
    "  TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM') AS MES,",
    "  TO_CHAR(TFIN.DTNEG, 'DD/MM/YYYY') AS DATA,",
    '  FIN.NUFIN AS DOCUMENTO,',
    "  NVL(PAR.NOMEPARC, 'Sem parceiro') AS PARCEIRO,",
    "  'Financeiro' AS ORIGEM,",
    '  SUM(',
    '    NVL(FIN.VLRDESDOB, 0) *',
    '    NVL(FIN.RECDESP, 0)',
    '  ) AS VALOR',
    'FROM TGFFIN TFIN',
    'LEFT JOIN VGFFINRAT FIN',
    '  ON FIN.NUFIN = TFIN.NUFIN',
    'LEFT JOIN TGFPAR PAR',
    '  ON PAR.CODPARC = TFIN.CODPARC',
    "WHERE FIN.PROVISAO = 'N'",
    `  AND TFIN.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')`,
    `  AND TFIN.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1`,
    `  AND FIN.CODNAT = ${codigoNatureza}`,
    filtroEmpresa,
    'GROUP BY',
    "  TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM'),",
    "  TO_CHAR(TFIN.DTNEG, 'DD/MM/YYYY'),",
    '  FIN.NUFIN,',
    '  PAR.NOMEPARC',
  ].filter(Boolean).join('\n');
}

function nomeResultado(chave) {
  const nomes = {
    receitaLiquida: 'Receita Líquida Operacional',
    resultadoBruto: 'Resultado Bruto',
    resultadoOperacional: 'Resultado Operacional',
    resultadoLiquido: 'Resultado Líquido',
    resultadoFinal: 'Resultado Final'
  };

  return nomes[chave] || chave;
}

function calcularTotalIndicadores(
  valores,
  meses,
  receitaBruta
) {
  let resultado = 0;
  let anoAnterior = 0;
  let baseReceita = 0;

  for (const mes of meses) {
    resultado += valores.get(mes) || 0;

    anoAnterior += valores.get(
      subtrairUmAno(mes)
    ) || 0;

    baseReceita += receitaBruta.get(mes) || 0;
  }

  let ah = 0;

  if (anoAnterior === 0 && resultado !== 0) {
    ah = 100;
  } else if (anoAnterior !== 0) {
    ah = (resultado / anoAnterior - 1) * 100;
  }

  return {
    resultado,
    anoAnterior,
    ah,
    av: baseReceita === 0
      ? null
      : Math.abs(resultado / baseReceita * 100)
  };
}

function calcularIndicadores(
  valores,
  meses,
  receitaBruta
) {
  const resultado = {};

  for (const mes of meses) {
    const atual = valores.get(mes) || 0;
    const anterior = valores.get(
      subtrairUmAno(mes)
    ) || 0;

    const base = receitaBruta.get(mes) || 0;

    let ah = 0;

    if (anterior === 0 && atual !== 0) {
      ah = 100;
    } else if (anterior !== 0) {
      ah = (atual / anterior - 1) * 100;
    }

    const av = base === 0
      ? null
      : Math.abs(atual / base * 100);

    resultado[mes] = {
      resultado: atual,
      anoAnterior: anterior,
      ah,
      av
    };
  }

  return resultado;
}

function receitaBrutaSerie(serie, mesesConsulta) {
  return serie || criarSerieVazia(mesesConsulta);
}

function somarSeries(
  primeira,
  segunda,
  meses
) {
  const resultado = criarSerieVazia(meses);

  for (const mes of meses) {
    resultado.set(
      mes,
      (primeira?.get(mes) || 0) +
        (segunda?.get(mes) || 0)
    );
  }

  return resultado;
}

function criarSerieVazia(meses) {
  return new Map(
    meses.map((mes) => [mes, 0])
  );
}

function valoresVisiveis(serie, meses) {
  return Object.fromEntries(
    meses.map((mes) => [
      mes,
      serie.get(mes) || 0
    ])
  );
}

function listarMeses(inicio, fim) {
  const [anoInicio, mesInicio] =
    inicio.split('-').map(Number);

  const [anoFim, mesFim] =
    fim.split('-').map(Number);

  const atual = new Date(
    Date.UTC(anoInicio, mesInicio - 1, 1)
  );

  const limite = new Date(
    Date.UTC(anoFim, mesFim - 1, 1)
  );

  const meses = [];

  while (atual <= limite) {
    meses.push(
      atual.toISOString().slice(0, 7)
    );

    atual.setUTCMonth(
      atual.getUTCMonth() + 1
    );
  }

  return meses;
}

function subtrairUmAno(data) {
  const texto = String(data || '').trim();

  const eMes = /^\d{4}-\d{2}$/.test(texto);

  const dataUtc = new Date(
    (eMes ? texto + '-01' : texto) + 'T00:00:00Z'
  );

  dataUtc.setUTCFullYear(
    dataUtc.getUTCFullYear() - 1
  );

  return dataUtc.toISOString().slice(
    0,
    eMes ? 7 : 10
  );
}

function normalizarCodigo(valor) {
  const numeroCodigo = Number(valor);

  if (Number.isFinite(numeroCodigo)) {
    return String(Math.trunc(numeroCodigo));
  }

  return String(valor || '').trim();
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
    texto = texto
      .replace(/\./g, '')
      .replace(',', '.');
  }

  const convertido = Number(texto);

  return Number.isFinite(convertido)
    ? convertido
    : 0;
}

async function obterTokenSankhya(env) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/authenticate',
    {
      method: 'POST',
      headers: {
        'X-Token': env.SANKHYA_X_TOKEN,
        'Content-Type':
          'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: env.SANKHYA_CLIENT_ID,
        client_secret: env.SANKHYA_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }).toString()
    }
  );

  if (!resposta.ok) {
    throw new Error(
      'Autenticação Sankhya recusada.'
    );
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
    throw new Error(
      'Consulta Sankhya recusada.'
    );
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
