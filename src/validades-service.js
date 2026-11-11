import {
  garantirEstruturaValidades
} from './validades-db.js';

import {
  interpretarMensagemValidade
} from './validades-mensagem.js';

function erroValidacao(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

export async function salvarMensagemValidade(env, acesso, entrada) {
  if (
    !acesso?.session?.user_id ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.create
  ) {
    throw erroValidacao('Sem permissão para salvar validades.', 403);
  }

  const mensagem = entrada?.mensagem;
  const chave = entrada?.chaveRequisicao;

  if (
    typeof mensagem !== 'string' ||
    !mensagem.trim() ||
    mensagem.length > 10000
  ) {
    throw erroValidacao(
      'Informe uma mensagem com até 10.000 caracteres.'
    );
  }

  if (
    typeof chave !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(chave)
  ) {
    throw erroValidacao(
      'Identificador da tentativa inválido. Confira a mensagem novamente.'
    );
  }

  const interpretacao = interpretarMensagemValidade(mensagem);

  if (interpretacao.status !== 'VALIDO') {
    throw erroValidacao(
      (interpretacao.motivos || ['Mensagem inválida.']).join(' '),
      422
    );
  }

  const usuario = String(acesso.session.user_id);

  // A chave identifica uma tentativa de salvamento deste usuário.
  const chaveRequisicao = JSON.stringify([
    usuario,
    chave.toLowerCase()
  ]);

  await garantirEstruturaValidades(env);

  async function buscarExistente() {
    return env.DB.prepare(`
      SELECT id, mensagem_original, criado_por
      FROM validades_lotes
      WHERE chave_requisicao = ?
    `).bind(chaveRequisicao).first();
  }

  function responderExistente(registro) {
    if (
      registro.criado_por !== usuario ||
      registro.mensagem_original !== mensagem
    ) {
      throw erroValidacao(
        'Esta tentativa já foi usada para outra mensagem. Confira novamente.',
        409
      );
    }

    return {
      sucesso: true,
      id: registro.id,
      jaExistia: true,
      aviso: 'Esta mensagem já havia sido salva nesta tentativa.'
    };
  }

  const existente = await buscarExistente();

  if (existente) {
    return responderExistente(existente);
  }

  const dados = interpretacao.dados;
  const id = crypto.randomUUID();
  const movimentoId = crypto.randomUUID();
  const agora = new Date().toISOString();

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO validades_lotes (
          id,
          mensagem_original,
          chave_requisicao,
          loja_nome,
          produto_nome,
          quantidade_inicial,
          quantidade_restante,
          unidade,
          vencimento,
          situacao,
          observacao,
          criado_por,
          criado_em,
          atualizado_por,
          atualizado_em,
          versao
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          'UN', ?, 'ATIVO', '',
          ?, ?, ?, ?, 1
        )
      `).bind(
        id,
        mensagem,
        chaveRequisicao,
        dados.lojaNome,
        dados.produtoNome,
        dados.quantidade,
        dados.quantidade,
        dados.vencimento,
        usuario,
        agora,
        usuario,
        agora
      ),

      env.DB.prepare(`
        INSERT INTO validades_movimentos (
          id,
          lote_id,
          tipo,
          quantidade_anterior,
          quantidade_movimentada,
          quantidade_posterior,
          motivo,
          realizado_por,
          realizado_em
        )
        VALUES (
          ?, ?, 'CADASTRO', 0, ?, ?,
          'Registro de mensagem pelo portal',
          ?, ?
        )
      `).bind(
        movimentoId,
        id,
        dados.quantidade,
        dados.quantidade,
        usuario,
        agora
      )
    ]);
  } catch (erro) {
    // Outra requisição pode ter concluído a mesma tentativa.
    const salvo = await buscarExistente();

    if (salvo) {
      return responderExistente(salvo);
    }

    throw erro;
  }

  return {
    sucesso: true,
    id,
    jaExistia: false,
    aviso: 'Mensagem salva com sucesso.'
  };
}

export async function listarValidades(env, acesso, url) {
  if (!acesso?.session || !acesso?.permissions?.view) {
    throw erroValidacao('Sem permissão para consultar validades.', 403);
  }

  const paginaTexto = url.searchParams.get('pagina') || '1';

  if (!/^[1-9]\d{0,5}$/.test(paginaTexto)) {
    throw erroValidacao('Página inválida.');
  }

  const pagina = Number(paginaTexto);
  const porPagina = 100;
  const deslocamento = (pagina - 1) * porPagina;

  // A classificação usa o dia de São Paulo.
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const obter = tipo =>
    partes.find(parte => parte.type === tipo).value;

  const hoje = `${obter('year')}-${obter('month')}-${obter('day')}`;

  const dataLimite = new Date(`${hoje}T00:00:00Z`);
  dataLimite.setUTCDate(dataLimite.getUTCDate() + 5);

  const limite = dataLimite.toISOString().slice(0, 10);

  await garantirEstruturaValidades(env);

  const resultado = await env.DB.prepare(`
    SELECT
      id,
      loja_nome AS lojaNome,
      produto_nome AS produtoNome,
      quantidade_inicial AS quantidadeInicial,
      quantidade_restante AS quantidadeRestante,
      unidade,
      vencimento,
      situacao,
      criado_em AS criadoEm,
      CASE
        WHEN vencimento < ? THEN 'VENCIDO'
        WHEN vencimento = ? THEN 'VENCE_HOJE'
        WHEN vencimento <= ? THEN 'PROXIMOS_5_DIAS'
        ELSE 'NO_PRAZO'
      END AS faixa
    FROM validades_lotes
    WHERE situacao = 'ATIVO'
    ORDER BY vencimento ASC, criado_em ASC, id ASC
    LIMIT ? OFFSET ?
  `).bind(
    hoje,
    hoje,
    limite,
    porPagina + 1,
    deslocamento
  ).all();

  const registros = resultado.results || [];

  return {
    hoje,
    limiteAviso: limite,
    pagina,
    porPagina,
    temProximaPagina: registros.length > porPagina,
    registros: registros.slice(0, porPagina)
  };
}

export async function baixarQuantidadeValidade(env, acesso, entrada) {
  if (
    !acesso?.session?.user_id ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.update
  ) {
    throw erroValidacao('Sem permissão para baixar quantidades.', 403);
  }

  const id = entrada?.id;
  const quantidade = entrada?.quantidade;
  const motivo = typeof entrada?.motivo === 'string'
    ? entrada.motivo.trim()
    : '';
  const chave = entrada?.chaveRequisicao;

  const formatoUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (typeof id !== 'string' || !formatoUUID.test(id)) {
    throw erroValidacao('Registro inválido.');
  }

  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    throw erroValidacao('Informe uma quantidade inteira maior que zero.');
  }

  if (!motivo || motivo.length > 500) {
    throw erroValidacao('Informe um motivo com até 500 caracteres.');
  }

  if (typeof chave !== 'string' || !formatoUUID.test(chave)) {
    throw erroValidacao('Identificador da tentativa inválido.');
  }

  const usuario = String(acesso.session.user_id);

  const movimentoId = JSON.stringify([
    'BAIXA',
    usuario,
    chave.toLowerCase()
  ]);

  await garantirEstruturaValidades(env);

  async function buscarBaixa() {
    return env.DB.prepare(`
      SELECT
        lote_id,
        quantidade_movimentada,
        quantidade_posterior,
        motivo,
        realizado_por
      FROM validades_movimentos
      WHERE id = ?
    `).bind(movimentoId).first();
  }

  function responderBaixaExistente(baixa) {
    if (
      baixa.lote_id !== id ||
      baixa.quantidade_movimentada !== quantidade ||
      baixa.motivo !== motivo ||
      baixa.realizado_por !== usuario
    ) {
      throw erroValidacao(
        'Esta tentativa já foi usada para outra baixa.',
        409
      );
    }

    return {
      sucesso: true,
      jaExistia: true,
      id,
      saldoAposBaixa: baixa.quantidade_posterior
    };
  }

  const existente = await buscarBaixa();

  if (existente) {
    return responderBaixaExistente(existente);
  }

    const origemExterna = await env.DB.prepare(`
    SELECT origem
    FROM validades_origens
    WHERE lote_id = ?
  `).bind(id).first();

  if (origemExterna) {
    throw erroValidacao(
      'Este registro veio do WhatsApp. A baixa pelo portal ainda não está habilitada para registros sincronizados.',
      409
    );
  }

  const lote = await env.DB.prepare(`
    SELECT id, quantidade_restante, situacao, versao
    FROM validades_lotes
    WHERE id = ?
  `).bind(id).first();

  if (!lote) {
    throw erroValidacao('Registro não encontrado.', 404);
  }

  if (lote.situacao !== 'ATIVO') {
    throw erroValidacao('Este registro já está baixado.', 409);
  }

  if (quantidade > lote.quantidade_restante) {
    throw erroValidacao(
      'Quantidade maior que o saldo disponível: ' +
      lote.quantidade_restante + ' unidades.',
      409
    );
  }

  const agora = new Date().toISOString();
  let resultados;

  try {
    resultados = await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO validades_movimentos (
          id,
          lote_id,
          tipo,
          quantidade_anterior,
          quantidade_movimentada,
          quantidade_posterior,
          motivo,
          realizado_por,
          realizado_em
        )
        SELECT
          ?,
          id,
          'BAIXA',
          quantidade_restante,
          ?,
          quantidade_restante - ?,
          ?,
          ?,
          ?
        FROM validades_lotes
        WHERE id = ?
          AND versao = ?
          AND situacao = 'ATIVO'
          AND quantidade_restante >= ?
      `).bind(
        movimentoId,
        quantidade,
        quantidade,
        motivo,
        usuario,
        agora,
        id,
        lote.versao,
        quantidade
      ),

      env.DB.prepare(`
        UPDATE validades_lotes
        SET
          quantidade_restante = quantidade_restante - ?,
          situacao = CASE
            WHEN quantidade_restante - ? = 0 THEN 'BAIXADO'
            ELSE 'ATIVO'
          END,
          versao = versao + 1,
          atualizado_por = ?,
          atualizado_em = ?
        WHERE id = ?
          AND versao = ?
          AND EXISTS (
            SELECT 1
            FROM validades_movimentos
            WHERE id = ?
              AND lote_id = validades_lotes.id
          )
      `).bind(
        quantidade,
        quantidade,
        usuario,
        agora,
        id,
        lote.versao,
        movimentoId
      )
    ]);
  } catch (erro) {
    const baixa = await buscarBaixa();

    if (baixa) {
      return responderBaixaExistente(baixa);
    }

    throw erro;
  }

  if (
    resultados[0].meta.changes !== 1 ||
    resultados[1].meta.changes !== 1
  ) {
    const baixa = await buscarBaixa();

    if (baixa) {
      return responderBaixaExistente(baixa);
    }

    throw erroValidacao(
      'O saldo foi atualizado por outra operação. Atualize a lista antes de continuar.',
      409
    );
  }

  return {
    sucesso: true,
    jaExistia: false,
    id,
    saldoAposBaixa: lote.quantidade_restante - quantidade
  };
}

