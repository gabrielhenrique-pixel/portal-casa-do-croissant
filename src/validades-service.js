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
