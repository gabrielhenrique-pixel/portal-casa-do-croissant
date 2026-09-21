export function perfilPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Perfil | Casa do Croissant</title>

  <style>
    :root {
      --verde:#123d2d;
      --verde-claro:#287a57;
      --fundo:#f4f8f6;
      --texto:#183128;
      --borda:#d2e1d9;
      --erro:#b42318;
      --sucesso:#087443;
    }

    * { box-sizing:border-box; }

    body {
      margin:0;
      min-height:100vh;
      background:var(--fundo);
      color:var(--texto);
      font-family:Arial,sans-serif;
    }

    main {
      width:min(900px,calc(100% - 32px));
      margin:0 auto;
      padding:30px 0 48px;
    }

    .topo {
      display:flex;
      align-items:center;
      gap:16px;
      margin-bottom:26px;
    }

    .voltar {
      display:grid;
      width:48px;
      height:48px;
      place-items:center;
      border-radius:50%;
      background:#fff;
      color:var(--verde);
      text-decoration:none;
      font-size:28px;
      box-shadow:0 5px 16px #123d2d20;
    }

    .voltar:hover {
      background:var(--verde);
      color:#fff;
    }

    h1 {
      margin:0;
      font-size:30px;
    }

    .subtitulo {
      margin:5px 0 0;
      color:#60766a;
    }

    .perfil-card {
      display:grid;
      grid-template-columns:250px minmax(0,1fr);
      overflow:hidden;
      border:1px solid var(--borda);
      border-radius:18px;
      background:#fff;
      box-shadow:0 8px 24px #123d2d12;
    }

    .foto-area {
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:32px 24px;
      background:#e8f2ed;
      text-align:center;
    }

    .avatar-wrap {
  position:relative;
}

.remover-foto {
  position:absolute;
  top:-5px;
  right:-5px;
  display:grid;
  width:31px;
  height:31px;
  place-items:center;
  border:2px solid #fff;
  border-radius:50%;
  background:#b42318;
  color:#fff;
  font-size:22px;
  font-weight:700;
  line-height:1;
  cursor:pointer;
  box-shadow:0 3px 8px #0003;
}

.remover-foto:hover {
  background:#8f1c14;
}

    .avatar {
      display:grid;
      width:150px;
      height:150px;
      place-items:center;
      overflow:hidden;
      border:4px solid #fff;
      border-radius:50%;
      background:#c9dcf5;
      color:#547db9;
      font-size:68px;
      font-weight:700;
      box-shadow:0 5px 16px #123d2d28;
    }

    .avatar img {
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .trocar-foto {
      margin-top:18px;
      padding:10px 14px;
      border:0;
      border-radius:8px;
      background:var(--verde);
      color:#fff;
      font:inherit;
      font-weight:700;
      cursor:pointer;
    }

    .trocar-foto:hover {
      background:var(--verde-claro);
    }

    .foto-area small {
      margin-top:12px;
      color:#567264;
      line-height:1.4;
    }

    .dados {
      padding:32px;
    }

    .nome {
      margin:0;
      font-size:25px;
    }

    .email {
      margin:7px 0 0;
      color:#60766a;
    }

    .perfil-tag {
      display:inline-block;
      margin-top:13px;
      padding:6px 10px;
      border-radius:20px;
      background:#e8f2ed;
      color:#176445;
      font-size:13px;
      font-weight:700;
    }

    .linha {
      height:1px;
      margin:27px 0;
      background:var(--borda);
    }

    h2 {
      margin:0 0 7px;
      font-size:20px;
    }

    .descricao {
      margin:0 0 18px;
      color:#60766a;
      font-size:14px;
    }

    label {
      display:block;
      margin:14px 0 6px;
      color:#254535;
      font-size:14px;
      font-weight:700;
    }

    input {
      width:100%;
      padding:12px;
      border:1px solid #b9d1c2;
      border-radius:8px;
      outline:none;
      font:inherit;
    }

    input:focus {
      border-color:var(--verde-claro);
      box-shadow:0 0 0 3px #287a5720;
    }

    .salvar {
      margin-top:20px;
      padding:12px 18px;
      border:0;
      border-radius:8px;
      background:#087443;
      color:#fff;
      font:inherit;
      font-weight:700;
      cursor:pointer;
    }

    .salvar:hover {
      background:#075f38;
    }

    .mensagem {
      min-height:20px;
      margin:14px 0 0;
      font-size:14px;
      font-weight:700;
    }

    .mensagem.erro { color:var(--erro); }
    .mensagem.sucesso { color:var(--sucesso); }

    #arquivoFoto {
      display:none;
    }

    .modal-senha {
  position:fixed;
  z-index:20;
  inset:0;
  display:grid;
  place-items:center;
  padding:20px;
  background:#102e4970;
}

