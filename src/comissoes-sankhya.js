const TAMANHO_PAGINA = 200;
const MAXIMO_PAGINAS = 50;

function erro(mensagem, status = 502) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function periodoDoMes(mes) {
  if (!/^\d{4}-\d{2}$/.test(mes || '')) {
    throw erro('Informe o mês no formato AAAA-MM.', 400);
  }

  const [ano, numeroMes] = mes.split('-').map(Number);

  if (
    ano < 2026 ||
    ano > 2100 ||
    numeroMes < 1 ||
    numeroMes > 12 ||
    mes < '2026-10'
  ) {
    throw erro('Informe um mês válido a partir de outubro de 2026.', 400);
  }

  const proximoAno = numeroMes === 12 ? ano + 1 : ano;
  const proximoMes = numeroMes === 12 ? 1 : numeroMes + 1;

  return {
    mes,
    inicio: mes + '-01',
    fimExclusivo:
      proximoAno + '-' +
      String(proximoMes).padStart(2, '0') + '-01'
  };
}

async function buscarJson(url, opcoes, etapa) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      ...opcoes,
      signal: controller.signal
    });

    if (!response.ok) {
      throw erro(
        etapa + ': o Sankhya respondeu HTTP ' + response.status + '.'
      );
    }

    try {
      return await response.json();
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      throw erro(etapa + ': resposta inválida do Sankhya.');
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      throw erro(etapa + ': tempo de espera excedido.', 504);
    }

    throw e;
  } finally {
    clearTimeout(timer);
  }
}

async function obterToken(env) {
  if (
    !env.SANKHYA_CLIENT_ID ||
    !env.SANKHYA_CLIENT_SECRET ||
    !env.SANKHYA_X_TOKEN
  ) {
    throw erro('A integração com o Sankhya não está configurada.', 503);
  }

  const dados = await buscarJson(
    'https://api.sankhya.com.br/authenticate',
    {
      method: 'POST',
      headers: {
        'X-Token': env.SANKHYA_X_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: env.SANKHYA_CLIENT_ID,
        client_secret: env.SANKHYA_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }).toString()
    },
    'Autenticação'
  );

  if (!dados.access_token) {
    throw erro('O Sankhya não retornou o token de acesso.');
  }

  return dados.access_token;
}

async function consultar(token, sql) {
  const dados = await buscarJson(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr' +
    '?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: { sql }
      })
    },
    'Consulta das baixas'
  );

  if (String(dados.status) === '0') {
    // Não devolve SQL ou detalhes internos ao navegador.
    throw erro(
      'O Sankhya recusou a consulta das baixas. ' +
      'Confira a permissão da integração para consultar os dados.'
    );
  }

  if (!Array.isArray(dados.responseBody?.rows)) {
    throw erro('O Sankhya retornou um formato de dados inesperado.');
  }

  return dados.responseBody.rows.map(linha => {
    const valores = Array.isArray(linha)
      ? linha
      : Array.isArray(linha?.row)
        ? linha.row
        : null;

    if (!valores || valores.length !== 25) {
      throw erro('A estrutura das colunas retornadas não é a esperada.');
    }

    return valores.map(valor => {
      if (
        valor &&
        typeof valor === 'object' &&
        Object.prototype.hasOwnProperty.call(valor, '$')
      ) {
        return valor.$;
      }

      return valor;
    });
  });
}

