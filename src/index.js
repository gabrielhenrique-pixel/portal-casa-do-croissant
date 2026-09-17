import { investimentosPage } from './pages/investimentos.js';
import { investimentosListaPage } from './pages/investimentos-lista.js';
import { investimentosPendentesPage } from './pages/investimentos-pendentes.js';
import { usuariosPage } from './pages/usuarios.js';
import { registroUsuarioPage } from './pages/registro-usuario.js';
import { historicoAcoesPage } from './pages/historico-acoes.js';
import { devolucoesPage } from './pages/devolucoes.js';
import { acessosPage } from './pages/acessos.js';
import { rentabilidadeSkuPage } from './pages/rentabilidade-sku.js';
import { listarRentabilidadeSkuSankhya } from './rentabilidade-sku-service.js';
import {carregarClientesRentabilidade,atualizarPercentuaisClienteRentabilidade,atualizarClientesRentabilidadeEmLote,sincronizarClientesRentabilidadeSankhya,REDES_RENTABILIDADE} from './clientes-rentabilidade.js';
import { margemRedePage } from './pages/margem-rede.js';
import { listarMargemRedeSankhya } from './margem-rede-service.js';
import {redesRentabilidade,salvarInvestimentoRentabilidade,excluirInvestimento,listarTodosInvestimentos,listarInvestimentosPendentes,informarValorRealInvestimento} from './investimentos-rentabilidade.js';
import { dashboardRentabilidadePage } from './pages/dashboard-rentabilidade.js';
import {carregarMetaFaturamento,salvarMetaFaturamento} from './dashboard-rentabilidade-service.js';
import { dashboardVendasPage } from './pages/dashboard-vendas.js';
import { dashboardsPage } from './pages/dashboards.js';
import {listarMonitoramentoVendasSankhya,salvarMetaVendedor,salvarMetaProduto,salvarMetaEmpresaVendas} from './vendas-monitoramento-service.js';
import { clientesRentabilidadePage } from './pages/clientes-rentabilidade.js';

const SESSION_SECONDS = 8 * 60 * 60;
const PASSWORD_ITERATIONS = 100000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/health') {
        return json({ status: 'ok' });
      }

      if (url.pathname === '/api/status' && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT COUNT(*) AS total FROM users').first();
        return json({ hasUsers: Number(row?.total || 0) > 0 });
      }

      if (url.pathname === '/api/bootstrap' && request.method === 'POST') {
        return bootstrap(request, env);
      }

      if (url.pathname === '/api/login' && request.method === 'POST') {
        return login(request, env);
      }

      if (url.pathname === '/api/logout' && request.method === 'POST') {
        return logout(request, env);
      }

      if (url.pathname === '/api/me' && request.method === 'GET') {
        return currentUser(request, env);
      }

      if (url.pathname === '/investimentos' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return investimentosListaPage();
}

                  if (url.pathname === '/investimentos/novo' && request.method === 'GET') {
        const session = await getSession(request, env);

        if (!session) {
          return redirectToPortal();
        }

        const modules = await getModulesForUser(env, session);
        const investimentos = modules.find(
          (module) => module.id === 'INVESTIMENTOS'
        );

        if (!investimentos?.permissions.create) {
          return redirectToPortal();
        }

        const redes = await redesRentabilidade(env);
        return investimentosPage(session.username, redes);
      }

      if (url.pathname === '/investimentos-pendentes' && request.method === 'GET') {
        const session = await getSession(request, env);

        if (!session) {
          return redirectToPortal();
        }

        const modules = await getModulesForUser(env, session);
        const pendentes = modules.find(
          (module) => module.id === 'INVESTIMENTOS_PENDENTES'
        );

        if (!pendentes?.permissions.view) {
          return redirectToPortal();
        }

        return investimentosPendentesPage();
      }

            if (url.pathname === '/usuarios' && request.method === 'GET') {
        const session = await getSession(request, env);

        if (!session || session.role !== 'Administrador') {
          return redirectToPortal();
        }

        return usuariosPage();
      }

      if (url.pathname === '/registro-usuario' && request.method === 'GET') {
        const session = await getSession(request, env);

        if (!session || session.role !== 'Administrador') {
          return redirectToPortal();
        }

        return registroUsuarioPage();
      }


      if (url.pathname === '/api/users' && request.method === 'GET') {
        return listUsers(request, env);
      }

      if (url.pathname === '/api/users' && request.method === 'POST') {
        return createUser(request, env);
      }

            const userMatch = url.pathname.match(/^\/api\/users\/([^/]+)$/);

      if (userMatch && request.method === 'PUT') {
        return updateUser(request, env, userMatch[1]);
      }

      if (userMatch && request.method === 'DELETE') {
        return deleteUser(request, env, userMatch[1]);
      }


      const permissionMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/permissions$/);
      if (permissionMatch && request.method === 'GET') {
        return userPermissions(request, env, permissionMatch[1]);
      }

      if (permissionMatch && request.method === 'PUT') {
        return saveUserPermissions(request, env, permissionMatch[1]);
      }

      if (url.pathname === '/acessos' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return acessosPage();
}

if (url.pathname === '/api/accesses' && request.method === 'GET') {
  return carregarAcessos(request, env);
}

if (url.pathname === '/api/accesses' && request.method === 'PUT') {
  return salvarAcessos(request, env);
}

if (url.pathname === '/api/accesses' && request.method === 'DELETE') {
  return removerAcessosDosUsuarios(request, env);
}

const acessoUsuarioMatch = url.pathname.match(/^\/api\/accesses\/([^/]+)$/);

if (acessoUsuarioMatch && request.method === 'DELETE') {
  return removerAcessosDoUsuario(request, env, acessoUsuarioMatch[1]);
}

      if (url.pathname === '/historico-acoes' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return new Response(null, {
      status: 302,
      headers: { location: '/' }
    });
  }

  return historicoAcoesPage();
}

if (url.pathname === '/api/audit-log' && request.method === 'GET') {
  return listAuditLog(request, env);
}

      if (url.pathname === '/devolucoes' && request.method === 'GET') {
  const session = await podeConsultarDevolucoes(request, env);

  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { location: '/' }
    });
  }

  return devolucoesPage();
}

if (url.pathname === '/api/devolucoes' && request.method === 'GET') {
  return listarDevolucoesDoSankhya(request, env);
}
      if (url.pathname === '/api/rentabilidade/vendas' && request.method === 'GET') {
  return listarVendasRentabilidadeSankhya(request, env);
}
 if (url.pathname === '/dashboards' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return dashboardsPage();
}

 if (url.pathname === '/dashboard-rentabilidade' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return dashboardRentabilidadePage();
}

      if (url.pathname === '/dashboard-vendas' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return dashboardVendasPage();
}

if (
  url.pathname === '/api/vendas/monitoramento' &&
  request.method === 'GET'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  try {
    const resultado = await listarMonitoramentoVendasSankhya(
      request,
      env
    );

    if (resultado.error) {
      return json(
        { error: resultado.error },
        resultado.status || 400
      );
    }

    return json(resultado);
  } catch (error) {
    console.error('Falha no monitoramento de vendas:', error);

    return json({
      error:
        error.message ||
        'Não foi possível consultar as vendas no Sankhya.'
    }, 502);
  }
}

if (
  url.pathname === '/api/vendas/metas' &&
  request.method === 'PUT'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const resultado = await salvarMetaVendedor(
    env,
    await bodyAsJson(request)
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'META_VENDEDOR_ATUALIZADA',
    'Vendedor: ' +
      resultado.vendedor +
      ' | Meta: R$ ' +
      resultado.meta
  );

  return json({
    meta: resultado
  });
}

if (
  url.pathname === '/api/vendas/meta-empresa' &&
  request.method === 'PUT'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const dados = await bodyAsJson(request);

  const resultado = await salvarMetaEmpresaVendas(
    env,
    dados.meta
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'META_EMPRESA_VENDAS_ATUALIZADA',
    'Meta total: R$ ' + resultado.meta
  );

  return json(resultado);
}

if (
  url.pathname === '/api/vendas/metas-produtos' &&
  request.method === 'PUT'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const resultado = await salvarMetaProduto(
    env,
    await bodyAsJson(request)
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'META_PRODUTO_ATUALIZADA',
    'Produto: ' +
      resultado.produto +
      ' | Meta: R$ ' +
      resultado.meta
  );

  return json({
    meta: resultado
  });
}

if (url.pathname === '/rentabilidade-sku' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return rentabilidadeSkuPage();
}

if (
  url.pathname === '/api/rentabilidade/meta-faturamento' &&
  request.method === 'GET'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  return json({
    metaFaturamento: await carregarMetaFaturamento(env)
  });
}

if (
  url.pathname === '/api/rentabilidade/meta-faturamento' &&
  request.method === 'PUT'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const dados = await bodyAsJson(request);

  const resultado = await salvarMetaFaturamento(
    env,
    dados.metaFaturamento
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'META_FATURAMENTO_ATUALIZADA',
    'Nova meta: R$ ' + resultado.metaFaturamento
  );

  return json({
    metaFaturamento: resultado.metaFaturamento
  });
}     

