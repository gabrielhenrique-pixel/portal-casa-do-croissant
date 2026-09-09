export function acessosPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acessos | Casa do Croissant</title>
  <style>
    :root{--verde:#168447;--escuro:#0d4b2b;--fundo:#f6f8f7;--texto:#183128;--borda:#d6e4dd;--erro:#b8322a}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;font-family:Arial,sans-serif;color:var(--texto);background:var(--fundo)}
    main{max-width:1300px;margin:0 auto;padding:34px 36px 48px}
    .topo{display:flex;align-items:center;gap:16px;margin-bottom:26px}
    .voltar{display:grid;width:48px;height:48px;place-items:center;flex:0 0 48px;border-radius:50%;background:var(--escuro);color:#fff;text-decoration:none;font-size:26px;font-weight:700}
    h1{margin:0;font-size:27px}
    .subtitulo{margin:5px 0 0;color:#66746d}
    .grade{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .painel{padding:20px;border:1px solid var(--borda);border-radius:12px;background:#fff}
    .painel h2{margin:0 0 16px;font-size:18px}
    .cabecalho-painel{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
    .campo{width:100%;height:42px;padding:0 12px;border:1px solid #b9cfc3;border-radius:7px;background:#fff;font:inherit}
    .selecionar-todos{display:flex;align-items:center;gap:7px;margin:12px 0;font-size:13px;font-weight:700}
    .lista{max-height:390px;overflow:auto;border:1px solid #dce8e1;border-radius:8px}
    .modulo{display:flex;align-items:center;gap:10px;padding:13px;border-bottom:1px solid #e3ece7;cursor:pointer}
    .modulo:last-child{border-bottom:0}
    .modulo:hover{background:#f3faf6}
    .modulo input{width:17px;height:17px}
    .usuarios{display:grid;gap:9px;min-height:130px}
    .usuario{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;border:1px solid #dce8e1;border-radius:8px;background:#fff;cursor:pointer}
    .usuario:hover{background:#f3faf6}
    .usuario.selecionado{border-color:var(--verde);box-shadow:0 0 0 2px rgba(22,132,71,.15)}
    .usuario small{display:block;margin-top:4px;color:#66746d}
    .acoes{display:flex;gap:9px;flex-wrap:wrap}
    .botao{padding:10px 14px;border:0;border-radius:7px;background:var(--verde);color:#fff;font-weight:700;cursor:pointer}
    .botao.secundario{border:1px solid #b9cfc3;background:#fff;color:#405149}
    .botao.perigo{background:#c1362d}
    .botao:disabled{cursor:not-allowed;opacity:.55}
    .tipos{display:flex;flex-wrap:wrap;gap:14px}
    .tipos label{display:flex;align-items:center;gap:7px;font-size:14px}
    .rodape{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}
    .mensagem{display:none;margin:16px 0;padding:12px 14px;border-radius:7px;background:#e2f3e8;color:#12623e}
    .mensagem.erro{background:#fde5e2;color:var(--erro)}
    .mensagem.visivel{display:block}
    .vazio{padding:28px;color:#66746d;text-align:center}
    .modal-fundo{position:fixed;inset:0;z-index:10;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(15,35,26,.55)}
    .modal-fundo.visivel{display:flex}
    .modal{width:min(100%,520px);padding:24px;border-radius:12px;background:#fff}
    .modal-cabecalho{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px}
    .modal h2{margin:0;font-size:20px}
    .fechar{border:0;background:transparent;color:#66746d;font-size:27px;cursor:pointer}
    .lista-modal{max-height:300px;margin-top:12px;overflow:auto;border:1px solid var(--borda);border-radius:8px}
    .opcao-usuario{display:flex;gap:10px;align-items:center;padding:12px;border-bottom:1px solid #e3ece7;cursor:pointer}
    .opcao-usuario:last-child{border-bottom:0}
    .opcao-usuario small{display:block;color:#66746d;margin-top:3px}
    @media(max-width:800px){main{padding:24px 16px}.grade{grid-template-columns:1fr}.rodape{flex-direction:column-reverse}.rodape button{width:100%}}
  </style>
</head>
<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/" aria-label="Voltar à Página inicial">↩</a>
      <div>
        <h1>Acessos</h1>
        <p class="subtitulo">Selecione módulos, um usuário e os tipos de acesso que serão aplicados.</p>
      </div>
    </header>

    <div id="mensagem" class="mensagem" role="status"></div>

    <section class="grade">
      <article class="painel">
        <h2>Módulos</h2>
        <input id="buscaModulo" class="campo" type="search" placeholder="Pesquisar módulo">
        <label class="selecionar-todos">
          <input id="todosModulos" type="checkbox">
          Selecionar módulos exibidos
        </label>
        <div id="listaModulos" class="lista"></div>
      </article>

      <article class="painel">
        <div class="cabecalho-painel">
          <h2>Usuários</h2>
          <div class="acoes">
            <button id="adicionarUsuario" class="botao secundario" type="button">Adicionar usuário</button>
            <button id="removerUsuario" class="botao perigo" type="button" disabled>Remover acessos</button>
          </div>
        </div>
        <div id="listaUsuarios" class="usuarios">
          <div class="vazio">Selecione um ou mais módulos.</div>
        </div>
      </article>
    </section>

    <section class="painel" style="margin-top:16px">
      <h2>Tipos de acesso</h2>

      <div class="tipos">
        <label><input id="view" type="checkbox"> Consultar</label>
        <label><input id="create" type="checkbox"> Incluir</label>
        <label><input id="update" type="checkbox"> Alterar</label>
        <label><input id="delete" type="checkbox"> Excluir</label>
        <label><input id="configure" type="checkbox"> Configurar</label>
      </div>

      <div class="rodape">
        <button id="salvar" class="botao" type="button">Confirmar acessos</button>
      </div>
    </section>
  </main>

  <div id="modal" class="modal-fundo">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-cabecalho">
        <h2>Selecionar usuário</h2>
        <button id="fecharModal" class="fechar" type="button" aria-label="Fechar">×</button>
      </div>

      <input id="buscaUsuario" class="campo" type="search" placeholder="Pesquisar usuário, e-mail ou perfil">

      <div id="usuariosModal" class="lista-modal"></div>

      <div class="rodape">
        <button id="cancelarModal" class="botao secundario" type="button">Cancelar</button>
        <button id="confirmarUsuario" class="botao" type="button">Selecionar usuário</button>
      </div>
    </div>
  </div>

  <script>
    const listaModulos = document.getElementById('listaModulos');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const mensagem = document.getElementById('mensagem');
    const modal = document.getElementById('modal');

    let dados = { modules: [], users: [], grants: [] };
    let modulosSelecionados = [];
    let usuarioSelecionado = null;
    let usuarioDoModal = null;

    function seguro(valor) {
      const elemento = document.createElement('span');
      elemento.textContent = valor || '';
      return elemento.innerHTML;
    }

    function avisar(texto, erro) {
      mensagem.textContent = texto;
      mensagem.className = erro
        ? 'mensagem erro visivel'
        : 'mensagem visivel';
    }

    function temPermissao(usuarioId, moduloId) {
      return dados.grants.find(function(item) {
        return item.user_id === usuarioId && item.module_id === moduloId;
      });
    }

    function temAlgumaPermissao(usuarioId) {
      return modulosSelecionados.some(function(moduloId) {
        const acesso = temPermissao(usuarioId, moduloId);

        return acesso && (
          acesso.can_view ||
          acesso.can_create ||
          acesso.can_update ||
          acesso.can_delete ||
          acesso.can_configure
        );
      });
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

      const corpo = await resposta.json().catch(function() {
        return {};
      });

      if (!resposta.ok) {
        throw new Error(corpo.error || 'Não foi possível concluir esta ação.');
      }

      return corpo;
    }

    function renderizarModulos() {
      const termo = document.getElementById('buscaModulo').value
        .toLocaleLowerCase('pt-BR');

      const exibidos = dados.modules.filter(function(modulo) {
        return String(modulo.name || '')
          .toLocaleLowerCase('pt-BR')
          .includes(termo);
      });

      listaModulos.innerHTML = exibidos.length
        ? exibidos.map(function(modulo) {
          return '<label class="modulo">' +
            '<input type="checkbox" data-modulo="' + seguro(modulo.id) + '" ' +
            (modulosSelecionados.includes(modulo.id) ? 'checked' : '') + '>' +
            '<span>' + seguro(modulo.name) + '</span>' +
          '</label>';
        }).join('')
        : '<div class="vazio">Nenhum módulo encontrado.</div>';

      document.getElementById('todosModulos').checked =
        exibidos.length > 0 &&
        exibidos.every(function(modulo) {
          return modulosSelecionados.includes(modulo.id);
        });
    }

    function carregarPermissoesMarcadas() {
      const ids = ['view', 'create', 'update', 'delete', 'configure'];

      ids.forEach(function(id) {
        const campo = document.getElementById(id);

        if (!usuarioSelecionado || !modulosSelecionados.length) {
          campo.checked = false;
          return;
        }

        campo.checked = modulosSelecionados.every(function(moduloId) {
          const acesso = temPermissao(usuarioSelecionado, moduloId);
          return acesso && Boolean(acesso['can_' + id]);
        });
      });
    }

    function renderizarUsuarios() {
      const botao = document.getElementById('removerUsuario');
      botao.disabled = true;

      if (!modulosSelecionados.length) {
        listaUsuarios.innerHTML =
          '<div class="vazio">Selecione um ou mais módulos.</div>';
        return;
      }

      const visiveis = dados.users.filter(function(usuario) {
        return usuario.role === 'Administrador' ||
          usuario.id === usuarioSelecionado ||
          temAlgumaPermissao(usuario.id);
      });

      if (!visiveis.length) {
        listaUsuarios.innerHTML =
          '<div class="vazio">Nenhum usuário possui acesso aos módulos selecionados.</div>';
        return;
      }

      listaUsuarios.innerHTML = visiveis.map(function(usuario) {
        return '<div class="usuario ' +
          (usuario.id === usuarioSelecionado ? 'selecionado' : '') +
          '" data-usuario="' + seguro(usuario.id) + '">' +
          '<div><strong>' + seguro(usuario.username) + '</strong>' +
          '<small>' + seguro(usuario.role) + ' — ' +
          seguro(usuario.email) + '</small></div></div>';
      }).join('');

      const escolhido = dados.users.find(function(usuario) {
        return usuario.id === usuarioSelecionado;
      });

      botao.disabled = !escolhido || escolhido.role === 'Administrador';
      carregarPermissoesMarcadas();
    }

    function renderizarModal() {
      const termo = document.getElementById('buscaUsuario').value
        .toLocaleLowerCase('pt-BR');

      const usuarios = dados.users
        .filter(function(usuario) {
          return usuario.role !== 'Administrador';
        })
        .filter(function(usuario) {
          return [usuario.username, usuario.email, usuario.role].some(function(valor) {
            return String(valor || '')
              .toLocaleLowerCase('pt-BR')
              .includes(termo);
          });
        });

      document.getElementById('usuariosModal').innerHTML = usuarios.length
        ? usuarios.map(function(usuario) {
          return '<label class="opcao-usuario">' +
            '<input type="radio" name="usuarioModal" value="' +
            seguro(usuario.id) + '" ' +
            (usuario.id === usuarioDoModal ? 'checked' : '') + '>' +
            '<span><strong>' + seguro(usuario.username) + '</strong>' +
            '<small>' + seguro(usuario.role) + ' — ' +
            seguro(usuario.email) + '</small></span></label>';
        }).join('')
        : '<div class="vazio">Nenhum usuário encontrado.</div>';
    }

    async function carregar() {
      try {
        dados = await api('/api/accesses');
        dados.modules = dados.modules || [];
        dados.users = dados.users || [];
        dados.grants = dados.grants || [];

        renderizarModulos();
        renderizarUsuarios();
      } catch (erro) {
        avisar(erro.message, true);
      }
    }

    document.getElementById('buscaModulo')
      .addEventListener('input', renderizarModulos);

    listaModulos.addEventListener('change', function(evento) {
      const campo = evento.target.closest('[data-modulo]');
      if (!campo) return;

      const id = campo.dataset.modulo;

      modulosSelecionados = campo.checked
        ? [...new Set([...modulosSelecionados, id])]
        : modulosSelecionados.filter(function(item) {
          return item !== id;
        });

      renderizarModulos();
      renderizarUsuarios();
    });

    document.getElementById('todosModulos')
      .addEventListener('change', function(evento) {
        const termo = document.getElementById('buscaModulo').value
          .toLocaleLowerCase('pt-BR');

        dados.modules
          .filter(function(modulo) {
            return String(modulo.name || '')
              .toLocaleLowerCase('pt-BR')
              .includes(termo);
          })
          .forEach(function(modulo) {
            if (evento.target.checked &&
                !modulosSelecionados.includes(modulo.id)) {
              modulosSelecionados.push(modulo.id);
            }

            if (!evento.target.checked) {
              modulosSelecionados = modulosSelecionados.filter(function(id) {
                return id !== modulo.id;
              });
            }
          });

        renderizarModulos();
        renderizarUsuarios();
      });

    listaUsuarios.addEventListener('click', function(evento) {
      const item = evento.target.closest('[data-usuario]');
      if (!item) return;

      usuarioSelecionado = item.dataset.usuario;
      renderizarUsuarios();
    });

    document.getElementById('adicionarUsuario')
      .addEventListener('click', function() {
        usuarioDoModal = usuarioSelecionado;
        document.getElementById('buscaUsuario').value = '';
        renderizarModal();
        modal.classList.add('visivel');
      });

    document.getElementById('fecharModal')
      .addEventListener('click', function() {
        modal.classList.remove('visivel');
      });

    document.getElementById('cancelarModal')
      .addEventListener('click', function() {
        modal.classList.remove('visivel');
      });

    modal.addEventListener('click', function(evento) {
      if (evento.target === modal) {
        modal.classList.remove('visivel');
      }
    });

    document.getElementById('buscaUsuario')
      .addEventListener('input', renderizarModal);

    document.getElementById('usuariosModal')
      .addEventListener('change', function(evento) {
        if (evento.target.name === 'usuarioModal') {
          usuarioDoModal = evento.target.value;
        }
      });

    document.getElementById('confirmarUsuario')
      .addEventListener('click', function() {
        if (!usuarioDoModal) {
          avisar('Selecione um usuário.', true);
          return;
        }

        usuarioSelecionado = usuarioDoModal;
        modal.classList.remove('visivel');
        renderizarUsuarios();
      });

    document.getElementById('salvar')
      .addEventListener('click', async function() {
        if (!modulosSelecionados.length) {
          avisar('Selecione ao menos um módulo.', true);
          return;
        }

        if (!usuarioSelecionado) {
          avisar('Selecione um usuário.', true);
          return;
        }

        const usuario = dados.users.find(function(item) {
          return item.id === usuarioSelecionado;
        });

        if (!usuario || usuario.role === 'Administrador') {
          avisar('Administradores já possuem todos os acessos.', true);
          return;
        }

        const permissions = {
          view: document.getElementById('view').checked,
          create: document.getElementById('create').checked,
          update: document.getElementById('update').checked,
          delete: document.getElementById('delete').checked,
          configure: document.getElementById('configure').checked
        };

        try {
          await api('/api/accesses', {
            method: 'PUT',
            body: JSON.stringify({
              userId: usuarioSelecionado,
              moduleIds: modulosSelecionados,
              permissions: permissions
            })
          });

          avisar('Acessos salvos com sucesso.', false);
          await carregar();
        } catch (erro) {
          avisar(erro.message, true);
        }
      });

    document.getElementById('removerUsuario')
      .addEventListener('click', async function() {
        const usuario = dados.users.find(function(item) {
          return item.id === usuarioSelecionado;
        });

        if (!usuario ||
            !confirm('Remover todos os acessos de "' + usuario.username + '"?')) {
          return;
        }

        try {
          await api('/api/accesses/' + encodeURIComponent(usuario.id), {
            method: 'DELETE'
          });

          usuarioSelecionado = null;
          avisar('Acessos removidos com sucesso.', false);
          await carregar();
        } catch (erro) {
          avisar(erro.message, true);
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
