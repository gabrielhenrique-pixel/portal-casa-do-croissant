import {
  carregarClientesRentabilidade,
  listarRedesRentabilidade
} from './clientes-rentabilidade.js';

function resposta(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export function percentual(valor) {
  const texto = String(valor ?? '').trim().replace(',', '.');

  if (!/^\d{1,3}(\.\d{1,2})?$/.test(texto)) {
    throw new Error(
      'Informe um percentual de 0 a 100, com até duas casas decimais.'
    );
  }

  const numero = Math.round(Number(texto) * 100);

  if (numero > 10000) {
    throw new Error('O percentual não pode ultrapassar 100%.');
  }

  return numero;
}

export function validarCadastro(dados, clientes, redes) {
  const nome = String(dados.nome || '').trim();

  if (!nome || nome.length > 120) {
    throw new Error(
      'Informe o nome do vendedor, com até 120 caracteres.'
    );
  }

  if (typeof dados.ativo !== 'boolean') {
    throw new Error('Informe se o vendedor está ativo.');
  }

  if (
    !Array.isArray(dados.excecoes) ||
    dados.excecoes.length > 500
  ) {
    throw new Error('Lista de exceções inválida. Máximo: 500.');
  }

  const cadastradas = new Set();

  const excecoes = dados.excecoes.map(excecao => {
    if (!excecao || typeof excecao !== 'object') {
      throw new Error('Exceção inválida.');
    }

    const tipo = excecao.tipo;
    const alvo = String(excecao.alvo ?? '').trim();

    if (!['cliente', 'rede'].includes(tipo)) {
      throw new Error('Selecione uma exceção por cliente ou rede.');
    }

    const existe = tipo === 'rede'
      ? redes.includes(alvo)
      : clientes.some(
          cliente => String(cliente.codigoParceiro) === alvo
        );

    if (!existe) {
      throw new Error('Selecione um cliente ou uma rede cadastrada.');
    }

    const chave = tipo + ':' + alvo;

    if (cadastradas.has(chave)) {
      throw new Error(
        'Existe mais de uma exceção para o mesmo cliente ou rede.'
      );
    }

    cadastradas.add(chave);

    return {
      tipo,
      alvo,
      venda: percentual(excecao.venda),
      devolucao: percentual(excecao.devolucao)
    };
  });

  return {
    nome,
    ativo: dados.ativo,
    venda: percentual(dados.venda),
    devolucao: percentual(dados.devolucao),
    excecoes
  };
}

export function selecionarRegra(cadastro, cliente, rede, tipo) {
  if (!cadastro.ativo) {
    throw new Error('Vendedor inativo.');
  }

  if (!['venda', 'devolucao'].includes(tipo)) {
    throw new Error('Tipo de movimento inválido.');
  }

  const regraCliente = cadastro.excecoes.find(
    regra =>
      regra.tipo === 'cliente' &&
      regra.alvo === String(cliente)
  );

  const regraRede = cadastro.excecoes.find(
    regra =>
      regra.tipo === 'rede' &&
      regra.alvo === rede
  );

  const regra = regraCliente || regraRede;

  return {
    percentual: regra ? regra[tipo] : cadastro[tipo],
    origem: regra
      ? regra.tipo + ':' + regra.alvo
      : 'padrao'
  };
}

export async function cadastroComissoes(request, env, acesso) {
  if (!acesso?.session || !acesso?.permissions?.view) {
    return resposta({ error: 'Acesso não autorizado.' }, 403);
  }

  const escrita = request.method === 'POST';

  if (!escrita && request.method !== 'GET') {
    return resposta({ error: 'Método não permitido.' }, 405);
  }

  let dados;

  if (escrita) {
    const origem = request.headers.get('origin');

    if (origem !== new URL(request.url).origin) {
      return resposta({ error: 'Origem não autorizada.' }, 403);
    }

    try {
      dados = await request.json();
    } catch {
      return resposta({ error: 'Dados inválidos.' }, 400);
    }

    if (
      !dados ||
      typeof dados !== 'object' ||
      Array.isArray(dados)
    ) {
      return resposta({ error: 'Cadastro inválido.' }, 400);
    }

    const permissao = dados.id ? 'update' : 'create';

    if (!acesso.permissions[permissao]) {
      return resposta({
        error: 'Você não tem permissão para esta alteração.'
      }, 403);
    }
  }

  if (!escrita) {
    const [cadastros, usuarios, clientes, redes] =
      await Promise.all([
        env.DB.prepare(`
          SELECT
            id,
            user_id,
            origem,
            codigo_origem,
            revisao,
            dados,
            atualizado_em,
            atualizado_por
          FROM comissao_vendedores
          ORDER BY atualizado_em DESC
        `).all(),

        env.DB.prepare(`
          SELECT
            u.id,
            u.username,
            u.nome,
            v.codigo_vendedor
          FROM users u
          INNER JOIN usuarios_vendedores v
            ON v.user_id = u.id
          ORDER BY u.nome, u.username
        `).all(),

        carregarClientesRentabilidade(env),
        listarRedesRentabilidade(env)
      ]);

    return resposta({
      vendedores: (cadastros.results || []).map(registro => ({
        ...registro,
        dados: JSON.parse(registro.dados)
      })),

      usuarios: usuarios.results || [],

      clientes: clientes.map(cliente => ({
        codigo: String(cliente.codigoParceiro),
        nome: cliente.cliente,
        rede: cliente.rede
      })),

      redes,
      permissoes: acesso.permissions
    });
  }

  const id = dados.id
    ? String(dados.id)
    : crypto.randomUUID();

  const anterior = dados.id
    ? await env.DB.prepare(`
        SELECT *
        FROM comissao_vendedores
        WHERE id = ?
      `).bind(id).first()
    : null;

  if (dados.id && !anterior) {
    return resposta({ error: 'Cadastro não encontrado.' }, 404);
  }

  if (anterior && anterior.revisao !== dados.revisao) {
    return resposta({
      error:
        'Este cadastro foi alterado por outra pessoa. ' +
        'Recarregue a página antes de salvar.'
    }, 409);
  }

  const usuarioId = anterior
    ? anterior.user_id
    : String(dados.userId || '');

  const vinculo = await env.DB.prepare(`
    SELECT v.codigo_vendedor
    FROM usuarios_vendedores v
    INNER JOIN users u
      ON u.id = v.user_id
    WHERE v.user_id = ?
  `).bind(usuarioId).first();

  if (!vinculo || !String(vinculo.codigo_vendedor ?? '').trim()) {
    return resposta({
      error: 'Selecione um usuário com código de vendedor vinculado.'
    }, 400);
  }

  if (
    anterior &&
    anterior.codigo_origem !== String(vinculo.codigo_vendedor)
  ) {
    return resposta({
      error:
        'O código de vendedor vinculado ao usuário mudou. ' +
        'Revise esse vínculo antes de alterar as comissões.'
    }, 409);
  }

  const [clientes, redes] = await Promise.all([
    carregarClientesRentabilidade(env),
    listarRedesRentabilidade(env)
  ]);

  let cadastro;

  try {
    cadastro = validarCadastro(dados, clientes, redes);
  } catch (erro) {
    return resposta({ error: erro.message }, 400);
  }

  const revisao = anterior ? anterior.revisao + 1 : 1;
  const agora = new Date().toISOString();
  const autor = acesso.session.username;
  const conteudo = JSON.stringify(cadastro);

  const gravarCadastro = anterior
    ? env.DB.prepare(`
        UPDATE comissao_vendedores
        SET
          revisao = ?,
          dados = ?,
          atualizado_em = ?,
          atualizado_por = ?
        WHERE id = ?
          AND revisao = ?
      `).bind(
        revisao,
        conteudo,
        agora,
        autor,
        id,
        anterior.revisao
      )
    : env.DB.prepare(`
        INSERT INTO comissao_vendedores (
          id,
          user_id,
          origem,
          codigo_origem,
          revisao,
          dados,
          atualizado_em,
          atualizado_por
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        usuarioId,
        'sankhya',
        String(vinculo.codigo_vendedor),
        revisao,
        conteudo,
        agora,
        autor
      );

  const gravarHistorico = env.DB.prepare(`
    INSERT INTO comissao_cadastro_historico (
      vendedor_id,
      revisao,
      dados,
      criado_em,
      criado_por
    )
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    id,
    revisao,
    conteudo,
    agora,
    autor
  );

  try {
    await env.DB.batch([
      gravarCadastro,
      gravarHistorico
    ]);
  } catch (erro) {
    if (/UNIQUE|constraint/i.test(String(erro.message))) {
      return resposta({
        error:
          'O usuário ou código já está cadastrado, ou houve uma ' +
          'alteração simultânea. Recarregue a página.'
      }, 409);
    }

    throw erro;
  }

  return resposta(
    { id, revisao },
    anterior ? 200 : 201
  );
}