if (url.pathname === '/api/rentabilidade/sku' && request.method === 'GET') {
  const session = await getSession(request, env);
  return listarRentabilidadeSkuSankhya(request, env, session);
}

      if (url.pathname === '/margem-rede' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return redirectToPortal();
  }

  return margemRedePage();
}

if (
  url.pathname === '/api/rentabilidade/margem-rede' &&
  request.method === 'GET'
) {
  const session = await getSession(request, env);
  return listarMargemRedeSankhya(request, env, session);
}

      if (url.pathname === '/api/investimentos' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  try {
    const investimentos = await listarTodosInvestimentos(env);

    return json({ investimentos });
  } catch (error) {
    return json(
      {
        error: error.message ||
          'Não foi possível carregar os investimentos.'
      },
      500
    );
  }
}

      const investimentoMatch = url.pathname.match(
  /^\/api\/investimentos\/([^/]+)$/
);

if (investimentoMatch && request.method === 'DELETE') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const resultado = await excluirInvestimento(
    env,
    investimentoMatch[1]
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'INVESTIMENTO_EXCLUIDO',
    'Rede: ' + resultado.rede +
      ' | Tipo: ' + resultado.tipo +
      ' | Previsto: R$ ' + resultado.valorPrevisto +
      ' | Real: R$ ' + (resultado.valorReal || 0)
  );

  return json({ ok: true });
}

if (url.pathname === '/api/investimentos' && request.method === 'POST') {
  const session = await getSession(request, env);

  if (!session) {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const modules = await getModulesForUser(env, session);
  const investimentos = modules.find(
    (module) => module.id === 'INVESTIMENTOS'
  );

  if (!investimentos?.permissions.create) {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  try {
    const dados = await bodyAsJson(request);
    const resultado = await salvarInvestimentoRentabilidade(
      env,
      dados,
      session.username
    );

    if (resultado.error) {
      return json({ error: resultado.error }, resultado.status || 400);
    }

    await writeAudit(
      env,
      session.username,
      'INVESTIMENTO_CRIADO',
      'Rede: ' + resultado.rede +
        ' | Período: ' + resultado.inicio + ' até ' + resultado.fim +
        ' | Tipo do valor: ' + resultado.tipoValor
    );

    return json({
      ok: true,
      mensagem: 'Investimento registrado com sucesso.'
    }, 201);
  } catch (error) {
    return json({
      error: error.message || 'Não foi possível salvar o investimento.'
    }, 400);
  }
}

      if (
  url.pathname === '/api/investimentos/pendentes' &&
  request.method === 'GET'
) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  try {
    const investimentos = await listarInvestimentosPendentes(env);

    return json({ investimentos });
  } catch (error) {
    return json(
      {
        error: error.message ||
          'Não foi possível consultar os investimentos pendentes.'
      },
      500
    );
  }
}

const investimentoPendenteMatch = url.pathname.match(
  /^\/api\/investimentos\/([^/]+)\/valor-real$/
);

if (investimentoPendenteMatch && request.method === 'PUT') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const dados = await bodyAsJson(request);

  const resultado = await informarValorRealInvestimento(
    env,
    investimentoPendenteMatch[1],
    dados.valorReal
  );

  if (resultado.error) {
    return json(
      { error: resultado.error },
      resultado.status || 400
    );
  }

  await writeAudit(
    env,
    session.username,
    'VALOR_REAL_INVESTIMENTO_INFORMADO',
    'Rede: ' + resultado.rede +
      ' | Previsto: R$ ' + resultado.valorPrevisto +
      ' | Real: R$ ' + resultado.valorReal
  );

  return json({
    investimento: resultado
  });
}

if (url.pathname === '/api/rentabilidade/clientes' && request.method === 'GET') {
  await requireAdministrator(request, env);

  const clientes = await carregarClientesRentabilidade(env);

  return json({
    total: clientes.length,
    redes: REDES_RENTABILIDADE,
    clientes
  });
}

      if (url.pathname === '/rentabilidade/clientes' && request.method === 'GET') {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return new Response('Acesso não autorizado.', { status: 403 });
  }

  return clientesRentabilidadePage();
}

if (
  url.pathname === '/api/rentabilidade/clientes/sincronizar' &&
  request.method === 'POST'
) {
  const administrador = await requireAdministrator(request, env);
  const token = await obterTokenSankhya(env);

  const linhas = await executarConsultaSankhya(
    token,
    [
      'SELECT PAR.CODPARC, PAR.NOMEPARC,',
      'NVL(PAR.DESCFIN, 0) AS DESCONTO_FINANCEIRO,',
      'NVL(PAR.AD_COMVENDA, 0) AS COMISSAO_VENDA',
      'FROM TGFPAR PAR',
      "WHERE PAR.CLIENTE = 'S'",
      "AND PAR.ATIVO = 'S'",
      'ORDER BY PAR.NOMEPARC'
    ].join(String.fromCharCode(10))
  );

  const resultado = await sincronizarClientesRentabilidadeSankhya(
    env,
    linhas
  );

  await writeAudit(
    env,
    administrador.username,
    'RENTABILIDADE_CLIENTES_SINCRONIZADOS',
    resultado.totalSincronizado +
      ' clientes ativos sincronizados pelo Sankhya.'
  );

  return json(resultado);
}

if (
  url.pathname === '/api/rentabilidade/clientes/lote' &&
  request.method === 'PUT'
) {
  const administrador = await requireAdministrator(request, env);
  const dados = await bodyAsJson(request);

  const resultado = await atualizarClientesRentabilidadeEmLote(
    env,
    dados.codigoParceiros,
    dados.campos,
    administrador.username
  );

  if (resultado.error) {
    return json({ error: resultado.error }, resultado.status || 400);
  }

  await writeAudit(
    env,
    administrador.username,
    'RENTABILIDADE_CLIENTES_EDITADOS_EM_LOTE',
    resultado.totalAtualizado + ' clientes atualizados em lote.'
  );

  return json(resultado);
}

const clienteRentabilidadeMatch =
  url.pathname.match(/^\/api\/rentabilidade\/clientes\/([^/]+)\/percentuais$/);

if (clienteRentabilidadeMatch && request.method === 'PUT') {
  const administrador = await requireAdministrator(request, env);
  const dados = await bodyAsJson(request);
  const resultado = await atualizarPercentuaisClienteRentabilidade(
    env,
    clienteRentabilidadeMatch[1],
    dados,
    administrador.username
  );

  if (resultado.error) {
    return json({ error: resultado.error }, resultado.status);
  }

  await writeAudit(
    env,
    administrador.username,
    'RENTABILIDADE_CLIENTE_PERCENTUAIS_ATUALIZADOS',
    'Percentuais atualizados para ' +
      resultado.cliente.cliente +
      ' (parceiro ' +
      resultado.cliente.codigoParceiro +
      ').'
  );

  return json({ cliente: resultado.cliente });
}

      return new Response(APP_HTML, {
        headers: {
          'content-type': 'text/html; charset=UTF-8',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'same-origin'
        }
      });
    } catch (error) {
      if (error instanceof Response) return error;
      console.error(error);
      return json({ error: 'Não foi possível concluir esta ação.' }, 500);
    }
  }
};

