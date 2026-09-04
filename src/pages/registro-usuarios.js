export function registroUsuarioPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Registro de usuário | Casa do Croissant</title>
  <style>
    :root { --verde:#168447; --escuro:#0d4b2b; --fundo:#f6f8f7; --texto:#183128; --borda:#d6e4dd; --erro:#b8322a; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; font-family:Arial,sans-serif; color:var(--texto); background:var(--fundo); }
    main { max-width:900px; margin:0 auto; padding:34px 36px 48px; }
    .topo { display:flex; align-items:center; gap:16px; margin-bottom:26px; }
    .voltar { display:grid; width:48px; height:48px; place-items:center; border-radius:50%; background:var(--escuro); color:#fff; text-decoration:none; font-size:26px; font-weight:700; }
    h1 { margin:0; font-size:27px; }
    .subtitulo { margin:5px 0 0; color:#66746d; }
    .cartao { max-width:620px; padding:26px; border:1px solid var(--borda); border-radius:12px; background:#fff; }
    label { display:block; margin:16px 0 7px; font-size:13px; font-weight:700; }
    input, select { width:100%; height:42px; padding:0 12px; border:1px solid #b9cfc3; border-radius:7px; background:#fff; font:inherit; }
    .rodape { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; }
    .botao { padding:10px 16px; border:0; border-radius:7px; font-weight:700; cursor:pointer; }
    .primario { background:var(--verde); color:#fff; }
    .secundario { border:1px solid #b9cfc3; background:#fff; color:#405149; text-decoration:none; }
    .mensagem { display:none; margin-top:16px; padding:12px 14px; border-radius:7px; background:#e2f3e8; color:#12623e; font-size:14px; }
    .mensagem.erro { background:#fde5e2; color:var(--erro); }
    .mensagem.visivel { display:block; }
  </style>
</head>
<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/usuarios" aria-label="Voltar para usuários cadastrados">↩</a>
      <div>
        <h1>Registro de usuário</h1>
        <p class="subtitulo">Cadastre um novo acesso ao portal.</p>
      </div>
    </header>

    <section class="cartao">
      <form id="formulario">
        <label for="username">Usuário</label>
        <input id="username" minlength="3" autocomplete="username" required>

        <label for="email">E-mail</label>
        <input id="email" type="email" autocomplete="email" required>

        <label for="role">Perfil de acesso</label>
        <select id="role">
          <option>Colaborador</option>
          <option>Gestor</option>
          <option>Administrador</option>
        </select>

        <label for="password">Senha inicial</label>
        <input id="password" type="password" minlength="8" autocomplete="new-password" required>

        <label for="confirmPassword">Confirmar senha</label>
        <input id="confirmPassword" type="password" minlength="8" autocomplete="new-password" required>

        <div class="rodape">
          <a class="botao secundario" href="/usuarios">Cancelar</a>
          <button id="salvar" class="botao primario" type="submit">Cadastrar usuário</button>
        </div>
      </form>

      <div id="mensagem" class="mensagem" role="status"></div>
    </section>
  </main>

  <script>
    const form = document.getElementById('formulario');
    const mensagem = document.getElementById('mensagem');

    function mostrar(texto, erro) {
      mensagem.textContent = texto;
      mensagem.className = erro ? 'mensagem erro visivel' : 'mensagem visivel';
    }

    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const senha = document.getElementById('password').value;

      if (senha !== document.getElementById('confirmPassword').value) {
        mostrar('A confirmação de senha não confere.', true);
        return;
      }

      const botao = document.getElementById('salvar');
      botao.disabled = true;
      botao.textContent = 'Cadastrando...';

      try {
        const resposta = await fetch('/api/users', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            password: senha
          })
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          throw new Error(dados.error || 'Não foi possível cadastrar o usuário.');
        }

        mostrar('Usuário cadastrado com sucesso. Retornando à lista...', false);

        setTimeout(() => {
          window.location.href = '/usuarios';
        }, 700);
      } catch (erro) {
        mostrar(erro.message, true);
        botao.disabled = false;
        botao.textContent = 'Cadastrar usuário';
      }
    });
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