function montarSql(periodo, ultimoFinanceiro) {
  // As datas são construídas após validação.
  // O cursor é validado como inteiro seguro antes desta função.
  return `
    SELECT *
    FROM (
      SELECT *
      FROM (
        SELECT
          FIN.NUFIN AS FINANCEIRO_ID,
          CAB.NUNOTA AS DOCUMENTO_ID,
          CAB.NUMNOTA AS NUMERO_NOTA,
          CAB.TIPMOV AS TIPO_MOVIMENTO,
          CAB.CODTIPOPER AS OPERACAO,
          CAB.CODVEND AS VENDEDOR_ID,
          VEN.APELIDO AS VENDEDOR_NOME,
          CAB.CODPARC AS CLIENTE_ID,
          PAR.NOMEPARC AS CLIENTE_NOME,

          TO_CHAR(CAB.DTNEG, 'YYYY-MM-DD') AS DATA_NOTA,
          TO_CHAR(CAB.DTFATUR, 'YYYY-MM-DD') AS DATA_FATURAMENTO,
          TO_CHAR(FIN.DTVENC, 'YYYY-MM-DD') AS DATA_VENCIMENTO,
          TO_CHAR(FIN.DHBAIXA, 'YYYY-MM-DD') AS DATA_BAIXA,

          FIN.DESDOBRAMENTO,
          FIN.RECDESP,
          FIN.PROVISAO,

          NVL(CAB.VLRNOTA, 0) AS VALOR_NOTA,
          NVL(CAB.VLRDESTAQUE, 0) AS DESTAQUE_NOTA,
          NVL(CAB.VLRJURO, 0) AS JUROS_NOTA,

          NVL(FIN.VLRDESDOB, 0) AS VALOR_TITULO,
          NVL(FIN.VLRDESC, 0) AS DESCONTO_FINANCEIRO,
          NVL(FIN.VLRJURO, 0) AS JUROS_FINANCEIRO,
          NVL(FIN.VLRMULTA, 0) AS MULTA_FINANCEIRA,
          NVL(FIN.VLRBAIXA, 0) AS VALOR_BAIXA,

          COUNT(*) OVER () AS TOTAL_PERIODO

        FROM TGFFIN FIN

        INNER JOIN TGFCAB CAB
          ON CAB.NUNOTA = FIN.NUNOTA

        LEFT JOIN TGFVEN VEN
          ON VEN.CODVEND = CAB.CODVEND

        LEFT JOIN TGFPAR PAR
          ON PAR.CODPARC = CAB.CODPARC

        WHERE FIN.DHBAIXA >= DATE '${periodo.inicio}'
          AND FIN.DHBAIXA < DATE '${periodo.fimExclusivo}'
          AND FIN.PROVISAO = 'N'
          AND CAB.STATUSNOTA = 'L'
          AND (
            (
              CAB.TIPMOV = 'V'
              AND CAB.CODTIPOPER = 1101
              AND FIN.RECDESP = 1
            )
            OR
            (
              CAB.TIPMOV = 'D'
              AND CAB.CODTIPOPER IN (1201, 1202, 1203)
              AND FIN.RECDESP = -1
            )
          )
      ) BASE
      WHERE BASE.FINANCEIRO_ID > ${ultimoFinanceiro}
      ORDER BY BASE.FINANCEIRO_ID
    )
    WHERE ROWNUM <= ${TAMANHO_PAGINA}
  `;
}

function inteiro(valor, campo) {
  const texto = String(valor ?? '').trim();

  if (!/^\d+$/.test(texto)) {
    throw erro('Identificador inválido no campo ' + campo + '.');
  }

  const numero = Number(texto);

  if (!Number.isSafeInteger(numero)) {
    throw erro('Identificador fora do limite no campo ' + campo + '.');
  }

  return numero;
}

function numero(valor, campo) {
  if (valor === null || valor === undefined || valor === '') {
    throw erro('Valor ausente no campo ' + campo + '.');
  }

  // O serviço JSON deve retornar números ou textos com ponto decimal.
  // Não adivinha separadores de milhar.
  const texto = String(valor).trim();

  if (!/^-?\d+(\.\d+)?$/.test(texto)) {
    throw erro('Formato numérico inesperado no campo ' + campo + '.');
  }

  const convertido = Number(texto);

  if (!Number.isFinite(convertido)) {
    throw erro('Valor inválido no campo ' + campo + '.');
  }

  return convertido;
}