async function bootstrap(request, env) {
  if (!env.SETUP_TOKEN) {
    return json({ error: 'O primeiro acesso ainda não foi configurado.' }, 503);
  }

  const count = await env.DB.prepare('SELECT COUNT(*) AS total FROM users').first();
  if (Number(count?.total || 0) > 0) {
    return json({ error: 'O primeiro acesso já foi criado.' }, 409);
  }

  const data = await bodyAsJson(request);
  if (String(data.setupToken || '') !== env.SETUP_TOKEN) {
    return json({ error: 'Código de configuração inválido.' }, 403);
  }

  const username = normalizeUsername(data.username);
  const email = normalizeEmail(data.email);
  const password = String(data.password || '');
  validateAccount(username, email, password);

  const salt = randomToken(16);
  const passwordHash = await hashPassword(password, salt);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users
       (id, username, email, role, password_hash, password_salt, password_algorithm, created_at)
       VALUES (?, ?, ?, 'Administrador', ?, ?, 'pbkdf2-sha256', ?)`
    ).bind(id, username, email, passwordHash, salt, createdAt),
    env.DB.prepare(
      'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), createdAt, username, 'USUARIO_ADMINISTRADOR_CRIADO', 'Primeiro acesso do Portal Casa do Croissant.')
  ]);

  return createSessionResponse(env, id, username, email, 'Administrador');
}

async function login(request, env) {
  const data = await bodyAsJson(request);
  const username = normalizeUsername(data.username);
  const password = String(data.password || '');

  const user = await env.DB.prepare(
    `SELECT id, username, email, role, password_hash, password_salt, password_algorithm
     FROM users WHERE username = ? COLLATE NOCASE`
  ).bind(username).first();

  if (!user || !await verifyPassword(password, user)) {
  }

  await writeAudit(env, user.username, 'LOGIN_REALIZADO', 'Login realizado com sucesso.');
  return createSessionResponse(env, user.id, user.username, user.email, user.role);
}

async function logout(request, env) {
  const token = getCookie(request, 'portal_session');

  if (token) {
    const tokenHash = await sha256(token);

    await env.DB.prepare(
      'DELETE FROM sessions WHERE id = ?'
    ).bind(tokenHash).run();
  }

  return json({ ok: true }, 200, {
    'set-cookie': expiredSessionCookie()
  });
}

async function currentUser(request, env) {
  const session = await getSession(request, env);
  if (!session) {
    return json({ error: 'Sessão não encontrada.' }, 401);
  }

  const modules = await getModulesForUser(env, session);
  return json({
    user: {
      id: session.user_id,
      username: session.username,
      email: session.email,
      role: session.role
    },
    modules
  });
}

async function requireAdministrator(request, env) {
  const session = await getSession(request, env);
  if (!session) throw new Response(JSON.stringify({ error: 'Sessão não encontrada.' }), { status: 401 });
  if (session.role !== 'Administrador') {
    throw new Response(JSON.stringify({ error: 'Apenas administradores podem concluir esta ação.' }), { status: 403 });
  }
  return session;
}

async function listUsers(request, env) {
  await requireAdministrator(request, env);
  const result = await env.DB.prepare(
    `SELECT users.id, users.username, users.email, users.role, users.created_at,
       COUNT(user_module_permissions.module_id) AS permission_count
     FROM users
     LEFT JOIN user_module_permissions ON user_module_permissions.user_id = users.id
     GROUP BY users.id
     ORDER BY LOWER(users.username)`
  ).all();
  return json({ users: result.results });
}

async function createUser(request, env) {
  const administrator = await requireAdministrator(request, env);
  const data = await bodyAsJson(request);
  const username = normalizeUsername(data.username);
  const email = normalizeEmail(data.email);
  const password = String(data.password || '');
  const role = String(data.role || 'Colaborador');
  validateAccount(username, email, password);
  if (!['Administrador', 'Gestor', 'Colaborador'].includes(role)) {
    return json({ error: 'Perfil de usuário inválido.' }, 400);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const salt = randomToken(16);
  const passwordHash = await hashPassword(password, salt);
  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO users
         (id, username, email, role, password_hash, password_salt, password_algorithm, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pbkdf2-sha256', ?)`
      ).bind(id, username, email, role, passwordHash, salt, createdAt),
      env.DB.prepare(
        'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), createdAt, administrator.username, 'USUARIO_CRIADO', `Usuário ${username} criado com perfil ${role}.`)
    ]);
  } catch (error) {
    if (String(error.message || '').includes('UNIQUE constraint failed')) {
      return json({ error: 'Já existe um usuário com este nome ou e-mail.' }, 409);
    }
    throw error;
  }
  return json({ user: { id, username, email, role, created_at: createdAt } }, 201);
}

async function userPermissions(request, env, userId) {
  await requireAdministrator(request, env);
  const user = await env.DB.prepare('SELECT id, username, role FROM users WHERE id = ?').bind(userId).first();
  if (!user) return json({ error: 'Usuário não encontrado.' }, 404);
  const result = await env.DB.prepare(
    `SELECT modules.id, modules.name, modules.sort_order,
       COALESCE(user_module_permissions.can_view, 0) AS can_view,
       COALESCE(user_module_permissions.can_create, 0) AS can_create,
       COALESCE(user_module_permissions.can_update, 0) AS can_update,
       COALESCE(user_module_permissions.can_delete, 0) AS can_delete,
       COALESCE(user_module_permissions.can_configure, 0) AS can_configure
     FROM modules
     LEFT JOIN user_module_permissions
       ON user_module_permissions.module_id = modules.id
      AND user_module_permissions.user_id = ?
     ORDER BY modules.sort_order`
  ).bind(userId).all();
  return json({ user, modules: result.results });
}

async function updateUser(request, env, userId) {
  const administrator = await requireAdministrator(request, env);

  const targetUser = await env.DB.prepare(
    'SELECT id, username, email, role FROM users WHERE id = ?'
  ).bind(userId).first();

  if (!targetUser) {
    return json({ error: 'Usuário não encontrado.' }, 404);
  }

  const data = await bodyAsJson(request);
  const username = normalizeUsername(data.username);
  const email = normalizeEmail(data.email);
  const role = String(data.role || '');

  if (username.length < 3) {
    return json({ error: 'O usuário precisa ter pelo menos 3 caracteres.' }, 400);
  }

  if (!email.includes('@')) {
    return json({ error: 'Informe um e-mail válido.' }, 400);
  }

  if (!['Administrador', 'Gestor', 'Colaborador'].includes(role)) {
    return json({ error: 'Perfil de usuário inválido.' }, 400);
  }

  if (targetUser.id === administrator.user_id && role !== 'Administrador') {
    return json({ error: 'Você não pode remover seu próprio perfil de administrador.' }, 400);
  }

  if (targetUser.role === 'Administrador' && role !== 'Administrador') {
    const total = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'Administrador'"
    ).first();

    if (Number(total.total) <= 1) {
      return json({ error: 'O último administrador não pode ter o perfil alterado.' }, 400);
    }
  }

  try {
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?'
      ).bind(username, email, role, userId),

      env.DB.prepare(
        'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        new Date().toISOString(),
        administrator.username,
        'USUARIO_ALTERADO',
        'Usuário ' + targetUser.username + ' alterado para ' + username + '.'
      )
    ]);
  } catch (error) {
    if (String(error.message || '').includes('UNIQUE constraint failed')) {
      return json({ error: 'Já existe um usuário com este nome ou e-mail.' }, 409);
    }

    throw error;
  }

  return json({ ok: true });
}

async function deleteUser(request, env, userId) {
  const administrator = await requireAdministrator(request, env);

  const targetUser = await env.DB.prepare(
    'SELECT id, username, role FROM users WHERE id = ?'
  ).bind(userId).first();

  if (!targetUser) {
    return json({ error: 'Usuário não encontrado.' }, 404);
  }

  if (targetUser.id === administrator.user_id) {
    return json({ error: 'Você não pode excluir o próprio usuário.' }, 400);
  }

  if (targetUser.role === 'Administrador') {
    const total = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'Administrador'"
    ).first();

    if (Number(total.total) <= 1) {
      return json({ error: 'O último administrador não pode ser excluído.' }, 400);
    }
  }

  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM user_module_permissions WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId),
    env.DB.prepare(
      'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      new Date().toISOString(),
      administrator.username,
      'USUARIO_EXCLUIDO',
      'Usuário ' + targetUser.username + ' excluído.'
    )
  ]);

  return json({ ok: true });
}

async function saveUserPermissions(request, env, userId) {
  const administrator = await requireAdministrator(request, env);
  const targetUser = await env.DB.prepare('SELECT id, username, role FROM users WHERE id = ?').bind(userId).first();
  if (!targetUser) return json({ error: 'Usuário não encontrado.' }, 404);
  if (targetUser.role === 'Administrador') {
    return json({ error: 'As permissões de administradores são completas e não precisam ser alteradas.' }, 400);
  }
  const data = await bodyAsJson(request);
  const incoming = Array.isArray(data.permissions) ? data.permissions : [];
  const available = await env.DB.prepare('SELECT id FROM modules').all();
  const availableIds = new Set(available.results.map((module) => module.id));
  const timestamp = new Date().toISOString();
  const commands = [];
  for (const item of incoming) {
    if (!availableIds.has(item.moduleId)) continue;
    const allowed = (value) => value ? 1 : 0;
    commands.push(env.DB.prepare(
      `INSERT INTO user_module_permissions
       (user_id, module_id, can_view, can_create, can_update, can_delete, can_configure, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, module_id) DO UPDATE SET
         can_view = excluded.can_view, can_create = excluded.can_create,
         can_update = excluded.can_update, can_delete = excluded.can_delete,
         can_configure = excluded.can_configure, updated_at = excluded.updated_at,
         updated_by = excluded.updated_by`
    ).bind(userId, item.moduleId, allowed(item.view), allowed(item.create), allowed(item.update), allowed(item.delete), allowed(item.configure), timestamp, administrator.username));
  }
  if (commands.length) await env.DB.batch(commands);
  await writeAudit(env, administrator.username, 'PERMISSOES_ATUALIZADAS', `Permissões atualizadas para ${targetUser.username}.`);
  return json({ ok: true });
}

