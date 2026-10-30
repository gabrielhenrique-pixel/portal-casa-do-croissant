import {
  lerBaixasComissoesSankhya
} from './comissoes-sankhya.js';

const ORIGEM = 'sankhya';

// Regra específica ainda não implementada.
// Os movimentos são preservados, sem calcular comissão.
const VENDEDORES_COM_REGRA_PENDENTE = new Set(['17']);

function resposta(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function falha(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarMes(valor) {
  const mes = String(valor || '').trim();

  if (!/^\d{4}-\d{2}$/.test(mes)) {
    throw falha('Informe o mês no formato AAAA-MM.');
  }

  const [ano, numeroMes] = mes.split('-').map(Number);

  if (
    ano < 2026 ||
    ano > 2100 ||
    numeroMes < 1 ||
    numeroMes > 12 ||
    mes < '2026-10'
  ) {
    throw falha('Informe um mês válido a partir de outubro de 2026.');
  }

  return mes;
}

async function consultarSituacao(env, mes) {
  const atual = await env.DB.prepare(`
    SELECT
      P.revisao,
      R.id,
      R.status,
      R.iniciado_em,
      R.concluido_em,
      R.executado_por,
      R.resumo
    FROM comissao_importacao_periodos P
    INNER JOIN comissao_importacoes R
      ON R.id = P.importacao_atual
    WHERE P.origem = ?
      AND P.mes = ?
  `).bind(ORIGEM, mes).first();

  const historico = await env.DB.prepare(`
    SELECT
      id,
      status,
      iniciado_em,
      concluido_em,
      executado_por,
      erro
    FROM comissao_importacoes
    WHERE origem = ?
      AND mes = ?
    ORDER BY iniciado_em DESC
    LIMIT 5
  `).bind(ORIGEM, mes).all();

  return {
    origem: ORIGEM,
    mes,

    atual: atual
      ? {
          ...atual,
          resumo: atual.resumo ? JSON.parse(atual.resumo) : null
        }
      : null,

    ultimasTentativas: historico.results || []
  };
}

async function sincronizar(env, mes, autor) {
  await env.DB.prepare(`
    INSERT OR IGNORE INTO comissao_importacao_periodos (
      origem,
      mes,
      revisao
    )
    VALUES (?, ?, 0)
  `).bind(ORIGEM, mes).run();

  // A revisão impede que duas sincronizações iniciadas sobre
  // a mesma versão substituam uma à outra silenciosamente.
  const base = await env.DB.prepare(`
    SELECT importacao_atual, revisao
    FROM comissao_importacao_periodos
    WHERE origem = ?
      AND mes = ?
  `).bind(ORIGEM, mes).first();

  if (!base) {
    throw falha('Não foi possível preparar o período.', 500);
  }

  const id = crypto.randomUUID();
  const iniciadoEm = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO comissao_importacoes (
      id,
      origem,
      mes,
      status,
      iniciado_em,
      executado_por
    )
    VALUES (?, ?, ?, 'EXECUTANDO', ?, ?)
  `).bind(
    id,
    ORIGEM,
    mes,
    iniciadoEm,
    autor
  ).run();

  try {
    // Só prossegue quando o leitor termina a consulta completa.
    const leitura = await lerBaixasComissoesSankhya(env, mes);

    const movimentos = leitura.movimentos.map(movimento => ({
      ...movimento,

      regraStatus: VENDEDORES_COM_REGRA_PENDENTE.has(
        movimento.vendedorCodigo
      )
        ? 'REGRA_PENDENTE'
        : 'AGUARDANDO_CALCULO'
    }));

    // Grava em lotes. Não usa uma consulta por financeiro.
    // As versões anteriores continuam preservadas.
    for (let inicio = 0; inicio < movimentos.length; inicio += 200) {
      const lote = movimentos.slice(inicio, inicio + 200);

      await env.DB.prepare(`
        INSERT INTO comissao_importacao_itens (
          importacao_id,
          chave_origem,
          financeiro_id,
          documento_id,
          vendedor_codigo,
          tipo,
          data_baixa,
          regra_status,
          dados
        )
        SELECT
          ?,
          json_extract(value, '$.chaveOrigem'),
          json_extract(value, '$.financeiroId'),
          json_extract(value, '$.documentoId'),
          json_extract(value, '$.vendedorCodigo'),
          json_extract(value, '$.tipo'),
          json_extract(value, '$.dataBaixa'),
          json_extract(value, '$.regraStatus'),
          value
        FROM json_each(?)
      `).bind(
        id,
        JSON.stringify(lote)
      ).run();
    }

    const contagem = await env.DB.prepare(`
      SELECT COUNT(*) AS quantidade
      FROM comissao_importacao_itens
      WHERE importacao_id = ?
    `).bind(id).first();

    if (Number(contagem.quantidade) !== leitura.total) {
      throw falha(
        'A quantidade gravada não corresponde à quantidade recebida.',
        500
      );
    }

    // Movimentos da versão anterior que não aparecem na nova.
    // Isso NÃO significa automaticamente cancelamento.
    const ausentes = base.importacao_atual
      ? await env.DB.prepare(`
          SELECT COUNT(*) AS quantidade
          FROM comissao_importacao_itens ANTIGO
          WHERE ANTIGO.importacao_id = ?
            AND NOT EXISTS (
              SELECT 1
              FROM comissao_importacao_itens NOVO
              WHERE NOVO.importacao_id = ?
                AND NOVO.chave_origem = ANTIGO.chave_origem
            )
        `).bind(base.importacao_atual, id).first()
      : { quantidade: 0 };

    const resumo = {
      total: movimentos.length,

      vendas: movimentos.filter(
        movimento => movimento.tipo === 'venda'
      ).length,

      devolucoes: movimentos.filter(
        movimento => movimento.tipo === 'devolucao'
      ).length,

      regrasPendentes: movimentos.filter(
        movimento => movimento.regraStatus === 'REGRA_PENDENTE'
      ).length,

      movimentosComAlertas: movimentos.filter(
        movimento => movimento.alertas.length > 0
      ).length,

      ausentesDesdeAnterior: Number(ausentes.quantidade),
      importacaoAnterior: base.importacao_atual,
      consultasSankhya: leitura.consultas,
      consultadoEm: leitura.consultadoEm
    };

    const concluidoEm = new Date().toISOString();

    // A publicação da nova versão e o registro de conclusão
    // acontecem juntos.
    const resultados = await env.DB.batch([
      env.DB.prepare(`
        UPDATE comissao_importacao_periodos
        SET
          importacao_atual = ?,
          revisao = revisao + 1,
          atualizado_em = ?
        WHERE origem = ?
          AND mes = ?
          AND revisao = ?
      `).bind(
        id,
        concluidoEm,
        ORIGEM,
        mes,
        base.revisao
      ),

      env.DB.prepare(`
        UPDATE comissao_importacoes
        SET
          status = CASE
            WHEN EXISTS (
              SELECT 1
              FROM comissao_importacao_periodos
              WHERE origem = ?
                AND mes = ?
                AND importacao_atual = ?
            )
            THEN 'CONCLUIDA'
            ELSE 'CONFLITO'
          END,
          concluido_em = ?,
          resumo = ?
        WHERE id = ?
      `).bind(
        ORIGEM,
        mes,
        id,
        concluidoEm,
        JSON.stringify(resumo),
        id
      )
    ]);

    if (Number(resultados[0].meta.changes) !== 1) {
      throw falha(
        'Outra sincronização atualizou este mês. ' +
        'Consulte a situação antes de tentar novamente.',
        409
      );
    }

    return {
      sucesso: true,
      importacaoId: id,
      origem: ORIGEM,
      mes,
      status: 'CONCLUIDA',
      resumo,
      aviso: 'Dados importados. Nenhuma comissão foi calculada.'
    };
  } catch (erro) {
    // Não altera uma sincronização já concluída ou em conflito.
    // Em caso de interrupção abrupta, a tentativa pode permanecer
    // EXECUTANDO, mas não vira a versão atual.
    try {
      await env.DB.prepare(`
        UPDATE comissao_importacoes
        SET
          status = 'FALHA',
          concluido_em = ?,
          erro = ?
        WHERE id = ?
          AND status = 'EXECUTANDO'
      `).bind(
        new Date().toISOString(),
        erro.status
          ? String(erro.message).slice(0, 500)
          : 'Falha na leitura ou gravação da importação.',
        id
      ).run();
    } catch {
      // Preserva o erro original.
    }

    throw erro;
  }
}

export async function importarComissoes(request, env, acesso) {
  if (
    !acesso?.session ||
    !acesso?.permissions?.view ||
    !acesso?.permissions?.update
  ) {
    return resposta({
      error: 'É necessário acesso de consulta e alteração ao cadastro de comissões.'
    }, 403);
  }

  try {
    const url = new URL(request.url);

    if (request.method === 'GET') {
      const mes = validarMes(url.searchParams.get('mes'));

      return resposta(
        await consultarSituacao(env, mes)
      );
    }

    if (request.method !== 'POST') {
      return resposta({ error: 'Método não permitido.' }, 405);
    }

    if (request.headers.get('origin') !== url.origin) {
      return resposta({ error: 'Origem não autorizada.' }, 403);
    }

    const contentType = request.headers.get('content-type') || '';
    let mesInformado;

    if (contentType.includes('application/json')) {
      let dados;

      try {
        dados = await request.json();
      } catch {
        throw falha('JSON inválido.');
      }

      mesInformado = dados?.mes;
    } else if (
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const formulario = await request.formData();
      mesInformado = formulario.get('mes');
    } else {
      throw falha('Formato de envio não suportado.', 415);
    }

    const mes = validarMes(mesInformado);

    const resultado = await sincronizar(
      env,
      mes,
      acesso.session.username
    );

    return resposta(resultado);
  } catch (erro) {
    return resposta({
      error: erro.status
        ? erro.message
        : 'Não foi possível concluir a operação. Consulte a situação antes de repetir.'
    }, erro.status || 500);
  }
}

export function importacaoComissoesPage() {
  return new Response(String.raw`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sincronização de comissões</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f5f7f6;
      color: #102e49;
      font: 14px Arial, sans-serif;
    }
    main {
      max-width: 1440px;
      margin: auto;
      padding: 6px 8px 38px;
    }
    header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 34px;
      background: white;
      border-radius: 18px;
      box-shadow: 0 8px 22px #1730521c;
    }
    nav { display: flex; gap: 8px; }
    nav a {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 5px 15px #1730521c;
      text-decoration: none;
      color: #102e49;
      font-size: 25px;
    }
    h1 { margin: 0; font-size: 26px; }
    section {
      margin-top: 18px;
      padding: 24px;
      background: white;
      border-radius: 14px;
    }
    p { line-height: 1.6; }
    form {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 12px;
    }
    label { display: grid; gap: 8px; }
    input, button {
      min-height: 42px;
      padding: 10px 14px;
      font: inherit;
      border: 1px solid #c6d4e4;
      border-radius: 7px;
    }
    button {
      background: #1769aa;
      color: white;
      cursor: pointer;
    }
    .secondary {
      background: white;
      color: #102e49;
    }
    @media(max-width:600px) {
      header { padding: 16px; }
      h1 { font-size: 20px; }
    }
  </style>
</head>
<body>
<main>
  <header>
    <nav>
      <a href="/comissoes/vendedores" title="Voltar aos vendedores"
         aria-label="Voltar aos vendedores">←</a>
      <a href="/" title="Página inicial" aria-label="Página inicial">⌂</a>
    </nav>
    <h1>SINCRONIZAÇÃO DE COMISSÕES</h1>
  </header>

  <section>
    <h2>Importação das baixas</h2>

    <p>
      Esta etapa copia as baixas para o portal.
      Não calcula comissão, não fecha o mês e não altera o Sankhya.
      A regra da IZAURA ROSA permanece pendente.
    </p>

    <form method="POST" action="/api/comissoes/importacao">
      <label>
        Mês da baixa
        <input
          type="month"
          name="mes"
          min="2026-10"
          max="2100-12"
          value="2026-10"
          required
        >
      </label>

      <button type="submit">Sincronizar dados</button>

      <button
        class="secondary"
        type="submit"
        formmethod="GET"
        formaction="/api/comissoes/importacao"
      >
        Consultar situação
      </button>
    </form>

    <p>
      O resultado abrirá em formato JSON.
      Se houver demora ou erro, consulte a situação antes de repetir.
      Esta é uma tela de teste da integração, não o demonstrativo do vendedor.
    </p>
  </section>
</main>
</body>
</html>
  `, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
