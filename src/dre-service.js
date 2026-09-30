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

  for (const grupo of Object.keys(DRE_GRUPOS)) {
    valoresPorGrupo.set(
      Number(grupo),
      criarSerieVazia(mesesConsulta)
    );
  }

  const naoClassificados = criarSerieVazia(
    mesesConsulta
  );

  for (const linha of linhas) {
    const mes = String(linha[0] || '').slice(0, 7);
    const codigoNatureza = normalizarCodigo(linha[1]);
    const valor = numero(linha[2]);
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

  const grupos = Array.from(
    valoresPorGrupo.entries()
  ).map(([codigo, valores]) => ({
    codigo,
    nome: DRE_GRUPOS[codigo].nome,
    nv2: DRE_GRUPOS[codigo].nv2,
    valores: valoresVisiveis(valores, meses),
    indicadores: calcularIndicadores(
      valores,
      meses,
      receitaBrutaSerie(
        valoresPorNv2.get('receitaBruta'),
        mesesConsulta
      )
    )
  }));

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
  const filtroEmpresa = empresa
    ? `  AND FIN.CODEMP = ${Number(empresa)}`
    : '';

  return [
    'SELECT',
    "  TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM') AS MES,",
    '  FIN.CODNAT AS CODIGO_NATUREZA,',
    '  SUM(',
    '    NVL(FIN.VLRDESDOB, 0) *',
    '    NVL(FIN.RECDESP, 0)',
    '  ) AS VALOR',
    'FROM TGFFIN TFIN',
    'LEFT JOIN VGFFINRAT FIN',
    '  ON FIN.NUFIN = TFIN.NUFIN',
    "WHERE FIN.PROVISAO = 'N'",
    `  AND TFIN.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')`,
    `  AND TFIN.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1`,
    filtroEmpresa,
    'GROUP BY',
    "  TO_CHAR(TRUNC(TFIN.DTNEG, 'MM'), 'YYYY-MM'),",
    '  FIN.CODNAT',
    'ORDER BY',
    '  MES,',
    '  CODIGO_NATUREZA'
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
  const dataUtc = new Date(
    `${data}T00:00:00Z`
  );

  dataUtc.setUTCFullYear(
    dataUtc.getUTCFullYear() - 1
  );

  return dataUtc.toISOString().slice(0, 7);
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