async function carregarAcessos(request, env) {
  await requireAdministrator(request, env);

  const resultados = await Promise.all([
    env.DB.prepare(
      "SELECT id, name, sort_order FROM modules WHERE id <> 'INICIO' ORDER BY sort_order"
    ).all(),

    env.DB.prepare(
      `SELECT id, username, email, role
       FROM users
       ORDER BY LOWER(username)`
    ).all(),

    env.DB.prepare(
      `SELECT user_id, module_id,
              can_view, can_create, can_update,
              can_delete, can_configure
       FROM user_module_permissions`
    ).all()
  ]);

  return json({
    modules: resultados[0].results || [],
    users: resultados[1].results || [],
    grants: resultados[2].results || []
  });
}

async function salvarAcessos(request, env) {
  const administrator = await requireAdministrator(request, env);
  const data = await bodyAsJson(request);

  const userIds = Array.isArray(data.userIds)
    ? [...new Set(data.userIds.map(String))]
    : [];

  const moduleIds = Array.isArray(data.moduleIds)
    ? [...new Set(data.moduleIds.map(String))]
    : [];

  if (!userIds.length) {
    return json({ error: 'Selecione ao menos um usuário.' }, 400);
  }

  if (!moduleIds.length) {
    return json({ error: 'Selecione ao menos um módulo.' }, 400);
  }

  const usuarios = await env.DB.prepare(
    `SELECT id, username, role
     FROM users
     WHERE id IN (${userIds.map(() => '?').join(', ')})`
  ).bind(...userIds).all();

  if ((usuarios.results || []).length !== userIds.length) {
    return json({ error: 'Um ou mais usuários não foram encontrados.' }, 404);
  }

  if (usuarios.results.some((usuario) => usuario.role === 'Administrador')) {
    return json({
      error: 'Administradores já possuem todos os acessos.'
    }, 400);
  }

  const modulosDisponiveis = await env.DB.prepare(
    "SELECT id FROM modules WHERE id <> 'INICIO'"
  ).all();

  const idsValidos = new Set(
    (modulosDisponiveis.results || []).map((modulo) => modulo.id)
  );

  const selecionados = moduleIds.filter((id) => idsValidos.has(id));

  if (!selecionados.length) {
    return json({ error: 'Nenhum módulo válido foi selecionado.' }, 400);
  }

  const permissoes = data.permissions || {};

  if (![
    permissoes.view,
    permissoes.create,
    permissoes.update,
    permissoes.delete,
    permissoes.configure
  ].some(Boolean)) {
    return json({
      error: 'Selecione ao menos um tipo de acesso.'
    }, 400);
  }

  const permitido = (valor) => valor ? 1 : 0;
  const atualizadoEm = new Date().toISOString();
  const comandos = [];

  usuarios.results.forEach((usuario) => {
    selecionados.forEach((moduleId) => {
      comandos.push(
        env.DB.prepare(
          `INSERT INTO user_module_permissions
           (user_id, module_id, can_view, can_create, can_update,
            can_delete, can_configure, updated_at, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id, module_id) DO UPDATE SET
             can_view = excluded.can_view,
             can_create = excluded.can_create,
             can_update = excluded.can_update,
             can_delete = excluded.can_delete,
             can_configure = excluded.can_configure,
             updated_at = excluded.updated_at,
             updated_by = excluded.updated_by`
        ).bind(
          usuario.id,
          moduleId,
          permitido(permissoes.view),
          permitido(permissoes.create),
          permitido(permissoes.update),
          permitido(permissoes.delete),
          permitido(permissoes.configure),
          atualizadoEm,
          administrator.username
        )
      );
    });
  });

  comandos.push(
    env.DB.prepare(
      'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      atualizadoEm,
      administrator.username,
      'ACESSOS_ATUALIZADOS',
      'Acessos atualizados para ' + usuarios.results.length + ' usuário(s).'
    )
  );

  await env.DB.batch(comandos);

  return json({ ok: true });
}

async function removerAcessosDosUsuarios(request, env) {
  const administrator = await requireAdministrator(request, env);
  const data = await bodyAsJson(request);

  const userIds = Array.isArray(data.userIds)
    ? [...new Set(data.userIds.map(String))]
    : [];

  if (!userIds.length) {
    return json({ error: 'Selecione ao menos um usuário.' }, 400);
  }

  const usuarios = await env.DB.prepare(
    `SELECT id, username, role
     FROM users
     WHERE id IN (${userIds.map(() => '?').join(', ')})`
  ).bind(...userIds).all();

  if ((usuarios.results || []).length !== userIds.length) {
    return json({ error: 'Um ou mais usuários não foram encontrados.' }, 404);
  }

  if (usuarios.results.some((usuario) => usuario.role === 'Administrador')) {
    return json({
      error: 'Administradores já possuem todos os acessos.'
    }, 400);
  }

  const comandos = usuarios.results.map((usuario) =>
    env.DB.prepare(
      'DELETE FROM user_module_permissions WHERE user_id = ?'
    ).bind(usuario.id)
  );

  comandos.push(
    env.DB.prepare(
      'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      new Date().toISOString(),
      administrator.username,
      'ACESSOS_REMOVIDOS',
      'Acessos removidos de ' + usuarios.results.length + ' usuário(s).'
    )
  );

  await env.DB.batch(comandos);

  return json({ ok: true });
}

async function removerAcessosDoUsuario(request, env, userId) {
  const administrator = await requireAdministrator(request, env);

  const usuario = await env.DB.prepare(
    'SELECT id, username, role FROM users WHERE id = ?'
  ).bind(userId).first();

  if (!usuario) {
    return json({ error: 'Usuário não encontrado.' }, 404);
  }

  if (usuario.role === 'Administrador') {
    return json({
      error: 'Administradores já possuem todos os acessos.'
    }, 400);
  }

  await env.DB.batch([
    env.DB.prepare(
      'DELETE FROM user_module_permissions WHERE user_id = ?'
    ).bind(userId),

    env.DB.prepare(
      'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      new Date().toISOString(),
      administrator.username,
      'ACESSOS_REMOVIDOS',
      'Todos os acessos de ' + usuario.username + ' foram removidos.'
    )
  ]);

  return json({ ok: true });
}

async function getModulesForUser(env, user) {
  if (user.role === 'Administrador') {
    const result = await env.DB.prepare(
      'SELECT id, name, sort_order FROM modules ORDER BY sort_order'
    ).all();
    return result.results.map((module) => ({
      ...module,
      permissions: { view: true, create: true, update: true, delete: true, configure: true }
    }));
  }

  const result = await env.DB.prepare(
    `SELECT modules.id, modules.name, modules.sort_order,
       user_module_permissions.can_view, user_module_permissions.can_create,
       user_module_permissions.can_update, user_module_permissions.can_delete,
       user_module_permissions.can_configure
     FROM user_module_permissions
     JOIN modules ON modules.id = user_module_permissions.module_id
     WHERE user_module_permissions.user_id = ?
       AND user_module_permissions.can_view = 1
     ORDER BY modules.sort_order`
  ).bind(user.user_id).all();

  return result.results.map((module) => ({
    id: module.id,
    name: module.name,
    sort_order: module.sort_order,
    permissions: {
      view: Boolean(module.can_view),
      create: Boolean(module.can_create),
      update: Boolean(module.can_update),
      delete: Boolean(module.can_delete),
      configure: Boolean(module.can_configure)
    }
  }));
}

async function createSessionResponse(env, userId, username, email, role) {
  const token = randomToken(32);
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000).toISOString();

  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(tokenHash, userId, expiresAt, new Date().toISOString()).run();

  return json({
    user: { id: userId, username, email, role }
  }, 200, { 'set-cookie': sessionCookie(token) });
}

async function getSession(request, env) {
  const token = getCookie(request, 'portal_session');
  if (!token) return null;

  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const session = await env.DB.prepare(
    `SELECT sessions.id, users.id AS user_id, users.username, users.email, users.role
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = ? AND sessions.expires_at > ?`
  ).bind(tokenHash, now).first();

  if (!session) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(tokenHash).run();
  }
  return session || null;
}

async function listAuditLog(request, env) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  const resultado = await env.DB.prepare(
    `SELECT created_at, username, action, detail
     FROM audit_log
     WHERE UPPER(action) NOT LIKE '%LOGIN%'
       AND UPPER(action) NOT LIKE '%LOGOUT%'
     ORDER BY created_at DESC
     LIMIT 500`
  ).all();

  return json({ items: resultado.results || [] });
}

async function podeConsultarDevolucoes(request, env) {
  const session = await getSession(request, env);

  if (!session) {
    return null;
  }

  if (session.role === 'Administrador') {
    return session;
  }

  const modulos = await getModulesForUser(env, session);
  const devolucoes = modulos.find(function(modulo) {
    return modulo.id === 'DEVOLUCOES';
  });

  return devolucoes && devolucoes.permissions && devolucoes.permissions.view
    ? session
    : null;
}

