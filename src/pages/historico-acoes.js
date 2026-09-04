export function historicoAcoesPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Histórico de ações | Casa do Croissant</title>
  <style>
    :root {
      --verde:#168447;
      --escuro:#0d4b2b;
      --fundo:#f6f8f7;
      --texto:#183128;
      --borda:#d6e4dd;
    }

    * { box-sizing:border-box; }

    body {
      margin:0;
      min-height:100vh;
      font-family:Arial,sans-serif;
      color:var(--texto);
      background:var(--fundo);
    }

    main {
      max-width:1400px;
      margin:0 auto;
      padding:34px 36px 48px;
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
      flex:0 0 48px;
      border-radius:50%;
      background:var(--escuro);
      color:#fff;
      text-decoration:none;
      font-size:26px;
      font-weight:700;
    }

    h1 {
      margin:0;
      font-size:27px;
    }

    .subtitulo {
      margin:5px 0 0;
      color:#66746d;
    }

    .busca {
      width:380px;
      max-width:100%;
      height:42px;
      margin-bottom:10px;
      padding:0 12px;
      border:1px solid #b9cfc3;
      border-radius:7px;
      background:#fff;
      font:inherit;
    }

    .tabela-area {
      overflow-x:auto;
      border:1px solid var(--borda);
      border-radius:10px;
      background:#fff;
    }

    table {
      width:100%;
      min-width:850px;
      border-collapse:collapse;
    }

    th, td {
      padding:12px;
      border-bottom:1px solid #e3ece7;
      text-align:left;
      font-size:14px;
    }

    th {
      background:#edf6f0;
      color:#123d2d;
    }

    tr:last-child td {
      border-bottom:0;
    }

    .vazio, .carregando {
      padding:34px;
      color:#66746d;
      text-align:center;
    }

    .erro {
      display:none;
      margin:14px 0;
      padding:12px 14px;
      border-radius:7px;
      background:#fde5e2;
      color:#a22b24;
    }

    .erro.visivel {
      display:block;
    }

    @media (max-width:700px) {
      main { padding:24px 16px; }
    }
  </style>
</head>
<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/" aria-label="Voltar à Página inicial">↩</a>
      <div>
        <h1>Histórico de ações</h1>
        <p class="subtitulo">Ações realizadas no Portal Casa do Croissant.</p>
      </div>
    </header>

    <input
      id="busca"
      class="busca"
      type="search"
      placeholder="Pesquisar usuário, ação ou detalhe">

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
