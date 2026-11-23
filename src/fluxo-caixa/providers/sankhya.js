import {
  obterTokenSankhya,
  executarConsultaSankhya
} from '../../dre-service.js';

export async function listarContasSankhya(env) {
  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    throw Object.assign(
      new Error('A integração com o Sankhya não está configurada.'),
      { status: 503 }
    );
  }

  const token = await obterTokenSankhya(env);

  const sql = [
    'SELECT',
    '  CTA.CODCTABCOINT,',
    '  CTA.DESCRICAO,',
    '  COUNT(*) OVER () AS TOTAL_REGISTROS',
    'FROM TSICTA CTA',
    'ORDER BY CTA.CODCTABCOINT'
  ].join(String.fromCharCode(10));

  const linhas = await executarConsultaSankhya(token, sql);

  if (!Array.isArray(linhas)) {
    throw new Error('Resposta inválida na consulta de contas.');
  }

  const total = linhas.length ? Number(linhas[0][2]) : 0;

  if (
    !Number.isSafeInteger(total) ||
    total !== linhas.length ||
    linhas.some(function(linha) {
      return Number(linha[2]) !== total;
    })
  ) {
    throw new Error('A consulta de contas retornou dados incompletos.');
  }

  const ids = new Set();

  return linhas.map(function(linha) {
    const id = String(linha[0] ?? '').trim();
    const descricao = String(linha[1] ?? '').trim();

    if (!/^\d+$/.test(id) || ids.has(id)) {
      throw new Error('Identificação de conta inválida ou duplicada.');
    }

    ids.add(id);

    return {
      id: id,
      descricao: descricao || 'Conta ' + id
    };
  });
}