async function listarDevolucoesDoSankhya(request, env) {
  const session = await podeConsultarDevolucoes(request, env);

  if (!session) {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  if (!env.SANKHYA_CLIENT_ID ||
      !env.SANKHYA_CLIENT_SECRET ||
      !env.SANKHYA_X_TOKEN) {
    return json({
      error: 'A integração com o Sankhya ainda não foi configurada.'
    }, 503);
  }

  const url = new URL(request.url);
  const hoje = new Date();
  const mesAnterior = new Date();
  mesAnterior.setMonth(mesAnterior.getMonth() - 1);

  const inicio = dataSankhyaValida(
    url.searchParams.get('inicio'),
    mesAnterior
  );

  const fim = dataSankhyaValida(
    url.searchParams.get('fim'),
    hoje
  );

  try {
    const accessToken = await obterTokenSankhya(env);

    const sqlDevolucoes = [
      'SELECT',
      '  TRUNC(CAB.DTNEG) AS DATA,',
      '  CAB.NUNOTA AS NUMERO_NOTA,',
      '  PAR.CODPARC AS COD_PARCEIRO,',
      '  PAR.NOMEPARC AS PARCEIRO,',
      '  PRO.DESCRPROD AS PRODUTO,',
      '  ITE.QTDNEG AS QTD_NEG,',
      '  ITE.VLRUNIT AS VLR_UNITARIO,',
      '  ITE.VLRTOT AS VALOR_TOTAL',
      'FROM TGFITE ITE',
      'INNER JOIN TGFCAB CAB ON CAB.NUNOTA = ITE.NUNOTA',
      'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
      'LEFT JOIN TGFPAR PAR ON PAR.CODPARC = CAB.CODPARC',
      "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
      "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
      '  AND CAB.CODTIPOPER = 1202',
      "  AND CAB.TIPMOV = 'D'",
      "  AND CAB.STATUSNOTA = 'L'",
      'ORDER BY CAB.DTNEG DESC'
    ].join('\n'); 

    const sqlFaturamento = [
      'SELECT',
      '  NVL(SUM(CAB.VLRNOTA), 0) AS FATURAMENTO',
      'FROM TGFCAB CAB',
      'INNER JOIN TGFTOP TOP',
      '  ON TOP.CODTIPOPER = CAB.CODTIPOPER',
      ' AND TOP.DHALTER = CAB.DHTIPOPER',
      "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
      "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
      "  AND CAB.TIPMOV = 'V'",
      "  AND CAB.STATUSNOTA = 'L'",
      "  AND UPPER(TRIM(TOP.DESCROPER)) = 'VENDA NF-E'"
    ].join(String.fromCharCode(10));

    const resultados = await Promise.all([
      executarConsultaSankhya(accessToken, sqlDevolucoes),
      executarConsultaSankhya(accessToken, sqlFaturamento)
    ]);

    const itens = resultados[0].map(function(linha) {
      return {
        data: converterDataSankhya(linha[0]),
        numeroNota: String(linha[1] || ''),
        codigoParceiro: String(linha[2] || ''),
        parceiro: String(linha[3] || ''),
        produto: String(linha[4] || ''),
        quantidade: numeroSankhya(linha[5]),
        valorUnitario: numeroSankhya(linha[6]),
        valorTotal: numeroSankhya(linha[7])
      };
    });

    const faturamento = resultados[1].length
      ? numeroSankhya(resultados[1][0][0])
      : 0;

    return json({
      items: itens,
      faturamento: faturamento
    });
  } catch (error) {
  console.error('Falha na consulta ao Sankhya:', error);

  return json({
    error: error.message || 'Não foi possível consultar as devoluções no Sankhya.'
  }, 502);
}
}

async function listarVendasRentabilidadeSankhya(request, env) {
  const session = await getSession(request, env);

  if (!session || session.role !== 'Administrador') {
    return json({ error: 'Acesso não autorizado.' }, 403);
  }

  if (!env.SANKHYA_CLIENT_ID ||
      !env.SANKHYA_CLIENT_SECRET ||
      !env.SANKHYA_X_TOKEN) {
    return json({
      error: 'A integração com o Sankhya ainda não foi configurada.'
    }, 503);
  }

  const url = new URL(request.url);
  const hoje = new Date();
  const mesAnterior = new Date(hoje);
  mesAnterior.setMonth(mesAnterior.getMonth() - 1);

  const inicio = dataSankhyaValida(
    url.searchParams.get('inicio'),
    mesAnterior
  );
  const fim = dataSankhyaValida(
    url.searchParams.get('fim'),
    hoje
  );

  try {
  const clientes = await carregarClientesRentabilidade(env);
  const clientesPorCodigo = new Map(
    clientes.map((cliente) => [cliente.codigoParceiro, cliente])
  );

  const accessToken = await obterTokenSankhya(env);

    const sqlVendas = [
      'SELECT',
      '  TRUNC(CAB.DTNEG) AS DATA,',
      '  CAB.NUNOTA AS NUMERO_NOTA,',
      '  PAR.CODPARC AS COD_PARCEIRO,',
      '  PAR.NOMEPARC AS PARCEIRO,',
      '  PRO.CODPROD AS COD_PRODUTO,',
      '  PRO.DESCRPROD AS PRODUTO,',
      '  ITE.QTDNEG AS QTD_NEG,',
      '  (NVL(ITE.VLRTOT, 0) - NVL(ITE.VLRDESC, 0)) AS VLR_LIQUIDO,',
      '  NVL(ITE.VLRSUBST, 0) AS VLR_ST',
      'FROM TGFITE ITE',
      'INNER JOIN TGFCAB CAB ON CAB.NUNOTA = ITE.NUNOTA',
      'INNER JOIN TGFTOP TOP',
      '  ON TOP.CODTIPOPER = CAB.CODTIPOPER',
      ' AND TOP.DHALTER = CAB.DHTIPOPER',
      'LEFT JOIN TGFPAR PAR ON PAR.CODPARC = CAB.CODPARC',
      'LEFT JOIN TGFPRO PRO ON PRO.CODPROD = ITE.CODPROD',
      "WHERE CAB.DTNEG >= TO_DATE('" + inicio + "', 'YYYY-MM-DD')",
      "  AND CAB.DTNEG < TO_DATE('" + fim + "', 'YYYY-MM-DD') + 1",
      "  AND CAB.TIPMOV = 'V'",
      "  AND CAB.STATUSNOTA = 'L'",
      '  AND CAB.CODTIPOPER = 1101',
      'ORDER BY CAB.DTNEG DESC, CAB.NUNOTA DESC, ITE.SEQUENCIA ASC'
    ].join(String.fromCharCode(10));

    const linhas = await executarConsultaSankhya(accessToken, sqlVendas);

    const items = linhas.map(function(linha) {
    const valorLiquido = numeroSankhya(linha[7]);
    const valorSt = numeroSankhya(linha[8]);
    const clienteCadastrado = clientesPorCodigo.get(
  String(linha[2] || '')
);

      return {
        data: converterDataVendasRentabilidade(linha[0]),
        numeroNota: String(linha[1] || ''),
        codigoParceiro: String(linha[2] || ''),
        parceiro: String(linha[3] || ''),
        cliente: clienteCadastrado
        ? clienteCadastrado.cliente
        : String(linha[3] || ''),
        rede: clienteCadastrado ? clienteCadastrado.rede : null,
        percentualContrato: clienteCadastrado
        ? clienteCadastrado.percentualContrato
        : null,
        percentualPromotoria: clienteCadastrado
        ? clienteCadastrado.percentualPromotoria
        : null,
        percentualComissao: clienteCadastrado
        ? clienteCadastrado.percentualComissao
        : null,
        codigoProduto: String(linha[4] || ''),
        produto: String(linha[5] || ''),
        quantidade: numeroSankhya(linha[6]),
        valorLiquido: valorLiquido,
        valorSt: valorSt,
        faturamentoBruto: valorLiquido + valorSt
      };
    });

    const resumo = items.reduce(function(total, item) {
      total.valorLiquido += item.valorLiquido;
      total.valorSt += item.valorSt;
      total.faturamentoBruto += item.faturamentoBruto;
      return total;
    }, {
      valorLiquido: 0,
      valorSt: 0,
      faturamentoBruto: 0
    });

    return json({
      inicio: inicio,
      fim: fim,
      totalItens: items.length,
      valorLiquido: resumo.valorLiquido,
      valorSt: resumo.valorSt,
      faturamentoBruto: resumo.faturamentoBruto,
      items: items
    });
  } catch (error) {
    console.error('Falha na consulta de vendas para rentabilidade:', error);

    return json({
      error: error.message || 'Não foi possível consultar as vendas no Sankhya.'
    }, 502);
  }
}

function converterDataVendasRentabilidade(valor) {
  const texto = String(valor || '').trim();

  const iso = texto.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return iso[1] + '-' + iso[2] + '-' + iso[3];
  }

  const brasileiro = texto.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (brasileiro) {
    return brasileiro[3] + '-' + brasileiro[2] + '-' + brasileiro[1];
  }

  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  if (/^(19|20)\d{6}$/.test(numeros)) {
    return numeros.slice(0, 4) + '-' +
      numeros.slice(4, 6) + '-' +
      numeros.slice(6, 8);
  }

  if (/^\d{8}$/.test(numeros)) {
    return numeros.slice(4, 8) + '-' +
      numeros.slice(2, 4) + '-' +
      numeros.slice(0, 2);
  }

  return '';
}


