import {
  calcularPreviaComissoes
} from './comissoes-calculo.js';

function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function consultarFechamentos(request, env, acesso) {
  if (!acesso?.session || !acesso?.permissions?.view) {
    return responder({
      error: 'Você não tem acesso ao fechamento de comissões.'
    }, 403);
  }

  if (request.method !== 'GET') {
    return responder({ error: 'Método não permitido.' }, 405);
  }

  const mes = new URL(request.url).searchParams.get('mes') || '';

  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) ||
    mes < '2026-10' ||
    mes > '2100-12'
  ) {
    return responder({
      error: 'Informe um mês válido a partir de outubro de 2026.'
    }, 400);
  }

  try {
    const consulta = await env.DB.prepare(`
      SELECT
        id,
        origem,
        codigo_origem,
        vendedor_nome,
        quantidade_movimentos,
        comissao_vendas,
        perda_devolucoes,
        comissao_liquida,
        fechado_em,
        versao
      FROM comissao_fechamentos
      WHERE mes = ?
        AND status = 'FECHADO'
      ORDER BY vendedor_nome
    `).bind(mes).all();

    const fechados = consulta.results || [];

    const linhas = fechados.map(item => ({
      codigo: item.codigo_origem,
      vendedor: item.vendedor_nome,
      movimentos: item.quantidade_movimentos,
      comissaoVendas: item.comissao_vendas,
      perdaDevolucoes: item.perda_devolucoes,
      comissaoLiquida: item.comissao_liquida,
      situacao: 'FECHADO',
      motivo: '',
      fechamentoId: item.id,
      fechadoEm: item.fechado_em,
      versao: item.versao
    }));

    const codigosFechados = new Set(
      fechados.map(item => item.origem + ':' + item.codigo_origem)
    );

    let previa = null;
    let aviso = '';

    try {
      previa = await calcularPreviaComissoes(env, mes);
    } catch (erro) {
      if (erro.status !== 409) throw erro;

      aviso = erro.message +
        ' Os valores já fechados, quando existentes, continuam disponíveis.';
    }

    if (previa) {
      for (const vendedor of previa.porVendedor) {
        if (codigosFechados.has('sankhya:' + vendedor.codigo)) {
          continue;
        }

        let situacao = 'EM_ABERTO';
        let motivo = '';

        if (vendedor.foraDaEtapa > 0) {
          situacao = 'FORA_DA_ETAPA';
          motivo = 'Regra específica fora desta etapa.';
        } else if (vendedor.pendentes > 0) {
          situacao = 'PENDENTE';
          motivo =
            vendedor.pendentes +
            ' movimento(s) precisam de conferência.';
        } else if (
          vendedor.semComissao === vendedor.movimentos
        ) {
          situacao = 'SEM_COMISSAO';
          motivo = 'Vendedor definido como não comissionado.';
        } else if (vendedor.calculados === 0) {
          situacao = 'PENDENTE';
          motivo = 'Nenhum movimento calculado.';
        }

        linhas.push({
          codigo: vendedor.codigo,
          vendedor: vendedor.vendedor,
          movimentos: vendedor.movimentos,
          comissaoVendas: vendedor.comissaoVendas,
          perdaDevolucoes: vendedor.descontoDevolucoes,
          comissaoLiquida: vendedor.comissaoLiquida,
          situacao,
          motivo,
          fechamentoId: null,
          fechadoEm: null,
          versao: null
        });
      }
    }

    linhas.sort((a, b) =>
      a.vendedor.localeCompare(b.vendedor, 'pt-BR')
    );

    return responder({
      mes,
      aviso,
      dadosImportadosEm: previa?.dadosImportadosEm || null,
      permissoes: {
        consultar: true,
        fechar: Boolean(acesso.permissions.create),
        reabrir: Boolean(acesso.permissions.update)
      },
      linhas
    });
  } catch (erro) {
    console.error('Erro na consulta de fechamentos:', erro);

    return responder({
      error: 'Não foi possível consultar os fechamentos.'
    }, 500);
  }
}
