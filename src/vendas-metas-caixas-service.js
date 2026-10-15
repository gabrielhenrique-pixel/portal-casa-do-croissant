import { listarProdutosHabilitadosPainel } from './produtos-painel-service.js';

const LIMITE = 999999999.99;

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

export async function listarVendedoresCadastrados(env) {
  const resultado = await env.DB.prepare(`
    SELECT
      uv.codigo_vendedor AS codigoVendedor,
      u.username AS usuario
    FROM usuarios_vendedores uv
    INNER JOIN users u
      ON u.id = uv.user_id
    ORDER BY u.username
  `).all();

  return (resultado.results || [])
    .map(function(vendedor) {
      return {
        codigoVendedor: String(
          vendedor.codigoVendedor || ''
        ).trim(),
        usuario: String(vendedor.usuario || '').trim()
      };
    })
    .filter(function(vendedor) {
      return /^\d+$/.test(vendedor.codigoVendedor);
    });
}

export async function carregarCadastroMetasPainel(env) {
  await garantirMetasPainel(env);

  const vendedoresCadastrados =
    await listarVendedoresCadastrados(env);

  const codigosVendedores = vendedoresCadastrados
    .map(function(vendedor) {
      return vendedor.codigoVendedor;
    });

  const codigosCadastrados = new Set(codigosVendedores);

  const filtroVendedores = codigosVendedores.length
    ? 'WHERE CODVEND IN (' +
      codigosVendedores.map(Number).join(',') +
      ')'
    : 'WHERE 1 = 0';

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
        ${filtroVendedores}
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

  vendedoresCadastrados.forEach(function(vendedorCadastrado) {
    vendedores.set(vendedorCadastrado.codigoVendedor, {
      codigoVendedor: vendedorCadastrado.codigoVendedor,
      vendedor: (
        vendedorCadastrado.usuario || 'SEM VENDEDOR'
      ).toUpperCase(),
      meta: 0
    });
  });

  linhasVendedores.forEach(function(linha) {
    const codigoVendedor = String(linha[0] || '').trim();
    const vendedorCadastrado = vendedores.get(codigoVendedor);

    if (!vendedorCadastrado) {
      return;
    }

    vendedores.set(codigoVendedor, {
      ...vendedorCadastrado,
      vendedor: String(
        linha[1] || vendedorCadastrado.vendedor
      ).trim()
    });
  });

  (metas.results || []).forEach(function(meta) {
    const codigoVendedor = String(meta.codigoVendedor || '');

    if (!codigosCadastrados.has(codigoVendedor)) {
      return;
    }

    const vendedorCadastrado = vendedores.get(codigoVendedor);

    vendedores.set(codigoVendedor, {
      codigoVendedor,
      vendedor:
        vendedorCadastrado?.vendedor ||
        String(meta.vendedor || 'SEM VENDEDOR').trim(),
      meta: Number(meta.meta) || 0
    });
  });

  return {
    metaEmpresa: Number(empresa?.meta) || 0,

    vendedores: Array.from(vendedores.values()).sort(
      function(a, b) {
        return a.vendedor.localeCompare(
          b.vendedor,
          'pt-BR'
        );
      }
    ),

    produtos: produtos.map(function(produto) {
      return {
        codigoProduto: String(produto.codigoProduto),
        produto: produto.produto,
        grupo: produto.grupo,
        pacotesPorCaixa: produto.pacotesPorCaixa
      };
    }),

    metasCaixas: caixas.filter(function(meta) {
      return codigosCadastrados.has(
        String(meta.codigoVendedor)
      );
    })
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

    if (temVendedor) {
    const vendedoresCadastrados =
      await listarVendedoresCadastrados(env);

    const vendedorCadastrado = vendedoresCadastrados.some(
      function(vendedorCadastrado) {
        return (
          vendedorCadastrado.codigoVendedor ===
          String(vendedor.codigoVendedor)
        );
      }
    );

    if (!vendedorCadastrado) {
      return {
        error:
          'Este código não possui um login cadastrado como vendedor.',
        status: 403
      };
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
