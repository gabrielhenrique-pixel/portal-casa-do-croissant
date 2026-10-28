const VERSAO = 'dashboard-v3-frete';
const MINUTO = 60 * 1000;

function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}

function hojeBrasil() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const campos = Object.fromEntries(
    partes.map(parte => [parte.type, parte.value])
  );

  return campos.year + '-' + campos.month + '-' + campos.day;
}

function dataValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor || '')) {
    return false;
  }

  const data = new Date(valor + 'T00:00:00Z');

  return Number.isFinite(data.getTime()) &&
    data.toISOString().slice(0, 10) === valor;
}

function respostaSalva(registro) {
  return responder({
    ...JSON.parse(registro.dados),
    cacheAtualizadoEm: registro.atualizado_em
  });
}

export async function lerEvolucaoSalva(env) {
  const hoje = hojeBrasil();
  const ano = Number(hoje.slice(0, 4));
  const mesAtual = Number(hoje.slice(5, 7));
  const periodos = [];

  for (let mes = 1; mes <= mesAtual; mes++) {
    const numeroMes = String(mes).padStart(2, '0');
    const inicio = ano + '-' + numeroMes + '-01';

    const ultimoDia = new Date(
      Date.UTC(ano, mes, 0)
    ).getUTCDate();

    const fim = mes === mesAtual
      ? hoje
      : ano + '-' + numeroMes + '-' +
        String(ultimoDia).padStart(2, '0');

    periodos.push({
      mes,
      inicio,
      fim,
      chave: VERSAO + ':' + inicio + ':' + fim
    });
  }

  const registros = await env.DB.prepare(
    `SELECT chave, dados, atualizado_em, valido_ate, bloqueado_ate
     FROM rentabilidade_cache_periodos
     WHERE chave IN (${periodos.map(() => '?').join(',')})`
  ).bind(...periodos.map(periodo => periodo.chave)).all();

  const porChave = new Map(
    (registros.results || []).map(registro => [
      registro.chave,
      registro
    ])
  );

  const agora = Date.now();

  return responder({
    hoje,
    meses: periodos.map(periodo => {
      const registro = porChave.get(periodo.chave);
      const dados = registro?.dados
        ? JSON.parse(registro.dados)
        : null;

      return {
        mes: periodo.mes,
        inicio: periodo.inicio,
        fim: periodo.fim,
        dados,
        atualizadoEm: registro?.atualizado_em || null,
        vencido: !dados || Number(registro.valido_ate) <= agora,
        bloqueadoAte: Number(registro?.bloqueado_ate || 0)
      };
    })
  });
}

export async function consultarDashboardCache(
  request,
  env,
  calcular
) {
  const url = new URL(request.url);
  const inicio = url.searchParams.get('inicio');
  const fim = url.searchParams.get('fim');

  // Filtros não previstos continuam seguindo a consulta original.
  const outrosFiltros = Array.from(url.searchParams.keys())
    .some(chave => !['inicio', 'fim'].includes(chave));

  if (
    outrosFiltros ||
    !dataValida(inicio) ||
    !dataValida(fim) ||
    inicio > fim
  ) {
    return calcular();
  }

  const chave = VERSAO + ':' + inicio + ':' + fim;
  const responsavel = crypto.randomUUID();

  // Aguarda uma preparação já iniciada por outro acesso.
  for (let tentativa = 0; tentativa < 45; tentativa++) {
    const agora = Date.now();

    const registro = await env.DB.prepare(
      `SELECT dados, atualizado_em, valido_ate
       FROM rentabilidade_cache_periodos
       WHERE chave = ?`
    ).bind(chave).first();

    if (
      registro?.dados &&
      Number(registro.valido_ate) > agora
    ) {
      return respostaSalva(registro);
    }

    // Reserva atômica: apenas um acesso calcula este período.
    const reserva = await env.DB.prepare(
      `INSERT INTO rentabilidade_cache_periodos
         (chave, bloqueado_ate, responsavel)
       VALUES (?, ?, ?)
       ON CONFLICT(chave) DO UPDATE SET
         bloqueado_ate = excluded.bloqueado_ate,
         responsavel = excluded.responsavel
       WHERE rentabilidade_cache_periodos.bloqueado_ate <= ?
         AND (
           rentabilidade_cache_periodos.dados IS NULL
           OR rentabilidade_cache_periodos.valido_ate <= ?
         )`
    ).bind(
      chave,
      agora + 10 * MINUTO,
      responsavel,
      agora,
      agora
    ).run();

    if (Number(reserva.meta?.changes || 0) > 0) {
      try {
        const resposta = await calcular();

        // Erros nunca são gravados como resultado válido.
        if (!resposta.ok) return resposta;

        const dados = await resposta.json();

        if (
          dados.error ||
          !Array.isArray(dados.redes) ||
          dados.inicio !== inicio ||
          dados.fim !== fim
        ) {
          return responder({
            error: 'A consulta retornou um relatório inválido.'
          }, 502);
        }

        const hoje = hojeBrasil();
        const inicioMesAtual = hoje.slice(0, 7) + '-01';

        const validade = fim < inicioMesAtual
          ? 24 * 60 * MINUTO
          : 15 * MINUTO;

        const atualizadoEm = new Date().toISOString();

        // O responsável antigo não pode sobrescrever uma nova reserva.
        await env.DB.prepare(
          `UPDATE rentabilidade_cache_periodos
           SET dados = ?,
               atualizado_em = ?,
               valido_ate = ?,
               bloqueado_ate = 0,
               responsavel = NULL
           WHERE chave = ?
             AND responsavel = ?`
        ).bind(
          JSON.stringify(dados),
          atualizadoEm,
          Date.now() + validade,
          chave,
          responsavel
        ).run();

        return responder({
          ...dados,
          cacheAtualizadoEm: atualizadoEm
        });
      } finally {
        await env.DB.prepare(
          `UPDATE rentabilidade_cache_periodos
           SET bloqueado_ate = 0,
               responsavel = NULL
           WHERE chave = ?
             AND responsavel = ?`
        ).bind(chave, responsavel).run();
      }
    }

    if (request.headers.get('x-rentabilidade-preparar') === '1') {
  return responder({ preparando: true }, 202);
}

await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return responder({
    error:
      'Este período ainda está sendo preparado. Tente novamente em instantes.'
  }, 503);
}
