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

export async function consultarSaldoInicialSankhya(env, filtros) {
  if (
    !filtros ||
    !/^\d{4}-\d{2}-\d{2}$/.test(filtros.inicio) ||
    !Array.isArray(filtros.contas) ||
    filtros.contas.length === 0 ||
    filtros.contas.some(function (id) {
      return (
        typeof id !== 'string' ||
        !/^[1-9]\d*$/.test(id) ||
        !Number.isSafeInteger(Number(id))
      );
    }) ||
    typeof filtros.apenasSaldoInicialConciliado !== 'boolean'
  ) {
    throw new Error('Filtros inválidos para consultar o saldo inicial.');
  }

  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    throw new Error('Integração com o Sankhya não configurada.');
  }

  const contas = Array.from(new Set(filtros.contas));
  const token = await obterTokenSankhya(env);

  const sql = [
    'SELECT',
    '  CTA.CODCTABCOINT,',
    '  CTA.DESCRICAO,',
    '  ROUND(',
    '    NVL(CTA.SALDOREAL, 0)',
    '    + NVL(SUM(MBC.VLRLANC * MBC.RECDESP), 0),',
    '    2',
    '  ) AS SALDO_INICIAL,',
    "  TO_CHAR(CTA.DTIMPLANT, 'YYYY-MM-DD') AS DATA_IMPLANTACAO",
    'FROM TSICTA CTA',
    'LEFT JOIN TGFMBC MBC',
    '  ON MBC.CODCTABCOINT = CTA.CODCTABCOINT',
    '  AND MBC.DTLANC >= CTA.DTIMPLANT',
    "  AND MBC.DTLANC < DATE '" + filtros.inicio + "'",
    filtros.apenasSaldoInicialConciliado
      ? "  AND MBC.CONCILIADO = 'S'"
      : '',
    'WHERE CTA.CODCTABCOINT IN (' + contas.join(',') + ')',
    'GROUP BY',
    '  CTA.CODCTABCOINT,',
    '  CTA.DESCRICAO,',
    '  CTA.SALDOREAL,',
    '  CTA.DTIMPLANT',
    'ORDER BY CTA.CODCTABCOINT'
  ].join(String.fromCharCode(10));

  const linhas = await executarConsultaSankhya(token, sql);

  if (!Array.isArray(linhas) || linhas.length !== contas.length) {
    throw new Error('A consulta de saldos retornou dados incompletos.');
  }

  const idsRecebidos = new Set();

  return linhas.map(function (linha) {
    const id = String(linha[0] ?? '').trim();
    const descricao = String(linha[1] ?? '').trim();
    const valor = linha[2];
    const dataImplantacao = String(linha[3] ?? '').trim();

    if (!contas.includes(id) || idsRecebidos.has(id)) {
      throw new Error('Conta inválida ou duplicada na consulta de saldos.');
    }

    idsRecebidos.add(id);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(dataImplantacao) ||
      dataImplantacao > filtros.inicio
    ) {
      throw new Error(
        'A conta ' + id +
        ' não possui implantação válida para o início do período.'
      );
    }

    if (
      valor === null ||
      valor === undefined ||
      String(valor).trim() === '' ||
      !Number.isFinite(Number(valor))
    ) {
      throw new Error('Saldo inicial inválido para a conta ' + id + '.');
    }

    const saldoInicialCentavos = Math.round(Number(valor) * 100);

    if (!Number.isSafeInteger(saldoInicialCentavos)) {
      throw new Error('Saldo fora do limite permitido para a conta ' + id + '.');
    }

    return {
      id,
      descricao: descricao || 'Conta ' + id,
      dataImplantacao,
      saldoInicialCentavos
    };
  });
}
