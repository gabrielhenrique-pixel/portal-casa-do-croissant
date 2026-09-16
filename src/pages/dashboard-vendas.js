export function dashboardVendasPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Monitoramento de vendas</title>

  <style>
    :root {
      --azul:#102e49;
      --fundo:#edf3f9;
      --verde:#15954f;
      --amarelo:#df9400;
      --vermelho:#e93d49;
      --texto:#112b55;
    }

    * {
      box-sizing:border-box;
    }

    body {
      margin:0;
      background:linear-gradient(135deg,#edf3f9,#dfe9f4);
      color:var(--texto);
      font-family:Arial,sans-serif;
    }

    main {
      max-width:1500px;
      margin:auto;
      padding:18px 18px 34px;
    }

    .cabecalho {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:24px;
      padding:18px 28px;
      border-radius:18px;
      background:rgba(255,255,255,.91);
      box-shadow:0 8px 22px #1730521c;
    }

    h1 {
      margin:0;
      font-size:28px;
    }

    .cabecalho small {
      color:#6680a5;
      font-size:11px;
      font-weight:700;
      letter-spacing:4px;
      white-space:nowrap;
    }

    .filtros {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:13px;
      margin-top:15px;
      padding:14px 28px;
      border-radius:15px;
      background:rgba(255,255,255,.82);
      box-shadow:0 6px 18px #17305214;
    }

    label {
      display:grid;
      gap:5px;
      color:#17375f;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    }

    input,
    select {
      height:37px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      padding:0 10px;
      color:#142f57;
      background:#fff;
      font:inherit;
      font-size:14px;
    }

    select {
      min-width:210px;
    }

    button {
      border:0;
      border-radius:7px;
      padding:10px 16px;
      background:var(--azul);
      color:#fff;
      font:inherit;
      font-size:13px;
      font-weight:700;
      cursor:pointer;
    }

    button:hover {
      background:#1b4b7b;
    }

    button:disabled {
      cursor:wait;
      opacity:.7;
    }

    .voltar {
      margin-left:auto;
      color:var(--azul);
      font-size:13px;
      font-weight:700;
      text-decoration:none;
    }

    .estado {
      min-height:18px;
      margin:10px 2px 0;
      color:#5c6d82;
      font-size:13px;
    }

    .estado.erro {
      color:#b42331;
    }

    .grade-principal {
      display:grid;
      grid-template-columns:minmax(350px,.74fr) minmax(500px,1.26fr);
      gap:14px;
      margin-top:14px;
    }

    .painel {
      padding:18px;
      border-radius:18px;
      background:rgba(255,255,255,.94);
      box-shadow:0 8px 22px #1730521c;
    }

    .painel h2 {
      margin:0 0 12px;
      font-size:20px;
    }

    table {
      width:100%;
      border-collapse:collapse;
    }

    th,
    td {
      padding:10px 9px;
      border-bottom:1px solid #dce6f0;
      font-size:13px;
      text-align:right;
    }

    th {
      color:#26436c;
      background:#edf3fa;
      font-size:12px;
      text-align:center;
    }

    th:first-child,
    td:first-child {
      text-align:left;
    }

    .sem-meta {
      color:#7d8998;
      font-style:italic;
    }

    .gauge-total {
      display:grid;
      place-items:center;
      min-height:259px;
    }

    .gauge {
      position:relative;
      width:390px;
      max-width:100%;
      height:205px;
    }

    .gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .ponteiro {
      position:absolute;
      bottom:33px;
      left:calc(50% - 2px);
      width:4px;
      height:105px;
      border-radius:4px;
      background:#112b55;
      transform-origin:50% 100%;
      transition:transform .25s ease;
    }

    .pino {
      position:absolute;
      bottom:25px;
      left:calc(50% - 8px);
      width:16px;
      height:16px;
      border-radius:50%;
      background:#112b55;
    }

    .gauge strong {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      font-size:33px;
      text-align:center;
    }

    .gauge span {
      position:absolute;
      right:0;
      bottom:-22px;
      left:0;
      color:#58729a;
      font-size:15px;
      text-align:center;
    }

    .totais {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1px;
      margin:5px 32px 0;
      background:#d7e1ed;
    }

    .total {
      padding:12px;
      background:#fff;
      text-align:center;
    }

    .total span {
      display:block;
      color:#5a7091;
      font-size:13px;
    }

    .total strong {
      display:block;
      margin-top:5px;
      font-size:21px;
    }

    .cards {
      display:grid;
      grid-template-columns:repeat(3,minmax(220px,1fr));
      gap:14px;
      margin-top:14px;
    }

    .card {
      padding:16px 14px;
      border-radius:16px;
      background:rgba(255,255,255,.94);
      box-shadow:0 8px 22px #1730521c;
      text-align:center;
    }

    .card h3 {
      margin:0;
      font-size:18px;
    }

    .mini-gauge {
      position:relative;
      width:200px;
      max-width:100%;
      height:113px;
      margin:12px auto 2px;
    }

    .mini-gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .mini-gauge i {
      position:absolute;
      bottom:22px;
      left:calc(50% - 2px);
      width:4px;
      height:64px;
      border-radius:4px;
      background:var(--texto);
      transform-origin:50% 100%;
    }

    .mini-gauge b {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      font-size:25px;
      text-align:center;
    }

    .faturamento {
      display:block;
      margin-top:5px;
      color:#617697;
      font-size:13px;
    }

    .faturamento strong {
      display:block;
      margin-top:4px;
      color:var(--texto);
      font-size:19px;
    }

    .meta-card {
      display:flex;
      align-items:center;
      justify-content:center;
      gap:7px;
      margin-top:11px;
      color:#5a7091;
      font-size:12px;
    }

    .meta-card input {
      display:none;
      width:116px;
      height:29px;
      font-size:12px;
    }

    .meta-card button {
      padding:5px 8px;
      font-size:11px;
    }

    .meta-card.editando span,
    .meta-card.editando .editar {
      display:none;
    }

    .meta-card.editando input,
    .meta-card.editando .salvar {
      display:block;
    }

    .salvar {
      display:none;
      background:#138347;
    }

    .vazio {
      grid-column:1/-1;
      padding:32px;
      border-radius:16px;
      color:#697a91;
      background:rgba(255,255,255,.92);
      text-align:center;
    }

    @media (max-width:900px) {
      .grade-principal {
        grid-template-columns:1fr;
      }

      .cards {
        grid-template-columns:repeat(2,minmax(200px,1fr));
      }
    }

    @media (max-width:620px) {
      main {
        padding:10px;
      }

      .cabecalho {
        align-items:flex-start;
        flex-direction:column;
        padding:18px;
      }

      h1 {
        font-size:23px;
      }

      .filtros {
        padding:14px;
      }

      label,
      select,
      input {
        width:100%;
      }

      .voltar {
        margin:3px 0 0;
      }

      .cards {
        grid-template-columns:1fr;
      }

      .totais {
        margin:5px 0;
      }
    }
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <h1>PAINEL MONITORAMENTO DE VENDAS</h1>
      <small>DESEMPENHO · FOCO · RESULTADOS</small>
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

      <label>
        Vendedor
        <select id="vendedor">
          <option value="">Todos</option>
        </select>
      </label>

      <button id="atualizar" type="submit">
        ATUALIZAR DADOS
      </button>

      <a class="voltar" href="/">Página inicial</a>
    </form>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="grade-principal">
      <article class="painel">
        <h2>Vendedores</h2>

        <table>
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Total vendas</th>
              <th>Meta atingida</th>
            </tr>
          </thead>

          <tbody id="linhas"></tbody>
        </table>
      </article>

      <article class="painel">
        <h2>Faturamento total</h2>

        <div class="gauge-total">
          <div class="gauge">
            <svg viewBox="0 0 390 220" aria-hidden="true">
              <path d="M 48 164 A 147 147 0 0 1 342 164"
                fill="none"
                stroke="#e5ebf2"
                stroke-width="31"/>

              <path d="M 48 164 A 147 147 0 0 1 148 34"
                fill="none"
                stroke="#eb5560"
                stroke-width="31"/>

              <path d="M 148 34 A 147 147 0 0 1 244 34"
                fill="none"
                stroke="#f4b22f"
                stroke-width="31"/>

              <path d="M 244 34 A 147 147 0 0 1 342 164"
                fill="none"
                stroke="#5dcc7b"
                stroke-width="31"/>
            </svg>

            <i id="ponteiroTotal" class="ponteiro"></i>
            <i class="pino"></i>

            <strong id="pctTotal">—</strong>
            <span>Meta atingida</span>
          </div>
        </div>

        <div class="totais">
          <div class="total">
            <span>Faturamento realizado</span>
            <strong id="faturamentoTotal">—</strong>
          </div>

          <div class="total">
            <span>Meta total</span>
            <strong id="metaTotal">—</strong>
          </div>
        </div>
      </article>
    </section>

    <section id="cards" class="cards"></section>
  </main>

  <script>
    (function () {
      var $ = function (id) {
        return document.getElementById(id);
      };

      var dadosAtuais = null;

      var moeda = new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
      });

      var percentual = new Intl.NumberFormat('pt-BR', {
        style:'percent',
        minimumFractionDigits:0,
        maximumFractionDigits:1
      });

      function numero(valor) {
        valor = Number(valor);
        return Number.isFinite(valor) ? valor : 0;
      }

      function dataIso(data) {
        return data.getFullYear() + '-' +
          String(data.getMonth() + 1).padStart(2, '0') + '-' +
          String(data.getDate()).padStart(2, '0');
      }

      function escapar(valor) {
        var elemento = document.createElement('div');
        elemento.textContent = String(valor || '');
        return elemento.innerHTML;
      }

      function corMeta(valor) {
        if (valor == null) return '#60738e';
        if (valor < .5) return '#e93d49';
        if (valor < .8) return '#df9400';
        return '#15954f';
      }

      function angulo(valor) {
        valor = Math.max(0, Math.min(numero(valor), 1));
        return -90 + valor * 180;
      }

      function gaugePequeno(vendedor) {
  var metaAtingida = vendedor.percentualMeta;

  var texto = metaAtingida == null
    ? '—'
    : percentual.format(metaAtingida);

  var progresso = Math.max(
    0,
    Math.min(numero(metaAtingida), 1)
  ) * 245;

  return (
    '<div class="mini-gauge">' +
      '<svg viewBox="0 0 200 125" aria-hidden="true">' +
        '<path d="M 22 101 A 78 78 0 0 1 178 101" ' +
          'fill="none" stroke="#e2e9f1" stroke-width="23"/>' +
        '<path d="M 22 101 A 78 78 0 0 1 178 101" ' +
          'fill="none" stroke="' + corMeta(metaAtingida) + '" ' +
          'stroke-width="23" ' +
          'stroke-dasharray="' + progresso.toFixed(1) + ' 245"/>' +
      '</svg>' +
      '<i style="transform:rotate(' +
        angulo(metaAtingida) +
        'deg)"></i>' +
      '<b style="color:' +
        corMeta(metaAtingida) +
        '">' +
        texto +
      '</b>' +
    '</div>'
  );
}

      function preencherFiltro(vendedores) {
        var select = $('vendedor');
        var anterior = select.value;

        select.innerHTML =
          '<option value="">Todos</option>' +
          vendedores.map(function (vendedor) {
            return (
            '<option value="' +
            escapar(vendedor.codigoVendedor) +
            '">' +
            escapar(vendedor.vendedor) +
            '</option>'
          );

        var existe = Array.from(select.options).some(
          function (opcao) {
            return opcao.value === anterior;
          }
        );

        if (existe) {
          select.value = anterior;
        }
      }

      function render(dados) {
        dadosAtuais = dados;

        var vendedores = dados.vendedores || [];

        preencherFiltro(vendedores);

        $('linhas').innerHTML = vendedores.map(function (vendedor) {
          var percentualMeta = vendedor.percentualMeta == null
            ? '<span class="sem-meta">Sem meta</span>'
            : percentual.format(vendedor.percentualMeta);

          return (
          '<tr>' +
          '<td><strong>' +
          escapar(vendedor.vendedor) +
        '</strong></td>' +
    '<td>' +
      moeda.format(numero(vendedor.faturamento)) +
    '</td>' +
    '<td style="color:' +
      corMeta(vendedor.percentualMeta) +
      '">' +
      metaAtingida +
    '</td>' +
  '</tr>'
);
          '<tr><td colspan="3" class="sem-meta">Nenhuma venda encontrada no período.</td></tr>';

        $('faturamentoTotal').textContent = moeda.format(
          numero(dados.totalFaturamento)
        );

        $('metaTotal').textContent = dados.totalMeta
          ? moeda.format(numero(dados.totalMeta))
          : 'Defina as metas';

        $('pctTotal').textContent = dados.percentualMeta == null
          ? '—'
          : percentual.format(dados.percentualMeta);

        $('pctTotal').style.color = corMeta(
          dados.percentualMeta
        );

        $('ponteiroTotal').style.transform =
          'rotate(' + angulo(dados.percentualMeta) + 'deg)';

        $('cards').innerHTML = vendedores.map(function (vendedor) {
          var meta = vendedor.meta
            ? moeda.format(numero(vendedor.meta))
            : 'não definida';

          return (
  '<article class="card" data-codigo="' +
    escapar(vendedor.codigoVendedor) +
    '">' +
    '<h3>' +
      escapar(vendedor.vendedor) +
    '</h3>' +
    gaugePequeno(vendedor) +
    '<span class="faturamento">' +
      'Faturamento' +
      '<strong>' +
        moeda.format(numero(vendedor.faturamento)) +
      '</strong>' +
    '</span>' +
    '<div class="meta-card">' +
      '<span>Meta: <strong>' +
        meta +
      '</strong></span>' +
      '<button class="editar" type="button">Editar</button>' +
      '<input type="number" min="0" step="0.01" value="' +
        numero(vendedor.meta) +
      '">' +
      '<button class="salvar" type="button">Salvar</button>' +
    '</div>' +
  '</article>'
);
          '<div class="vazio">Nenhuma venda foi encontrada no período selecionado.</div>';

        $('estado').textContent = '';
        $('estado').className = 'estado';
      }

      async function carregar() {
        var botao = $('atualizar');

        botao.disabled = true;
        $('estado').textContent =
          'Consultando vendas e metas...';

        $('estado').className = 'estado';

        try {
          var url =
            '/api/vendas/monitoramento?inicio=' +
            encodeURIComponent($('inicio').value) +
            '&fim=' +
            encodeURIComponent($('fim').value) +
            '&vendedor=' +
            encodeURIComponent($('vendedor').value);

          var resposta = await fetch(url);
          var dados = await resposta.json();

          if (!resposta.ok) {
            throw Error(
              dados.error ||
              'Não foi possível carregar o monitoramento.'
            );
          }

          render(dados);
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
        }
      }

      async function salvarMeta(card) {
        var vendedor = (dadosAtuais.vendedores || []).find(
          function (item) {
            return String(item.codigoVendedor) ===
              String(card.dataset.codigo);
          }
        );

        if (!vendedor) return;

        var valor = Number(
          card.querySelector('input').value
        );

        if (!Number.isFinite(valor) || valor < 0) {
          $('estado').textContent =
            'Informe uma meta válida.';
          $('estado').className = 'estado erro';
          return;
        }

        var botao = card.querySelector('.salvar');
        botao.disabled = true;

        try {
          var resposta = await fetch(
            '/api/vendas/metas',
            {
              method:'PUT',
              headers:{
                'content-type':'application/json'
              },
              body:JSON.stringify({
                codigoVendedor:vendedor.codigoVendedor,
                vendedor:vendedor.vendedor,
                meta:valor
              })
            }
          );

          var dados = await resposta.json();

          if (!resposta.ok) {
            throw Error(
              dados.error ||
              'Não foi possível salvar a meta.'
            );
          }

          card.querySelector('.meta-card')
            .classList.remove('editando');

          await carregar();
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
        }
      }

      $('filtros').addEventListener(
        'submit',
        function (evento) {
          evento.preventDefault();
          carregar();
        }
      );

      $('cards').addEventListener(
        'click',
        function (evento) {
          var card = evento.target.closest('.card');

          if (!card) return;

          if (evento.target.classList.contains('editar')) {
            card.querySelector('.meta-card')
              .classList.add('editando');

            card.querySelector('input').focus();
          }

          if (evento.target.classList.contains('salvar')) {
            salvarMeta(card);
          }
        }
      );

      var hoje = new Date();

      $('inicio').value = dataIso(
        new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          1
        )
      );

      $('fim').value = dataIso(hoje);

      carregar();
    })();
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff'
    }
  });
}
