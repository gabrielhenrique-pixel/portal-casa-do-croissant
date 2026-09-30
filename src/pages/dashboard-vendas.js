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
      --fundo:#edf3f9;
      --verde:#00ad4f;
      --texto:#17355f;
      --cinza:#a7a7a7;
      --borda:#d3dce8;
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
      width:48px;
      height:48px;
      place-items:center;
      border-radius:50%;
      background:#fff;
      box-shadow:0 5px 15px #1730521c;
      color:var(--azul);
      font-size:25px;
      font-weight:700;
      text-decoration:none;
      transition:transform .15s,background .15s;
    }

    .nav-icone:hover {
      background:#edf3f9;
      transform:translateY(-2px);
    }

    h1 {
      flex:1;
      margin:0;
      font-size:30px;
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

        .painel-ranking {
      padding:14px 10px 12px;
    }

    .painel-ranking h2 {
      margin:0 8px 10px;
      font-size:20px;
    }

        .ranking-tabela {
      border-collapse:separate;
      border-spacing:0 6px;
    }

    .ranking-tabela th {
      padding:0 10px 4px;
      border:0;
      background:transparent;
      color:#6c7d95;
      font-size:10px;
      font-weight:700;
      text-align:left;
      text-transform:uppercase;
    }

    .ranking-tabela th:nth-child(2),
    .ranking-tabela th:nth-child(3) {
      text-align:right;
    }

    .ranking-tabela td {
      padding:6px 10px;
      border:0;
      background:#f3f7fc;
      color:#132d57;
      font-size:12px;
      font-weight:700;
    }

    .ranking-tabela td:first-child {
      width:48%;
      border-radius:9px 0 0 9px;
      text-align:left;
    }

    .ranking-tabela td:nth-child(2) {
      width:31%;
      white-space:nowrap;
      text-align:right;
    }

    .ranking-tabela td:last-child {
      width:21%;
      border-radius:0 9px 9px 0;
      text-align:right;
    }

        .ranking-vendedor {
      white-space:nowrap;
    }

    .ranking-vendedor .ranking-posicao {
      margin-right:9px;
      vertical-align:middle;
    }

        .ranking-vendedor strong {
         vertical-align:middle;
         font-weight:400;
        }
    
    .ranking-posicao {
      display:inline-flex;
      width:28px;
      height:20px;
      flex:0 0 28px;
      align-items:center;
      justify-content:center;
      border-radius:999px;
      background:#e8eef6;
      color:#60718b;
      font-size:11px;
      font-weight:700;
    }

    .ranking-meta {
      display:inline-flex;
      min-width:54px;
      height:22px;
      align-items:center;
      justify-content:center;
      padding:0 8px;
      border-radius:999px;
      font-size:11px;
      font-weight:700;
    }

    .ranking-meta--verde {
      background:#ddf8e7;
      color:#07984a;
    }

    .ranking-meta--amarela {
      background:#fff2d2;
      color:#e88a00;
    }

    .ranking-meta--vermelha {
      background:#ffe0e4;
      color:#e64050;
    }

    .ranking-meta--sem {
      background:#e8eef5;
      color:#60718b;
      font-weight:400;
    }

        .ranking-primeiro td {
      padding:10px 11px;
      background:#fffaf0;
      border-top:1px solid #ffd273;
      border-bottom:1px solid #ffd273;
      font-size:15px;
    }

    .ranking-primeiro td:first-child {
      border-left:1px solid #ffd273;
    }

    .ranking-primeiro td:last-child {
      border-right:1px solid #ffd273;
    }

        .ranking-primeiro .ranking-posicao {
      width:32px;
      height:24px;
      margin-right:10px;
      background:transparent;
      color:#d78a00;
      font-size:13px;
    }

    .ranking-primeiro .ranking-meta {
      min-width:60px;
      height:26px;
      font-size:12px;
    }

    .gauge-total {
    display:grid;
    place-items:center;
    min-height:290px;
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
      background:#112b55;
      transform-origin:50% 100%;
    }

    .pino {
      position:absolute;
      bottom:27px;
      left:calc(50% - 8px);
      width:16px;
      height:16px;
      border-radius:50%;
      background:#112b55;
    }

    .gauge strong {
    position:absolute;
    right:0;
    bottom:-28px;
    left:0;
    font-size:34px;
    text-align:center;
   }

      .gauge span {
      position:absolute;
      right:0;
      bottom:-49px;
      left:0;
      color:#58729a;
      font-size:15px;
      text-align:center;
    }

    .totais {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1px;
      margin:22px 36px 0;
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

    .secao-grupos {
      margin-top:16px;
    }

    .cards-grupos {
      display:grid;
      grid-template-columns:repeat(3,minmax(250px,1fr));
      gap:14px;
    }

    .grupo-card {
      min-height:215px;
      padding:14px;
      border-radius:32px;
      background:#fff;
      box-shadow:0 2px 3px #0005;
      text-align:center;
    }

    .grupo-card h3 {
      margin:0;
      color:#42526c;
      font-size:16px;
    }

    .grupo-gauge {
      position:relative;
      width:190px;
      height:128px;
      margin:10px auto 0;
    }

    .grupo-gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .grupo-ponteiro {
      position:absolute;
      bottom:28px;
      left:calc(50% - 2px);
      width:4px;
      height:64px;
      border-radius:4px;
      background:#111;
      transform-origin:50% 100%;
    }

    .grupo-gauge b {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      color:#23588d;
      font-size:19px;
      text-align:center;
    }

        .grupo-resumo {
      margin: 5px 0 0;
      color: #60718b;
      font-size: 12px;
      line-height: 1.4;
    }

    .acoes-metas {
      display:flex;
      justify-content:center;
      margin-top:20px;
    }

    .botao-metas {
      min-width:190px;
      background:#117445;
    }

    .botao-metas:hover {
      background:#0d6039;
    }

    .modal {
      position:fixed;
      z-index:10;
      inset:0;
      display:none;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#102e4988;
    }

    .modal.aberto {
      display:flex;
    }

    .janela-metas {
      width:min(100%,680px);
      max-height:90vh;
      overflow:auto;
      padding:24px;
      border-radius:18px;
      background:#fff;
      box-shadow:0 18px 50px #0005;
    }

    .janela-metas h2 {
      margin:0;
      color:#102e49;
    }

    .janela-metas p {
      margin:7px 0 18px;
      color:#617697;
      font-size:14px;
    }

    .meta-total {
      display:grid;
      grid-template-columns:1fr 180px;
      align-items:center;
      gap:12px;
      margin-bottom:14px;
      padding:14px;
      border-radius:10px;
      background:#e9f2fb;
      color:#102e49;
      font-weight:700;
    }

    .meta-total input {
      min-width:0;
      border:0;
      background:#fff;
      text-align:right;
      font-weight:700;
    }

    .lista-metas {
      display:grid;
      gap:8px;
    }

    .linha-meta {
      display:grid;
      grid-template-columns:1fr 180px;
      align-items:center;
      gap:12px;
      padding:10px 0;
      border-bottom:1px solid #e2e9f1;
    }

    .linha-meta strong {
      font-size:14px;
    }

    .linha-meta input {
      min-width:0;
      text-align:right;
    }

    .acoes-modal {
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:20px;
    }

    .cancelar {
      border:1px solid #b8c8d8;
      background:#fff;
      color:#17355f;
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

      .cards-grupos {
        grid-template-columns:repeat(2,minmax(240px,1fr));
      }
    }

    @media (max-width:650px) {
      main {
        padding:10px;
      }

      .cabecalho {
        gap:12px;
        padding:16px;
      }

      .nav-icone {
        width:42px;
        height:42px;
        font-size:22px;
      }

      h1 {
        font-size:23px;
      }

      .filtros {
        padding:14px;
      }

      label,
      input,
      select {
        width:100%;
      }


      .cards-grupos {
        grid-template-columns:1fr;
      }

      .totais {
        margin:5px 0;
      }

      .meta-total,
      .linha-meta {
        grid-template-columns:1fr;
      }
    }

     .selecionar-vendedor {
  padding:3px 5px;
  border:0;
  border-radius:4px;
  background:transparent;
  color:inherit;
  font-family:inherit;
  font-size:inherit;
  font-weight:400;
  text-align:left;
  vertical-align:middle;
  cursor:pointer;
}

.selecionar-vendedor:hover {
  background:#e0edf8;
  color:#12558d;
}

.selecionar-vendedor[aria-pressed="true"] {
  background:#dcefe5;
  color:#0d5e3d;
  font-weight:700;
}

.selecionar-vendedor:focus-visible {
  outline:2px solid #60a5fa;
  outline-offset:2px;
}

.ranking-tabela .ranking-linha {
  cursor:pointer;
  transition:transform .18s ease, filter .18s ease;
}

.ranking-tabela .ranking-linha td {
  transition:
    background-color .18s ease,
    color .18s ease,
    box-shadow .18s ease;
}

.ranking-tabela .ranking-linha:hover {
  transform:translateY(-2px);
  filter:drop-shadow(0 3px 4px #163a5a20);
}

.ranking-tabela .ranking-linha:hover td {
  background:#e6f0f8;
}

.ranking-tabela .ranking-linha:active {
  transform:translateY(0);
}

.ranking-tabela .ranking-selecionado td {
  background:#dcefe5;
  color:#0d5e3d;
  border-color:transparent;
  box-shadow:
    inset 0 1px #168454,
    inset 0 -1px #168454;
}

.ranking-tabela .ranking-selecionado td:first-child {
  box-shadow:
    inset 3px 0 #168454,
    inset 0 1px #168454,
    inset 0 -1px #168454;
}

.ranking-tabela .ranking-selecionado td:last-child {
  box-shadow:
    inset -1px 0 #168454,
    inset 0 1px #168454,
    inset 0 -1px #168454;
}

.ranking-tabela .ranking-selecionado:hover td {
  background:#cee7db;
}

.ranking-tabela .selecionar-vendedor,
.ranking-tabela .selecionar-vendedor:hover,
.ranking-tabela .selecionar-vendedor[aria-pressed="true"] {
  background:transparent;
  color:inherit;
}

.ranking-tabela .ranking-selecionado .selecionar-vendedor {
  font-weight:700;
}

@media (prefers-reduced-motion:reduce) {
  .ranking-tabela .ranking-linha,
  .ranking-tabela .ranking-linha td {
    transition:none;
  }

  .ranking-tabela .ranking-linha:hover {
    transform:none;
  }
}
    
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <nav class="navegacao-topo" aria-label="Navegação">
        <a class="nav-icone" href="/dashboards" aria-label="Voltar aos dashboards">←</a>
        <a class="nav-icone" href="/" aria-label="Voltar à página inicial">⌂</a>
      </nav>
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

    </form>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="grade-principal">
            <article class="painel painel-ranking">
        <h2>Vendedores</h2>

                <table class="ranking-tabela" aria-label="Ranking de vendedores por meta atingida">
          <thead>
            <tr>
              <th aria-label="Posição e nome"></th>
              <th>Total vendido</th>
              <th>Meta</th>
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

    <section class="secao-grupos">
      <div id="cardsGrupos" class="cards-grupos"></div>

      <div class="acoes-metas">
        <button id="abrirMetas" class="botao-metas" type="button">
          ATUALIZAR METAS
        </button>
      </div>
    </section>
  </main>

  <script>
(function () {
  var $ = function (id) {
    return document.getElementById(id);
  };

  var GRUPOS = [
    'Croissant TO GO',
    'Biscoitos',
    'Amêndoas',
    'Pão croissant 10un',
    'Pão Croissant 125g',
    'Pão Croissant 250g'
  ];

  var caixas = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2
  });

  var moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  var percentual = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
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
    elemento.textContent = String(valor ?? '');
    return elemento.innerHTML;
  }

  function corMeta(valor) {
    if (valor == null) {
      return '#60738e';
    }

    if (valor < .39) {
      return '#eb5560';
    }

    if (valor < .61) {
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

  function velocimetroGrupo(grupo) {
    var participacao = grupo.participacao;

    var progresso = Math.max(
      0,
      Math.min(numero(participacao), 1)
    ) * 245;

    var textoPercentual;

    if (grupo.semConversao) {
      textoPercentual = '—';
    } else if (participacao == null) {
      textoPercentual = 'Sem meta';
    } else {
      textoPercentual = percentual.format(participacao);
    }

    return (
      '<div class="grupo-gauge">' +
        '<svg viewBox="0 0 190 130" aria-hidden="true">' +
          '<path d="M 20 105 A 75 75 0 0 1 170 105" ' +
            'fill="none" stroke="#a7a7a7" stroke-width="25"/>' +
          '<path d="M 20 105 A 75 75 0 0 1 170 105" ' +
            'fill="none" stroke="#00ad4f" stroke-width="25" ' +
            'stroke-dasharray="' +
              progresso.toFixed(1) +
              ' 245"/>' +
        '</svg>' +
        '<i class="grupo-ponteiro" style="transform:rotate(' +
          angulo(participacao) +
          'deg)"></i>' +
        '<b>' +
          textoPercentual +
        '</b>' +
      '</div>'
    );
  }

    function montarGrupos(produtos) {
    return produtos.map(function (produto) {
      return {
        nome: produto.produto,
        caixasVendidas: produto.caixasVendidas,
        metaCaixas: numero(produto.metaCaixas),
        semConversao: numero(produto.semConversao),

        participacao: produto.percentualMeta == null
          ? null
          : numero(produto.percentualMeta)
      };
    });
  }


  function render(dados) {
    $('abrirMetas').textContent = dados.podeEditarMetas
      ? 'ATUALIZAR METAS'
      : 'CONSULTAR METAS';

    var vendedores = dados.vendedores || [];

    var vendedorSelecionado = String(
      dados.vendedorSelecionado || ''
    );

    var opcoesVendedores =
      dados.opcoesVendedores || vendedores;

    var produtos = dados.produtos || [];
    var grupos = montarGrupos(produtos);

    preencherFiltro(opcoesVendedores);
    $('vendedor').value = vendedorSelecionado;

    $('linhas').innerHTML =
      vendedores.map(function (vendedor, indice) {
        var semMeta = vendedor.percentualMeta == null;

        var metaAtingida = semMeta
          ? 'Sem meta'
          : percentual.format(vendedor.percentualMeta);

        var classeMeta = 'ranking-meta--sem';

        if (!semMeta && vendedor.percentualMeta < .39) {
          classeMeta = 'ranking-meta--vermelha';
        } else if (!semMeta && vendedor.percentualMeta < .61) {
          classeMeta = 'ranking-meta--amarela';
        } else if (!semMeta) {
          classeMeta = 'ranking-meta--verde';
        }

        var selecionado =
          String(vendedor.codigoVendedor) === vendedorSelecionado;

        return (
          '<tr class="ranking-linha' +
            (indice === 0 ? ' ranking-primeiro' : '') +
            (selecionado ? ' ranking-selecionado' : '') +
          '" data-linha-vendedor="' +
            escapar(vendedor.codigoVendedor) +
          '">' +
            '<td class="ranking-vendedor">' +
              '<span class="ranking-posicao">' +
                (indice + 1) +
                'º</span>' +
              '<button type="button" class="selecionar-vendedor"' +
                ' data-selecionar-vendedor="' +
                  escapar(vendedor.codigoVendedor) + '"' +
                ' aria-pressed="' +
                  (selecionado ? 'true' : 'false') +
                '">' +
                escapar(vendedor.vendedor) +
              '</button>' +
            '</td>' +
            '<td>' +
              (
                vendedorSelecionado && !selecionado
                  ? '—'
                  : moeda.format(numero(vendedor.faturamento))
              ) +
            '</td>' +
            '<td>' +
              '<span class="ranking-meta ' +
                classeMeta +
              '">' +
                metaAtingida +
              '</span>' +
            '</td>' +
          '</tr>'
        );
      }).join('') ||
      '<tr><td colspan="3" class="sem-meta">' +
        'Nenhuma venda encontrada no período.' +
      '</td>';

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

    $('cardsGrupos').innerHTML =
      grupos.map(function (grupo) {
        var textoVendas = grupo.semConversao
          ? 'Verificar conversão em caixas no Sankhya'
          : caixas.format(numero(grupo.caixasVendidas)) +
            ' cx vendidas';

        return (
          '<article class="grupo-card">' +
            '<h3>' +
              escapar(grupo.nome) +
            '</h3>' +
            velocimetroGrupo(grupo) +
            '<p class="grupo-resumo">' +
              textoVendas +
            '</p>' +
            '<p class="grupo-resumo">' +
              'Meta: ' +
              caixas.format(grupo.metaCaixas) +
              ' cx' +
            '</p>' +
          '</article>'
        );
      }).join('');

        $('estado').textContent = grupos.length
      ? ''
      : 'Nenhum produto habilitado. Confira o Cadastro de produtos.';
    $('estado').className = 'estado';
  }

  function abrirMetas() {
    var parametros = new URLSearchParams({
      inicio: $('inicio').value,
      fim: $('fim').value,
      vendedor: $('vendedor').value
    });

    window.location.href =
      '/dashboard-vendas/metas?' + parametros.toString();
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

  $('filtros').addEventListener('submit', function (evento) {
    evento.preventDefault();
    carregar();
  });

  $('linhas').addEventListener('click', function (evento) {
    var linha = evento.target.closest('[data-linha-vendedor]');

    if (!linha || $('atualizar').disabled) {
      return;
    }

    var codigo = linha.dataset.linhaVendedor;
    var filtro = $('vendedor');

    filtro.value = filtro.value === codigo ? '' : codigo;

    carregar();
  });

  $('abrirMetas').addEventListener('click', abrirMetas);

  var hoje = new Date();

  $('inicio').value = dataIso(
    new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      1
    )
  );

  $('fim').value = dataIso(hoje);

  // Recupera os filtros ao voltar da página de metas.
  var parametrosIniciais = new URLSearchParams(location.search);

  ['inicio', 'fim'].forEach(function (campo) {
    var valor = parametrosIniciais.get(campo);

    if (/^\d{4}-\d{2}-\d{2}$/.test(valor || '')) {
      $(campo).value = valor;
    }
  });

  var vendedorInicial = parametrosIniciais.get('vendedor');

  if (/^\d+$/.test(vendedorInicial || '')) {
    $('vendedor').add(
      new Option(vendedorInicial, vendedorInicial)
    );

    $('vendedor').value = vendedorInicial;
  }

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
