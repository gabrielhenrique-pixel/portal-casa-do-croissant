import { listarProdutosHabilitadosPainel } from './produtos-painel-service.js';
import { listarMetasCaixas } from './vendas-metas-caixas-service.js';

function numero(valor) {
  if (typeof valor === 'number') return valor;

  let texto = String(valor ?? '').trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const convertido = Number(texto);

  if (!Number.isFinite(convertido)) {
    throw new Error(
      'Quantidade inválida recebida do Sankhya.'
    );
  }

  return convertido;
}

export async function listarCaixasDoPainel(
  env,
  token,
  inicio,
  fim,
  vendedor = '',
  codigosVendedoresCadastrados = []
) {
  vendedor = String(vendedor ?? '').trim();

    vendedor = String(vendedor ?? '').trim();

  const codigosVendedores = Array.from(
    new Set(
      (Array.isArray(codigosVendedoresCadastrados)
        ? codigosVendedoresCadastrados
        : []
      ).map(function(codigoVendedor) {
        return String(codigoVendedor ?? '').trim();
      })
    )
  );

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(inicio) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fim) ||
    inicio > fim ||
    (vendedor && !/^\d+$/.test(vendedor)) ||
    codigosVendedores.some(function(codigoVendedor) {
      return !/^\d+$/.test(codigoVendedor);
    })
  ) {
    throw new Error('Filtro de vendas inválido.');
  }

  const codigosVendedoresSet = new Set(
    codigosVendedores
  );

  const filtroVendedoresCadastrados =
    codigosVendedores.length
      ? 'AND CAB.CODVEND IN (' +
        codigosVendedores.map(Number).join(',') +
        ')'
      : 'AND 1 = 0';

  const filtroVendedor = vendedor
    ? 'AND CAB.CODVEND = ' + Number(vendedor)
    : '';

  const [produtos, metas] = await Promise.all([
    listarProdutosHabilitadosPainel(env),
    listarMetasCaixas(env)
  ]);

  if (!produtos.length) return [];

  const porCodigo = new Map();
  const grupos = new Map();

  produtos.forEach(produto => {
    const codigo = String(produto.codigoProduto);

    if (!/^\d{1,10}$/.test(codigo)) {
      throw new Error('Código de produto inválido.');
    }

    if (!(Number(produto.pacotesPorCaixa) > 0)) {
      throw new Error(
        'Confira os pacotes por caixa do produto ' + codigo + '.'
      );
    }

    porCodigo.set(codigo, produto);

    if (!grupos.has(produto.grupo)) {
      grupos.set(produto.grupo, {
        produto: produto.grupo,
        codigoProduto: produto.grupo,
        caixasVendidas: 0,
        metaCaixas: 0,
        semConversao: 0
      });
    }
  });

    metas.forEach(meta => {
    const codigoVendedor = String(
      meta.codigoVendedor
    );

    if (!codigosVendedoresSet.has(codigoVendedor)) {
      return;
    }

    if (
      vendedor &&
      codigoVendedor !== vendedor
    ) {
      return;
    }

    const produto = porCodigo.get(
      String(meta.codigoProduto)
    );

    if (produto) {
      grupos.get(produto.grupo).metaCaixas += numero(
        meta.metaCaixas
      );
    }
  });

  const codigos = Array.from(porCodigo.keys());

  for (let i = 0; i < codigos.length; i += 500) {
    const ids = codigos.slice(i, i + 500).join(',');

    const sql = `
      SELECT
        ITE.CODPROD,
        SUM(NVL(ITE.QTDNEG, 0)) AS QUANTIDADE,
        UPPER(TRIM(PRO.CODVOL)) AS UNIDADE_PADRAO

      FROM TGFCAB CAB

      INNER JOIN TGFITE ITE
        ON ITE.NUNOTA = CAB.NUNOTA

      INNER JOIN TGFPRO PRO
        ON PRO.CODPROD = ITE.CODPROD

      WHERE CAB.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')
        AND CAB.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1
        AND CAB.TIPMOV = 'V'
        AND CAB.STATUSNOTA = 'L'
        AND CAB.CODTIPOPER IN (1101, 1107)
        AND PRO.USOPROD = 'V'
        AND ITE.CODPROD IN (${ids})
        ${filtroVendedoresCadastrados}
        ${filtroVendedor}

      GROUP BY
        ITE.CODPROD,
        UPPER(TRIM(PRO.CODVOL))
    `;

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
          requestBody: { sql }
        })
      }
    );

    const dados = await resposta.json();

    if (
      !resposta.ok ||
      String(dados.status) === '0' ||
      !Array.isArray(dados.responseBody?.rows)
    ) {
      throw new Error(
        dados.statusMessage ||
        'Não foi possível consultar as quantidades vendidas.'
      );
    }

    dados.responseBody.rows.forEach(linha => {
      const produto = porCodigo.get(String(linha[0]));

      if (!produto) return;

      const grupo = grupos.get(produto.grupo);
      const quantidade = numero(linha[1]);

      const unidade = String(linha[2] || '')
        .trim()
        .toUpperCase();

      if (quantidade === 0) return;

      if (unidade !== produto.unidadeSankhya) {
        grupo.semConversao++;

      } else if (
        ['PA', 'PCT', 'PAC', 'PACOTE'].includes(unidade)
      ) {
        grupo.caixasVendidas +=
          quantidade / Number(produto.pacotesPorCaixa);

      } else if (
        ['CX', 'CAIXA'].includes(unidade)
      ) {
        grupo.caixasVendidas += quantidade;

      } else {
        grupo.semConversao++;
      }
    });
  }

  return Array.from(grupos.values()).map(grupo => ({
    ...grupo,

    caixasVendidas: grupo.semConversao
      ? null
      : grupo.caixasVendidas,

    percentualMeta:
      !grupo.semConversao && grupo.metaCaixas > 0
        ? grupo.caixasVendidas / grupo.metaCaixas
        : null
  }));
}
