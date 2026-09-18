export function acessosPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Acessos | Casa do Croissant</title>
  <style>
  :root {
    --v: #168447;
    --e: #0d4b2b;
    --f: #f6f8f7;
    --t: #183128;
    --b: #d6e4dd;
    --r: #b8322a;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: var(--t);
    background: var(--f);
  }

  main {
    max-width: 1300px;
    margin: auto;
    padding: 34px 36px 48px;
  }

  .topo {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 26px;
  }

  .voltar {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    border-radius: 50%;
    background: var(--e);
    color: #fff;
    text-decoration: none;
    font-size: 26px;
    font-weight: 700;
  }

  h1 {
    margin: 0;
    font-size: 27px;
  }

  .sub {
    margin: 5px 0 0;
    color: #66746d;
  }

  .grade {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .painel {
    padding: 20px;
    border: 1px solid var(--b);
    border-radius: 12px;
    background: #fff;
  }

  .cab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .painel h2 {
    margin: 0;
    font-size: 18px;
  }

  .campo {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 1px solid #b9cfc3;
    border-radius: 7px;
    font: inherit;
  }

  .todos {
    display: flex;
    gap: 7px;
    align-items: center;
    margin: 12px 0;
    font-size: 13px;
    font-weight: 700;
  }

  .lista {
    max-height: 390px;
    overflow: auto;
    border: 1px solid #dce8e1;
    border-radius: 8px;
  }

  .modulo,
  .usuario,
  .opcao {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 13px;
    border-bottom: 1px solid #e3ece7;
    cursor: pointer;
  }

  .modulo:last-child,
  .opcao:last-child {
    border-bottom: 0;
  }

  .modulo:hover,
  .usuario:hover {
    background: #f3faf6;
  }

  .usuario {
    border: 1px solid #dce8e1;
    border-radius: 8px;
    background: #fff;
  }

  .usuario.selecionado {
    border-color: var(--v);
    box-shadow: 0 0 0 2px rgba(22, 132, 71, 0.15);
  }

  small {
    display: block;
    margin-top: 4px;
    color: #66746d;
  }

  .usuarios {
    display: grid;
    gap: 9px;
    min-height: 130px;
  }

  .acoes,
  .rodape {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .rodape {
    justify-content: flex-end;
    margin-top: 20px;
  }

  .botao {
    padding: 10px 14px;
    border: 0;
    border-radius: 7px;
    background: var(--v);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }

  .sec {
    border: 1px solid #b9cfc3;
    background: #fff;
    color: #405149;
  }

  .perigo {
    background: #c1362d;
  }

  .botao:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .tipos {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .tipos label {
    display: flex;
    gap: 7px;
    align-items: center;
  }

  .msg {
    display: none;
    margin: 16px 0;
    padding: 12px 14px;
    border-radius: 7px;
    background: #e2f3e8;
    color: #12623e;
  }

  .msg.erro {
    background: #fde5e2;
    color: var(--r);
  }

  .msg.visivel {
    display: block;
  }

  .vazio {
    padding: 28px;
    text-align: center;
    color: #66746d;
  }

  .fundo {
    position: fixed;
    inset: 0;
    display: none;
    place-items: center;
    padding: 20px;
    background: rgba(15, 35, 26, 0.55);
  }

  .fundo.visivel {
    display: grid;
  }

  .modal {
    width: min(100%, 540px);
    padding: 24px;
    border-radius: 12px;
    background: #fff;
  }

  .modal .cab {
    margin-bottom: 16px;
  }

  .fechar {
    border: 0;
    background: transparent;
    color: #66746d;
    font-size: 27px;
    cursor: pointer;
  }

  .lista-modal {
    max-height: 300px;
    overflow: auto;
    margin-top: 12px;
    border: 1px solid var(--b);
    border-radius: 8px;
  }

  .grupo-modulos{
  border-bottom:1px solid #e3ece7;
}

.titulo-grupo{
  padding:13px;
  font-size:13px;
  font-weight:700;
  background:#f3faf6;
  color:#0d4b2b;
}

.submodulos{
  padding-left:24px;
  background:#fbfdfc;
}

.submodulos .modulo{
  padding-left:13px;
}

.toast{
  position:fixed;
  z-index:50;
  right:24px;
  bottom:24px;
  display:none;
  min-width:230px;
  padding:14px 18px;
  border-radius:9px;
  background:#0a6237;
  color:#fff;
  font-weight:700;
  box-shadow:0 10px 26px #1235;
}

.toast.visivel{
  display:block;
}

  @media (max-width: 800px) {
    main {
      padding: 24px 16px;
    }

    .grade {
      grid-template-columns: 1fr;
    }

    .rodape {
      flex-direction: column-reverse;
    }

    .rodape button {
      width: 100%;
    }
  }
</style>
</head>
<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/" aria-label="Voltar à Página inicial">↩</a>
      <div>
        <h1>Acessos</h1>
        <p class="sub">Selecione módulos, usuários e os tipos de acesso que serão aplicados.</p>
      </div>
    </header>

    <div id="msg" class="msg" role="status"></div>
    <div id="toast" class="toast" role="status"></div>

    <section class="grade">
      <article class="painel">
        <h2>Módulos</h2>
        <input id="buscaModulo" class="campo" type="search" placeholder="Pesquisar módulo">
        <label class="todos">
          <input id="todosModulos" type="checkbox">
          Selecionar módulos exibidos
        </label>
        <div id="modulos" class="lista"></div>
      </article>

      <article class="painel">
        <div class="cab">
          <h2>Usuários</h2>
          <div class="acoes">
            <button id="adicionar" class="botao sec" type="button">Adicionar usuários</button>
            <button id="remover" class="botao perigo" type="button">Remover acessos</button>
          </div>
        </div>
        <div id="usuarios" class="usuarios"></div>
      </article>
    </section>

    <section class="painel" style="margin-top:16px">
      <h2>Tipos de acesso</h2>
      <div class="tipos">
        <label><input id="view" type="checkbox">Consultar</label>
        <label><input id="create" type="checkbox">Incluir</label>
        <label><input id="update" type="checkbox">Alterar</label>
        <label><input id="delete" type="checkbox">Excluir</label>
        <label><input id="configure" type="checkbox">Configurar</label>
      </div>
      <div class="rodape">
        <button id="salvar" class="botao" type="button">Confirmar acessos</button>
      </div>
    </section>
  </main>

  <div id="modal" class="fundo">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="cab">
        <h2>Selecionar usuários</h2>
        <button id="fechar" class="fechar" type="button">×</button>
      </div>

      <input id="buscaUsuario" class="campo" type="search" placeholder="Pesquisar usuário, e-mail ou perfil">

      <div id="opcoes" class="lista-modal"></div>

      <div class="rodape">
        <button id="cancelar" class="botao sec" type="button">Cancelar</button>
        <button id="confirmar" class="botao" type="button">Selecionar usuários</button>
      </div>
    </div>
  </div>

  <script>
    const $ = (id) => document.getElementById(id);

    let dados = { modules: [], users: [], grants: [] };
    let modulos = [];
    let usuarios = [];
    let usuariosModal = [];

    let temporizadorToast;

function mostrarToast(texto) {
  const toast = $('toast');

  toast.textContent = texto;
  toast.classList.add('visivel');

  clearTimeout(temporizadorToast);

  temporizadorToast = setTimeout(() => {
    toast.classList.remove('visivel');
  }, 3000);
}

    const PAINEIS_DASHBOARD = [
  'DASHBOARD_RENTABILIDADE',
  'DASHBOARD_VENDAS',
  'DEVOLUCOES'
];

    function esc(valor) {
      const no = document.createElement('span');
      no.textContent = valor || '';
      return no.innerHTML;
    }

    function aviso(texto, erro) {
      $('msg').textContent = texto;
      $('msg').className = erro
        ? 'msg erro visivel'
        : 'msg visivel';
    }

    async function api(url, opcoes) {
      const resposta = await fetch(url, {
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          ...((opcoes && opcoes.headers) || {})
        },
        ...(opcoes || {})
      });

      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(corpo.error || 'Não foi possível concluir esta ação.');
      }

      return corpo;
    }

    function grant(usuarioId, moduloId) {
      return dados.grants.find((item) =>
        item.user_id === usuarioId &&
        item.module_id === moduloId
      );
    }

    function temAcesso(usuarioId) {
      return modulos.some((moduloId) => {
        const item = grant(usuarioId, moduloId);

        return item && (
          item.can_view ||
          item.can_create ||
          item.can_update ||
          item.can_delete ||
          item.can_configure
        );
      });
    }

    function renderModulos() {
  const termo = $('buscaModulo').value.toLocaleLowerCase('pt-BR');

  const corresponde = (modulo) =>
    String(modulo.name || '')
      .toLocaleLowerCase('pt-BR')
      .includes(termo);

  const painel = (modulo) =>
    PAINEIS_DASHBOARD.includes(modulo.id);

  const linha = (modulo) =>
    '<label class="modulo">' +
      '<input type="checkbox" data-modulo="' + esc(modulo.id) + '" ' +
      (modulos.includes(modulo.id) ? 'checked' : '') + '>' +
      '<span>' + esc(modulo.name) + '</span>' +
    '</label>';

  const paineis = dados.modules.filter(painel);
  const principais = dados.modules.filter((modulo) => !painel(modulo));

  const blocos = principais
    .filter((modulo) => {
      if (modulo.id !== 'DASHBOARDS') return corresponde(modulo);

      return corresponde(modulo) ||
        paineis.some(corresponde);
    })
    .map((modulo) => {
      if (modulo.id !== 'DASHBOARDS') return linha(modulo);

      const filhos = paineis.filter(corresponde);

      return '<div class="grupo-modulos">' +
        '<div class="titulo-grupo">Dashboards</div>' +
        '<div class="submodulos">' +
          (filhos.length
            ? filhos.map(linha).join('')
            : '<div class="vazio">Nenhum dashboard encontrado.</div>') +
        '</div>' +
      '</div>';
    });

  $('modulos').innerHTML = blocos.length
    ? blocos.join('')
    : '<div class="vazio">Nenhum módulo encontrado.</div>';

  const visiveis = dados.modules.filter((modulo) =>
    modulo.id !== 'DASHBOARDS' && corresponde(modulo)
  );

  $('todosModulos').checked =
    visiveis.length > 0 &&
    visiveis.every((modulo) => modulos.includes(modulo.id));
}

    function renderPermissoes() {
      ['view', 'create', 'update', 'delete', 'configure'].forEach((tipo) => {
        $(tipo).checked =
          Boolean(usuarios.length && modulos.length) &&
          usuarios.every((usuarioId) =>
            modulos.every((moduloId) => {
              const item = grant(usuarioId, moduloId);
              return item && Boolean(item['can_' + tipo]);
            })
          );
      });
    }

    function renderUsuarios() {
      if (!modulos.length) {
        $('usuarios').innerHTML =
          '<div class="vazio">Selecione um ou mais módulos.</div>';

        $('remover').disabled = true;
        return;
      }

      const lista = dados.users.filter((usuario) =>
        usuario.role === 'Administrador' ||
        usuarios.includes(usuario.id) ||
        temAcesso(usuario.id)
      );

      $('usuarios').innerHTML = lista.length
        ? lista.map((usuario) =>
          '<div class="usuario ' +
            (usuarios.includes(usuario.id) ? 'selecionado' : '') +
            '" data-usuario="' + esc(usuario.id) + '">' +
            '<div><strong>' + esc(usuario.username) + '</strong>' +
            '<small>' + esc(usuario.role) + ' — ' +
            esc(usuario.email) + '</small></div></div>'
        ).join('')
        : '<div class="vazio">Nenhum usuário possui acesso aos módulos selecionados.</div>';

      $('remover').disabled = !usuarios.length;
      renderPermissoes();
    }

    function renderModal() {
      const termo = $('buscaUsuario').value.toLocaleLowerCase('pt-BR');

      const lista = dados.users
        .filter((usuario) => usuario.role !== 'Administrador')
        .filter((usuario) =>
          [usuario.username, usuario.email, usuario.role].some((valor) =>
            String(valor || '')
              .toLocaleLowerCase('pt-BR')
              .includes(termo)
          )
        );

      $('opcoes').innerHTML = lista.length
        ? lista.map((usuario) =>
          '<label class="opcao">' +
            '<input type="checkbox" data-modal="' + esc(usuario.id) + '" ' +
            (usuariosModal.includes(usuario.id) ? 'checked' : '') + '>' +
            '<span><strong>' + esc(usuario.username) + '</strong>' +
            '<small>' + esc(usuario.role) + ' — ' +
            esc(usuario.email) + '</small></span></label>'
        ).join('')
        : '<div class="vazio">Nenhum usuário encontrado.</div>';
    }

    async function carregar() {
      try {
        dados = await api('/api/accesses');

        dados.modules = (dados.modules || []).filter((modulo) =>
          modulo.id !== 'INICIO'
        );

        dados.users = dados.users || [];
        dados.grants = dados.grants || [];

        usuarios = usuarios.filter((id) =>
          dados.users.some((usuario) =>
            usuario.id === id &&
            usuario.role !== 'Administrador'
          )
        );

        renderModulos();
        renderUsuarios();
      } catch (erro) {
        aviso(erro.message, true);
      }
    }

    $('buscaModulo').addEventListener('input', renderModulos);

    $('modulos').addEventListener('change', (evento) => {
      const campo = evento.target.closest('[data-modulo]');
      if (!campo) return;

      const id = campo.dataset.modulo;

      modulos = campo.checked
        ? [...new Set([...modulos, id])]
        : modulos.filter((valor) => valor !== id);

      renderModulos();
      renderUsuarios();
    });

    $('todosModulos').addEventListener('change', (evento) => {
      const termo = $('buscaModulo').value.toLocaleLowerCase('pt-BR');

      dados.modules
        .filter((modulo) =>
          String(modulo.name || '')
            .toLocaleLowerCase('pt-BR')
            .includes(termo)
        )
        .forEach((modulo) => {
          if (evento.target.checked && !modulos.includes(modulo.id)) {
            modulos.push(modulo.id);
          }

          if (!evento.target.checked) {
            modulos = modulos.filter((id) => id !== modulo.id);
          }
        });

      renderModulos();
      renderUsuarios();
    });

    $('usuarios').addEventListener('click', (evento) => {
      const item = evento.target.closest('[data-usuario]');
      if (!item) return;

      const usuario = dados.users.find((registro) =>
        registro.id === item.dataset.usuario
      );

      if (!usuario || usuario.role === 'Administrador') return;

      usuarios = usuarios.includes(usuario.id)
        ? usuarios.filter((id) => id !== usuario.id)
        : [...usuarios, usuario.id];

      renderUsuarios();
    });

    $('adicionar').addEventListener('click', () => {
      usuariosModal = [...usuarios];
      $('buscaUsuario').value = '';
      renderModal();
      $('modal').classList.add('visivel');
    });

    $('fechar').addEventListener('click', () =>
      $('modal').classList.remove('visivel')
    );

    $('cancelar').addEventListener('click', () =>
      $('modal').classList.remove('visivel')
    );

    $('modal').addEventListener('click', (evento) => {
      if (evento.target === $('modal')) {
        $('modal').classList.remove('visivel');
      }
    });

    $('buscaUsuario').addEventListener('input', renderModal);

    $('opcoes').addEventListener('change', (evento) => {
      const campo = evento.target.closest('[data-modal]');
      if (!campo) return;

      const id = campo.dataset.modal;

      usuariosModal = campo.checked
        ? [...new Set([...usuariosModal, id])]
        : usuariosModal.filter((valor) => valor !== id);
    });

    $('confirmar').addEventListener('click', () => {
      if (!usuariosModal.length) {
        aviso('Selecione ao menos um usuário.', true);
        return;
      }

      usuarios = [...usuariosModal];
      $('modal').classList.remove('visivel');
      renderUsuarios();
    });

    $('salvar').addEventListener('click', async () => {
      if (!modulos.length) {
        aviso('Selecione ao menos um módulo.', true);
        return;
      }

      if (!usuarios.length) {
        aviso('Selecione ao menos um usuário.', true);
        return;
      }

      const permissions = {
        view: $('view').checked,
        create: $('create').checked,
        update: $('update').checked,
        delete: $('delete').checked,
        configure: $('configure').checked
      };

      if (!Object.values(permissions).some(Boolean)) {
        aviso('Selecione ao menos um tipo de acesso.', true);
        return;
      }

      try {
        await api('/api/accesses', {
          method: 'PUT',
          body: JSON.stringify({
            userIds: usuarios,
            moduleIds: modulos,
            permissions
          })
        });

        modulos = [];
         usuarios = [];
          usuariosModal = [];

        $('msg').className = 'msg';

        await carregar();

        mostrarToast('Acessos salvos.');
      } catch (erro) {
        aviso(erro.message, true);
      }
    });

    $('remover').addEventListener('click', async () => {
      if (!usuarios.length) return;

      const nomes = dados.users
        .filter((usuario) => usuarios.includes(usuario.id))
        .map((usuario) => usuario.username)
        .join(', ');

      if (!confirm('Remover todos os acessos de: ' + nomes + '?')) {
        return;
      }

      try {
        await api('/api/accesses', {
          method: 'DELETE',
          body: JSON.stringify({ userIds: usuarios })
        });

        usuarios = [];
        aviso('Acessos removidos com sucesso.', false);
        await carregar();
      } catch (erro) {
        aviso(erro.message, true);
      }
    });

    carregar();
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
