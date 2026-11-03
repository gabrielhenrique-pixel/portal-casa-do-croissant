function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function reabrirComissao(request, env, acesso) {
  if (
    !acesso?.session ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.update
  ) {
    return responder({
      error: 'Você não tem permissão para reabrir comissões.'
    }, 403);
  }

  if (request.method !== 'POST') {
    return responder({ error: 'Método não permitido.' }, 405);
  }

  if (
    request.headers.get('Origin') !== new URL(request.url).origin
  ) {
    return responder({
      error: 'Origem da solicitação inválida.'
    }, 403);
  }

  if (
    !(request.headers.get('Content-Type') || '')
      .includes('application/json')
  ) {
    return responder({ error: 'Envie os dados em JSON.' }, 415);
  }

  try {
    const texto = await request.text();

    if (texto.length > 10000) {
      return responder({ error: 'Solicitação muito grande.' }, 413);
    }

    let dados;

    try {
      dados = JSON.parse(texto);
    } catch {
      return responder({ error: 'JSON inválido.' }, 400);
    }

    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
      return responder({ error: 'Solicitação inválida.' }, 400);
    }

    const fechamentoId = String(dados.fechamentoId || '');
    const operacaoId = String(dados.operacaoId || '');
    const versao = dados.versao;
    const motivo = typeof dados.motivo === 'string'
      ? dados.motivo.trim()
      : '';

    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      !uuid.test(fechamentoId) ||
      !uuid.test(operacaoId) ||
      !Number.isSafeInteger(versao) ||
      versao < 1
    ) {
      return responder({
        error: 'Identificação do fechamento inválida.'
      }, 400);
    }

    if (!motivo || motivo.length > 1000) {
      return responder({
        error: 'Informe o motivo da reabertura, com até 1.000 caracteres.'
      }, 400);
    }

    const autor = String(acesso.session.user_id);

    // Repetir a mesma operação não cria outro evento.
    const anterior = await env.DB.prepare(`
      SELECT
        fechamento_id,
        evento,
        executado_por,
        motivo
      FROM comissao_fechamento_eventos
      WHERE id = ?
    `).bind(operacaoId).first();

    if (anterior) {
      if (
        anterior.fechamento_id === fechamentoId &&
        anterior.evento === 'REABERTURA' &&
        anterior.executado_por === autor &&
        anterior.motivo === motivo
      ) {
        return responder({
          sucesso: true,
          jaRegistrado: true,
          fechamentoId
        });
      }

      return responder({
        error: 'Identificador de operação já utilizado.'
      }, 409);
    }

    const agora = new Date().toISOString();

    const resultados = await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO comissao_fechamento_eventos (
          id,
          fechamento_id,
          evento,
          executado_em,
          executado_por,
          motivo,
          dados
        )
        SELECT
          ?,
          id,
          'REABERTURA',
          ?,
          ?,
          ?,
          json_object(
            'mes', mes,
            'versao', versao,
            'vendedor', vendedor_nome,
            'comissaoLiquida', comissao_liquida
          )
        FROM comissao_fechamentos
        WHERE id = ?
          AND versao = ?
          AND status = 'FECHADO'
      `).bind(
        operacaoId,
        agora,
        autor,
        motivo,
        fechamentoId,
        versao
      ),

      env.DB.prepare(`
        UPDATE comissao_fechamentos
        SET status = 'REABERTO'
        WHERE id = ?
          AND versao = ?
          AND status = 'FECHADO'
          AND EXISTS (
            SELECT 1
            FROM comissao_fechamento_eventos
            WHERE id = ?
              AND fechamento_id = comissao_fechamentos.id
              AND evento = 'REABERTURA'
          )
      `).bind(
        fechamentoId,
        versao,
        operacaoId
      )
    ]);

    if (
      resultados[0].meta.changes !== 1 ||
      resultados[1].meta.changes !== 1
    ) {
      return responder({
        error: 'O fechamento já foi reaberto ou sua situação mudou. ' +
          'Atualize a tela.'
      }, 409);
    }

    return responder({
      sucesso: true,
      fechamentoId,
      reabertoEm: agora
    });
  } catch (erro) {
    console.error('Erro ao reabrir comissão:', erro);

    return responder({
      error: 'Não foi possível confirmar a reabertura. ' +
        'Atualize a tela para verificar a situação antes de tentar novamente.'
    }, 500);
  }
}
