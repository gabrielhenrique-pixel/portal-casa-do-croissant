import { carregarClientesRentabilidade } from './clientes-rentabilidade.js';
import { listarInvestimentosDaMargemRede } from './investimentos-rentabilidade.js';
import { calcularLinhaRentabilidadeSku } from './rentabilidade-sku-service.js';

const REDES_MODELO = [
  'ALIMAX', 'ANGELONI', 'ANGELONI SC', 'ARCHER', 'ASSAÍ', 'BAVARESCO',
  'BELLA VILLA', 'BOZA', 'CIRCUITO', 'COLATUSSO', 'CONDOR', 'COOP',
  'FESTVAL', 'GEPETTO', 'GIASSI', 'HIPER SELECT', 'HIPPO', 'ITALO',
  'JACOMAR', 'KOCH', 'MUFFATO', 'NO PONTO', 'OBA', 'OUTROS', 'REDE MAX',
  'STRAPASSON', 'SUPER GOLFF', 'TELEMACO', 'TOZETTO', 'VERONA',
  'ZAMPROGNA', 'IMPERATRIZ'
];

export async function listarMargemRedeSankhya(request, env, session) {
  if (!session || session.role !== 'Administrador') {
    return responderJson({ error: 'Acesso não autorizado.' }, 403);
  }

  if (!env.SANKHYA_CLIENT_ID ||
      !env.SANKHYA_CLIENT_SECRET ||
      !env.SANKHYA_X_TOKEN) {
    return responderJson({
      error: 'A integração com o Sankhya ainda não foi configurada.'
    }, 503);
  }

  const url = new URL(request.url);
  const hoje = new Date();
  const mesAnterior = new Date(hoje);
  mesAnterior.setMonth(mesAnterior.getMonth() - 1);

  const inicio = dataSankhyaValida(
    url.searchParams.get('inicio'),
    mesAnterior
  );
  const fim = dataSankhyaValida(url.searchParams.get('fim'), hoje);

  if (inicio > fim) {
    return responderJson({
      error: 'A data final não pode ser anterior à data inicial.'
    }, 400);
  }

  try {
    const [clientes, investimentos, accessToken] = await Promise.all([
      carregarClientesRentabilidade(env),
      listarInvestimentosDaMargemRede(env, inicio, fim),
      obterTokenSankhya(env)
    ]);

    const [linhasVendas, linhasDevolucoes, linhasFrete] = await Promise.all([
      executarConsultaSankhya(accessToken, montarSqlVendas(inicio, fim)),
      executarConsultaSankhya(accessToken, montarSqlDevolucoes(inicio, fim)),
      executarConsultaSankhya(accessToken, montarSqlFrete(inicio, fim))
    ]);

    const clientesPorCodigo = new Map(
      clientes.map((cliente) => [
        String(cliente.codigoParceiro || '').trim(),
        cliente
      ])
    );
    const resumoPorRede = new Map(
      REDES_MODELO.map((rede) => [rede, novoResumo(rede)])
    );
    const alertas = {
      vendasSemCadastro: new Map(),
      devolucoesSemCadastro: new Map(),
      fretesSemCadastro: new Map(),
      investimentosForaDoModelo: new Map()
    };

    linhasVendas.forEach((linha) => {
      const valores = valoresDaLinha(linha);
      const codigoParceiro = String(valores[2] || '').trim();
      const parceiro = String(valores[3] || '');
      const cadastro = clientesPorCodigo.get(codigoParceiro);
      const item = calcularLinhaRentabilidadeSku(valores, clientesPorCodigo);
      const resumo = resumoDaRede(resumoPorRede, cadastro?.rede);

      if (!resumo) {
        adicionarAlerta(
          alertas.vendasSemCadastro,
          codigoParceiro,
          parceiro,
          item.faturamento
        );
        return;
      }

      resumo.faturamentoBruto += item.faturamento;
      resumo.receitaLiquida += item.receitaLiquida;
      resumo.resultadoResumo += item.resultado;
      resumo.faturamentoPorParceiro.set(
        codigoParceiro,
        (resumo.faturamentoPorParceiro.get(codigoParceiro) || 0) +
          item.faturamento
      );
    });

    linhasDevolucoes.forEach((linha) => {
      const valores = valoresDaLinha(linha);
      const codigoParceiro = String(valores[2] || '').trim();
      const parceiro = String(valores[3] || '');
      const valorTotal = numeroSankhya(valores[7]);
      const cadastro = clientesPorCodigo.get(codigoParceiro);
      const resumo = resumoDaRede(resumoPorRede, cadastro?.rede);

      if (!resumo) {
        adicionarAlerta(
          alertas.devolucoesSemCadastro,
          codigoParceiro,
          parceiro,
          valorTotal
        );
        return;
      }

      resumo.devolucoes += valorTotal;
    });

    linhasFrete.forEach((linha) => {
      const valores = valoresDaLinha(linha);
      const codigoParceiro = String(valores[1] || '').trim();
      const parceiro = String(valores[4] || '');
      const freteProporcional = numeroSankhya(valores[13]);
      const cadastro = clientesPorCodigo.get(codigoParceiro);
      const resumo = resumoDaRede(resumoPorRede, cadastro?.rede);

      if (!resumo) {
        adicionarAlerta(
          alertas.fretesSemCadastro,
          codigoParceiro,
          parceiro,
          freteProporcional
        );
        return;
      }

      resumo.frete += freteProporcional;
    });

    investimentos.forEach((investimento) => {
      const resumo = resumoDaRede(resumoPorRede, investimento.rede);
      const valor = numeroSankhya(investimento.valor_real);

      if (!resumo) {
        adicionarAlerta(
          alertas.investimentosForaDoModelo,
          String(investimento.rede || ''),
          String(investimento.rede || ''),
          valor
        );
        return;
      }

      resumo.investimentos += valor;
    });

    const redes = REDES_MODELO.map((rede) => finalizarResumo(
      resumoPorRede.get(rede)
    ));
    const totalReceitaLiquida = redes.reduce(
      (total, rede) => total + rede.receitaLiquida,
      0
    );

    redes.forEach((rede) => {
      rede.participacao = totalReceitaLiquida === 0
        ? null
        : rede.receitaLiquida / totalReceitaLiquida;
    });

    return responderJson({
      inicio,
      fim,
      redes,
      alertas: {
        vendasSemCadastro: listaDeAlertas(alertas.vendasSemCadastro),
        devolucoesSemCadastro: listaDeAlertas(alertas.devolucoesSemCadastro),
        fretesSemCadastro: listaDeAlertas(alertas.fretesSemCadastro),
        investimentosForaDoModelo: listaDeAlertas(
          alertas.investimentosForaDoModelo
        )
      }
    });
  } catch (error) {
    console.error('Falha ao montar a Margem_Rede:', error);

    return responderJson({
      error: error.message || 'Não foi possível calcular a Margem_Rede.'
    }, 502);
  }
}

