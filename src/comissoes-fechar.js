import {
  calcularPreviaComissoes
} from './comissoes-calculo.js';

import {
  resumir
} from './comissoes-demonstrativo.js';

function resposta(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function falha(mensagem, status = 409) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

async function assinatura(dados) {
  const bytes = new TextEncoder().encode(JSON.stringify(dados));
  const hash = await crypto.subtle.digest('SHA-256', bytes);

  return [...new Uint8Array(hash)]
    .map(numero => numero.toString(16).padStart(2, '0'))
    .join('');
}

async function preparar(env, mes, codigo) {
  const cadastro = await env.DB.prepare(`
    SELECT *
    FROM comissao_vendedores
    WHERE origem = 'sankhya'
      AND codigo_origem = ?
  `).bind(codigo).first();

  if (!cadastro) {
    throw falha('Vendedor sem cadastro de comissão.');
  }

  const existente = await env.DB.prepare(`
    SELECT id
    FROM comissao_fechamentos
    WHERE origem = 'sankhya'
      AND codigo_origem = ?
      AND mes = ?
      AND status = 'FECHADO'
  `).bind(codigo, mes).first();

  if (existente) {
    throw falha('Este vendedor já possui fechamento neste mês.');
  }

  const previa = await calcularPreviaComissoes(env, mes);

  const linhas = previa.linhas.filter(
    linha => linha.vendedorCodigo === codigo
  );

  if (!linhas.length) {
    throw falha('Não há movimentos para este vendedor no mês.');
  }

  if (linhas.some(linha => linha.status !== 'CALCULADO_PREVIA')) {
    throw falha(
      'O vendedor possui movimentos pendentes, sem comissão ' +
      'ou fora desta etapa. O fechamento não foi permitido.'
    );
  }

  if (
    linhas.some(linha =>
      linha.cadastroId !== cadastro.id ||
      linha.revisaoCadastro !== cadastro.revisao
    )
  ) {
    throw falha(
      'O cadastro mudou durante a consulta. Atualize e confira novamente.'
    );
  }

  const consulta = await env.DB.prepare(`
    SELECT chave_origem, dados
    FROM comissao_importacao_itens
    WHERE importacao_id = ?
      AND vendedor_codigo = ?
    ORDER BY chave_origem
  `).bind(previa.importacaoId, codigo).all();

  const originais = consulta.results || [];

  if (originais.length !== linhas.length) {
    throw falha('A quantidade de movimentos está divergente.');
  }

  const mapaOriginais = new Map(
    originais.map(item => [
      item.chave_origem,
      JSON.parse(item.dados)
    ])
  );

  const itens = linhas.map(linha => {
    const movimento = mapaOriginais.get(linha.chaveOrigem);

    if (!movimento) {
      throw falha('Não foi possível localizar um movimento de origem.');
    }

    return {
      movimento,
      calculo: linha
    };
  });

  const resumo = resumir(linhas);

  const versaoAnterior = await env.DB.prepare(`
    SELECT COALESCE(MAX(versao), 0) AS versao
    FROM comissao_fechamentos
    WHERE vendedor_id = ?
      AND mes = ?
  `).bind(cadastro.id, mes).first();

  const material = {
    mes,
    cadastro,
    importacaoId: previa.importacaoId,
    versaoCalculo: previa.versaoCalculo,
    resumo,
    itens
  };

  return {
    cadastro,
    previa,
    linhas,
    itens,
    resumo,
    versao: Number(versaoAnterior.versao) + 1,
    assinatura: await assinatura(material)
  };
}

export async function fecharComissao(request, env, acesso) {
  if (
    !acesso?.session ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.create
  ) {
    return resposta({
      error: 'Você não tem permissão para fechar comissões.'
    }, 403);
  }

  if (request.method !== 'POST') {
    return resposta({ error: 'Método não permitido.' }, 405);
  }

  const origem = request.headers.get('Origin');

  if (origem !== new URL(request.url).origin) {
    return resposta({ error: 'Origem da solicitação inválida.' }, 403);
  }

  if (
    !(request.headers.get('Content-Type') || '')
      .includes('application/json')
  ) {
    return resposta({ error: 'Envie os dados em JSON.' }, 415);
  }

  try {
    const texto = await request.text();

    if (texto.length > 20000) {
      throw falha('Solicitação muito grande.', 413);
    }

    let dados;

    try {
      dados = JSON.parse(texto);
    } catch {
      throw falha('JSON inválido.', 400);
    }

    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
      throw falha('Solicitação inválida.', 400);
    }

    const mes = String(dados.mes || '');
    const codigo = String(dados.vendedor || '');
    const acao = String(dados.acao || '');

    if (
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) ||
      mes < '2026-10' ||
      mes > '2100-12' ||
      !/^\d+$/.test(codigo) ||
      !['preparar', 'confirmar'].includes(acao)
    ) {
      throw falha('Mês, vendedor ou ação inválidos.', 400);
    }

    const autor = String(acesso.session.user_id);

    if (acao === 'confirmar') {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          .test(String(dados.operacaoId || '')) ||
        !/^[0-9a-f]{64}$/.test(String(dados.assinatura || ''))
      ) {
        throw falha('Confirmação inválida.', 400);
      }

      // Uma repetição da mesma operação não cria outro fechamento.
      const repetido = await env.DB.prepare(`
        SELECT id, mes, codigo_origem, fechado_por, status
        FROM comissao_fechamentos
        WHERE id = ?
      `).bind(dados.operacaoId).first();

      if (repetido) {
        if (
          repetido.mes === mes &&
          repetido.codigo_origem === codigo &&
          repetido.fechado_por === autor &&
          repetido.status === 'FECHADO'
        ) {
          return resposta({
            sucesso: true,
            fechamentoId: repetido.id,
            jaConfirmado: true
          });
        }

        throw falha('Identificador de operação já utilizado.');
      }
    }

    const preparado = await preparar(env, mes, codigo);

    if (acao === 'preparar') {
      return resposta({
        mes,
        vendedor: codigo,
        nome: preparado.linhas[0].vendedorNome,
        resumo: preparado.resumo,
        dadosImportadosEm: preparado.previa.dadosImportadosEm,
        assinatura: preparado.assinatura
      });
    }

    if (dados.assinatura !== preparado.assinatura) {
      throw falha(
        'Os dados ou regras mudaram após a conferência. ' +
        'Atualize a tela e confira novamente.'
      );
    }

    const {
      cadastro,
      previa,
      itens,
      resumo,
      versao
    } = preparado;

    const id = dados.operacaoId;
    const agora = new Date().toISOString();

    const registro = {
      id,
      vendedor_id: cadastro.id,
      vendedor_user_id: cadastro.user_id,
      vendedor_nome: preparado.linhas[0].vendedorNome,
      origem: cadastro.origem,
      codigo_origem: cadastro.codigo_origem,
      mes,
      versao,
      status: 'FECHADO',
      importacao_id: previa.importacaoId,
      versao_calculo: previa.versaoCalculo,
      revisao_cadastro: cadastro.revisao,
      cadastro_snapshot: cadastro.dados,
      resumo_snapshot: JSON.stringify(resumo),
      quantidade_movimentos: itens.length,
      comissao_vendas: resumo.comissaoVendas,
      perda_devolucoes: resumo.perdaDevolucoes,
      comissao_liquida: resumo.comissaoLiquida,
      dados_importados_em: previa.dadosImportadosEm,
      calculado_em: previa.calculadoEm,
      fechado_em: agora,
      fechado_por: autor
    };

    // Os nomes das colunas são internos, nunca recebidos do navegador.
    const colunas = Object.keys(registro);

    const comandos = [
      env.DB.prepare(`
        INSERT INTO comissao_fechamentos (
          ${colunas.join(', ')}
        )
        SELECT ${colunas.map(() => '?').join(', ')}
        WHERE EXISTS (
          SELECT 1
          FROM comissao_vendedores
          WHERE id = ?
            AND revisao = ?
            AND dados = ?
            AND user_id = ?
            AND origem = ?
            AND codigo_origem = ?
        )
        AND EXISTS (
          SELECT 1
          FROM comissao_importacao_periodos
          WHERE origem = ?
            AND mes = ?
            AND importacao_atual = ?
        )
        AND NOT EXISTS (
          SELECT 1
          FROM comissao_fechamentos
          WHERE origem = ?
            AND codigo_origem = ?
            AND mes = ?
            AND status = 'FECHADO'
        )
      `).bind(
        ...Object.values(registro),
        cadastro.id,
        cadastro.revisao,
        cadastro.dados,
        cadastro.user_id,
        cadastro.origem,
        cadastro.codigo_origem,
        cadastro.origem,
        mes,
        previa.importacaoId,
        cadastro.origem,
        codigo,
        mes
      )
    ];

    // Divide o conteúdo em lotes, mantendo tudo na mesma transação.
    for (let inicio = 0; inicio < itens.length; inicio += 100) {
      comandos.push(
        env.DB.prepare(`
          INSERT INTO comissao_fechamento_itens (
            fechamento_id,
            chave_origem,
            financeiro_id,
            documento_id,
            tipo,
            data_baixa,
            movimento_snapshot,
            calculo_snapshot
          )
          SELECT
            ?,
            json_extract(J.value, '$.calculo.chaveOrigem'),
            json_extract(J.value, '$.calculo.financeiroId'),
            json_extract(J.value, '$.calculo.documentoId'),
            json_extract(J.value, '$.calculo.tipo'),
            json_extract(J.value, '$.calculo.dataBaixa'),
            json_extract(J.value, '$.movimento'),
            json_extract(J.value, '$.calculo')
          FROM json_each(?) AS J
          WHERE EXISTS (
            SELECT 1
            FROM comissao_fechamentos
            WHERE id = ?
          )
        `).bind(
          id,
          JSON.stringify(itens.slice(inicio, inicio + 100)),
          id
        )
      );
    }

    comandos.push(
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
        SELECT ?, ?, 'FECHAMENTO', ?, ?, NULL, ?
        WHERE EXISTS (
          SELECT 1
          FROM comissao_fechamentos
          WHERE id = ?
        )
      `).bind(
        crypto.randomUUID(),
        id,
        agora,
        autor,
        JSON.stringify({
          assinatura: preparado.assinatura,
          importacaoId: previa.importacaoId,
          versao,
          resumo
        }),
        id
      )
    );

    const resultados = await env.DB.batch(comandos);

    if (resultados[0].meta.changes !== 1) {
      throw falha(
        'O cadastro, a importação ou o fechamento mudou. ' +
        'Atualize a tela antes de continuar.'
      );
    }

    return resposta({
      sucesso: true,
      fechamentoId: id,
      mes,
      vendedor: codigo,
      fechadoEm: agora,
      resumo
    });
  } catch (erro) {
    console.error('Erro ao fechar comissão:', erro);

    return resposta({
      error: erro.status
        ? erro.message
        : 'Não foi possível confirmar o fechamento. ' +
          'Atualize a tela para verificar a situação antes de tentar novamente.'
    }, erro.status || 500);
  }
}
