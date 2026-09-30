import { listarProdutosHabilitadosPainel } from './produtos-painel-service.js';

export const PRODUTOS_METAS_CAIXAS = [
  { codigoProduto: '155', grupo: 'Pão Croissant 250g' },
  { codigoProduto: '156', grupo: 'Pão Croissant 250g' },
  { codigoProduto: '809', grupo: 'Pão Croissant 125g' },
  { codigoProduto: '917', grupo: 'Amêndoas' },
  { codigoProduto: '291', grupo: 'Pão croissant 10un' },
  { codigoProduto: '44', grupo: 'Biscoitos' },
  { codigoProduto: '43', grupo: 'Biscoitos' },
  { codigoProduto: '42', grupo: 'Biscoitos' },
  { codigoProduto: '931', grupo: 'Croissant TO GO' },
  { codigoProduto: '929', grupo: 'Croissant TO GO' },
  { codigoProduto: '930', grupo: 'Croissant TO GO' },
  { codigoProduto: '928', grupo: 'Croissant TO GO' }
];

const LIMITE = 999999999.99;

function numeroSankhya(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  let texto = String(valor ?? '').trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : 0;
}

export async function garantirMetasPainel(env) {
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS vendas_metas_vendedores (
        codigo_vendedor TEXT PRIMARY KEY,
        vendedor TEXT NOT NULL,
        meta REAL NOT NULL DEFAULT 0,
        atualizado_em TEXT NOT NULL
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS vendas_meta_empresa (
        id INTEGER PRIMARY KEY,
        meta REAL NOT NULL DEFAULT 0,
        atualizado_em TEXT NOT NULL
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS vendas_metas_caixas (
        codigo_vendedor TEXT NOT NULL,
        codigo_produto TEXT NOT NULL,
        meta_caixas REAL NOT NULL DEFAULT 0,
        atualizado_em TEXT NOT NULL,
        atualizado_por TEXT NOT NULL,
        PRIMARY KEY (codigo_vendedor, codigo_produto)
      )
    `)
  ]);
}

export async function listarMetasCaixas(env) {
  await garantirMetasPainel(env);

  const resultado = await env.DB.prepare(`
    SELECT
      codigo_vendedor AS codigoVendedor,
      codigo_produto AS codigoProduto,
      meta_caixas AS metaCaixas
    FROM vendas_metas_caixas
  `).all();

  return resultado.results || [];
}

async function consultar(token, sql) {
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
      dados.statusMessage || 'Não foi possível consultar o Sankhya.'
    );
  }

  return dados.responseBody.rows;
}

async function autenticar(env) {
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

  const dados = await resposta.json();

  if (!resposta.ok || !dados.access_token) {
    throw new Error('Autenticação Sankhya recusada.');
  }

  return dados.access_token;
}

export async function carregarCadastroMetasPainel(env) {
  await garantirMetasPainel(env);

  const token = await autenticar(env);

  const [
    linhasVendedores,
    produtos,
    metas,
    empresa,
    caixas
  ] = await Promise.all([
    consultar(
      token,
      `
        SELECT
          CODVEND,
          NVL(APELIDO, 'SEM VENDEDOR')
        FROM TGFVEN
        ORDER BY APELIDO
      `
    ),

    listarProdutosHabilitadosPainel(env),

    env.DB.prepare(`
      SELECT
        codigo_vendedor AS codigoVendedor,
        vendedor,
        meta
      FROM vendas_metas_vendedores
    `).all(),

    env.DB.prepare(`
      SELECT meta
      FROM vendas_meta_empresa
      WHERE id = 1
    `).first(),

    listarMetasCaixas(env)
  ]);

  const vendedores = new Map();

  linhasVendedores.forEach(linha => {
    vendedores.set(String(linha[0]), {
      codigoVendedor: String(linha[0]),
      vendedor: String(linha[1] || 'SEM VENDEDOR').trim(),
      meta: 0
    });
  });

  (metas.results || []).forEach(meta => {
    const codigo = String(meta.codigoVendedor);

    vendedores.set(codigo, {
      codigoVendedor: codigo,
      vendedor:
        vendedores.get(codigo)?.vendedor || meta.vendedor,
      meta: Number(meta.meta) || 0
    });
  });

  return {
    metaEmpresa: Number(empresa?.meta) || 0,

    vendedores: Array.from(vendedores.values()).sort(
      (a, b) => a.vendedor.localeCompare(b.vendedor, 'pt-BR')
    ),

    produtos: produtos.map(produto => ({
      codigoProduto: String(produto.codigoProduto),
      produto: produto.produto,
      grupo: produto.grupo,
      pacotesPorCaixa: produto.pacotesPorCaixa
    })),

    metasCaixas: caixas
  };
}

function valorValido(valor) {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= 0 &&
    valor <= LIMITE
  );
}

export async function salvarMetasPainel(env, dados, usuario) {
  if (
    !dados ||
    typeof dados !== 'object' ||
    Array.isArray(dados)
  ) {
    return {
      error: 'Dados de metas inválidos.',
      status: 400
    };
  }

  const temEmpresa = Object.hasOwn(dados, 'metaEmpresa');
  const temVendedor = Object.hasOwn(dados, 'vendedor');

  if (!temEmpresa && !temVendedor) {
    return {
      error: 'Nenhuma meta informada.',
      status: 400
    };
  }

  if (temEmpresa && !valorValido(dados.metaEmpresa)) {
    return {
      error: 'Informe uma meta financeira total válida.',
      status: 400
    };
  }

  const vendedor = dados.vendedor;

  if (temVendedor) {
    if (
      !vendedor ||
      !/^\d+$/.test(String(vendedor.codigoVendedor ?? '')) ||
      typeof vendedor.vendedor !== 'string' ||
      !vendedor.vendedor.trim() ||
      vendedor.vendedor.length > 200 ||
      !valorValido(vendedor.meta)
    ) {
      return {
        error: 'Vendedor ou meta financeira inválidos.',
        status: 400
      };
    }

        if (!Array.isArray(dados.metasCaixas)) {
      return {
        error: 'Informe as metas em caixas dos produtos.',
        status: 400
      };
    }

    const produtosHabilitados =
      await listarProdutosHabilitadosPainel(env);

    const permitidos = new Set(
      produtosHabilitados.map(
        produto => String(produto.codigoProduto)
      )
    );

    if (dados.metasCaixas.length !== permitidos.size) {
      return {
        error: 'A lista de produtos foi alterada. Recarregue a página de metas antes de salvar.',
        status: 409
      };
    }

    for (const item of dados.metasCaixas) {
      if (
        !item ||
        !permitidos.delete(String(item.codigoProduto)) ||
        !valorValido(item.metaCaixas)
      ) {
        return {
          error: 'Produto repetido, não habilitado ou meta inválida. Confira o cadastro e recarregue a página de metas.',
          status: 400
        };
      }
    }
  }

  await garantirMetasPainel(env);

  const agora = new Date().toISOString();
  const comandos = [];

  if (temEmpresa) {
    comandos.push(
      env.DB.prepare(`
        INSERT INTO vendas_meta_empresa (
          id,
          meta,
          atualizado_em
        )
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          meta = excluded.meta,
          atualizado_em = excluded.atualizado_em
      `).bind(dados.metaEmpresa, agora)
    );
  }

  if (temVendedor) {
    comandos.push(
      env.DB.prepare(`
        INSERT INTO vendas_metas_vendedores (
          codigo_vendedor,
          vendedor,
          meta,
          atualizado_em
        )
        VALUES (?, ?, ?, ?)
        ON CONFLICT(codigo_vendedor) DO UPDATE SET
          vendedor = excluded.vendedor,
          meta = excluded.meta,
          atualizado_em = excluded.atualizado_em
      `).bind(
        String(vendedor.codigoVendedor),
        vendedor.vendedor.trim().toUpperCase(),
        vendedor.meta,
        agora
      )
    );

    for (const item of dados.metasCaixas) {
      comandos.push(
        env.DB.prepare(`
          INSERT INTO vendas_metas_caixas (
            codigo_vendedor,
            codigo_produto,
            meta_caixas,
            atualizado_em,
            atualizado_por
          )
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(codigo_vendedor, codigo_produto)
          DO UPDATE SET
            meta_caixas = excluded.meta_caixas,
            atualizado_em = excluded.atualizado_em,
            atualizado_por = excluded.atualizado_por
        `).bind(
          String(vendedor.codigoVendedor),
          String(item.codigoProduto),
          item.metaCaixas,
          agora,
          usuario
        )
      );
    }
  }

  comandos.push(
    env.DB.prepare(`
      INSERT INTO audit_log (
        id,
        created_at,
        username,
        action,
        detail
      )
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      agora,
      usuario,
      'METAS_VENDAS_ATUALIZADAS',
      JSON.stringify({
        metaEmpresa: temEmpresa ? dados.metaEmpresa : undefined,
        vendedor: temVendedor ? vendedor : undefined,
        metasCaixas: temVendedor ? dados.metasCaixas : undefined
      })
    )
  );

  await env.DB.batch(comandos);

  return { ok: true };
}

