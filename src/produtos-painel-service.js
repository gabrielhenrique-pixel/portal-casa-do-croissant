export async function garantirCadastroProdutos(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS produtos_painel_config (
      codigo_produto TEXT PRIMARY KEY,
      pacotes_por_caixa INTEGER,
      cmv REAL,
      grupo TEXT NOT NULL DEFAULT '',
      habilitado INTEGER NOT NULL DEFAULT 0,
      unidade_sankhya TEXT NOT NULL DEFAULT '',
      atualizado_em TEXT NOT NULL,
      atualizado_por TEXT NOT NULL
    )
  `).run();

  const colunas = await env.DB.prepare(
    'PRAGMA table_info(produtos_painel_config)'
  ).all();

  const possuiCmv = (colunas.results || []).some(coluna =>
    String(coluna.name || '').toLowerCase() === 'cmv'
  );

    if (!possuiCmv) {
    try {
      await env.DB.prepare(
        'ALTER TABLE produtos_painel_config ADD COLUMN cmv REAL'
      ).run();
    } catch (erro) {
      if (!/duplicate column name/i.test(String(erro?.message || erro))) {
        throw erro;
      }
    }
  }

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS grupos_produtos (
      nome TEXT PRIMARY KEY COLLATE NOCASE,
      criado_em TEXT NOT NULL,
      criado_por TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    INSERT OR IGNORE INTO grupos_produtos (
      nome,
      criado_em,
      criado_por
    )
    SELECT
      TRIM(grupo),
      datetime('now'),
      'MIGRACAO'
    FROM produtos_painel_config
    WHERE TRIM(grupo) <> ''
    GROUP BY TRIM(grupo)
  `).run();
}

function normalizarNomeGrupo(valor) {
  return String(valor || '')
    .trim()
    .replace(/\s+/g, ' ');
}

export async function listarGruposProdutos(env) {
  await garantirCadastroProdutos(env);

  const resultado = await env.DB.prepare(`
    SELECT nome
    FROM grupos_produtos
    ORDER BY nome COLLATE NOCASE
  `).all();

  return (resultado.results || []).map(function(grupo) {
    return String(grupo.nome || '').trim();
  });
}