export async function consultarHistoricoValidade(env, acesso, url) {
  if (!acesso?.session || !acesso?.permissions?.view) {
    throw erroValidacao('Sem permissão para consultar o histórico.', 403);
  }

  const id = url.searchParams.get('id') || '';
  const paginaTexto = url.searchParams.get('pagina') || '1';

  const formatoUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!formatoUUID.test(id)) {
    throw erroValidacao('Identificador do registro inválido.');
  }

  if (!/^[1-9]\d{0,5}$/.test(paginaTexto)) {
    throw erroValidacao('Página inválida.');
  }

  const pagina = Number(paginaTexto);
  const porPagina = 50;

  await garantirEstruturaValidades(env);

  const registro = await env.DB.prepare(`
    SELECT
      id,
      loja_nome AS lojaNome,
      produto_nome AS produtoNome,
      vencimento,
      quantidade_inicial AS quantidadeInicial,
      quantidade_restante AS quantidadeRestante,
      situacao,
      mensagem_original AS mensagemOriginal
    FROM validades_lotes
    WHERE id = ?
  `).bind(id).first();

  if (!registro) {
    throw erroValidacao('Registro não encontrado.', 404);
  }

  const resultado = await env.DB.prepare(`
    SELECT
      id,
      tipo,
      quantidade_anterior AS quantidadeAnterior,
      quantidade_movimentada AS quantidadeMovimentada,
      quantidade_posterior AS quantidadePosterior,
      motivo,
      realizado_por AS usuarioId,
      realizado_em AS realizadoEm
    FROM validades_movimentos
    WHERE lote_id = ?
    ORDER BY realizado_em DESC, id DESC
    LIMIT ? OFFSET ?
  `).bind(
    id,
    porPagina + 1,
    (pagina - 1) * porPagina
  ).all();

  const movimentos = resultado.results || [];

  return {
    registro,
    pagina,
    porPagina,
    temProximaPagina: movimentos.length > porPagina,
    movimentos: movimentos.slice(0, porPagina)
  };
}

