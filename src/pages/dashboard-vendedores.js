export function dashboardVendedoresPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Vendedores | Monitoramento de vendas</title>

  <style>
    *{box-sizing:border-box}
    body{
      margin:0;
      min-height:100vh;
      background:linear-gradient(135deg,#edf3f9,#dfe9f4);
      color:#17355f;
      font-family:Arial,sans-serif;
    }
    main{max-width:1550px;margin:auto;padding:10px 12px 34px}
    .cabecalho{
      display:flex;
      align-items:center;
      gap:16px;
      padding:18px 34px;
      border-radius:18px;
      background:#fff;
      box-shadow:0 8px 22px #1730521c;
    }
    .navegacao-topo{display:flex;gap:8px;flex-shrink:0}
    .nav-icone{
      display:grid;
      width:48px;
      height:48px;
      place-items:center;
      border-radius:50%;
      background:#fff;
      box-shadow:0 5px 15px #1730521c;
      color:#102e49;
      font-size:25px;
      font-weight:700;
      text-decoration:none;
    }
    h1{margin:0;font-size:30px}
    .filtros{
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:18px;
      margin-top:15px;
      padding:14px 34px;
      border-radius:15px;
      background:#fff;
      box-shadow:0 6px 18px #17305214;
    }
    label{
      display:grid;
      gap:5px;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    }
    input{
      height:39px;
      min-width:175px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      padding:0 10px;
      color:#142f57;
      background:#fff;
      font:inherit;
      font-size:14px;
    }
    button{
      min-height:39px;
      border:0;
      border-radius:8px;
      padding:10px 18px;
      background:#102e49;
      color:#fff;
      font:inherit;
      font-size:13px;
      font-weight:700;
      cursor:pointer;
    }
    button:disabled{opacity:.6;cursor:wait}
    .estado{min-height:18px;margin:12px 2px;font-size:13px}
    .erro{color:#b42331}
    .tabela-wrap{
      overflow:auto;
      border-radius:14px;
      background:#fff;
      box-shadow:0 8px 22px #1730521c;
    }
    table{
      width:100%;
      min-width:900px;
      border-collapse:collapse;
      font-size:13px;
    }
    th{
      padding:14px 12px;
      background:#1f4e78;
      color:#fff;
      text-align:right;
      white-space:nowrap;
    }
    td{
      padding:13px 12px;
      border-bottom:1px solid #dce6f0;
      text-align:right;
      white-space:nowrap;
    }
    th:first-child,td:first-child{text-align:left}
    tbody tr:nth-child(even){background:#f3f7fc}
    .devolucao{color:#b42331}
    .atingida{color:#087a40;font-weight:700}
    .vazio{text-align:center;padding:28px;color:#60718b}
    @media(max-width:650px){
      main{padding:8px 10px 24px}
      .cabecalho{gap:10px;padding:14px}
      .nav-icone{width:40px;height:40px;font-size:21px}
      h1{font-size:20px}
      .filtros{padding:14px;gap:12px}
      .filtros label,.filtros button{width:100%}
      input{width:100%;min-width:0}
    }
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <nav class="navegacao-topo" aria-label="Navegação">
        <a id="voltar" class="nav-icone"
           href="/dashboard-vendas"
           aria-label="Voltar ao monitoramento">←</a>
        <a class="nav-icone" href="/"
           aria-label="Voltar à página inicial">⌂</a>
      </nav>
      <h1>VENDEDORES</h1>
    </header>

    <form id="filtros" class="filtros">
      <label>
        Data inicial
        <input id="inicio" type="date" required>
      </label>
      <label>
        Data final
        <input id="fim" type="date" required>
      </label>
      <button id="atualizar" type="submit">ATUALIZAR DADOS</button>
    </form>

    <p id="estado" class="estado" role="status"></p>

    <section class="tabela-wrap">
      <table aria-label="Resultados por vendedor">
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Total vendido</th>
            <th>Meta em dinheiro</th>
            <th>Meta atingida</th>
            <th>Pedidos a faturar</th>
            <th>Total de devoluções</th>
          </tr>
        </thead>
        <tbody id="linhas"></tbody>
      </table>
    </section>
  </main>

  <script>
  (function () {
    var $ = function (id) {
      return document.getElementById(id);
    };

    var moeda = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    var percentual = new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

    var carregando = false;

    function dataIso(data) {
      return data.getFullYear() + '-' +
        String(data.getMonth() + 1).padStart(2, '0') + '-' +
        String(data.getDate()).padStart(2, '0');
    }

    function render(vendedores) {
      var fragmento = document.createDocumentFragment();

      vendedores.forEach(function (vendedor) {
        var linha = document.createElement('tr');

        var valores = [
  vendedor.vendedor,

  vendedor.faturamento == null
    ? '—'
    : moeda.format(vendedor.faturamento),

  vendedor.meta == null
    ? '—'
    : moeda.format(vendedor.meta),

  vendedor.percentualMeta == null
    ? '—'
    : percentual.format(vendedor.percentualMeta),

  vendedor.pedidosAFaturar == null
    ? '—'
    : moeda.format(vendedor.pedidosAFaturar),

  vendedor.devolucoes == null
    ? '—'
    : moeda.format(vendedor.devolucoes)
];

        valores.forEach(function (valor, indice) {
          var celula = document.createElement('td');
          celula.textContent = valor;

          if (indice === 5) celula.className = 'devolucao';
          if (indice === 3 && vendedor.percentualMeta != null) {
  var selo = document.createElement('span');
  selo.textContent = valor;

  var metaAlta = vendedor.percentualMeta >= 0.8;
  var metaBaixa = vendedor.percentualMeta < 0.4;

  selo.style.cssText =
    'display:inline-block;' +
    'min-width:58px;' +
    'padding:5px 10px;' +
    'border-radius:999px;' +
    'text-align:center;' +
    'font-size:12px;' +
    'font-weight:700;' +
    'background:' +
     (metaAlta ? '#dcfce7' : metaBaixa ? '#fee2e2' : '#fff3cd') + ';' +
    'color:' +
     (metaAlta ? '#008a45' : metaBaixa ? '#dc2626' : '#ef8500') + ';';

  celula.replaceChildren(selo);
}

          linha.appendChild(celula);
        });

        fragmento.appendChild(linha);
      });

      if (!vendedores.length) {
        var linha = document.createElement('tr');
        var celula = document.createElement('td');

        celula.colSpan = 6;
        celula.className = 'vazio';
        celula.textContent = 'Nenhum vendedor disponível.';

        linha.appendChild(celula);
        fragmento.appendChild(linha);
      }

      $('linhas').replaceChildren(fragmento);
    }

    async function carregar() {
      if (carregando) return;

      if (!$('inicio').value || !$('fim').value ||
          $('inicio').value > $('fim').value) {
        $('estado').className = 'estado erro';
        $('estado').textContent = 'Informe um período válido.';
        return;
      }

      carregando = true;
      $('atualizar').disabled = true;
      $('estado').className = 'estado';
      $('estado').textContent = 'Carregando vendedores...';
      $('linhas').replaceChildren();

      var parametros = new URLSearchParams({
        inicio: $('inicio').value,
        fim: $('fim').value,
        detalhes: 'vendedores'
      });

      try {
        var resposta = await fetch(
          '/api/vendas/monitoramento?' + parametros.toString(),
          {
            credentials: 'same-origin',
            cache: 'no-store'
          }
        );

        var dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.error || 'Não foi possível carregar.');
        }

        render(dados.vendedores || []);

        $('voltar').href = '/dashboard-vendas?' +
          new URLSearchParams({
            inicio: dados.inicio,
            fim: dados.fim
          }).toString();

        $('estado').textContent = '';
      } catch (erro) {
        $('estado').className = 'estado erro';
        $('estado').textContent = erro.message;
      } finally {
        carregando = false;
        $('atualizar').disabled = false;
      }
    }

    var hoje = new Date();
    var parametros = new URLSearchParams(location.search);

    $('inicio').value = dataIso(
      new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    );
    $('fim').value = dataIso(hoje);

    ['inicio', 'fim'].forEach(function (campo) {
      var valor = parametros.get(campo);

      if (/^\d{4}-\d{2}-\d{2}$/.test(valor || '')) {
        $(campo).value = valor;
      }
    });

    $('filtros').addEventListener('submit', function (evento) {
      evento.preventDefault();
      carregar();
    });

    carregar();
  })();
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}