function novoResumo(rede) {
  return {
    rede,
    faturamentoBruto: 0,
    devolucoes: 0,
    receitaLiquida: 0,
    resultadoResumo: 0,
    investimentos: 0,
    frete: 0,
    faturamentoPorParceiro: new Map()
  };
}

function resumoDaRede(resumoPorRede, rede) {
  return resumoPorRede.get(String(rede || '').trim()) || null;
}

function finalizarResumo(resumo) {
  const receitaLiquida = limparMenosZero(
    resumo.receitaLiquida - resumo.devolucoes
  );
  const resultadoResumo = limparMenosZero(
    resumo.resultadoResumo - resumo.devolucoes
  );
  const investimentos = limparMenosZero(resumo.investimentos);
  const frete = limparMenosZero(resumo.frete);
  const resultadoFinal = limparMenosZero(
    resultadoResumo - investimentos - frete
  );

  return {
    rede: resumo.rede,
    faturamentoBruto: limparMenosZero(resumo.faturamentoBruto),
    devolucoes: limparMenosZero(resumo.devolucoes),
    receitaLiquida,
    resultadoResumo,
    investimentos,
    frete,
    resultadoFinal,
    margem: receitaLiquida === 0
      ? null
      : resultadoFinal / Math.abs(receitaLiquida),
    participacao: null,
    clientesPositivados: Array.from(
      resumo.faturamentoPorParceiro.values()
    ).filter((valor) => valor > 0).length
  };
}

