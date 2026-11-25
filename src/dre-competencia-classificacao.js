async function garantirTabela(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS dre_competencia_classificacao (
      categoria TEXT PRIMARY KEY,
      grupo_id INTEGER NOT NULL,
      alterado_por TEXT NOT NULL,
      alterado_em TEXT NOT NULL
    )
  `).run();
}

export async function carregarClassificacaoCompetencia(env) {
  await garantirTabela(env);

  const resultado = await env.DB.prepare(`
    SELECT categoria, grupo_id
    FROM dre_competencia_classificacao
  `).all();

  return new Map(
    resultado.results.map(linha => [
      String(linha.categoria),
      Number(linha.grupo_id)
    ])
  );
}