export async function importarValidadeWhatsApp(env, entrada) {
  const chaveExterna = entrada?.chaveExterna;
  const mensagem = entrada?.mensagem;

  const formatoUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (
    typeof chaveExterna !== 'string' ||
    !formatoUUID.test(chaveExterna)
  ) {
    throw erroValidacao('Identificador de origem inválido.');
  }

  if (
    typeof mensagem !== 'string' ||
    !mensagem.trim() ||
    mensagem.length > 10000
  ) {
    throw erroValidacao(
      'Informe uma mensagem com até 10.000 caracteres.'
    );
  }

  const chave = chaveExterna.toLowerCase();

  await garantirEstruturaValidades(env);

  async function buscarImportado() {
    return env.DB.prepare(`
      SELECT
        l.id,
        l.mensagem_original
      FROM validades_origens o
      JOIN validades_lotes l ON l.id = o.lote_id
      WHERE o.origem = 'WHATSAPP_LOCAL'
        AND o.chave_externa = ?
    `).bind(chave).first();
  }

  function responderExistente(registro) {
    if (registro.mensagem_original !== mensagem) {
      throw erroValidacao(
        'O registro de origem já foi importado com outra mensagem. Revisão necessária.',
        409
      );
    }

    return {
      sucesso: true,
      id: registro.id,
      jaExistia: true
    };
  }

  const existente = await buscarImportado();

  if (existente) {
    return responderExistente(existente);
  }

  const interpretacao = interpretarMensagemValidade(mensagem);

  if (interpretacao.status !== 'VALIDO') {
    throw erroValidacao(
      (interpretacao.motivos || ['Mensagem inválida.']).join(' '),
      422
    );
  }

  const dados = interpretacao.dados;
  const id = crypto.randomUUID();
  const movimentoId = crypto.randomUUID();
  const agora = new Date().toISOString();

  // Identifica a integração, sem atribuir a ação a um usuário humano.
  const responsavel = 'integracao:whatsapp-local';

  const chaveRequisicao = JSON.stringify([
    'WHATSAPP_LOCAL',
    chave
  ]);

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO validades_lotes (
          id,
          mensagem_original,
          chave_requisicao,
          loja_nome,
          produto_nome,
          quantidade_inicial,
          quantidade_restante,
          unidade,
          vencimento,
          situacao,
          observacao,
          criado_por,
          criado_em,
          atualizado_por,
          atualizado_em,
          versao
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          'UN', ?, 'ATIVO', '',
          ?, ?, ?, ?, 1
        )
      `).bind(
        id,
        mensagem,
        chaveRequisicao,
        dados.lojaNome,
        dados.produtoNome,
        dados.quantidade,
        dados.quantidade,
        dados.vencimento,
        responsavel,
        agora,
        responsavel,
        agora
      ),

      env.DB.prepare(`
        INSERT INTO validades_movimentos (
          id,
          lote_id,
          tipo,
          quantidade_anterior,
          quantidade_movimentada,
          quantidade_posterior,
          motivo,
          realizado_por,
          realizado_em
        )
        VALUES (
          ?, ?, 'CADASTRO', 0, ?, ?,
          'Importação de mensagem recebida pelo WhatsApp',
          ?, ?
        )
      `).bind(
        movimentoId,
        id,
        dados.quantidade,
        dados.quantidade,
        responsavel,
        agora
      ),

      env.DB.prepare(`
        INSERT INTO validades_origens (
          lote_id,
          origem,
          chave_externa,
          sincronizado_em
        )
        VALUES (?, 'WHATSAPP_LOCAL', ?, ?)
      `).bind(
        id,
        chave,
        agora
      )
    ]);
  } catch (erro) {
    const importado = await buscarImportado();

    if (importado) {
      return responderExistente(importado);
    }

    throw erro;
  }

  return {
    sucesso: true,
    id,
    jaExistia: false
  };
}
