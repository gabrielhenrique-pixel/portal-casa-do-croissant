export function recuperarSenhaPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recuperar senha | Casa do Croissant</title>

  <style>
    :root {
      --verde: #1b744d;
      --verde-escuro: #123d2d;
      --erro: #a52b20;
      --sucesso: #12623e;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: Arial, sans-serif;
      color: var(--verde-escuro);
      background:
        linear-gradient(rgba(237, 244, 240, .92), rgba(237, 244, 240, .92)),
        url("https://drive.google.com/thumbnail?id=1Y3rY3y3t4C636I2snLRVWHcNv4JZEaQt&sz=w1200")
        center / cover;
    }

    .cartao {
      width: min(100%, 430px);
      padding: 32px;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 16px 40px rgba(10, 49, 33, .2);
    }

    .logo {
      display: block;
      width: min(100%, 250px);
      margin: 0 auto 22px;
    }

    h1 {
      margin: 0 0 10px;
      font-size: 26px;
    }

    p {
      margin: 0 0 22px;
      color: #5e6f66;
      line-height: 1.45;
    }

    label {
      display: block;
      margin: 14px 0 7px;
      font-size: 13px;
      font-weight: 700;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #bed1c6;
      border-radius: 7px;
      font: inherit;
    }

    input:focus {
      outline: 0;
      border-color: var(--verde);
      box-shadow: 0 0 0 3px rgba(27, 116, 77, .16);
    }

    button,
    .voltar {
      width: 100%;
      margin-top: 22px;
      padding: 12px;
      border: 0;
      border-radius: 7px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button {
      background: var(--verde);
      color: #fff;
    }

    button:disabled {
      cursor: wait;
      opacity: .72;
    }

    .voltar {
      display: block;
      margin-top: 10px;
      color: var(--verde);
      text-align: center;
      text-decoration: none;
      background: transparent;
    }

    .oculto {
      display: none;
    }

    .mensagem {
      min-height: 20px;
      margin-top: 18px;
      color: var(--erro);
      font-size: 14px;
      line-height: 1.4;
    }

    .mensagem.sucesso {
      color: var(--sucesso);
    }
  </style>
</head>

<body>
  <main class="cartao">
    <img
      class="logo"
      src="https://drive.google.com/thumbnail?id=1Y3rY3y3t4C636I2snLRVWHcNv4JZEaQt&sz=w1000"
      alt="Casa do Croissant"
    >

    <section id="areaEmail">
      <h1>Recuperar senha</h1>

      <p>
        Informe seu e-mail cadastrado. Se ele estiver no portal,
        enviaremos um link para criar uma nova senha.
      </p>

      <form id="formEmail">
        <label for="email">E-mail</label>

        <input
          id="email"
          type="email"
          autocomplete="email"
          required
        >

        <button id="botaoEmail" type="submit">
          Enviar link de recuperação
        </button>
      </form>
    </section>

    <section id="areaNovaSenha" class="oculto">
      <h1>Criar nova senha</h1>

      <p>
        Escolha uma senha com pelo menos 8 caracteres.
      </p>

      <form id="formNovaSenha">
        <label for="novaSenha">Nova senha</label>

        <input
          id="novaSenha"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        >

        <label for="confirmarSenha">Confirmar nova senha</label>

        <input
          id="confirmarSenha"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        >

        <button id="botaoNovaSenha" type="submit">
          Salvar nova senha
        </button>
      </form>
    </section>

    <div
      id="mensagem"
      class="mensagem"
      role="alert"
      aria-live="polite"
    ></div>

    <a class="voltar" href="/">Voltar para o login</a>
  </main>

  <script>
    const token = new URLSearchParams(
      window.location.search
    ).get('token') || '';

    const areaEmail = document.getElementById('areaEmail');
    const areaNovaSenha =
      document.getElementById('areaNovaSenha');

    const mensagem = document.getElementById('mensagem');

    if (token) {
      areaEmail.classList.add('oculto');
      areaNovaSenha.classList.remove('oculto');
    }

    function mostrarMensagem(texto, sucesso) {
      mensagem.textContent = texto || '';
      mensagem.className = sucesso
        ? 'mensagem sucesso'
        : 'mensagem';
    }

    async function requisicao(url, body) {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const dados = await resposta.json().catch(function () {
        return {};
      });

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Não foi possível concluir esta ação.'
        );
      }

      return dados;
    }

    document.getElementById('formEmail').addEventListener(
      'submit',
      async function (event) {
        event.preventDefault();

        const botao = document.getElementById('botaoEmail');

        botao.disabled = true;
        botao.textContent = 'Enviando...';
        mostrarMensagem('');

        try {
          await requisicao('/api/password-reset/request', {
            email: document.getElementById('email').value
          });

          mostrarMensagem(
            'Se o e-mail estiver cadastrado, o link de recuperação foi enviado.',
            true
          );
        } catch (error) {
          mostrarMensagem(error.message);
        } finally {
          botao.disabled = false;
          botao.textContent = 'Enviar link de recuperação';
        }
      }
    );

    document.getElementById('formNovaSenha').addEventListener(
      'submit',
      async function (event) {
        event.preventDefault();

        const novaSenha =
          document.getElementById('novaSenha').value;

        const confirmarSenha =
          document.getElementById('confirmarSenha').value;

        if (novaSenha !== confirmarSenha) {
          mostrarMensagem('As senhas não conferem.');
          return;
        }

        const botao =
          document.getElementById('botaoNovaSenha');

        botao.disabled = true;
        botao.textContent = 'Salvando...';
        mostrarMensagem('');

        try {
          await requisicao('/api/password-reset/confirm', {
            token: token,
            novaSenha: novaSenha,
            confirmarSenha: confirmarSenha
          });

          mostrarMensagem(
            'Senha alterada. Redirecionando para o login...',
            true
          );

          setTimeout(function () {
            window.location.replace('/');
          }, 1800);
        } catch (error) {
          mostrarMensagem(error.message);
        } finally {
          botao.disabled = false;
          botao.textContent = 'Salvar nova senha';
        }
      }
    );
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
