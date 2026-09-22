export function historicoAcoesPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Histórico de ações | Casa do Croissant</title>
  <style>
  :root {
    --navy:#102e49;
    --blue:#1f4e78;
    --bg:#f5f7f6;
    --ink:#142b3d;
    --border:#d5e0e8;
    --muted:#63716e;
    --error:#b42318;
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

  .controles {
    margin-top:16px;
    padding:14px 34px;
    border-radius:15px;
    background:rgba(255,255,255,.84);
    box-shadow:0 6px 18px #17305214;
  }

  .campo-busca {
    display:grid;
    gap:5px;
  }

  .campo-busca label {
    color:#17375f;
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
  }

  .busca {
    width:380px;
    max-width:100%;
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

  .erro {
    display:none;
    margin:14px 0 0;
    padding:12px 14px;
    border:1px solid #f3c9c5;
    border-radius:8px;
    background:#fdecec;
    color:var(--error);
    font-size:14px;
  }

  .erro.visivel { display:block; }

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

  .vazio,
  .carregando {
    padding:34px;
    color:var(--muted);
    text-align:center;
  }

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

    .controles { padding:14px 16px; }

    .busca { width:100%; }

    .tabela-area { border-radius:14px; }
  }
</style>
</head>
<body>
  <main>
    <header class="topo">
  <div class="navegacao-topo">
    <a
      class="nav-icone"
      href="/"
      onclick="if (window.history.length > 1) { window.history.back(); return false; }"
      aria-label="Voltar"
    >←</a>

    <a class="nav-icone" href="/" aria-label="Página inicial">⌂</a>
  </div>

  <div class="marca">
    <h1>Histórico de ações</h1>
    <p class="subtitulo">Ações realizadas no Portal Casa do Croissant.</p>
  </div>
</header>

    <section class="controles">
  <div class="campo-busca">
    <label for="busca">Pesquisar histórico</label>

    <input
      id="busca"
      class="busca"
      type="search"
      placeholder="Pesquisar usuário, ação ou detalhe">
  </div>
</section>

    <div id="erro" class="erro" role="alert"></div>

    <section class="tabela-area">
      <table>
        <thead>
          <tr>
            <th>Data e hora</th>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Detalhe</th>
          </tr>
        </thead>
        <tbody id="linhas">
          <tr>
            <td class="carregando" colspan="4">Carregando histórico...</td>
          </tr>
        </tbody>
      </table>

      <div id="vazio" class="vazio" hidden>
        Nenhuma ação registrada.
      </div>
    </section>
  </main>

  <script>
    const linhas = document.getElementById('linhas');
    const busca = document.getElementById('busca');
    const vazio = document.getElementById('vazio');
    const erro = document.getElementById('erro');
    let itens = [];

    function textoSeguro(valor) {
      const elemento = document.createElement('span');
      elemento.textContent = valor || '';
      return elemento.innerHTML;
    }

    function formatarData(valor) {
      return valor ? new Date(valor).toLocaleString('pt-BR') : '-';
    }

    function montarTabela() {
      const termo = busca.value.trim().toLocaleLowerCase('pt-BR');

      const filtrados = itens.filter(function(item) {
        return [item.username, item.action, item.detail].some(function(valor) {
          return String(valor || '')
            .toLocaleLowerCase('pt-BR')
            .includes(termo);
        });
      });

      vazio.hidden = filtrados.length !== 0;

      linhas.innerHTML = filtrados.map(function(item) {
        return '<tr>' +
          '<td>' + textoSeguro(formatarData(item.created_at)) + '</td>' +
          '<td>' + textoSeguro(item.username) + '</td>' +
          '<td>' + textoSeguro(item.action) + '</td>' +
          '<td>' + textoSeguro(item.detail) + '</td>' +
        '</tr>';
      }).join('');
    }

    async function carregarHistorico() {
      try {
        const resposta = await fetch('/api/audit-log', {
          credentials: 'same-origin'
        });

        const dados = await resposta.json().catch(function() {
          return {};
        });

        if (!resposta.ok) {
          throw new Error(dados.error || 'Não foi possível carregar o histórico.');
        }

        itens = dados.items || [];
        montarTabela();
      } catch (falha) {
        linhas.innerHTML = '';
        erro.textContent = falha.message;
        erro.classList.add('visivel');
      }
    }

    busca.addEventListener('input', montarTabela);
    carregarHistorico();
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
