export function usuariosPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Usuários cadastrados | Casa do Croissant</title>

    <style>
  :root {
    --navy:#102e49;
    --blue:#1f4e78;
    --green:#168447;
    --bg:#f5f7f6;
    --ink:#142b3d;
    --border:#d5e0e8;
    --muted:#63716e;
    --error:#b8322a;
  }

  * { box-sizing:border-box; }

  body {
    margin:0;
    min-height:100vh;
    background:var(--bg);
    color:var(--ink);
    font-family:Arial,sans-serif;
  }

  main {
    max-width:1440px;
    margin:auto;
    padding:8px 8px 38px;
  }

  .topo {
    display:flex;
    align-items:center;
    gap:16px;
    padding:18px 34px;
    border-radius:18px;
    background:rgba(255,255,255,.92);
    box-shadow:0 8px 22px #1730521c;
  }

  .navegacao-topo {
    display:flex;
    flex-shrink:0;
    gap:8px;
  }

  .nav-icone {
    display:grid;
    width:48px;
    height:48px;
    place-items:center;
    border-radius:50%;
    background:#fff;
    color:var(--navy);
    font-size:25px;
    font-weight:700;
    text-decoration:none;
    box-shadow:0 5px 15px #1730521c;
    transition:transform .15s,background .15s;
  }

  .nav-icone:hover {
    background:#edf3f9;
    transform:translateY(-2px);
  }

  .marca h1 {
    margin:0;
    color:var(--navy);
    font-size:30px;
  }

  .subtitulo {
    margin:5px 0 0;
    color:var(--muted);
    font-size:16px;
  }

  .acoes {
    display:flex;
    align-items:center;
    gap:10px;
    margin-top:16px;
    padding:14px 22px;
    border-radius:15px;
    background:rgba(255,255,255,.84);
    box-shadow:0 6px 18px #17305214;
  }

  .novo {
    display:grid;
    width:42px;
    height:42px;
    place-items:center;
    flex:0 0 42px;
    border-radius:8px;
    background:var(--green);
    color:#fff;
    font-size:29px;
    font-weight:400;
    text-decoration:none;
  }

  .novo:hover { background:#0f6c38; }

  .busca {
    width:380px;
    max-width:calc(100vw - 130px);
    height:42px;
    padding:0 12px;
    border:1px solid #c6d4e4;
    border-radius:8px;
    outline:none;
    background:#fff;
    color:var(--ink);
    font:inherit;
  }

  .busca:focus {
    border-color:var(--blue);
    box-shadow:0 0 0 3px #1f4e7820;
  }

  .mensagem {
    display:none;
    margin:14px 0 0;
    padding:12px 14px;
    border-radius:8px;
    background:#edf8f1;
    color:#17643f;
    font-size:14px;
  }

  .mensagem.erro {
    background:#fde5e2;
    color:var(--error);
  }

  .mensagem.visivel { display:block; }

  .tabela-area {
    margin-top:14px;
    overflow-x:auto;
    border:1px solid var(--border);
    border-radius:16px;
    background:#fff;
    box-shadow:0 6px 18px #17305214;
  }

  table {
    width:100%;
    min-width:850px;
    border-collapse:collapse;
  }

  th,
  td {
    padding:13px 12px;
    border-bottom:1px solid #e2e9ee;
    text-align:left;
    font-size:13px;
  }

  th {
    background:var(--navy);
    color:#fff;
    font-size:11px;
    text-transform:uppercase;
  }

  tbody tr:hover { background:#f5f9fc; }

  tr:last-child td { border-bottom:0; }

  .vazio {
    padding:34px;
    color:var(--muted);
    text-align:center;
  }

  .oculto { display:none; }

  .acoes-linha {
    display:flex;
    gap:8px;
  }

  .botao {
    padding:8px 12px;
    border:0;
    border-radius:7px;
    color:#fff;
    font-size:13px;
    font-weight:700;
    cursor:pointer;
  }

  .editar { background:var(--blue); }
  .excluir { background:#c1362d; }

  .modal-fundo {
    position:fixed;
    inset:0;
    z-index:10;
    display:none;
    align-items:center;
    justify-content:center;
    padding:20px;
    background:rgba(16,46,73,.5);
  }

  .modal-fundo.visivel { display:flex; }

  .modal {
    width:min(100%,560px);
    padding:24px;
    border-radius:14px;
    background:#fff;
    box-shadow:0 12px 35px #102e4940;
  }

  .modal-cabecalho {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
    margin-bottom:20px;
  }

  .modal h2 {
    margin:0;
    color:var(--navy);
    font-size:21px;
  }

  .fechar {
    border:0;
    background:transparent;
    color:var(--muted);
    font-size:27px;
    cursor:pointer;
  }

  label {
    display:block;
    margin:14px 0 7px;
    color:#17375f;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
  }

  input,
  select {
    width:100%;
    height:42px;
    padding:0 12px;
    border:1px solid #c6d4e4;
    border-radius:8px;
    outline:none;
    background:#fff;
    color:var(--ink);
    font:inherit;
  }

  input:focus,
  select:focus {
    border-color:var(--blue);
    box-shadow:0 0 0 3px #1f4e7820;
  }

  .rodape-modal {
    display:flex;
    justify-content:flex-end;
    gap:10px;
    margin-top:22px;
  }

  .cancelar,
  .salvar {
    padding:10px 16px;
    border-radius:7px;
    font-weight:700;
    cursor:pointer;
  }

  .cancelar {
    border:1px solid #c6d4e4;
    background:#fff;
    color:#405149;
  }

  .salvar {
    border:0;
    background:var(--navy);
    color:#fff;
  }

  .salvar:hover { background:var(--blue); }

  @media (max-width:700px) {
    main { padding:4px 6px 28px; }

    .topo {
      gap:12px;
      padding:16px;
    }

    .nav-icone {
      width:42px;
      height:42px;
      font-size:22px;
    }

    .marca h1 { font-size:23px; }
    .subtitulo { font-size:14px; }

    .acoes { padding:12px; }

    .rodape-modal {
      flex-direction:column-reverse;
    }

    .rodape-modal button { width:100%; }
  }
</style>
  </head>

  <body>
    <main>
      <header class="topo">
        <a
          class="voltar"
          href="/"
          aria-label="Voltar à Página inicial"
        >↩</a>

        <div>
          <h1>Usuários cadastrados</h1>
          <p class="subtitulo">
            Edite perfil, nome de usuário ou e-mail. Senhas não são exibidas.
          </p>
        </div>
      </header>

      <div class="acoes">
        <a
          class="novo"
          href="/registro-usuario"
          title="Cadastrar usuário"
          aria-label="Cadastrar usuário"
        >+</a>

        <input
          id="busca"
          class="busca"
          type="search"
          placeholder="Pesquisar usuário, e-mail ou perfil"
        >
      </div>

      <div
        id="mensagem"
        class="mensagem"
        role="status"
      ></div>

      <section class="tabela-area">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody id="linhas"></tbody>
        </table>

        <div
          id="vazio"
          class="vazio oculto"
        >Nenhum usuário cadastrado.</div>
      </section>
    </main>

    <div id="modal" class="modal-fundo">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-cabecalho">
          <h2>Editar usuário</h2>

          <button
            id="fechar"
            class="fechar"
            type="button"
            aria-label="Fechar"
          >×</button>
        </div>

        <form id="formEdicao">
          <input id="idUsuario" type="hidden">

          <label for="usuarioEdit">Usuário</label>
          <input id="usuarioEdit" minlength="3" required>

          <label for="emailEdit">E-mail</label>
          <input id="emailEdit" type="email" required>

          <label for="perfilEdit">Perfil de acesso</label>

          <select id="perfilEdit">
            <option>Colaborador</option>
            <option>Gestor</option>
            <option>Administrador</option>
          </select>

          <div class="rodape-modal">
            <button
              id="cancelar"
              class="cancelar"
              type="button"
            >Cancelar</button>

            <button
              id="salvar"
              class="salvar"
              type="submit"
            >Salvar alteração</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const linhas = document.getElementById('linhas');
      const vazio = document.getElementById('vazio');
      const busca = document.getElementById('busca');
      const mensagem = document.getElementById('mensagem');
      const modal = document.getElementById('modal');

      let usuarios = [];

      function seguro(valor) {
        const item = document.createElement('span');

        item.textContent = valor || '';

        return item.innerHTML;
      }

      function mostrar(texto, erro) {
        mensagem.textContent = texto;

        mensagem.className = erro
          ? 'mensagem erro visivel'
          : 'mensagem visivel';
      }

      async function api(url, opcoes) {
        const resposta = await fetch(url, {
          credentials:'same-origin',

          headers: {
            'content-type':'application/json',
            ...((opcoes && opcoes.headers) || {})
          },

          ...(opcoes || {})
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          throw new Error(
            dados.error || 'Não foi possível concluir esta ação.'
          );
        }

        return dados;
      }

      function data(valor) {
        return valor
          ? new Date(valor).toLocaleString('pt-BR')
          : '-';
      }

      function montarTabela() {
        const termo = busca.value.trim().toLocaleLowerCase('pt-BR');

        const filtrados = usuarios.filter((usuario) =>
          [
            usuario.username,
            usuario.email,
            usuario.role
          ].some((valor) =>
            String(valor || '')
              .toLocaleLowerCase('pt-BR')
              .includes(termo)
          )
        );

        linhas.innerHTML = filtrados.map((usuario) =>
          '<tr>' +
            '<td>' + seguro(usuario.username) + '</td>' +
            '<td>' + seguro(usuario.email) + '</td>' +
            '<td>' + seguro(usuario.role) + '</td>' +
            '<td>' + data(usuario.created_at) + '</td>' +
            '<td>' +
              '<div class="acoes-linha">' +
                '<button class="botao editar" type="button" data-editar="' +
                  seguro(usuario.id) +
                '">Editar</button>' +

                '<button class="botao excluir" type="button" data-excluir="' +
                  seguro(usuario.id) +
                '">Excluir</button>' +
              '</div>' +
            '</td>' +
          '</tr>'
        ).join('');

        vazio.classList.toggle(
          'oculto',
          filtrados.length !== 0
        );
      }

      async function carregar() {
        try {
          const dados = await api('/api/users');

          usuarios = dados.users || [];

          montarTabela();
        } catch (erro) {
          mostrar(erro.message, true);
        }
      }

      function abrirEdicao(id) {
        const usuario = usuarios.find((item) => item.id === id);

        if (!usuario) {
          return;
        }

        document.getElementById('idUsuario').value = usuario.id;
        document.getElementById('usuarioEdit').value = usuario.username;
        document.getElementById('emailEdit').value = usuario.email;
        document.getElementById('perfilEdit').value = usuario.role;

        modal.classList.add('visivel');
      }

      function fecharModal() {
        modal.classList.remove('visivel');
      }

      busca.addEventListener('input', montarTabela);

      document
        .getElementById('fechar')
        .addEventListener('click', fecharModal);

      document
        .getElementById('cancelar')
        .addEventListener('click', fecharModal);

      modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
          fecharModal();
        }
      });

      linhas.addEventListener('click', async(evento) => {
        const editar = evento.target.closest('[data-editar]');

        if (editar) {
          abrirEdicao(editar.dataset.editar);
          return;
        }

        const excluir = evento.target.closest('[data-excluir]');

        if (!excluir) {
          return;
        }

        const usuario = usuarios.find(
          (item) => item.id === excluir.dataset.excluir
        );

        if (
          !usuario ||
          !confirm(
            'Excluir o usuário "' +
            usuario.username +
            '"? Esta ação não poderá ser desfeita.'
          )
        ) {
          return;
        }

        try {
          await api(
            '/api/users/' + encodeURIComponent(usuario.id),
            { method:'DELETE' }
          );

          mostrar('Usuário excluído com sucesso.', false);

          await carregar();
        } catch (erro) {
          mostrar(erro.message, true);
        }
      });

      document
        .getElementById('formEdicao')
        .addEventListener('submit', async(evento) => {
          evento.preventDefault();

          const botao = document.getElementById('salvar');

          botao.disabled = true;
          botao.textContent = 'Salvando...';

          try {
            await api(
              '/api/users/' +
              encodeURIComponent(
                document.getElementById('idUsuario').value
              ),
              {
                method:'PUT',

                body: JSON.stringify({
                  username:document.getElementById('usuarioEdit').value,
                  email:document.getElementById('emailEdit').value,
                  role:document.getElementById('perfilEdit').value
                })
              }
            );

            fecharModal();

            mostrar('Usuário alterado com sucesso.', false);

            await carregar();
          } catch (erro) {
            mostrar(erro.message, true);
          } finally {
            botao.disabled = false;
            botao.textContent = 'Salvar alteração';
          }
        });

      carregar();
    </script>
  </body>
</html>`, {
  headers: {
    'content-type':'text/html; charset=UTF-8',
    'x-content-type-options':'nosniff',
    'referrer-policy':'same-origin'
  }
});
}