.modal-senha[hidden] {
  display:none;
}

.caixa-senha {
  position:relative;
  width:min(100%,480px);
  padding:28px;
  border-radius:18px;
  background:#fff;
  box-shadow:0 18px 50px #0005;
}

.fechar-senha {
  position:absolute;
  top:12px;
  right:14px;
  border:0;
  background:transparent;
  color:#476658;
  font-size:27px;
  cursor:pointer;
}

    @media (max-width:650px) {
      main {
        width:min(100% - 24px,900px);
        padding-top:20px;
      }

      .perfil-card {
        grid-template-columns:1fr;
      }

      .foto-area {
        padding:26px;
      }

      .dados {
        padding:25px 20px;
      }
    }
  </style>
</head>

<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/" aria-label="Voltar à página inicial">←</a>

      <div>
        <h1>Perfil</h1>
        <p class="subtitulo">Gerencie seu perfil.</p>
      </div>
    </header>

    <section class="perfil-card">
      <aside class="foto-area">
        <div class="avatar-wrap">
  <div id="avatar" class="avatar" aria-label="Foto de perfil">👤</div>

  <button
    id="removerFoto"
    class="remover-foto"
    type="button"
    aria-label="Remover foto de perfil"
    hidden
  >
    ×
  </button>
</div>

        <input
          id="arquivoFoto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
        >

        <button id="trocarFoto" class="trocar-foto" type="button">
          Alterar foto
        </button>

        <small>Use uma imagem JPG, PNG ou WebP.</small>
      </aside>

      <section class="dados">
        <h2 id="nome">Carregando...</h2>
        <p id="email" class="email"></p>
        <span id="perfil" class="perfil-tag"></span>

        <div class="linha"></div>

        <h2>Segurança</h2>

<p class="descricao">
  Altere sua senha quando necessário.
</p>

<button id="abrirSenha" class="salvar" type="button">
  Alterar senha
</button>

        <p id="mensagem" class="mensagem" role="alert"></p>
      </section>
    </section>
  </main>

<div id="modalSenha" class="modal-senha" hidden>
  <section class="caixa-senha" role="dialog" aria-modal="true">
    <button
      id="fecharSenha"
      class="fechar-senha"
      type="button"
      aria-label="Fechar"
    >
      ×
    </button>

    <h2>Alterar senha</h2>

    <p class="descricao">
      Informe sua senha atual e escolha uma nova senha.
    </p>

    <form id="formSenha">
      <label for="senhaAtual">Senha atual</label>
      <input
        id="senhaAtual"
        type="password"
        autocomplete="current-password"
        required
      >

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

      <button class="salvar" type="submit">
        Salvar nova senha
      </button>
    </form>

    <p id="mensagemSenha" class="mensagem" role="alert"></p>
  </section>
</div>