export async function consultarCaixasVendidas(
  token,
  inicio,
  fim,
  vendedor
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(inicio) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fim) ||
    (vendedor && !/^\d+$/.test(vendedor))
  ) {
    throw new Error('Filtro de vendas inválido.');
  }

  const ids = PRODUTOS_METAS_CAIXAS
    .map(produto => produto.codigoProduto)
    .join(',');

  const conversao = `
    CASE
      WHEN UPPER(TRIM(ITE.CODVOL)) IN ('CX', 'CAIXA')
        THEN NVL(ITE.QTDNEG, 0)

      WHEN VOA.VARIACOES = 1
        AND VOA.QUANTIDADE > 0
        AND VOA.DIVIDEMULTIPLICA = 'D'
        THEN NVL(ITE.QTDNEG, 0) * VOA.QUANTIDADE

      WHEN VOA.VARIACOES = 1
        AND VOA.QUANTIDADE > 0
        AND VOA.DIVIDEMULTIPLICA = 'M'
        THEN NVL(ITE.QTDNEG, 0) / VOA.QUANTIDADE

      WHEN NVL(ITE.QTDNEG, 0) = 0
        THEN 0

      ELSE NULL
    END
  `;

  const sql = `
    SELECT
      ITE.CODPROD,
      SUM(${conversao}) AS CAIXAS,
      SUM(
        CASE
          WHEN (${conversao}) IS NULL THEN 1
          ELSE 0
        END
      ) AS SEM_CONVERSAO

    FROM TGFCAB CAB

    INNER JOIN TGFITE ITE
      ON ITE.NUNOTA = CAB.NUNOTA

    LEFT JOIN (
      SELECT
        CODPROD,
        CODVOL,
        NVL(TRIM(CONTROLE), ' ') AS CONTROLE,
        MAX(QUANTIDADE) AS QUANTIDADE,
        MAX(DIVIDEMULTIPLICA) AS DIVIDEMULTIPLICA,
        COUNT(
          DISTINCT TO_CHAR(QUANTIDADE) || ':' || DIVIDEMULTIPLICA
        ) AS VARIACOES

      FROM TGFVOA

      GROUP BY
        CODPROD,
        CODVOL,
        NVL(TRIM(CONTROLE), ' ')
    ) VOA
      ON VOA.CODPROD = ITE.CODPROD
      AND VOA.CODVOL = ITE.CODVOL
      AND VOA.CONTROLE = NVL(TRIM(ITE.CONTROLE), ' ')

    WHERE CAB.DTNEG >= TO_DATE('${inicio}', 'YYYY-MM-DD')
      AND CAB.DTNEG < TO_DATE('${fim}', 'YYYY-MM-DD') + 1
      AND CAB.TIPMOV = 'V'
      AND CAB.STATUSNOTA = 'L'
      AND CAB.CODTIPOPER = 1101
      AND ITE.CODPROD IN (${ids})
      ${vendedor ? 'AND CAB.CODVEND = ' + Number(vendedor) : ''}

    GROUP BY ITE.CODPROD
  `;

  return consultar(token, sql);
}