function adicionarAlerta(mapa, codigoParceiro, parceiro, valor) {
  const chave = String(codigoParceiro || '').trim() || '(sem código)';
  const atual = mapa.get(chave) || {
    codigoParceiro: chave,
    parceiro: String(parceiro || ''),
    valor: 0
  };

  atual.valor += numeroSankhya(valor);
  mapa.set(chave, atual);
}

function listaDeAlertas(mapa) {
  return Array.from(mapa.values()).map((item) => ({
    codigoParceiro: item.codigoParceiro,
    parceiro: item.parceiro,
    valor: limparMenosZero(item.valor)
  }));
}

function montarSqlVendas(inicio, fim) {
  return [
    'SELECT',
    '  TRUNC(CAB.DTNEG) AS DATA,',
    '  CAB.NUNOTA AS NUMERO_NOTA,',
    '  PAR.CODPARC AS COD_PARCEIRO,',
    '  PAR.NOMEPARC AS PARCEIRO,',
    '  PRO.CODPROD AS COD_PRODUTO,',
    '  PRO.DESCRPROD AS PRODUTO,',
    '  ITE.QTDNEG AS QTD_NEG,',
    '  (NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0)) AS VLR_LIQUIDO,',
    '  NVL(ITE.VLRSUBST, 0) AS VLR_ST',
    'FROM TGFITE ITE',
    'INNER JOIN TGFCAB CAB ON CAB.NUNOTA = ITE.NUNOTA',
    'LEFT JOIN TGFPAR PAR ON PAR.CODPARC = CAB.CODPARC',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    '  AND CAB.CODTIPOPER = 1101',
    'ORDER BY CAB.DTNEG DESC, CAB.NUNOTA DESC, ITE.SEQUENCIA ASC'
  ].join(String.fromCharCode(10));
}

function montarSqlDevolucoes(inicio, fim) {
  return [
    'SELECT',
    '  TRUNC(CAB.DTNEG) AS DATA,',
    '  CAB.NUNOTA AS NUMERO_NOTA,',
    '  PAR.CODPARC AS COD_PARCEIRO,',
    '  PAR.NOMEPARC AS PARCEIRO,',
    '  PRO.DESCRPROD AS PRODUTO,',
    '  ITE.QTDNEG AS QTD_NEG,',
    '  ITE.VLRUNIT AS VLR_UNITARIO,',
    '  ITE.VLRTOT AS VALOR_TOTAL',
    'FROM TGFITE ITE',
    'INNER JOIN TGFCAB CAB ON CAB.NUNOTA = ITE.NUNOTA',
    'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
    'LEFT JOIN TGFPAR PAR ON PAR.CODPARC = CAB.CODPARC',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    '  AND CAB.CODTIPOPER = 1202',
    "  AND CAB.TIPMOV = 'D'",
    "  AND CAB.STATUSNOTA = 'L'",
    'ORDER BY CAB.DTNEG DESC'
  ].join(String.fromCharCode(10));
}