async function obterTokenSankhya(env) {
  const resposta = await fetch('https://api.sankhya.com.br/authenticate', {
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
  });

  if (!resposta.ok) {
    throw new Error('Autenticação Sankhya recusada.');
  }

  const dados = await resposta.json();

  if (!dados.access_token) {
    throw new Error('O Sankhya não retornou um token de acesso.');
  }

  return dados.access_token;
}

async function executarConsultaSankhya(accessToken, sql) {
  const resposta = await fetch(
    'https://api.sankhya.com.br/gateway/v1/mge/service.sbr' +
    '?serviceName=DbExplorerSP.executeQuery&outputType=json',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: {
          sql: sql
        }
      })
    }
  );

  if (!resposta.ok) {
    throw new Error('Consulta Sankhya recusada.');
  }

  const dados = await resposta.json();

if (String(dados.status || '') === '0') {
  throw new Error(
    dados.statusMessage ||
    'O Sankhya recusou a consulta.'
  );
}

if (!dados.responseBody || !Array.isArray(dados.responseBody.rows)) {
  throw new Error(
    dados.statusMessage ||
    'O Sankhya retornou uma resposta sem linhas.'
  );
}

return dados.responseBody.rows;
}

function dataSankhyaValida(valor, padrao) {
  const texto = String(valor || '').trim();

if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  return padrao.toISOString().slice(0, 10);
}

function converterDataSankhya(valor) {
  const texto = String(valor || '');

  const formatoIso = texto.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (formatoIso) {
    return formatoIso[1] + '-' +
      formatoIso[2] + '-' +
      formatoIso[3];
  }

  const numeros = texto.replace(/\D/g, '');

  if (numeros.length >= 8) {
    return numeros.slice(4, 8) + '-' +
      numeros.slice(2, 4) + '-' +
      numeros.slice(0, 2);
  }

  return '';
}

function numeroSankhya(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  let texto = String(valor || '').trim();

  if (texto.includes(',')) {
  texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : 0;
}

async function writeAudit(env, username, action, detail) {
  await env.DB.prepare(
    'INSERT INTO audit_log (id, created_at, username, action, detail) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), new Date().toISOString(), username, action, detail).run();
}

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validateAccount(username, email, password) {
  if (username.length < 3) throw new Error('O usuário precisa ter pelo menos 3 caracteres.');
  if (!email.includes('@')) throw new Error('Informe um e-mail válido.');
  if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
}

async function verifyPassword(password, user) {
  if (user.password_algorithm !== 'pbkdf2-sha256') return false;
  return (await hashPassword(password, user.password_salt)) === user.password_hash;
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: base64UrlToBytes(salt),
    iterations: PASSWORD_ITERATIONS,
    hash: 'SHA-256'
  }, key, 256);
  return bytesToBase64Url(new Uint8Array(bits));
}

async function sha256(value) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(buffer));
}

