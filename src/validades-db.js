export async function garantirTabelaValidades(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS validades_lotes (
            id TEXT PRIMARY KEY,

      mensagem_original TEXT NOT NULL
        CHECK (length(trim(mensagem_original)) > 0),

      chave_requisicao TEXT NOT NULL UNIQUE,

      loja_nome TEXT NOT NULL,

      produto_nome TEXT NOT NULL,

      quantidade_inicial INTEGER NOT NULL
        CHECK (
          typeof(quantidade_inicial) = 'integer'
          AND quantidade_inicial > 0
        ),

      quantidade_restante INTEGER NOT NULL
        CHECK (
          typeof(quantidade_restante) = 'integer'
          AND quantidade_restante >= 0
          AND quantidade_restante <= quantidade_inicial
        ),

      unidade TEXT NOT NULL DEFAULT 'UN'
        CHECK (unidade = 'UN'),

      vencimento TEXT NOT NULL,

      situacao TEXT NOT NULL DEFAULT 'ATIVO'
        CHECK (situacao IN ('ATIVO', 'BAIXADO')),

      observacao TEXT NOT NULL DEFAULT '',

      criado_por TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      atualizado_por TEXT NOT NULL,
      atualizado_em TEXT NOT NULL,

      versao INTEGER NOT NULL DEFAULT 1
        CHECK (versao >= 1),

      CHECK (
        (situacao = 'ATIVO' AND quantidade_restante > 0)
        OR
        (situacao = 'BAIXADO' AND quantidade_restante = 0)
      )
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_validades_lotes_vencimento
    ON validades_lotes (situacao, vencimento)
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_validades_lotes_loja
    ON validades_lotes (loja_nome, situacao, vencimento)
  `).run();
}

export async function garantirTabelaHistoricoValidades(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS validades_movimentos (
      id TEXT PRIMARY KEY,

      lote_id TEXT NOT NULL
        REFERENCES validades_lotes(id),

      tipo TEXT NOT NULL
        CHECK (tipo IN ('CADASTRO', 'BAIXA')),

      quantidade_anterior INTEGER NOT NULL
        CHECK (
          typeof(quantidade_anterior) = 'integer'
          AND quantidade_anterior >= 0
        ),

      quantidade_movimentada INTEGER NOT NULL
        CHECK (
          typeof(quantidade_movimentada) = 'integer'
          AND quantidade_movimentada > 0
        ),

      quantidade_posterior INTEGER NOT NULL
        CHECK (
          typeof(quantidade_posterior) = 'integer'
          AND quantidade_posterior >= 0
        ),

      motivo TEXT NOT NULL
        CHECK (length(trim(motivo)) > 0),

      realizado_por TEXT NOT NULL,
      realizado_em TEXT NOT NULL,

      CHECK (
        (
          tipo = 'CADASTRO'
          AND quantidade_anterior = 0
          AND quantidade_posterior = quantidade_movimentada
        )
        OR
        (
          tipo = 'BAIXA'
          AND quantidade_posterior =
            quantidade_anterior - quantidade_movimentada
        )
      )
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_validades_movimentos_lote
    ON validades_movimentos (lote_id, realizado_em)
  `).run();
}

export async function garantirEstruturaValidades(env) {
  await garantirTabelaValidades(env);
  await garantirTabelaHistoricoValidades(env);
}
