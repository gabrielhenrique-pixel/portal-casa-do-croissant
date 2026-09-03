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
      .tela { min-height:100vh; display:grid; place-items:center; padding:24px; background:linear-gradient(135deg,#f5faf7,#eef4f1); }
      .cartao { width:min(100%,440px); background:#fff; border:1px solid #d6e4dd; border-radius:18px; padding:34px; box-shadow:0 16px 42px rgba(5,57,37,.12); }
      .cartao label { display:block; margin:16px 0 7px; font-size:13px; font-weight:700; }.cartao input{width:100%;padding:13px 14px;border:1px solid #bdd1c7;border-radius:9px;font-size:16px;}.cartao button{width:100%;border:0;border-radius:9px;padding:13px 16px;margin-top:22px;background:#075638;color:#fff;font-size:15px;font-weight:700;cursor:pointer;}
      .link { display:block; width:100%; margin-top:14px; background:transparent!important; color:#075638!important; text-decoration:underline; }.erro{min-height:20px;margin-top:14px;color:var(--erro);font-size:14px;}
      .painel { min-height:100vh; padding:36px; background:#f4f8f6; color:#102d24; }.topo{display:flex;align-items:center;justify-content:space-between;gap:20px;}.topo button{width:auto;margin:0;border:0;border-radius:9px;padding:12px 16px;background:#075638;color:#fff;font-weight:700;}.boas-vindas{max-width:720px;margin:70px auto;padding:38px;text-align:center;background:#fff;border:1px solid #d6e4dd;border-radius:18px;}.tag{display:inline-block;margin-top:12px;padding:6px 10px;border-radius:999px;background:#e9f4ee;color:#075638;font-weight:700;font-size:13px;}
      @keyframes girarLogin { to { transform:rotate(360deg); } }
      @media (max-width:600px) { .painel { padding:22px; }.topo { align-items:flex-start; flex-direction:column; }.cartao { padding:26px; } }
    </style>
  </head>
  <body>
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
      $('formLogin').addEventListener('submit', async (event) => { event.preventDefault(); error('loginError'); const button = $('loginButton'); button.disabled = true; button.classList.add('entrando'); button.textContent = 'Entrando...'; try { await request('/api/login', {method:'POST', body:JSON.stringify({username:$('username').value, password:$('password').value})}); await loadSession(); } catch (err) { error('loginError', err.message); } finally { button.disabled = false; button.classList.remove('entrando'); button.textContent = '↪ Entrar'; } });
      $('setupLink').addEventListener('click', () => show('setup'));
      $('forgotPassword').addEventListener('click', () => error('loginError', 'A recuperação de senha será migrada após a configuração do envio de e-mails.'));
      $('backToLogin').addEventListener('click', () => show('login'));
      $('formSetup').addEventListener('submit', async (event) => { event.preventDefault(); error('setupError'); const button = $('setupButton'); button.disabled = true; try { await request('/api/bootstrap', {method:'POST', body:JSON.stringify({username:$('setupUsername').value, email:$('setupEmail').value, password:$('setupPassword').value, setupToken:$('setupToken').value})}); await loadSession(); } catch (err) { error('setupError', err.message); } finally { button.disabled = false; } });
      $('logout').addEventListener('click', async () => { await request('/api/logout', {method:'POST'}); await loadSession(); });
      loadSession();
    </script>
  </body>
</html>`;