function montarSqlFrete(inicio, fim) {
  return [
    'SELECT',
    '    ENTR.NOMEENTR AS ENTREGADOR,',
    '    PAR.CODPARC,',
    '    VEN.CODVEND,',
    '    CAB.DTNEG,',
    '    PAR.NOMEPARC,',
    '    TPV.CODTIPVENDA,',
    '    CAB.NUMNOTA,',
    '    TN.TOTAL_PACOTES_NOTA,',
    '    TN.VLRLIQ_NOTA,',
    '    FN.DT_LANCAM,',
    '    FN.NUMERO_CTE,',
    '    FN.COD_TRANSPORTADORA,',
    '    FN.FRETE_TOTAL_CTE,',
    '    CASE',
    "        WHEN UPPER(TRIM(ENTR.NOMEENTR)) = 'VILMAR' THEN",
    '            ROUND(NVL(TV.TOTAL_PACOTES_VILMAR, 0) * 0.60, 2)',
    '        ELSE NVL(FN.FRETE_PROPORCIONAL_NOTA, 0)',
    '    END AS FRETE_PROPORCIONAL_NOTA,',
    '    CASE',
    "        WHEN UPPER(TRIM(ENTR.NOMEENTR)) = 'VILMAR'",
    '             AND NVL(TV.TOTAL_PACOTES_VILMAR, 0) > 0 THEN 0.60',
    "        WHEN UPPER(TRIM(ENTR.NOMEENTR)) = 'VILMAR' THEN 0",
    '        ELSE NVL(',
    '            ROUND(',
    '                FN.FRETE_PROPORCIONAL_NOTA',
    '                / NULLIF(TN.TOTAL_PACOTES_NOTA, 0),',
    '                2',
    '            ),',
    '            0',
    '        )',
    '    END AS FRETE_MEDIO_POR_PACOTE',
    'FROM TGFCAB CAB',
    'LEFT JOIN AD_TJKENTR ENTR',
    '    ON ENTR.CODENTR = CAB.AD_CODENTR',
    'LEFT JOIN (',
    '    SELECT',
    '        NUNOTA,',
    '        SUM(QTDNEG) AS TOTAL_PACOTES_NOTA,',
    '        SUM((VLRTOT - VLRDESC) + VLRSUBST) AS VLRLIQ_NOTA',
    '    FROM TGFITE',
    '    GROUP BY NUNOTA',
    ') TN',
    '    ON TN.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN (',
    '    SELECT',
    '        ITE3.NUNOTA,',
    '        SUM(',
    '            CASE',
    "                WHEN ITE3.CODVOL = 'CX' THEN",
    '                    (',
    '                        CASE',
    '                            WHEN VOA3.CODPROD IS NULL THEN ITE3.QTDNEG',
    "                            WHEN VOA3.DIVIDEMULTIPLICA = 'D'",
    '                                THEN ITE3.QTDNEG * VOA3.QUANTIDADE',
    '                            ELSE ITE3.QTDNEG / VOA3.QUANTIDADE',
    '                        END',
    '                    ) *',
    '                    CASE ITE3.CODPROD',
    '                        WHEN 43 THEN 15',
    '                        WHEN 42 THEN 15',
    '                        WHEN 44 THEN 15',
    '                        WHEN 917 THEN 28',
    '                        WHEN 155 THEN 25',
    '                        WHEN 931 THEN 28',
    '                        WHEN 930 THEN 28',
    '                        WHEN 928 THEN 28',
    '                        WHEN 929 THEN 28',
    '                        WHEN 809 THEN 28',
    '                        WHEN 156 THEN 25',
    '                        ELSE 1',
    '                    END',
    "                WHEN ITE3.CODVOL IN ('PA', 'UN') THEN ITE3.QTDNEG",
    '                ELSE ITE3.QTDNEG',
    '            END',
    '        ) AS TOTAL_PACOTES_VILMAR',
    '    FROM TGFITE ITE3',
    '    LEFT JOIN TGFVOA VOA3',
    '        ON VOA3.CODPROD = ITE3.CODPROD',
    '        AND VOA3.CODVOL = ITE3.CODVOL',
    '        AND (',
    "            (ITE3.CONTROLE IS NULL AND VOA3.CONTROLE = ' ')",
    '            OR (ITE3.CONTROLE IS NOT NULL AND ITE3.CONTROLE = VOA3.CONTROLE)',
    '        )',
    '    GROUP BY ITE3.NUNOTA',
    ') TV',
    '    ON TV.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN (',
    '    SELECT',
    '        CN.NUNOTA,',
    '        LISTAGG(TO_CHAR(CTE.NUMCTE), \', \')',
    '            WITHIN GROUP (ORDER BY CTE.NUMCTE) AS NUMERO_CTE,',
    '        LISTAGG(TO_CHAR(CTE.CODTRANSP), \', \')',
    '            WITHIN GROUP (ORDER BY CTE.CODTRANSP) AS COD_TRANSPORTADORA,',
    '        SUM(CTE.VLRFRETE) AS FRETE_TOTAL_CTE,',
    '        LISTAGG(',
    "            TO_CHAR(CTE.DHLANC, 'DD/MM/YYYY'),",
    "            ', '",
    '        ) WITHIN GROUP (ORDER BY CTE.NUMCTE) AS DT_LANCAM,',
    '        SUM(',
    '            ROUND(',
    '                CTE.VLRFRETE',
    '                * TN2.TOTAL_PACOTES_NOTA',
    '                / NULLIF(TC.PACOTES_TOTAIS_CTE, 0),',
    '                2',
    '            )',
    '        ) AS FRETE_PROPORCIONAL_NOTA',
    '    FROM (',
    '        SELECT DISTINCT',
    '            NUNOTA,',
    '            NUMCTE',
    '        FROM CTF_CTENOTA',
    '    ) CN',
    '    LEFT JOIN CTF_CTE CTE',
    '        ON CTE.NUMCTE = CN.NUMCTE',
    '    LEFT JOIN (',
    '        SELECT',
    '            NUNOTA,',
    '            SUM(QTDNEG) AS TOTAL_PACOTES_NOTA',
    '        FROM TGFITE',
    '        GROUP BY NUNOTA',
    '    ) TN2',
    '        ON TN2.NUNOTA = CN.NUNOTA',
    '    LEFT JOIN (',
    '        SELECT',
    '            CN2.NUMCTE,',
    '            SUM(ITE2.QTDNEG) AS PACOTES_TOTAIS_CTE',
    '        FROM (',
    '            SELECT DISTINCT',
    '                NUNOTA,',
    '                NUMCTE',
    '            FROM CTF_CTENOTA',
    '        ) CN2',
    '        INNER JOIN TGFCAB CAB2',
    '            ON CAB2.NUNOTA = CN2.NUNOTA',
    '        INNER JOIN TGFITE ITE2',
    '            ON ITE2.NUNOTA = CN2.NUNOTA',
    '        INNER JOIN TGFTOP TPO2',
    '            ON TPO2.CODTIPOPER = CAB2.CODTIPOPER',
    '            AND TPO2.DHALTER = CAB2.DHTIPOPER',
    "        WHERE CAB2.DTNEG >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -2)",
    "          AND CAB2.DTNEG < TRUNC(SYSDATE) + 1",
    "          AND CAB2.TIPMOV = 'V'",
    "          AND CAB2.STATUSNOTA = 'L'",
    "          AND CAB2.STATUSNFE = 'A'",
    "          AND TPO2.DESCROPER = 'VENDA NF-E'",
    '        GROUP BY CN2.NUMCTE',
    '    ) TC',
    '        ON TC.NUMCTE = CN.NUMCTE',
    '    GROUP BY CN.NUNOTA',
    ') FN',
    '    ON FN.NUNOTA = CAB.NUNOTA',
    'LEFT JOIN TGFPAR PAR',
    '    ON PAR.CODPARC = CAB.CODPARC',
    'LEFT JOIN TGFTOP TPO',
    '    ON TPO.CODTIPOPER = CAB.CODTIPOPER',
    '    AND TPO.DHALTER = CAB.DHTIPOPER',
    'LEFT JOIN TGFTPV TPV',
    '    ON TPV.CODTIPVENDA = CAB.CODTIPVENDA',
    '    AND TPV.DHALTER = CAB.DHTIPVENDA',
    'LEFT JOIN TGFVEN VEN',
    '    ON VEN.CODVEND = CAB.CODVEND',
    "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
    "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
    "  AND CAB.TIPMOV = 'V'",
    "  AND CAB.STATUSNOTA = 'L'",
    "  AND CAB.STATUSNFE = 'A'",
    "  AND TPO.DESCROPER = 'VENDA NF-E'",
    'ORDER BY CAB.NUMNOTA'
  ].join(String.fromCharCode(10));
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
    throw new Error('O Sankhya não retornou um token de acesso.');
  }

  return dados.access_token;
}

async function executarConsultaSankhya(accessToken, sql) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr' +
    '?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
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
      dados.statusMessage || 'O Sankhya recusou a consulta.'
    );
  }

  if (!dados.responseBody || !Array.isArray(dados.responseBody.rows)) {
    throw new Error(
      dados.statusMessage || 'O Sankhya retornou uma resposta sem linhas.'
    );
  }

  return dados.responseBody.rows;
}

function valoresDaLinha(linha) {
  if (Array.isArray(linha)) return linha;
  if (linha && Array.isArray(linha.row)) return linha.row;
  if (linha && typeof linha === 'object') return Object.values(linha);
  return [];
}

function dataSankhyaValida(valor, padrao) {
  const texto = String(valor || '').trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  return padrao.toISOString().slice(0, 10);
}

function numeroSankhya(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  let texto = String(valor || '').trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : 0;
}

function limparMenosZero(valor) {
  return Math.abs(valor) < 0.00000001 ? 0 : valor;
}

function responderJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}