<script>
    (function() {
      var avatar = document.getElementById('avatar');
      var arquivoFoto = document.getElementById('arquivoFoto');
      var mensagem = document.getElementById('mensagem');

      function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto || '';
        mensagem.className = 'mensagem ' + (tipo || '');
      }

      async function requisicao(url, opcoes) {
        var resposta = await fetch(url, {
          headers: {
            'content-type':'application/json'
          },
          ...opcoes
        });

        var dados = await resposta.json().catch(function() {
          return {};
        });

        if (!resposta.ok) {
          throw new Error(
            dados.error || 'Não foi possível concluir a operação.'
          );
        }

        return dados;
      }

      function mostrarAvatar(imagem, nome) {
  document.getElementById('removerFoto').hidden = !imagem;

  if (imagem) {
    avatar.innerHTML = '';

    var foto = document.createElement('img');
    foto.src = imagem;
    foto.alt = 'Foto de perfil de ' + nome;

    avatar.appendChild(foto);
    return;
  }

  avatar.textContent = '👤';
}

      function lerImagem(arquivo) {
        return new Promise(function(resolve, reject) {
          if (!arquivo || !arquivo.type.startsWith('image/')) {
            reject(new Error('Escolha uma imagem válida.'));
            return;
          }

          var leitor = new FileReader();

          leitor.onload = function(evento) {
            var imagem = new Image();

            imagem.onload = function() {
              var tamanhoMaximo = 480;
              var escala = Math.min(
                1,
                tamanhoMaximo / imagem.width,
                tamanhoMaximo / imagem.height
              );

              var canvas = document.createElement('canvas');
              canvas.width = Math.round(imagem.width * escala);
              canvas.height = Math.round(imagem.height * escala);

              var contexto = canvas.getContext('2d');
              contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);

              resolve(canvas.toDataURL('image/jpeg', 0.84));
            };

            imagem.onerror = function() {
              reject(new Error('Não foi possível ler esta imagem.'));
            };

            imagem.src = evento.target.result;
          };

          leitor.onerror = function() {
            reject(new Error('Não foi possível ler esta imagem.'));
          };

          leitor.readAsDataURL(arquivo);
        });
      }

      async function carregarPerfil() {
        var dados = await requisicao('/api/profile');
        var usuario = dados.user;

        document.getElementById('nome').textContent = usuario.username;
        document.getElementById('email').textContent = usuario.email;
        document.getElementById('perfil').textContent = usuario.role;

        mostrarAvatar(dados.avatar, usuario.username);
      }

      document
        .getElementById('trocarFoto')
        .addEventListener('click', function() {
          arquivoFoto.click();
        });

        document
  .getElementById('removerFoto')
  .addEventListener('click', async function() {
    var confirmar = window.confirm(
      'Deseja realmente remover sua foto de perfil?'
    );

    if (!confirmar) {
      return;
    }

    try {
      mostrarMensagem('Removendo foto...');

      await requisicao('/api/profile/avatar', {
        method:'PUT',
        body:JSON.stringify({ avatar:null })
      });

      mostrarAvatar(
        null,
        document.getElementById('nome').textContent
      );

      mostrarMensagem('Foto removida com sucesso.', 'sucesso');
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    }
  });

      arquivoFoto.addEventListener('change', async function() {
        try {
          mostrarMensagem('Salvando foto...');

          var imagem = await lerImagem(arquivoFoto.files[0]);

          var dados = await requisicao('/api/profile/avatar', {
            method:'PUT',
            body:JSON.stringify({ avatar:imagem })
          });

          mostrarAvatar(
            dados.avatar,
            document.getElementById('nome').textContent
          );

          mostrarMensagem('Foto atualizada com sucesso.', 'sucesso');
        } catch (erro) {
          mostrarMensagem(erro.message, 'erro');
        } finally {
          arquivoFoto.value = '';
        }
      });

      var modalSenha = document.getElementById('modalSenha');
var formSenha = document.getElementById('formSenha');
var mensagemSenha = document.getElementById('mensagemSenha');

function fecharModalSenha() {
  modalSenha.hidden = true;
  formSenha.reset();
  mensagemSenha.textContent = '';
  mensagemSenha.className = 'mensagem';
}

document
  .getElementById('abrirSenha')
  .addEventListener('click', function() {
    modalSenha.hidden = false;
    document.getElementById('senhaAtual').focus();
  });

document
  .getElementById('fecharSenha')
  .addEventListener('click', fecharModalSenha);

modalSenha.addEventListener('click', function(evento) {
  if (evento.target === modalSenha) {
    fecharModalSenha();
  }
});

formSenha.addEventListener('submit', async function(evento) {
  evento.preventDefault();

  try {
    mensagemSenha.textContent = 'Salvando nova senha...';
    mensagemSenha.className = 'mensagem';

    await requisicao('/api/profile/password', {
      method:'PUT',
      body:JSON.stringify({
        senhaAtual:document.getElementById('senhaAtual').value,
        novaSenha:document.getElementById('novaSenha').value,
        confirmarSenha:document.getElementById('confirmarSenha').value
      })
    });

    fecharModalSenha();
    mostrarMensagem('Senha alterada com sucesso.', 'sucesso');
  } catch (erro) {
    mensagemSenha.textContent = erro.message;
    mensagemSenha.className = 'mensagem erro';
  }
});
      carregarPerfil().catch(function(erro) {
        mostrarMensagem(erro.message, 'erro');
      });
    })();
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
