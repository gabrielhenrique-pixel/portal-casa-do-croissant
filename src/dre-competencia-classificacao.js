import { DRE_GRUPOS, identificarGrupoDre } from './dre-config.js';

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

export async function salvarClassificacaoCompetencia(env, session, dados) {
  if (session?.role !== 'Administrador' || !session.user_id) {
    return { status: 403, error: 'Somente administradores podem mover categorias.' };
  }

  const categoria = typeof dados?.categoria === 'string'
    ? dados.categoria.trim()
    : '';

  const grupoPadrao = categoria === 'CONTRATO_ESTIMADO'
    ? 3
    : identificarGrupoDre(categoria);

  if (!grupoPadrao) {
    return { status: 400, error: 'Categoria da DRE inválida.' };
  }

  const grupoId = dados?.grupoId;
  if (!Number.isInteger(grupoId) || !Object.hasOwn(DRE_GRUPOS, grupoId)) {
    return { status: 400, error: 'Grupo de destino inválido.' };
  }

  await garantirTabela(env);

  if (grupoId === grupoPadrao) {
    // Voltar ao grupo original remove apenas a exceção.
    await env.DB.prepare(`
      DELETE FROM dre_competencia_classificacao
      WHERE categoria = ?
    `).bind(categoria).run();
  } else {
    await env.DB.prepare(`
      INSERT INTO dre_competencia_classificacao
        (categoria, grupo_id, alterado_por, alterado_em)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(categoria) DO UPDATE SET
        grupo_id = excluded.grupo_id,
        alterado_por = excluded.alterado_por,
        alterado_em = excluded.alterado_em
    `).bind(
      categoria,
      grupoId,
      String(session.user_id),
      new Date().toISOString()
    ).run();
  }

  return { sucesso: true, categoria, grupoId };
}
