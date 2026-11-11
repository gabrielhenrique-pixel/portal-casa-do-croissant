import {
  importarValidadeWhatsApp
} from './validades-service.js';

function resposta(dados, status = 200, headers = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}

export async function receberValidadeIntegracao(request, env) {
  if (request.method !== 'POST') {
    return resposta({
      error: 'Método não permitido.'
    }, 405, {
      Allow: 'POST'
    });
  }

  const segredo = env.VALIDADES_INTEGRACAO_TOKEN;

  if (typeof segredo !== 'string' || segredo.length < 32) {
    return resposta({
      error: 'Integração ainda não configurada.'
    }, 503);
  }

  const autorizacao = request.headers.get('authorization');

  if (autorizacao !== 'Bearer ' + segredo) {
    return resposta({
      error: 'Credencial de integração inválida.'
    }, 401);
  }

  const tipoConteudo = (
    request.headers.get('content-type') || ''
  ).split(';')[0].trim().toLowerCase();

  if (tipoConteudo !== 'application/json') {
    return resposta({
      error: 'Envie os dados no formato JSON.'
    }, 415);
  }

  if (!request.body) {
    return resposta({
      error: 'Informe os dados do registro.'
    }, 400);
  }

  const leitor = request.body.getReader();
  const partes = [];
  let tamanho = 0;

  try {
    while (true) {
      const { done, value } = await leitor.read();

      if (done) break;

      tamanho += value.byteLength;

      if (tamanho > 131072) {
        await leitor.cancel();

        return resposta({
          error: 'A solicitação excedeu o tamanho permitido.'
        }, 413);
      }

      partes.push(value);
    }
  } catch {
    return resposta({
      error: 'Não foi possível receber os dados.'
    }, 400);
  } finally {
    leitor.releaseLock();
  }

  const bytes = new Uint8Array(tamanho);
  let posicao = 0;

  for (const parte of partes) {
    bytes.set(parte, posicao);
    posicao += parte.byteLength;
  }

  let dados;

  try {
    dados = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    );
  } catch {
    return resposta({
      error: 'JSON inválido.'
    }, 400);
  }

  try {
    const resultado = await importarValidadeWhatsApp(env, dados);

    return resposta(
      resultado,
      resultado.jaExistia ? 200 : 201
    );
  } catch (erro) {
    const status = Number.isInteger(erro.status)
      && erro.status >= 400
      && erro.status < 500
        ? erro.status
        : 500;

    return resposta({
      error: status === 500
        ? 'Não foi possível confirmar a importação. Repita com a mesma chave de origem.'
        : erro.message
    }, status);
  }
}
