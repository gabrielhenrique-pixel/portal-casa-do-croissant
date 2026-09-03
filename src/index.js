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

      return new Response(APP_HTML, {
        headers: {
          'content-type': 'text/html; charset=UTF-8',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'same-origin'
        }
      });
    } catch (error) {
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
    await writeAudit(env, username || 'não identificado', 'LOGIN_NEGADO', 'Tentativa de login sem sucesso.');
    return json({ error: 'Usuário ou senha inválidos.' }, 401);
  }

  await writeAudit(env, user.username, 'LOGIN_REALIZADO', 'Login realizado com sucesso.');
  return createSessionResponse(env, user.id, user.username, user.email, user.role);
}

async function logout(request, env) {
  const token = getCookie(request, 'portal_session');
  if (token) {
    const tokenHash = await sha256(token);
    const session = await env.DB.prepare(
      `SELECT users.username
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ?`
    ).bind(tokenHash).first();
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(tokenHash).run();
    if (session) {
      await writeAudit(env, session.username, 'LOGOUT_REALIZADO', 'Usuário saiu do portal.');
    }
  }

  return json({ ok: true }, 200, { 'set-cookie': expiredSessionCookie() });
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

const APP_HTML = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portal Casa do Croissant</title>
    <style>
      :root { color-scheme: light; --verde:#075638; --verde-claro:#e9f4ee; --vermelho:#dc3030; --texto:#102d24; --borda:#d6e4dd; }
      * { box-sizing:border-box; }
      body { margin:0; min-height:100vh; font-family:Arial, sans-serif; color:var(--texto); background:linear-gradient(135deg,#f5faf7,#eef4f1); }
      .tela { min-height:100vh; display:grid; place-items:center; padding:24px; }
      .cartao { width:min(100%,440px); background:#fff; border:1px solid var(--borda); border-radius:18px; padding:34px; box-shadow:0 16px 42px rgba(5,57,37,.12); }
      .marca { display:flex; align-items:center; gap:12px; margin-bottom:26px; }
      .marca__icone { width:44px; height:44px; border-radius:13px; display:grid; place-items:center; color:#fff; background:var(--verde); font-size:23px; font-weight:700; }
      h1 { margin:0; font-size:25px; } p { color:#577167; line-height:1.5; } label { display:block; margin:16px 0 7px; font-size:13px; font-weight:700; }
      input { width:100%; padding:13px 14px; border:1px solid #bdd1c7; border-radius:9px; font-size:16px; }
      input:focus { outline:3px solid #d9eee2; border-color:var(--verde); }
      button { width:100%; border:0; border-radius:9px; padding:13px 16px; margin-top:22px; background:var(--verde); color:white; font-size:15px; font-weight:700; cursor:pointer; }
      button:hover { background:#06462f; } button:disabled { opacity:.6; cursor:wait; }
      .link { display:block; width:100%; margin-top:14px; background:transparent; color:var(--verde); text-decoration:underline; }
      .erro { min-height:20px; margin-top:14px; color:var(--vermelho); font-size:14px; }
      .sucesso { color:var(--verde); } .oculto { display:none !important; }
      .painel { min-height:100vh; padding:36px; } .topo { display:flex; align-items:center; justify-content:space-between; gap:20px; }
      .topo button { width:auto; margin:0; } .boas-vindas { max-width:720px; margin:70px auto; padding:38px; text-align:center; background:#fff; border:1px solid var(--borda); border-radius:18px; }
      .tag { display:inline-block; margin-top:12px; padding:6px 10px; border-radius:999px; background:var(--verde-claro); color:var(--verde); font-weight:700; font-size:13px; }
      @media (max-width:600px) { .painel { padding:22px; } .topo { align-items:flex-start; flex-direction:column; } .cartao { padding:26px; } }
    </style>
  </head>
  <body>
    <section id="login" class="tela">
      <form id="formLogin" class="cartao">
        <div class="marca"><div class="marca__icone">C</div><div><h1>Casa do Croissant</h1><small>Portal interno</small></div></div>
        <h2>Acessar portal</h2>
        <p>Use seu usuário e senha para continuar.</p>
        <label for="username">Usuário</label><input id="username" autocomplete="username" required>
        <label for="password">Senha</label><input id="password" type="password" autocomplete="current-password" required>
        <div id="loginError" class="erro" role="alert"></div>
        <button id="loginButton" type="submit">Entrar</button>
        <button id="setupLink" type="button" class="link oculto">Configurar primeiro acesso</button>
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
      <header class="topo"><div><h1>Página inicial</h1><p id="greeting"></p></div><button id="logout" type="button">Sair</button></header>
      <section class="boas-vindas"><h2>Fundação do portal pronta</h2><p>Login, sessão segura e permissões já estão sendo migrados. Os módulos de devoluções, investimentos e administração entrarão nas próximas etapas.</p><span id="role" class="tag"></span></section>
    </main>

    <script>
      const $ = (id) => document.getElementById(id);
      const login = $('login'), setup = $('setup'), dashboard = $('dashboard');
      function show(view) { login.classList.toggle('oculto', view !== 'login'); setup.classList.toggle('oculto', view !== 'setup'); dashboard.classList.toggle('oculto', view !== 'dashboard'); }
      function error(id, message) { $(id).textContent = message || ''; }
      async function request(path, options = {}) { const response = await fetch(path, { headers: {'content-type':'application/json', ...(options.headers || {})}, ...options }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Não foi possível concluir esta ação.'); return data; }
      async function loadSession() { try { const data = await request('/api/me'); $('greeting').textContent = 'Bem-vindo, ' + data.user.username + '.'; $('role').textContent = data.user.role; show('dashboard'); } catch { const status = await request('/api/status'); $('setupLink').classList.toggle('oculto', status.hasUsers); show('login'); } }
      $('formLogin').addEventListener('submit', async (event) => { event.preventDefault(); error('loginError'); const button = $('loginButton'); button.disabled = true; try { await request('/api/login', {method:'POST', body:JSON.stringify({username:$('username').value, password:$('password').value})}); await loadSession(); } catch (err) { error('loginError', err.message); } finally { button.disabled = false; } });
      $('setupLink').addEventListener('click', () => show('setup'));
      $('backToLogin').addEventListener('click', () => show('login'));
      $('formSetup').addEventListener('submit', async (event) => { event.preventDefault(); error('setupError'); const button = $('setupButton'); button.disabled = true; try { await request('/api/bootstrap', {method:'POST', body:JSON.stringify({username:$('setupUsername').value, email:$('setupEmail').value, password:$('setupPassword').value, setupToken:$('setupToken').value})}); await loadSession(); } catch (err) { error('setupError', err.message); } finally { button.disabled = false; } });
      $('logout').addEventListener('click', async () => { await request('/api/logout', {method:'POST'}); await loadSession(); });
      loadSession();
    </script>
  </body>
</html>`;
