export function dashboardVendasPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Painel monitoramento de vendas</title>

  <style>
    :root {
      --azul:#102e49;
      --azul-claro:#edf3f9;
      --fundo:#dfe9f4;
      --verde:#15954f;
      --amarelo:#df9400;
      --vermelho:#e93d49;
      --texto:#112b55;
      --cinza:#e3eaf2;
    }

    * {
      box-sizing:border-box;
    }

    body {
      margin:0;
      min-height:100vh;
      background:linear-gradient(135deg,#edf3f9,#dfe9f4);
      color:var(--texto);
      font-family:Arial,sans-serif;
    }

    main {
      max-width:1550px;
      margin:auto;
      padding:10px 12px 34px;
    }

    .cabecalho {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:24px;
      padding:18px 34px;
      border-radius:18px;
      background:rgba(255,255,255,.92);
      box-shadow:0 8px 22px #1730521c;
    }

    h1 {
      margin:0;
      font-size:30px;
      letter-spacing:.4px;
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
      gap:18px;
      margin-top:15px;
      padding:14px 34px;
      border-radius:15px;
      background:rgba(255,255,255,.84);
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

    select {
      min-width:245px;
    }

    button {
      min-height:39px;
      border:0;
      border-radius:8px;
      padding:10px 18px;
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
      grid-template-columns:minmax(410px,.7fr) minmax(560px,1.3fr);
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
      padding:9px 10px;
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
      min-height:250px;
    }

    .gauge {
      position:relative;
      width:410px;
      max-width:100%;
      height:215px;
    }

    .gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .ponteiro {
      position:absolute;
      bottom:34px;
      left:calc(50% - 3px);
      width:6px;
      height:108px;
      border-radius:6px;
      background:var(--texto);
      transform-origin:50% 100%;
      transition:transform .25s ease;
    }

    .pino {
      position:absolute;
      bottom:27px;
      left:calc(50% - 8px);
      width:16px;
      height:16px;
      border-radius:50%;
      background:var(--texto);
    }

    .gauge strong {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      font-size:34px;
      text-align:center;
    }

    .gauge span {
      position:absolute;
      right:0;
      bottom:-21px;
      left:0;
      color:#58729a;
      font-size:15px;
      text-align:center;
    }

    .totais {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1px;
      margin:5px 36px 0;
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

    .secao-produtos {
      margin-top:16px;
    }

    .secao-produtos h2 {
      margin:0 0 12px 4px;
      font-size:21px;
    }

    .cards-produtos {
      display:grid;
      grid-template-columns:repeat(3,minmax(250px,1fr));
      gap:14px;
    }

    .produto-card {
      min-height:248px;
      padding:16px 14px;
      border-radius:16px;
      background:rgba(255,255,255,.94);
      box-shadow:0 8px 22px #1730521c;
      text-align:center;
    }

    .produto-card h3 {
      min-height:42px;
      margin:0;
      font-size:18px;
    }

    .produto-gauge {
      position:relative;
      width:210px;
      max-width:100%;
      height:122px;
      margin:7px auto 0;
    }

    .produto-gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .produto-ponteiro {
      position:absolute;
      bottom:25px;
      left:calc(50% - 2px);
      width:4px;
      height:67px;
      border-radius:4px;
      background:var(--texto);
      transform-origin:50% 100%;
    }

    .produto-gauge b {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      font-size:27px;
      text-align:center;
    }

    .produto-faturamento {
      display:block;
      margin-top:4px;
      color:#617697;
      font-size:13px;
    }

    .produto-faturamento strong {
      display:block;
      margin-top:4px;
      color:var(--texto);
      font-size:21px;
    }

    .vazio {
      grid-column:1/-1;
      padding:32px;
      border-radius:16px;
      color:#697a91;
      background:rgba(255,255,255,.92);
      text-align:center;
    }

    @media (max-width:1000px) {
      .grade-principal {
        grid-template-columns:1fr;
      }

      .cards-produtos {
        grid-template-columns:repeat(2,minmax(240px,1fr));
      }
    }

    @media (max-width:650px) {
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

      .cabecalho small {
        white-space:normal;
      }

      .filtros {
        padding:14px;
      }

      label,
      input,
      select {
        width:100%;
      }

      .voltar {
        margin:2px 0 0;
      }

      .cards-produtos {
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
            <svg viewBox="0 0 410 230" aria-hidden="true">
              <path
                d="M 52 170 A 153 153 0 0 1 358 170"
                fill="none"
                stroke="#e5ebf2"
                stroke-width="32"
              />

              <path
                d="M 52 170 A 153 153 0 0 1 156 34"
                fill="none"
                stroke="#eb5560"
                stroke-width="32"
              />

              <path
                d="M 156 34 A 153 153 0 0 1 254 34"
                fill="none"
                stroke="#f4b22f"
                stroke-width="32"
              />

              <path
                d="M 254 34 A 153 153 0 0 1 358 170"
                fill="none"
                stroke="#5dcc7b"
                stroke-width="32"
              />
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

    <section class="secao-produtos">
      <h2>Produtos</h2>
      <div id="cardsProdutos" class="cards-produtos"></div>
    </section>
  </main>

  <script>
    (function () {
      var $ = function (id) {
        return document.getElementById(id);
      };

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
        if (valor == null) {
          return '#60738e';
        }

        if (valor < .5) {
          return '#e93d49';
        }

        if (valor < .8) {
          return '#df9400';
        }

        return '#15954f';
      }

      function angulo(valor) {
        valor = Math.max(0, Math.min(numero(valor), 1));
        return -90 + valor * 180;
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
          }).join('');

        var existe = Array.from(select.options).some(
          function (opcao) {
            return opcao.value === anterior;
          }
        );

        if (existe) {
          select.value = anterior;
        }
      }

      function velocimetroProduto(produto) {
        var metaAtingida = produto.percentualMeta;
        var cor = corMeta(metaAtingida);

        var texto = metaAtingida == null
          ? '—'
          : percentual.format(metaAtingida);

        var progresso = Math.max(
          0,
          Math.min(numero(metaAtingida), 1)
        ) * 245;

        return (
          '<div class="produto-gauge">' +
            '<svg viewBox="0 0 210 130" aria-hidden="true">' +
              '<path d="M 25 105 A 80 80 0 0 1 185 105" ' +
                'fill="none" stroke="#e2e9f1" stroke-width="24"/>' +
              '<path d="M 25 105 A 80 80 0 0 1 185 105" ' +
                'fill="none" stroke="' + cor + '" stroke-width="24" ' +
                'stroke-dasharray="' + progresso.toFixed(1) + ' 245"/>' +
            '</svg>' +
            '<i class="produto-ponteiro" style="transform:rotate(' +
              angulo(metaAtingida) +
              'deg)"></i>' +
            '<b style="color:' + cor + '">' +
              texto +
            '</b>' +
          '</div>'
        );
      }

      function render(dados) {
        var vendedores = dados.vendedores || [];
        var opcoesVendedores = dados.opcoesVendedores || vendedores;
        var produtos = dados.produtos || [];

      preencherFiltro(opcoesVendedores);

        $('linhas').innerHTML =
          vendedores.map(function (vendedor) {
            var metaAtingida = vendedor.percentualMeta == null
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
          }).join('') ||
          '<tr><td colspan="3" class="sem-meta">' +
            'Nenhuma venda encontrada no período.' +
          '</td></tr>';

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

        $('cardsProdutos').innerHTML =
          produtos.map(function (produto) {
            return (
              '<article class="produto-card">' +
                '<h3>' +
                  escapar(produto.produto) +
                '</h3>' +
                velocimetroProduto(produto) +
                '<span class="produto-faturamento">' +
                  'Faturamento' +
                  '<strong>' +
                    moeda.format(numero(produto.faturamento)) +
                  '</strong>' +
                '</span>' +
              '</article>'
            );
          }).join('') ||
          '<div class="vazio">' +
            'Nenhum produto foi encontrado no período selecionado.' +
          '</div>';

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

      $('filtros').addEventListener(
        'submit',
        function (evento) {
          evento.preventDefault();
          carregar();
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
