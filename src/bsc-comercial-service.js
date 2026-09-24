export function bscComercialPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BSC Comercial</title>

  <style>
    :root {
      --navy:#102e49;
      --green:#0f6a46;
      --green-light:#e8f6ee;
      --bg:#eef3f6;
      --line:#d7e1e8;
      --ink:#12314d;
    }

    * { box-sizing:border-box; }

    body {
      margin:0;
      background:var(--bg);
      color:var(--ink);
      font-family:Arial,sans-serif;
    }

    main {
      max-width:1440px;
      margin:auto;
      padding:6px 8px 38px;
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
      gap:8px;
      flex-shrink:0;
    }

    .nav-icone {
      display:grid;
      place-items:center;
      width:48px;
      height:48px;
      border-radius:50%;
      background:#fff;
      color:var(--navy);
      box-shadow:0 5px 15px #1730521c;
      font-size:25px;
      font-weight:700;
      text-decoration:none;
    }

    .marca {
      color:var(--navy);
      font-size:30px;
      font-weight:700;
    }

    .controles {
      display:flex;
      align-items:end;
      gap:18px;
      margin-top:15px;
      padding:14px 34px;
      border-radius:15px;
      background:rgba(255,255,255,.84);
      box-shadow:0 6px 18px #17305214;
    }

    .campo {
      display:grid;
      gap:5px;
      color:#17375f;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    }

    input[type=date] {
      width:175px;
      height:39px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      padding:0 10px;
      color:#142f57;
      background:#fff;
      font-size:14px;
      font-weight:700;
    }

    .abas {
      display:flex;
      gap:10px;
      margin-top:15px;
    }

    .aba {
      min-width:190px;
      padding:14px 18px;
      border:0;
      border-radius:10px;
      background:linear-gradient(135deg,#168454,#0d5e3d);
      box-shadow:0 7px 15px #0f5b3c2e;
      color:#fff;
      font-size:13px;
      font-weight:700;
      text-transform:uppercase;
    }

    .estado {
      min-height:18px;
      margin:14px 2px 8px;
      color:#5c7082;
      font-size:13px;
    }

    .estado.erro { color:#b42318; }

    .painel {
      overflow:hidden;
      border-radius:18px;
      background:#fff;
      box-shadow:0 8px 22px #1730521c;
    }

    .titulo-painel {
      padding:17px 24px;
      background:linear-gradient(135deg,#153b5d,#102e49);
      color:#fff;
      font-size:20px;
      font-weight:700;
      text-transform:uppercase;
    }

    .tabela-area { overflow:auto; }

    table {
      width:100%;
      min-width:850px;
      border-collapse:collapse;
    }

    th {
      padding:12px 10px;
      border-bottom:1px solid var(--line);
      background:#edf4f8;
      color:#244665;
      font-size:12px;
      text-align:right;
      text-transform:uppercase;
    }

    th:first-child,
    th:nth-child(2) { text-align:left; }

    td {
      padding:11px 10px;
      border-bottom:1px solid #e5edf2;
      color:#173957;
      font-size:14px;
      text-align:right;
    }

    td:first-child,
    td:nth-child(2) { text-align:left; }

    tbody tr:nth-child(even) { background:#f8fbfd; }

    .codigo {
      color:#597087;
      font-family:monospace;
    }

    .positivo { color:#098543; font-weight:700; }
    .negativo { color:#c24132; font-weight:700; }
    .neutro { color:#6c7f90; }

    tfoot td {
      border:0;
      background:#163a5a;
      color:#fff;
      font-size:15px;
      font-weight:700;
    }

    @media (max-width:700px) {
      main { padding:5px 4px 26px; }

      .topo,
      .controles { padding:14px; }

      .marca { font-size:22px; }

      .controles {
        align-items:stretch;
        flex-direction:column;
      }

      input[type=date] { width:100%; }

      .abas { overflow:auto; }

      .titulo-painel { font-size:16px; }
    }
  </style>
</head>

<body>
  <main>
    <header class="topo">
      <nav class="navegacao-topo" aria-label="Navegação">
        <a class="nav-icone" href="/dashboards" aria-label="Voltar aos dashboards">←</a>
        <a class="nav-icone" href="/" aria-label="Voltar à página inicial">⌂</a>
      </nav>

      <div class="marca">BSC COMERCIAL</div>
    </header>

    <form class="controles">
      <label class="campo">
        Data inicial
        <input id="inicio" type="date" required>
      </label>

      <label class="campo">
        Data final
        <input id="fim" type="date" required>
      </label>
    </form>

    <section class="abas" aria-label="Abas do BSC">
      <button class="aba" type="button">Volume por produto</button>
    </section>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="painel">
      <div class="titulo-painel">BSC Comercial - Volume por Produto</div>

      <div class="tabela-area">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th id="tituloAnterior">Período anterior</th>
              <th id="tituloAtual">Período selecionado</th>
              <th>Variação</th>
            </tr>
          </thead>

          <tbody id="linhas"></tbody>

          <tfoot>
            <tr>
              <td colspan="2">TOTAL</td>
              <td id="totalAnterior">—</td>
              <td id="totalAtual">—</td>
              <td id="variacaoTotal">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </main>

  <script>
    (function() {
      var $ = function(id) {
        return document.getElementById(id);
      };

      function iso(data) {
        return (
          data.getFullYear() +
          '-' +
          String(data.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(data.getDate()).padStart(2, '0')
        );
      }

      function textoPeriodo(inicio, fim) {
        return formatarData(inicio) + ' a ' + formatarData(fim);
      }

      function formatarData(data) {
        var partes = String(data || '').split('-');

        if (partes.length !== 3) return '—';

        return partes[2] + '/' + partes[1] + '/' + partes[0];
      }

      function quantidade(valor) {
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(Number(valor || 0));
      }

      function percentual(valor) {
        if (valor === null || valor === undefined) return '—';

        return new Intl.NumberFormat('pt-BR', {
          style:'percent',
          minimumFractionDigits:1,
          maximumFractionDigits:1
        }).format(Number(valor));
      }

      function classeVariacao(valor) {
        if (valor === null || valor === undefined) return 'neutro';
        if (valor > 0) return 'positivo';
        if (valor < 0) return 'negativo';
        return 'neutro';
      }

      function escapar(valor) {
        var mapa = {
          '&':'&amp;',
          '<':'&lt;',
          '>':'&gt;',
          '"':'&quot;',
          "'":'&#039;'
        };

        return String(valor || '').replace(/[&<>"']/g, function(letra) {
          return mapa[letra];
        });
      }

      function renderizar(dados) {
        var produtos = Array.isArray(dados.produtos) ? dados.produtos : [];

        $('tituloAnterior').textContent =
          'Volume ' + textoPeriodo(dados.inicioAnterior, dados.fimAnterior);

        $('tituloAtual').textContent =
          'Volume ' + textoPeriodo(dados.inicio, dados.fim);

        $('linhas').innerHTML = produtos.map(function(produto) {
          return (
            '<tr>' +
              '<td class="codigo">' + escapar(produto.codigoProduto) + '</td>' +
              '<td>' + escapar(produto.produto) + '</td>' +
              '<td>' + quantidade(produto.quantidadeAnterior) + '</td>' +
              '<td>' + quantidade(produto.quantidadeAtual) + '</td>' +
              '<td class="' + classeVariacao(produto.variacao) + '">' +
                percentual(produto.variacao) +
              '</td>' +
            '</tr>'
          );
        }).join('');

        $('totalAnterior').textContent = quantidade(dados.totalAnterior);
        $('totalAtual').textContent = quantidade(dados.totalAtual);

        $('variacaoTotal').textContent = percentual(dados.variacaoTotal);
        $('variacaoTotal').className = classeVariacao(dados.variacaoTotal);

        $('estado').textContent =
          produtos.length + ' produtos encontrados no Sankhya.';
        $('estado').className = 'estado';
      }

      async function carregar() {
        var inicio = $('inicio').value;
        var fim = $('fim').value;

        if (!inicio || !fim) return;

        $('estado').textContent = 'Consultando volume por produto...';
        $('estado').className = 'estado';

        try {
          var resposta = await fetch(
            '/api/bsc/volume-produto?inicio=' +
              encodeURIComponent(inicio) +
              '&fim=' +
              encodeURIComponent(fim),
            { cache:'no-store' }
          );

          var dados = await resposta.json();

          if (!resposta.ok) {
            throw Error(
              dados.error || 'Não foi possível consultar o BSC.'
            );
          }

          renderizar(dados);
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
          $('linhas').innerHTML = '';
          $('totalAnterior').textContent = '—';
          $('totalAtual').textContent = '—';
          $('variacaoTotal').textContent = '—';
        }
      }

      var hoje = new Date();

      $('inicio').value = iso(
        new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      );

      $('fim').value = iso(hoje);

      $('inicio').addEventListener('change', carregar);
      $('fim').addEventListener('change', carregar);

      carregar();
    })();
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