function data(valor, campo, obrigatoria = false) {
  if (valor === null || valor === undefined || valor === '') {
    if (obrigatoria) {
      throw erro('Data ausente no campo ' + campo + '.');
    }

    return null;
  }

  const texto = String(valor);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    throw erro('Formato de data inesperado no campo ' + campo + '.');
  }

  return texto;
}

function normalizar(linha) {
  const financeiroId = String(inteiro(linha[0], 'NUFIN'));
  const documentoId = String(inteiro(linha[1], 'NUNOTA'));
  const tipo = String(linha[3]);

  if (!['V', 'D'].includes(tipo)) {
    throw erro('Tipo de movimento não reconhecido.');
  }

  const movimento = {
    origem: 'sankhya',
    chaveOrigem: 'sankhya:financeiro:' + financeiroId,

    financeiroId,
    documentoId,
    numeroNota: String(linha[2] ?? ''),
    tipo: tipo === 'V' ? 'venda' : 'devolucao',
    codigoOperacao: String(inteiro(linha[4], 'CODTIPOPER')),

    vendedorCodigo: String(inteiro(linha[5], 'CODVEND')),
    vendedorNome: String(linha[6] ?? ''),
    clienteCodigo: String(inteiro(linha[7], 'CODPARC')),
    clienteNome: String(linha[8] ?? ''),

    dataNota: data(linha[9], 'DATA_NOTA'),
    dataFaturamento: data(linha[10], 'DATA_FATURAMENTO'),
    dataVencimento: data(linha[11], 'DATA_VENCIMENTO'),
    dataBaixa: data(linha[12], 'DATA_BAIXA', true),

    parcela: String(linha[13] ?? ''),
    receitaDespesa: numero(linha[14], 'RECDESP'),

    valorNota: numero(linha[16], 'VALOR_NOTA'),
    destaqueNota: numero(linha[17], 'DESTAQUE_NOTA'),
    jurosNota: numero(linha[18], 'JUROS_NOTA'),

    valorTitulo: numero(linha[19], 'VALOR_TITULO'),
    descontoFinanceiro: numero(linha[20], 'DESCONTO_FINANCEIRO'),
    jurosFinanceiro: numero(linha[21], 'JUROS_FINANCEIRO'),
    multaFinanceira: numero(linha[22], 'MULTA_FINANCEIRA'),
    valorBaixa: numero(linha[23], 'VALOR_BAIXA'),

    alertas: []
  };

  if (Math.abs(movimento.valorNota - movimento.valorTitulo) > 0.009) {
    movimento.alertas.push('VALOR_NOTA_DIFERENTE_DO_TITULO');
  }

  if (movimento.jurosNota !== 0) {
    movimento.alertas.push('JUROS_NO_CABECALHO_A_CONFERIR');
  }

  if (
    movimento.valorNota <= 0 ||
    movimento.valorTitulo <= 0 ||
    movimento.valorBaixa < 0
  ) {
    movimento.alertas.push('VALORES_A_CONFERIR');
  }

  // Apenas conferência dos componentes financeiros.
  // Não é a base de cálculo da comissão.
  const baixaEsperada =
    movimento.valorTitulo -
    movimento.descontoFinanceiro +
    movimento.jurosFinanceiro +
    movimento.multaFinanceira;

  if (Math.abs(movimento.valorBaixa - baixaEsperada) > 0.009) {
    movimento.alertas.push('COMPONENTES_DA_BAIXA_DIVERGENTES');
  }

  return movimento;
}