export function agruparMetasCaixas(
  linhas,
  metas,
  vendedorSelecionado = ''
) {
  const valores = new Map(
    linhas.map(linha => [
      String(linha[0]),
      {
        caixas: numeroSankhya(linha[1]),
        semConversao: numeroSankhya(linha[2])
      }
    ])
  );

  const metasPorProduto = new Map();

  metas.forEach(meta => {
    if (
      vendedorSelecionado &&
      String(meta.codigoVendedor) !== vendedorSelecionado
    ) {
      return;
    }

    const codigo = String(meta.codigoProduto);

    metasPorProduto.set(
      codigo,
      (metasPorProduto.get(codigo) || 0) +
        Number(meta.metaCaixas || 0)
    );
  });

  const grupos = new Map();

  PRODUTOS_METAS_CAIXAS.forEach(produto => {
    if (!grupos.has(produto.grupo)) {
      grupos.set(produto.grupo, {
        produto: produto.grupo,
        codigoProduto: produto.grupo,
        caixasVendidas: 0,
        metaCaixas: 0,
        semConversao: 0
      });
    }

    const grupo = grupos.get(produto.grupo);

    grupo.caixasVendidas +=
      valores.get(produto.codigoProduto)?.caixas || 0;

    grupo.semConversao +=
      valores.get(produto.codigoProduto)?.semConversao || 0;

    grupo.metaCaixas +=
      metasPorProduto.get(produto.codigoProduto) || 0;
  });

  return Array.from(grupos.values()).map(grupo => ({
    ...grupo,

    caixasVendidas: grupo.semConversao
      ? null
      : grupo.caixasVendidas,

    percentualMeta:
      grupo.metaCaixas > 0 && !grupo.semConversao
        ? grupo.caixasVendidas / grupo.metaCaixas
        : null
  }));
}
