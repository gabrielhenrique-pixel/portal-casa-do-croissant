const META_PADRAO = 1500000;

export async function carregarMetaFaturamento(env) {
  await garantirTabelaMeta(env);
  const registro = await env.DB.prepare(
    'SELECT valor FROM rentabilidade_configuracoes WHERE chave = ?'
  ).bind('meta_faturamento').first();

  const valor = Number(registro?.valor);
  return Number.isFinite(valor) && valor > 0 ? valor : META_PADRAO;
}

export async function salvarMetaFaturamento(env, valor) {
  const meta = Number(valor);

  if (!Number.isFinite(meta) || meta <= 0 || meta > 999999999.99) {
    return {
      error: 'Informe uma meta de faturamento maior que zero.',
      status: 400
    };
  }

  await garantirTabelaMeta(env);
  await env.DB.prepare(
    `INSERT INTO rentabilidade_configuracoes (chave, valor, atualizado_em)
     VALUES (?, ?, ?)
     ON CONFLICT(chave) DO UPDATE SET
       valor = excluded.valor,
       atualizado_em = excluded.atualizado_em`
  ).bind('meta_faturamento', meta, new Date().toISOString()).run();

  return { metaFaturamento: meta };
}

async function garantirTabelaMeta(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS rentabilidade_configuracoes (
      chave TEXT PRIMARY KEY,
      valor REAL NOT NULL,
      atualizado_em TEXT NOT NULL
    )`
  ).run();
}


export function comporRedesDashboard({
  resumosPorRede,
  totalClientesPorRede,
  redesMargem
}) {
  const redes = redesMargem.map(({ rede, resultadoFinal }) => {
    const base = resumosPorRede.get(rede);

    if (!base || !Number.isFinite(resultadoFinal)) {
      throw new Error(
        `Dados de rentabilidade indisponíveis para a rede ${rede}.`
      );
    }

    const faturamentoBruto = semMenosZero(base.faturamentoBruto);
    const receitaLiquida = semMenosZero(
      faturamentoBruto - base.valorSt
    );

    return {
      rede,
      faturamentoBruto,
      devolucoes: semMenosZero(base.devolucoes),
      receitaLiquida,

      resultadoFinal,

      margem: receitaLiquida === 0
        ? null
        : resultadoFinal / Math.abs(receitaLiquida),

      participacao: null,
      investimentos: semMenosZero(base.investimentos),
      frete: semMenosZero(base.frete),

      clientesPositivados: Array.from(
        base.faturamentoPorParceiro.values()
      ).filter((valor) => valor > 0).length,

      totalClientes: totalClientesPorRede.get(rede) || 0
    };
  });

  const receitaTotal = redes.reduce(
    (total, rede) => total + rede.receitaLiquida,
    0
  );

  redes.forEach((rede) => {
    rede.participacao = receitaTotal === 0
      ? null
      : rede.receitaLiquida / receitaTotal;
  });

  return redes;
}

function semMenosZero(valor) {
  return valor === 0 ? 0 : valor;
}