export async function lerBaixasComissoesSankhya(env, mes) {
  const periodo = periodoDoMes(mes);
  const token = await obterToken(env);

  const movimentos = [];
  const chaves = new Set();

  let ultimoFinanceiro = 0;
  let totalEsperado = null;
  let consultas = 0;
  let terminou = false;

  for (let pagina = 0; pagina < MAXIMO_PAGINAS; pagina++) {
    const linhas = await consultar(
      token,
      montarSql(periodo, ultimoFinanceiro)
    );

    consultas++;

    if (!linhas.length) {
      terminou = true;
      break;
    }

    for (const linha of linhas) {
      const total = inteiro(linha[24], 'TOTAL_PERIODO');

      if (totalEsperado === null) totalEsperado = total;

      if (total !== totalEsperado) {
        throw erro(
          'A quantidade de baixas mudou durante a consulta. ' +
          'Atualize a conferência.'
        );
      }

      const financeiro = inteiro(linha[0], 'NUFIN');

      if (financeiro <= ultimoFinanceiro) {
        throw erro('A paginação retornou registros repetidos ou fora de ordem.');
      }

      const movimento = normalizar(linha);

      if (chaves.has(movimento.chaveOrigem)) {
        throw erro('Foi encontrada uma chave financeira duplicada.');
      }

      if (
        movimento.dataBaixa < periodo.inicio ||
        movimento.dataBaixa >= periodo.fimExclusivo
      ) {
        throw erro('Foi retornada uma baixa fora do período solicitado.');
      }

      chaves.add(movimento.chaveOrigem);
      movimentos.push(movimento);
      ultimoFinanceiro = financeiro;
    }

    if (movimentos.length === totalEsperado) {
      terminou = true;
      break;
    }

    if (movimentos.length > totalEsperado) {
      throw erro('A quantidade recebida ultrapassou o total informado.');
    }
  }

  const total = totalEsperado ?? 0;

  if (!terminou || movimentos.length !== total) {
    throw erro(
      'A leitura não foi concluída. ' +
      'Nenhum resultado parcial será considerado completo.'
    );
  }

  return {
    origem: 'sankhya',
    mes,
    consultadoEm: new Date().toISOString(),
    consultas,
    total,
    movimentos
  };
}

export async function conferirBaixasComissoes(request, env, acesso) {
  if (
    !acesso?.session ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.update
  ) {
    return responder({
      error: 'É necessário acesso de consulta e alteração ao cadastro de comissões.'
    }, 403);
  }

  if (request.method !== 'GET') {
    return responder({ error: 'Método não permitido.' }, 405);
  }

  try {
    const mes = new URL(request.url).searchParams.get('mes');
    const resultado = await lerBaixasComissoesSankhya(env, mes);

    const operacoes = {};

    for (const movimento of resultado.movimentos) {
      const chave = movimento.codigoOperacao;

      if (!operacoes[chave]) {
        operacoes[chave] = {
          tipo: movimento.tipo,
          quantidade: 0
        };
      }

      operacoes[chave].quantidade++;
    }

    return responder({
      etapa: 'Conferência de leitura — sem gravação e sem cálculo',
      origem: resultado.origem,
      mes: resultado.mes,
      consultadoEm: resultado.consultadoEm,
      consultas: resultado.consultas,
      total: resultado.total,

      vendas: resultado.movimentos.filter(
        movimento => movimento.tipo === 'venda'
      ).length,

      devolucoes: resultado.movimentos.filter(
        movimento => movimento.tipo === 'devolucao'
      ).length,

      operacoes,

      quantidadeComAlertas: resultado.movimentos.filter(
        movimento => movimento.alertas.length > 0
      ).length,

      movimentosComAlertas: resultado.movimentos.filter(
        movimento => movimento.alertas.length > 0
      ),

      casosDeConferencia: resultado.movimentos.filter(
        movimento => ['220369', '214381', '228607']
          .includes(movimento.financeiroId)
      ),

      amostra: resultado.movimentos.slice(0, 5)
    });
  } catch (e) {
    return responder({
      error: e.status
        ? e.message
        : 'Falha inesperada ao consultar as baixas. Nenhum dado foi gravado.'
    }, e.status || 502);
  }
}
