export async function garantirTabelaValidades(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS validades_lotes (
      id TEXT PRIMARY KEY,

      loja_codigo TEXT NOT NULL,
      loja_nome TEXT NOT NULL,

      produto_codigo TEXT NOT NULL,
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
    ON validades_lotes (loja_codigo, situacao, vencimento)
  `).run();
}