export async function criarGrupoProduto(env, nome, usuario) {
  const grupo = normalizarNomeGrupo(nome);

  if (!grupo || grupo.length > 80) {
    return {
      error:
        'Informe um nome de grupo entre 1 e 80 caracteres.',
      status: 400
    };
  }

  await garantirCadastroProdutos(env);

  const existente = await env.DB.prepare(`
    SELECT nome
    FROM grupos_produtos
    WHERE nome COLLATE NOCASE = ?
  `).bind(grupo).first();

  if (existente) {
    return {
      error: 'Este grupo já está cadastrado.',
      status: 409
    };
  }

  const agora = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO grupos_produtos (
        nome,
        criado_em,
        criado_por
      )
      VALUES (?, ?, ?)
    `).bind(grupo, agora, usuario),

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
      'GRUPO_PRODUTO_CRIADO',
      JSON.stringify({ grupo })
    )
  ]);

  return { grupo };
}

async function consultarProdutosSankhya(env, codigo = '') {
  if (codigo && !/^\d+$/.test(codigo)) {
    throw new Error('Código de produto inválido.');
  }

  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    throw new Error(
      'A integração com o Sankhya não está configurada.'
    );
  }

  const autenticacao = await fetch(
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

  const acesso = await autenticacao.json();

  if (!autenticacao.ok || !acesso.access_token) {
    throw new Error('Autenticação Sankhya recusada.');
  }

  const sql = `
    SELECT
      PRO.CODPROD,
      PRO.DESCRPROD,
      PRO.CODVOL,
      PRO.ATIVO
    FROM TGFPRO PRO
    WHERE PRO.USOPROD = 'V'
      ${codigo ? 'AND PRO.CODPROD = ' + codigo : ''}
    ORDER BY PRO.DESCRPROD, PRO.CODPROD
  `;

  const resposta = await fetch(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + acesso.access_token,
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
      'Não foi possível consultar os produtos.'
    );
  }

  return dados.responseBody.rows.map(linha => ({
    codigoProduto: String(linha[0]),

    produto: String(linha[1] || '').trim(),

    unidadeSankhya: String(linha[2] || '')
      .trim()
      .toUpperCase(),

    ativoSankhya: String(linha[3] || '')
      .trim()
      .toUpperCase() === 'S'
  }));
}

function juntarConfiguracao(produto, configuracao) {
  const pacotes = Number(configuracao?.pacotes_por_caixa);
  const cmv = configuracao?.cmv == null
    ? null
    : Number(configuracao.cmv);
  const grupo = String(configuracao?.grupo || '').trim();

  const unidadeConfirmada =
    !!configuracao &&
    configuracao.unidade_sankhya === produto.unidadeSankhya;

  const configurado =
    Number.isInteger(pacotes) &&
    pacotes > 0 &&
    !!grupo &&
    unidadeConfirmada;

  const habilitado =
    produto.ativoSankhya &&
    configurado &&
    Number(configuracao?.habilitado) === 1;

  let situacao = 'Pendente de configuração';

  if (!produto.ativoSankhya) {
    situacao = 'Inativo no Sankhya';
  } else if (configuracao && !unidadeConfirmada) {
    situacao = 'Revisar unidade de venda';
  } else if (configurado) {
    situacao = habilitado ? 'Habilitado' : 'Fora do painel';
  }

  return {
    ...produto,
    pacotesPorCaixa: pacotes > 0 ? pacotes : null,
    cmv: Number.isFinite(cmv) && cmv >= 0 ? cmv : null,
    grupo,
    habilitado,
    configurado,
    situacao,
    atualizadoEm: configuracao?.atualizado_em || null
  };
}

export async function listarCadastroProdutos(env) {
  await garantirCadastroProdutos(env);

    const [
    produtos,
    cadastro,
    grupos
  ] = await Promise.all([
    consultarProdutosSankhya(env),

    env.DB.prepare(`
      SELECT *
      FROM produtos_painel_config
    `).all(),

    listarGruposProdutos(env)
  ]);

  const configuracoes = new Map(
    (cadastro.results || []).map(item => [
      String(item.codigo_produto),
      item
    ])
  );

  return {
    produtos: produtos.map(produto => juntarConfiguracao(
      produto,
      configuracoes.get(produto.codigoProduto)
    )),

        grupos
  };
}

export async function listarCmvProdutosConfigurados(env) {
  await garantirCadastroProdutos(env);

  const cadastro = await env.DB.prepare(`
    SELECT codigo_produto, cmv
    FROM produtos_painel_config
    WHERE cmv IS NOT NULL
      AND cmv >= 0
  `).all();

  return new Map(
    (cadastro.results || []).map(item => [
      String(item.codigo_produto || '').trim(),
      Number(item.cmv)
    ]).filter(([, cmv]) => Number.isFinite(cmv))
  );
}

export async function salvarConfiguracaoProduto(
  env,
  dados,
  usuario
) {
  const invalido = mensagem => ({
    error: mensagem,
    status: 400
  });

  if (
    !dados ||
    typeof dados !== 'object' ||
    Array.isArray(dados)
  ) {
    return invalido('Dados do produto inválidos.');
  }

  const codigo = String(dados.codigoProduto ?? '').trim();

  if (!/^\d+$/.test(codigo) || codigo.length > 10) {
    return invalido('Código do produto inválido.');
  }

  if (typeof dados.habilitado !== 'boolean') {
    return invalido(
      'Informe se o produto participa do painel.'
    );
  }

  if (
    typeof dados.grupo !== 'string' ||
    dados.grupo.length > 80
  ) {
    return invalido(
      'O grupo deve ter no máximo 80 caracteres.'
    );
  }

  let grupo = dados.grupo.trim().replace(/\s+/g, ' ');
  const pacotes = dados.pacotesPorCaixa;
  const cmv = dados.cmv;

  if (
    pacotes !== null &&
    (
      typeof pacotes !== 'number' ||
      !Number.isInteger(pacotes) ||
      pacotes <= 0 ||
      pacotes > 1000000
    )
  ) {
    return invalido(
      'Informe uma quantidade inteira de pacotes por caixa, maior que zero.'
    );
  }

  if (
    cmv !== null &&
    (
      typeof cmv !== 'number' ||
      !Number.isFinite(cmv) ||
      cmv < 0 ||
      cmv > 1000000000
    )
  ) {
    return invalido(
      'Informe um CMV válido, igual ou maior que zero.'
    );
  }

  if (dados.habilitado && (!pacotes || !grupo)) {
    return invalido(
      'Preencha os pacotes por caixa e o grupo antes de habilitar.'
    );
  }

  const [produto] = await consultarProdutosSankhya(
    env,
    codigo
  );

  if (!produto) {
    return invalido(
      'Produto não encontrado como Venda (fabricação própria) no Sankhya.'
    );
  }

  if (dados.habilitado && !produto.ativoSankhya) {
    return invalido(
      'Um produto inativo no Sankhya não pode ser habilitado.'
    );
  }

    const grupos = await listarGruposProdutos(env);

  const grupoCadastrado = grupos.find(function(nome) {
    return nome.toLocaleLowerCase('pt-BR') ===
      grupo.toLocaleLowerCase('pt-BR');
  });

  if (grupo && !grupoCadastrado) {
    return invalido(
      'Cadastre o grupo global antes de vinculá-lo ao produto.'
    );
  }

  grupo = grupoCadastrado || '';

  const agora = new Date().toISOString();

  const registro = {
    codigo_produto: produto.codigoProduto,
    pacotes_por_caixa: pacotes,
    cmv,
    grupo,
    habilitado: dados.habilitado ? 1 : 0,
    unidade_sankhya: produto.unidadeSankhya,
    atualizado_em: agora,
    atualizado_por: usuario
  };

  // Salva a configuração e o histórico no mesmo lote.
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO produtos_painel_config (
        codigo_produto,
        pacotes_por_caixa,
        cmv,
        grupo,
        habilitado,
        unidade_sankhya,
        atualizado_em,
        atualizado_por
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)

      ON CONFLICT(codigo_produto) DO UPDATE SET
        pacotes_por_caixa = excluded.pacotes_por_caixa,
        cmv = excluded.cmv,
        grupo = excluded.grupo,
        habilitado = excluded.habilitado,
        unidade_sankhya = excluded.unidade_sankhya,
        atualizado_em = excluded.atualizado_em,
        atualizado_por = excluded.atualizado_por
    `).bind(
      registro.codigo_produto,
      pacotes,
      cmv,
      grupo,
      registro.habilitado,
      produto.unidadeSankhya,
      agora,
      usuario
    ),

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
      'PRODUTO_PAINEL_CONFIGURADO',
      JSON.stringify(registro)
    )
  ]);

  return {
    ok: true,
    produto: juntarConfiguracao(produto, registro)
  };
}

export async function salvarConfiguracoesProdutos(
  env,
  configuracoes,
  usuario
) {
  if (
    !Array.isArray(configuracoes) ||
    configuracoes.length === 0
  ) {
    return {
      error: 'Nenhuma alteração de produto foi informada.',
      status: 400
    };
  }

  if (configuracoes.length > 1000) {
    return {
      error: 'Quantidade máxima de produtos excedida.',
      status: 400
    };
  }

  const produtos = [];

  for (let indice = 0; indice < configuracoes.length; indice++) {
    const resultado = await salvarConfiguracaoProduto(
      env,
      configuracoes[indice],
      usuario
    );

    if (resultado.error) {
      return {
        error:
          'Produto ' + (indice + 1) + ': ' +
          resultado.error,
        status: resultado.status || 400
      };
    }

    produtos.push(resultado.produto);
  }

  return {
    ok: true,
    produtos
  };
}

export async function listarProdutosHabilitadosPainel(env) {
  const cadastro = await listarCadastroProdutos(env);

  return cadastro.produtos.filter(
    produto => produto.habilitado
  );
}
