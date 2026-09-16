import { carregarClientesRentabilidade } from './clientes-rentabilidade.js';
import { buscarCmvUnitario } from './produtos-cmv-rentabilidade.js';

const IMPOSTOS_PADRAO = 0.12;
const META_MARGEM = 0.20;

export async function listarRentabilidadeSkuSankhya(request, env, session) {
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

  try {
    const accessToken = await obterTokenSankhya(env);

    const [linhas, clientes] = await Promise.all([
      executarConsultaSankhya(accessToken, montarSqlVendas(inicio, fim)),
      carregarClientesRentabilidade(env)
    ]);

    const clientesPorCodigo = new Map(
      clientes.map((cliente) => [
        String(cliente.codigoParceiro || '').trim(),
        cliente
      ])
    );

    const items = linhas.map((linha) =>
      calcularLinhaRentabilidadeSku(linha, clientesPorCodigo)
    );

    return responderJson({
      inicio,
      fim,
      totalItens: items.length,
      items
    });
  } catch (error) {
    console.error('Falha na consulta da rentabilidade por SKU:', error);

    return responderJson({
      error: error.message ||
        'Não foi possível consultar a rentabilidade por SKU no Sankhya.'
    }, 502);
  }
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

export function calcularLinhaRentabilidadeSku(linha, clientesPorCodigo) {
  const codigoParceiro = String(linha[2] || '').trim();
  const produto = String(linha[5] || '');
  const quantidade = numeroSankhya(linha[6]);
  const valorLiquido = numeroSankhya(linha[7]);
  const valorSt = numeroSankhya(linha[8]);
  const faturamento = valorLiquido + valorSt;
  const cadastro = clientesPorCodigo.get(codigoParceiro);
  const percentualPromotoria = percentual(cadastro?.percentualPromotoria);
  const percentualContrato = percentual(cadastro?.percentualContrato);
  const percentualComissao = percentual(cadastro?.percentualComissao);
  const impostos = faturamento * IMPOSTOS_PADRAO;
  const acordos = 0;
  const receitaLiquida = faturamento - impostos - acordos - valorSt;
  const cmvUnitario = buscarCmvUnitario(produto);
  const cmvTotal = quantidade * cmvUnitario;
  const custoPromotoria = faturamento * percentualPromotoria;
  const custoContrato = faturamento * percentualContrato;
  const investimentos = 0;
  const custoComissao = faturamento * percentualComissao;

  const resultado = receitaLiquida - cmvTotal - custoPromotoria -
    custoContrato - investimentos - custoComissao;
  const margem = receitaLiquida > 0 ? resultado / receitaLiquida : null;

  return {
    data: converterDataSankhya(linha[0]),
    numeroNota: String(linha[1] || ''),
    codigoParceiro,
    parceiro: String(linha[3] || ''),
    codigoProduto: String(linha[4] || ''),
    produto,
    quantidade,
    valorLiquido,
    valorSt,
    coluna8: '',
    faturamento,
    impostos,
    acordos,
    receitaLiquida,
    cmvUnitario,
    cmvTotal,
    percentualPromotoria,
    custoPromotoria,
    percentualContrato,
    custoContrato,
    investimentos,
    percentualComissao,
    custoComissao,
    resultado,
    margem,
    metaMargem: META_MARGEM,
    gapMargem: margem === null ? null : margem - META_MARGEM,
    rede: cadastro?.rede || ''
  };
}

function percentual(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 && numero <= 1 ? numero : 0;
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

function dataSankhyaValida(valor, padrao) {
  const texto = String(valor || '').trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  return padrao.toISOString().slice(0, 10);
}

function converterDataSankhya(valor) {
  const texto = String(valor || '').trim();
  const iso = texto.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (iso) {
    return iso[1] + '-' + iso[2] + '-' + iso[3];
  }

  const brasileiro = texto.match(/(\d{2})\/(\d{2})\/(\d{4})/);

  if (brasileiro) {
    return brasileiro[3] + '-' + brasileiro[2] + '-' + brasileiro[1];
  }

  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  if (/^(19|20)\d{6}$/.test(numeros)) {
    return numeros.slice(0, 4) + '-' + numeros.slice(4, 6) + '-' +
      numeros.slice(6, 8);
  }

  if (/^\d{8}$/.test(numeros)) {
    return numeros.slice(4, 8) + '-' + numeros.slice(2, 4) + '-' +
      numeros.slice(0, 2);
  }

  return '';
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

function responderJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}