function randomToken(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function bytesToBase64Url(bytes) {
  let text = '';
  bytes.forEach((byte) => { text += String.fromCharCode(byte); });
  return btoa(text).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlToBytes(value) {
  const padded = String(value).replaceAll('-', '+').replaceAll('_', '/')
    + '='.repeat((4 - String(value).length % 4) % 4);
  const text = atob(padded);
  return Uint8Array.from(text, (character) => character.charCodeAt(0));
}

function getCookie(request, name) {
  const value = request.headers.get('cookie') || '';
  const item = value.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function sessionCookie(token) {
  return `portal_session=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

function expiredSessionCookie() {
  return 'portal_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict';
}

async function bodyAsJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function redirectToPortal() {
  return new Response(null, {
    status: 302,
    headers: { location: '/' }
  });
}

const APP_HTML = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portal Casa do Croissant</title>
    <style>
      :root { color-scheme:light; --verde:#1b744d; --texto:#123d2d; --erro:#a52b20; }
      * { box-sizing:border-box; }
      body { margin:0; min-height:100vh; font-family:Arial,sans-serif; }
      .tela-login { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(rgba(8,35,25,.58),rgba(8,35,25,.58)),url('https://drive.google.com/thumbnail?id=1x2lOopgDUcTsdDeytSn6Mo_-TgjlaS03&sz=w1920'); background-size:cover; background-position:center; }
      .cartao-login { width:100%; max-width:390px; padding:30px; border-radius:14px; background:rgba(255,255,255,.90); box-shadow:0 15px 45px rgba(0,0,0,.35); text-align:center; }
      .cartao-login h1 { color:var(--texto); margin:0 0 18px; font-size:28px; }
      .logo-login { width:240px; max-width:100%; height:100px; object-fit:contain; margin:0 auto 18px; filter:brightness(0) saturate(100%) invert(20%) sepia(24%) saturate(1217%) hue-rotate(104deg); }
      .campo-login { display:flex; align-items:center; height:40px; margin-bottom:24px; overflow:hidden; border:1px solid #d9dfe6; border-radius:6px; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,.18); transition:.15s; }
      .campo-login:focus-within { border-color:#76a9fa; box-shadow:0 0 0 3px rgba(118,169,250,.45); }
      .campo-login span { display:flex; align-items:center; justify-content:center; width:42px; height:100%; flex-shrink:0; border-right:1px solid #d9dfe6; color:#000; }
      .campo-login svg { width:26px; height:26px; fill:#000; }
      .campo-login input { width:100%; height:100%; border:0; outline:0; padding:0 10px; color:#444; font-size:15px; background:#fff; }
      .botao-entrar { width:100%; border:0; border-radius:7px; padding:12px; background:var(--verde); color:#fff; font-size:15px; font-weight:700; cursor:pointer; transition:transform .12s ease,background .18s ease,box-shadow .18s ease; }
      .botao-entrar:hover { background:#35ad69; box-shadow:0 5px 12px rgba(27,116,77,.28); transform:translateY(-1px); }
      .botao-entrar:active { transform:scale(.96); background:#126d37; box-shadow:none; }
      .botao-entrar:disabled { cursor:wait; background:#126d37; }
      .botao-entrar.entrando { display:flex; align-items:center; justify-content:center; gap:9px; }
      .botao-entrar.entrando::before { content:''; width:14px; height:14px; border:2px solid rgba(255,255,255,.45); border-top-color:#fff; border-radius:50%; animation:girarLogin .7s linear infinite; }
      .link-recuperar { width:100%; margin-top:12px; border:0; background:transparent; color:var(--verde); font-size:14px; font-weight:bold; cursor:pointer; }
      .mensagem { min-height:18px; margin-top:16px; color:var(--erro); font-size:14px; }
      .oculto { display:none !important; }
      body.inicializando #login,
body.inicializando #setup,
body.inicializando #dashboard {
  display: none !important;
}

#inicializacao {
  display: none;
  min-height: 100vh;
  place-items: center;
  background: #f6f8f7;
  color: #123d2d;
  font-family: Arial, sans-serif;
  font-weight: 700;
}

body.inicializando #inicializacao {
  display: grid;
}
      .tela { min-height:100vh; display:grid; place-items:center; padding:24px; background:linear-gradient(135deg,#f5faf7,#eef4f1); }
      .cartao { width:min(100%,440px); background:#fff; border:1px solid #d6e4dd; border-radius:18px; padding:34px; box-shadow:0 16px 42px rgba(5,57,37,.12); }
      .cartao label { display:block; margin:16px 0 7px; font-size:13px; font-weight:700; }.cartao input{width:100%;padding:13px 14px;border:1px solid #bdd1c7;border-radius:9px;font-size:16px;}.cartao button{width:100%;border:0;border-radius:9px;padding:13px 16px;margin-top:22px;background:#075638;color:#fff;font-size:15px;font-weight:700;cursor:pointer;}
      .link { display:block; width:100%; margin-top:14px; background:transparent!important; color:#075638!important; text-decoration:underline; }.erro{min-height:20px;margin-top:14px;color:var(--erro);font-size:14px;}
      .painel { min-height:100vh; display:flex; background:#f6f8f7; color:#183128; }.menu { width:250px; min-height:100vh; flex-shrink:0; padding:28px 16px; background:#123d2d; color:#fff; }.marca-portal { padding:4px 12px 28px; font-size:20px; font-weight:700; }.marca-portal small { display:block; margin-top:6px; color:#b7d7c6; font-size:12px; font-weight:400; }.nav-btn { display:block; width:100%; margin:4px 0; padding:13px 12px; border:0; border-radius:8px; background:transparent; color:#d7e9df; text-align:left; font-size:14px; cursor:pointer; }.nav-btn:hover,.nav-btn.ativo { background:#256e50; color:#fff; }.nav-btn--sair { margin-top:24px; border-top:1px solid rgba(255,255,255,.18); border-radius:0; padding-top:19px; }.conteudo { flex:1; min-width:0; padding:38px; }.topo{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;}.topo h1{margin:0 0 8px;font-size:27px;}.topo p{margin:0;color:#66746d;}.tag{display:inline-block;padding:6px 10px;border-radius:999px;background:#e9f4ee;color:#075638;font-weight:700;font-size:13px;}.visao{max-width:940px;margin:42px auto 0;}.boas-vindas{padding:38px;text-align:center;background:#fff;border:1px solid #d6e4dd;border-radius:18px;}.boas-vindas p{max-width:620px;margin:12px auto;color:#52665d;}.grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-top:22px;}.cartao-modulo{padding:20px;border:1px solid #d6e4dd;border-radius:14px;background:#fff;}.cartao-modulo strong{display:block;color:#123d2d;}.cartao-modulo span{display:block;margin-top:7px;color:#66746d;font-size:13px;}.acao{border:0;border-radius:8px;padding:11px 14px;background:#075638;color:#fff;font-weight:700;cursor:pointer;}.acao-secundaria{border:1px solid #a8c5b5;border-radius:8px;padding:10px 13px;background:#fff;color:#075638;font-weight:700;cursor:pointer;}.painel-cabecalho{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;}.tabela-wrap{overflow:auto;border:1px solid #d6e4dd;border-radius:12px;background:#fff;}.tabela{width:100%;border-collapse:collapse;min-width:640px;}.tabela th,.tabela td{padding:14px 16px;border-bottom:1px solid #edf2ef;text-align:left;font-size:14px;}.tabela th{color:#52665d;font-size:12px;text-transform:uppercase;letter-spacing:.04em;}.formulario{max-width:640px;padding:24px;border:1px solid #d6e4dd;border-radius:14px;background:#fff;}.linha-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;}.formulario label{display:block;margin:14px 0 6px;font-size:13px;font-weight:700;}.formulario input,.formulario select{width:100%;padding:11px 12px;border:1px solid #bdd1c7;border-radius:8px;font:inherit;}.acoes-form{display:flex;gap:10px;margin-top:20px;}.permissoes{display:grid;gap:12px;}.permissao-item{padding:16px;border:1px solid #d6e4dd;border-radius:12px;background:#fff;}.permissao-titulo{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px;font-weight:700;}.checks{display:flex;flex-wrap:wrap;gap:13px;}.checks label{display:flex;gap:5px;align-items:center;font-size:13px;color:#52665d;}.vazio{padding:30px;text-align:center;color:#66746d;border:1px dashed #bdd1c7;border-radius:12px;background:#fff;}.erro{min-height:20px;margin-top:14px;color:var(--erro);font-size:14px;}
      @keyframes girarLogin { to { transform:rotate(360deg); } }
      @media (max-width:700px) { .painel{display:block;}.menu{width:100%;min-height:auto;padding:16px;}.marca-portal{padding:4px 8px 12px;}.menu nav{display:flex;overflow:auto;gap:4px;}.nav-btn{width:auto;white-space:nowrap;margin:0;}.nav-btn--sair{margin-top:0;border-top:0;padding-top:13px;}.conteudo{padding:22px;}.topo{align-items:flex-start;flex-direction:column;}.linha-form{grid-template-columns:1fr;}.grade-dashboards{grid-template-columns:1fr;}.cartao { padding:26px; } }
    </style>
  </head>
  <body class="inicializando">
  <div id="inicializacao" role="status">Carregando portal...</div>
    <section id="login" class="tela-login">
      <form id="formLogin" class="cartao-login">
        <h1>Acesso Portal</h1>
        <img class="logo-login" src="https://drive.google.com/thumbnail?id=1Y3rY3y3t4C636I2snLRVWHcNv4JZEaQt&sz=w1000" alt="Casa do Croissant">
        <div class="campo-login"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"></path></svg></span><input id="username" placeholder="Usuário" autocomplete="username" required></div>
        <div class="campo-login"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10h14V10a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V6zm3 9.73V18h-2v-2.27A2 2 0 1 1 13 15.73z"></path></svg></span><input id="password" type="password" placeholder="Senha" autocomplete="current-password" required></div>
        <button id="loginButton" class="botao-entrar" type="submit">↪ Entrar</button>
        <button id="forgotPassword" type="button" class="link-recuperar">Esqueci minha senha</button>
        <button id="setupLink" type="button" class="link oculto">Configurar primeiro acesso</button>
        <div id="loginError" class="mensagem" role="alert"></div>
      </form>
    </section>

    <section id="setup" class="tela oculto">
      <form id="formSetup" class="cartao">
        <div class="marca"><div class="marca__icone">C</div><div><h1>Primeiro acesso</h1><small>Configuração protegida</small></div></div>
        <p>Crie o administrador inicial do portal novo.</p>
        <label for="setupUsername">Usuário</label><input id="setupUsername" autocomplete="username" required>
        <label for="setupEmail">E-mail</label><input id="setupEmail" type="email" autocomplete="email" required>
        <label for="setupPassword">Nova senha</label><input id="setupPassword" type="password" autocomplete="new-password" minlength="8" required>
        <label for="setupToken">Código de configuração</label><input id="setupToken" type="password" required>
        <div id="setupError" class="erro" role="alert"></div>
        <button id="setupButton" type="submit">Criar administrador</button>
        <button id="backToLogin" type="button" class="link">Voltar ao login</button>
      </form>
    </section>

    <main id="dashboard" class="painel oculto">
      <aside class="menu">
        <div class="marca-portal">Casa do Croissant<small>Portal interno</small></div>
        <nav id="menuPortal">
          <button class="nav-btn ativo" type="button" data-view="inicio">Página inicial</button>
          <button id="navDashboards" class="nav-btn" type="button" data-view="dashboards">Dashboards</button>
          <button class="nav-btn" type="button" data-view="investimentos" data-module="INVESTIMENTOS">Investimentos</button>
          <button class="nav-btn" type="button" data-view="pendentes" data-module="INVESTIMENTOS_PENDENTES">Investimentos pendentes</button>
          <button id="navUsuarios" class="nav-btn" type="button" data-view="usuarios" data-module="USUARIOS">Usuários cadastrados</button>
          <button class="nav-btn" type="button" data-view="historico" data-module="HISTORICO">Histórico de ações</button>
          <button id="navAcessos" class="nav-btn" type="button" data-view="acessos" data-module="ACESSOS">Acessos</button>
          <button id="logout" class="nav-btn nav-btn--sair" type="button">Sair</button>
        </nav>
      </aside>
      <section class="conteudo">
        <header class="topo"><div><h1 id="tituloPagina">Página inicial</h1><p id="greeting"></p></div><span id="role" class="tag"></span></header>
        <section id="viewInicio" class="visao">
  <div class="portal-desenvolvimento">
    <h2>Portal em desenvolvimento</h2>
  </div>
</section>
        <section id="viewUsuarios" class="visao oculto">
          <div class="painel-cabecalho"><div><h2>Usuários cadastrados</h2><p>Cadastre os acessos da equipe ao novo portal.</p></div><button id="novoUsuario" class="acao" type="button">Novo usuário</button></div>
          <form id="formUsuario" class="formulario oculto">
            <h3>Novo usuário</h3>
            <div class="linha-form"><div><label for="novoNome">Usuário</label><input id="novoNome" required minlength="3" autocomplete="username"></div><div><label for="novoPerfil">Perfil</label><select id="novoPerfil"><option>Colaborador</option><option>Gestor</option><option>Administrador</option></select></div></div>
            <label for="novoEmail">E-mail</label><input id="novoEmail" type="email" required autocomplete="email">
            <label for="novaSenha">Senha inicial</label><input id="novaSenha" type="password" required minlength="8" autocomplete="new-password">
            <div id="erroUsuario" class="erro" role="alert"></div><div class="acoes-form"><button class="acao" type="submit">Cadastrar usuário</button><button id="cancelarUsuario" class="acao-secundaria" type="button">Cancelar</button></div>
          </form>
          <div id="listaUsuarios" class="tabela-wrap"></div>
        </section>
        <section id="viewAcessos" class="visao oculto">
          <div class="painel-cabecalho"><div><h2>Acessos</h2><p>Escolha quais operações cada usuário poderá realizar.</p></div></div>
          <div class="formulario"><label for="usuarioPermissoes">Usuário</label><select id="usuarioPermissoes"></select><div id="permissoesUsuario" class="permissoes" style="margin-top:20px"></div><div id="erroPermissoes" class="erro" role="alert"></div><button id="salvarPermissoes" class="acao" type="button">Salvar acessos</button></div>
        </section>
        <section id="viewEmMigracao" class="visao oculto"><div class="boas-vindas"><h2 id="tituloMigracao">Módulo em migração</h2><p>Este módulo será incluído depois de concluirmos a adaptação segura dos dados e integrações do portal anterior.</p></div></section>
      </section>
    </main>

    <script>
      const $ = (id) => document.getElementById(id);
      const login = $('login'), setup = $('setup'), dashboard = $('dashboard');
      let sessionData = null, cachedUsers = [], permissionModules = [];
      const moduleTitles = { investimentos:'Investimentos', pendentes:'Investimentos pendentes', devolucoes:'Painel de devoluções', historico:'Histórico de ações' };
      function show(view) {
  document.body.classList.remove('inicializando');
  $('inicializacao').classList.add('oculto');
  login.classList.toggle('oculto', view !== 'login');
  setup.classList.toggle('oculto', view !== 'setup');
  dashboard.classList.toggle('oculto', view !== 'dashboard');
}
      function error(id, message) { $(id).textContent = message || ''; }
      async function request(path, options = {}) { const response = await fetch(path, { headers: {'content-type':'application/json', ...(options.headers || {})}, ...options }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Não foi possível concluir esta ação.'); return data; }
      function html(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }
      function hasModule(id) { return sessionData && sessionData.modules.some((module) => module.id === id); }
      function openView(view) {
        if (view === 'dashboards') {
          window.location.href = '/dashboards';
          return;
        }
          if (view === 'dashboard-rentabilidade') {
          window.location.href = '/dashboard-rentabilidade';
          return;
         }
         if (view === 'dashboard-vendas') {
         window.location.href = '/dashboard-vendas';
         return;
        }
         if (view === 'investimentos') {
         window.location.href = '/investimentos';
         return;
        }

        if (view === 'pendentes') {
        window.location.href = '/investimentos-pendentes';
        return;
        }

       if (view === 'usuarios') {
       window.location.href = '/usuarios';
       return;
       }

if (view === 'historico') {
  window.location.href = '/historico-acoes';
  return;
}

if (view === 'devolucoes') {
  window.location.href = '/devolucoes';
  return;
}

if (view === 'acessos') {
  window.location.href = '/acessos';
  return;
}
         
        document.querySelectorAll('.visao').forEach((item) => item.classList.add('oculto'));
        document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('ativo', item.dataset.view === view));
        if (view === 'inicio') { $('tituloPagina').textContent = 'Página inicial'; $('viewInicio').classList.remove('oculto'); return; }
        if (view === 'usuarios') { $('tituloPagina').textContent = 'Usuários cadastrados'; $('viewUsuarios').classList.remove('oculto'); loadUsers(); return; }
        if (view === 'acessos') { $('tituloPagina').textContent = 'Acessos'; $('viewAcessos').classList.remove('oculto'); loadUsers(); return; }
        $('tituloPagina').textContent = moduleTitles[view] || 'Módulo em migração'; $('tituloMigracao').textContent = $('tituloPagina').textContent; $('viewEmMigracao').classList.remove('oculto');
      }
      
      function startDashboard(data) { sessionData = data; $('greeting').textContent = 'Bem-vindo, ' + data.user.username + '.'; $('role').textContent = data.user.role; document.querySelectorAll('[data-module]').forEach((button) => { button.classList.toggle('oculto', !hasModule(button.dataset.module)); }); if (data.user.role !== 'Administrador') { $('navUsuarios').classList.add('oculto'); $('navAcessos').classList.add('oculto'); $('navDashboards').classList.add('oculto'); } show('dashboard'); openView('inicio'); }
      async function loadSession() { try { startDashboard(await request('/api/me')); } catch { const status = await request('/api/status'); $('setupLink').classList.toggle('oculto', status.hasUsers); show('login'); } }
      async function loadUsers() { if (!sessionData || sessionData.user.role !== 'Administrador') return; try { const data = await request('/api/users'); cachedUsers = data.users; renderUsers(); renderUserSelector(); } catch (err) { error('erroUsuario', err.message); } }
      function renderUsers() { const target = $('listaUsuarios'); if (!cachedUsers.length) { target.innerHTML = '<div class="vazio">Nenhum usuário cadastrado.</div>'; return; } target.innerHTML = '<table class="tabela"><thead><tr><th>Usuário</th><th>E-mail</th><th>Perfil</th><th>Acessos configurados</th></tr></thead><tbody>' + cachedUsers.map((user) => '<tr><td><strong>' + html(user.username) + '</strong></td><td>' + html(user.email) + '</td><td>' + html(user.role) + '</td><td>' + Number(user.permission_count || 0) + '</td></tr>').join('') + '</tbody></table>'; }
      function renderUserSelector() { const select = $('usuarioPermissoes'); const previous = select.value; const nonAdmins = cachedUsers.filter((user) => user.role !== 'Administrador'); select.innerHTML = '<option value="">Selecione um usuário</option>' + nonAdmins.map((user) => '<option value="' + html(user.id) + '">' + html(user.username) + ' — ' + html(user.role) + '</option>').join(''); if (nonAdmins.some((user) => user.id === previous)) select.value = previous; }
      async function loadPermissions() { const userId = $('usuarioPermissoes').value; $('permissoesUsuario').innerHTML = ''; error('erroPermissoes'); if (!userId) return; try { const data = await request('/api/users/' + encodeURIComponent(userId) + '/permissions'); permissionModules = data.modules; $('permissoesUsuario').innerHTML = data.modules.map((module) => '<div class="permissao-item" data-permission="' + html(module.id) + '"><div class="permissao-titulo">' + html(module.name) + '</div><div class="checks"><label><input data-key="view" type="checkbox" ' + (module.can_view ? 'checked' : '') + '> Consultar</label><label><input data-key="create" type="checkbox" ' + (module.can_create ? 'checked' : '') + '> Incluir</label><label><input data-key="update" type="checkbox" ' + (module.can_update ? 'checked' : '') + '> Alterar</label><label><input data-key="delete" type="checkbox" ' + (module.can_delete ? 'checked' : '') + '> Excluir</label><label><input data-key="configure" type="checkbox" ' + (module.can_configure ? 'checked' : '') + '> Configurar</label></div></div>').join(''); } catch (err) { error('erroPermissoes', err.message); } }
      async function savePermissions() { const userId = $('usuarioPermissoes').value; if (!userId) { error('erroPermissoes', 'Selecione um usuário.'); return; } const permissions = Array.from(document.querySelectorAll('[data-permission]')).map((item) => { const checked = (key) => item.querySelector('[data-key="' + key + '"]').checked; return { moduleId:item.dataset.permission, view:checked('view'), create:checked('create'), update:checked('update'), delete:checked('delete'), configure:checked('configure') }; }); try { await request('/api/users/' + encodeURIComponent(userId) + '/permissions', { method:'PUT', body:JSON.stringify({permissions}) }); error('erroPermissoes', 'Acessos salvos.'); $('erroPermissoes').style.color = '#075638'; await loadUsers(); } catch (err) { $('erroPermissoes').style.color = ''; error('erroPermissoes', err.message); } }
      $('formLogin').addEventListener('submit', async (event) => { event.preventDefault(); error('loginError'); const button = $('loginButton'); button.disabled = true; button.classList.add('entrando'); button.textContent = 'Entrando...'; try { await request('/api/login', {method:'POST', body:JSON.stringify({username:$('username').value, password:$('password').value})}); await loadSession(); } catch (err) { error('loginError', err.message); } finally { button.disabled = false; button.classList.remove('entrando'); button.textContent = '↪ Entrar'; } });
      $('setupLink').addEventListener('click', () => show('setup'));
      $('forgotPassword').addEventListener('click', () => error('loginError', 'A recuperação de senha será migrada após a configuração do envio de e-mails.'));
      $('backToLogin').addEventListener('click', () => show('login'));
      $('formSetup').addEventListener('submit', async (event) => { event.preventDefault(); error('setupError'); const button = $('setupButton'); button.disabled = true; try { await request('/api/bootstrap', {method:'POST', body:JSON.stringify({username:$('setupUsername').value, email:$('setupEmail').value, password:$('setupPassword').value, setupToken:$('setupToken').value})}); await loadSession(); } catch (err) { error('setupError', err.message); } finally { button.disabled = false; } });
      document.addEventListener('click', (event) => { const button = event.target.closest('[data-view]'); if (button && !button.classList.contains('oculto')) openView(button.dataset.view); });
      $('novoUsuario').addEventListener('click', () => { $('formUsuario').reset(); error('erroUsuario'); $('formUsuario').classList.remove('oculto'); $('novoNome').focus(); });
      $('cancelarUsuario').addEventListener('click', () => $('formUsuario').classList.add('oculto'));
      $('formUsuario').addEventListener('submit', async (event) => { event.preventDefault(); error('erroUsuario'); try { await request('/api/users', {method:'POST', body:JSON.stringify({username:$('novoNome').value, email:$('novoEmail').value, password:$('novaSenha').value, role:$('novoPerfil').value})}); $('formUsuario').classList.add('oculto'); await loadUsers(); } catch (err) { error('erroUsuario', err.message); } });
      $('usuarioPermissoes').addEventListener('change', loadPermissions);
      $('salvarPermissoes').addEventListener('click', savePermissions);
      $('logout').addEventListener('click', async () => { await request('/api/logout', {method:'POST'}); await loadSession(); });
      loadSession();
    </script>
  </body>
</html>`;
