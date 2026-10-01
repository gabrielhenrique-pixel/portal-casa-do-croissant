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

    .exportar-bsc {
      margin-left:auto;
      min-height:40px;
      padding:0 15px;
      border:0;
      border-radius:8px;
      background:#0f6a46;
      color:#fff;
      cursor:pointer;
      font-size:12px;
      font-weight:700;
      text-transform:uppercase;
    }

    .exportar-bsc:disabled {
      cursor:wait;
      opacity:.7;
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
  gap:8px;
  margin-top:15px;
  flex-wrap:nowrap;
}

    .aba.ativa {
  background:linear-gradient(135deg,#168454,#0d5e3d);
  color:#fff;
}

.aba:not(.ativa) {
  background:#e4f1ea;
  color:#0d5e3d;
  box-shadow:none;
}

    .aba {
  flex:1 1 0;
  min-width:0;
  padding:11px 9px;
  border:0;
  border-radius:10px;
  background:linear-gradient(135deg,#168454,#0d5e3d);
  box-shadow:0 7px 15px #0f5b3c2e;
  color:#fff;
  cursor:pointer;
  font-size:12px;
  font-weight:700;
  letter-spacing:-0.15px;
  text-transform:uppercase;
  white-space:nowrap;
  transition:
    transform .18s ease,
    box-shadow .18s ease,
    filter .18s ease;
}

.aba:hover {
  filter:brightness(1.08);
  transform:translateY(-3px);
  box-shadow:0 11px 20px #0f5b3c42;
}

.aba:active {
  transform:translateY(0);
  box-shadow:0 5px 10px #0f5b3c2e;
}

    .estado {
      min-height:18px;
      margin:14px 2px 8px;
      color:#5c7082;
      font-size:13px;
    }

    .estado.erro { color:#b42318; }
     #tituloAnterior,
     #totalAnterior {
      text-align:center;
     }

    .painel {
      overflow:hidden;
      border-radius:18px;
      background:#fff;
      box-shadow:0 8px 22px #1730521c;
    }

    .painel-devolucoes {
  margin-top:20px;
}

.matriz-bsc {
  margin-top:20px;
}

.tabela-matriz th,
.tabela-matriz td {
  text-align:center;
  white-space:nowrap;
}

.tabela-matriz th:first-child,
.tabela-matriz td:first-child {
  text-align:left;
}

.tabela-matriz th:nth-child(2),
.tabela-matriz td:nth-child(2) {
  text-align:center;
}

.tabela-devolucoes th:nth-child(2),
.tabela-devolucoes td:nth-child(2) {
  text-align:center;
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
  padding:10px 8px;
  border-bottom:1px solid var(--line);
  background:#edf4f8;
  color:#244665;
  font-size:11px;
  text-align:center;
  text-transform:uppercase;
}

    .painel:not(.painel-devolucoes) th:first-child,
.painel:not(.painel-devolucoes) th:nth-child(2) {
  text-align:left;
}

.tabela-devolucoes th:first-child {
  text-align:left;
}
    td {
  padding:9px 8px;
  border-bottom:1px solid #e5edf2;
  color:#173957;
  font-size:12px;
  text-align:center;
}

    .painel:not(.painel-devolucoes) td:first-child,
.painel:not(.painel-devolucoes) td:nth-child(2) {
  text-align:left;
}

.tabela-devolucoes td:first-child {
  text-align:left;
}

    tbody tr:nth-child(even) { background:#f8fbfd; }

    .codigo {
      color:#597087;
      font-family:monospace;
    }

    body.modo-cliente #cabecalhoCodigo,
body.modo-cliente .coluna-codigo {
  display:none;
}

.coluna-meta {
  display:none;
}

body.modo-vendedor .coluna-meta {
  display:table-cell;
}

    .positivo { color:#098543; font-weight:700; }
    .negativo { color:#c24132; font-weight:700; }
    .neutro { color:#6c7f90; }

    tfoot td {
  border:0;
  background:#163a5a;
  color:#fff;
  font-size:13px;
  font-weight:700;
  text-align:center;
}

tfoot td:first-child {
  text-align:left;
}

    .positivacao-bsc {
  margin-top:20px;
}

.positivacao-grade {
  display:grid;
  grid-template-columns:minmax(290px, .8fr) minmax(520px, 1.2fr);
  gap:20px;
  margin-top:20px;
}

.tabela-indicadores-positivacao {
  min-width:0;
}

.tabela-indicadores-positivacao th:nth-child(2),
.tabela-indicadores-positivacao td:nth-child(2) {
  text-align:right;
}

.tabela-positivacao th:not(:first-child),
.tabela-positivacao td:not(:first-child),
.tabela-positivacao-vendedor th:not(:first-child),
.tabela-positivacao-vendedor td:not(:first-child) {
  text-align:center;
}

@media (max-width:1000px) {
  .positivacao-grade {
    grid-template-columns:1fr;
  }
}

.tabela-positivacao-vendedor {
  min-width:0;
  table-layout:fixed;
}

.tabela-positivacao-vendedor th,
.tabela-positivacao-vendedor td {
  padding:8px 5px;
  white-space:nowrap;
}

.tabela-positivacao-vendedor th {
  font-size:10px;
}

.tabela-positivacao-vendedor td {
  font-size:11px;
}

.tabela-positivacao-vendedor th:first-child,
.tabela-positivacao-vendedor td:first-child {
  width:26%;
}

.tabela-positivacao-vendedor th:not(:first-child),
.tabela-positivacao-vendedor td:not(:first-child) {
  width:18.5%;
}

    @media (max-width:700px) {
      main { padding:5px 4px 26px; }

      .topo,
      .controles { padding:14px; }

      .marca { font-size:22px; }

      .topo { flex-wrap:wrap; }

      .exportar-bsc {
        width:100%;
        margin-left:0;
      }

      .controles {
        align-items:stretch;
        flex-direction:column;
      }

      input[type=date] { width:100%; }

      .abas {
  overflow:auto;
  gap:8px;
}

.aba {
  flex:0 0 auto;
  min-width:150px;
}

      .titulo-painel { font-size:16px; }
    }

.botao-ver-clientes {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:24px;
  height:22px;
  padding:0;
  margin-left:4px;
  border:0;
  border-radius:0;
  background:transparent;
  box-shadow:none;
  color:#60a5fa;
  cursor:pointer;
  vertical-align:middle;
}

.botao-ver-clientes:hover {
  background:transparent;
  box-shadow:none;
  opacity:.65;
}

.botao-ver-clientes:focus-visible {
  outline:2px solid #168454;
  outline-offset:2px;
}

.olho-clientes {
  display:block;
  width:16px;
  height:16px;
  fill:none;
  stroke:currentColor;
  stroke-width:1.9;
  stroke-linecap:round;
  transform:none;
}

.olho-clientes::after {
  content:'';
  position:absolute;
  width:4px;
  height:4px;
  top:50%;
  left:50%;
  border-radius:50%;
  background:currentColor;
  transform:translate(-50%, -50%);
}

#modalNaoPositivados {
  box-sizing:border-box;
  width:900px;
  max-width:94vw;
  max-height:88vh;
  padding:0;
  border:0;
  border-radius:16px;
  background:#fff;
  color:#173957;
  box-shadow:0 20px 70px #0005;
}

#modalNaoPositivados::backdrop {
  background:#102e4980;
}

.cabecalho-nao-positivados {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  padding:20px;
  background:#163a5a;
  color:#fff;
}

.cabecalho-nao-positivados h2 {
  margin:0;
  font-size:18px;
}

.cabecalho-nao-positivados p {
  margin:6px 0 0;
  font-size:12px;
}

#fecharNaoPositivados {
  padding:8px 12px;
  border:0;
  border-radius:7px;
  background:#fff;
  color:#163a5a;
  cursor:pointer;
}

.lista-nao-positivados {
  max-height:58vh;
  overflow:auto;
}

#modalNaoPositivados table {
  width:100%;
  min-width:0;
  table-layout:fixed;
}

#modalNaoPositivados th,
#modalNaoPositivados td {
  text-align:left;
  white-space:normal;
  overflow-wrap:anywhere;
  padding:10px;
}

#modalNaoPositivados th {
  position:sticky;
  top:0;
  z-index:1;
}

#modalNaoPositivados th:first-child {
  width:22%;
}

#modalNaoPositivados th:nth-child(2) {
  width:48%;
}

#modalNaoPositivados th:nth-child(3) {
  width:30%;
}

#modalNaoPositivados select {
  box-sizing:border-box;
  display:block;
  width:100%;
  min-width:0;
  margin-top:8px;
  padding:8px;
  border:1px solid #c7d8e5;
  border-radius:6px;
  background:#fff;
  color:#173957;
  font-size:12px;
}

#contadorNaoPositivados {
  margin:0;
  padding:14px 20px;
  font-size:12px;
}

#modalNaoPositivados th {
  background:#163a5a;
  color:#fff;
}

.np-cabecalho {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  width:100%;
  padding:0;
  border:0;
  background:transparent;
  color:#fff;
  font:inherit;
  text-align:left;
  cursor:pointer;
}

.np-cabecalho span {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  width:22px;
  height:22px;
  border-radius:4px;
  background:#ffffff26;
}

.np-cabecalho.filtrado span {
  background:#60a5fa;
  color:#102e49;
}

.np-menu-filtro {
  position:fixed;
  inset:auto;
  box-sizing:border-box;
  width:292px;
  max-width:calc(100vw - 16px);
  max-height:calc(100vh - 16px);
  overflow:auto;
  margin:0;
  padding:12px;
  border:1px solid #9eb3c7;
  border-radius:8px;
  background:#fff;
  color:#173957;
  box-shadow:0 12px 26px #1235;
  font-family:inherit;
  font-size:14px;
}

.np-menu-filtro input[type="search"] {
  box-sizing:border-box;
  width:100%;
  margin:8px 0;
  padding:8px;
  border:1px solid #b9cce0;
  border-radius:5px;
  font:inherit;
}

.np-menu-filtro input[type="checkbox"] {
  width:14px;
  height:14px;
  margin:0;
  flex-shrink:0;
  accent-color:#1683ff;
}

.np-todos,
.np-opcoes label {
  display:flex;
  align-items:center;
  gap:7px;
  cursor:pointer;
}

.np-todos {
  padding:3px 4px;
}

.np-opcoes {
  max-height:235px;
  overflow:auto;
  border:1px solid #d6e1ea;
}

.np-opcoes label {
  padding:7px 8px;
  font-size:12px;
  overflow-wrap:anywhere;
}

.np-opcoes label[hidden] {
  display:none;
}

.np-opcoes label:hover {
  background:#edf5fc;
}

.np-acoes {
  display:flex;
  justify-content:flex-end;
  gap:7px;
  margin-top:10px;
}

.np-acoes button {
  padding:8px 12px;
  border:1px solid #aebfd0;
  border-radius:5px;
  background:#fff;
  color:#244866;
  font-weight:700;
  cursor:pointer;
}

.np-acoes .np-aplicar {
  border-color:#102e49;
  background:#102e49;
  color:#fff;
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

      <button id="exportarBsc" class="exportar-bsc" type="button">
        ⇩ Exportar planilha
      </button>
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
  <button
    class="aba ativa"
    type="button"
    data-aba="volume-produto"
  >
    Volume por produto
  </button>

  <button
    class="aba"
    type="button"
    data-aba="financeiro-produto"
  >
    Financeiro por produto
  </button>

  <button
    class="aba"
    type="button"
    data-aba="financeiro-cliente"
  >
    Financeiro por cliente
  </button>

  <button
    class="aba"
    type="button"
    data-aba="financeiro-praca"
  >
    Financeiro por praça
  </button>

  <button
  class="aba"
  type="button"
  data-aba="financeiro-vendedor"
>
  Financeiro por vendedor
</button>
<button
  class="aba"
  type="button"
  data-aba="vendedor-produto"
>
  Vendedor por produto
</button>

<button
  class="aba"
  type="button"
  data-aba="positivacao-produto"
>
  Positivação
</button>
</section>

    <p id="estado" class="estado">Carregando dados...</p>

    <section id="painelPrincipal" class="painel">
  <div id="tituloPainel" class="titulo-painel">
    BSC COMERCIAL - VOLUME POR PRODUTO
  </div>

  <div class="tabela-area">
        <table>
          <thead>
            <tr>
              <th id="cabecalhoCodigo">Código</th>
              <th id="cabecalhoDescricao">Produto</th>
              <th id="tituloAnterior">Período anterior</th>
              <th id="tituloAtual">Período selecionado</th>
              <th>Variação</th>
              <th id="tituloAcumuladoAnterior">Acumulado anterior</th>
              <th id="tituloAcumuladoAtual">Acumulado atual</th>
              <th>Variação acumulada</th>
              <th id="tituloMeta" class="coluna-meta">Meta mensal</th>
              <th class="coluna-meta">% atingido</th>
            </tr>
          </thead>

          <tbody id="linhas"></tbody>

          <tfoot>
            <tr>
              <td id="rotuloTotal" colspan="2">TOTAL</td>
              <td id="totalAnterior">—</td>
              <td id="totalAtual">—</td>
              <td id="variacaoTotal">—</td>
              <td id="totalAcumuladoAnterior">—</td>
              <td id="totalAcumuladoAtual">—</td>
              <td id="variacaoTotalAcumulado">—</td>
              <td id="totalMeta" class="coluna-meta">—</td>
              <td id="percentualMetaTotal" class="coluna-meta">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
        </section>

    <section id="painelDevolucoes" class="painel painel-devolucoes">
      <div class="titulo-painel">
        <span id="tituloPainelDevolucoes">DEVOLUÇÕES POR PRODUTO EM VOLUME</span>
      </div>

      <div class="tabela-area">
        <table class="tabela-devolucoes">
          <thead>
            <tr>
              <th id="cabecalhoDevolucao">Produto</th>
              <th id="tituloDevAnterior">Dev anterior</th>
              <th id="tituloDevAtual">Dev atual</th>
              <th>% Dev anterior</th>
              <th>% Dev atual</th>
              <th id="tituloDevAcumAnterior">Dev acum. anterior</th>
              <th id="tituloDevAcumAtual">Dev acum. atual</th>
              <th>% Acum. anterior</th>
              <th>% Acum. atual</th>
            </tr>
          </thead>

          <tbody id="linhasDevolucoes"></tbody>

          <tfoot>
            <tr>
              <td>TOTAL</td>
              <td id="totalDevAnterior">—</td>
              <td id="totalDevAtual">—</td>
              <td id="percentualDevAnterior">—</td>
              <td id="percentualDevAtual">—</td>
              <td id="totalDevAcumAnterior">—</td>
              <td id="totalDevAcumAtual">—</td>
              <td id="percentualDevAcumAnterior">—</td>
              <td id="percentualDevAcumAtual">—</td>
            </tr>
          </tfoot>
        </table>
            </div>
    </section>

    <section id="painelMatriz" class="matriz-bsc" hidden>
      <section class="painel">
        <div
          id="tituloMatrizUnidades"
          class="titulo-painel"
        >
          BSC COMERCIAL - VENDEDOR POR PRODUTO - UNIDADES
        </div>

        <div class="tabela-area">
          <table class="tabela-matriz">
            <thead>
              <tr id="cabecalhosMatrizUnidades"></tr>
            </thead>
            <tbody id="linhasMatrizUnidades"></tbody>
            <tfoot>
              <tr id="totaisMatrizUnidades"></tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section class="painel painel-devolucoes">
        <div
          id="tituloMatrizCaixas"
          class="titulo-painel"
        >
          BSC COMERCIAL - VENDEDOR POR PRODUTO - CAIXAS
        </div>

        <div class="tabela-area">
          <table class="tabela-matriz">
            <thead>
              <tr id="cabecalhosMatrizCaixas"></tr>
            </thead>
            <tbody id="linhasMatrizCaixas"></tbody>
            <tfoot>
              <tr id="totaisMatrizCaixas"></tr>
            </tfoot>
          </table>
        </div>
      </section>
        </section>

    <section id="painelPositivacao" class="positivacao-bsc" hidden>
  <section class="painel">
    <div class="titulo-painel">
      BSC COMERCIAL - POSITIVAÇÃO POR PRODUTO
    </div>

    <div class="tabela-area">
      <table class="tabela-positivacao">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Clientes positivados</th>
            <th>A positivar</th>
            <th>% Positivação</th>
            <th>Quantidade</th>
            <th>Faturamento líquido</th>
          </tr>
        </thead>

        <tbody id="linhasPositivacao"></tbody>
      </table>
    </div>
  </section>

  <div class="positivacao-grade">
    <section class="painel">
      <div class="titulo-painel">Indicadores</div>

      <div class="tabela-area">
        <table class="tabela-indicadores-positivacao">
          <thead>
            <tr>
              <th>Indicador</th>
              <th id="tituloResultadoPositivacao">Resultado</th>
            </tr>
          </thead>

          <tbody id="linhasIndicadoresPositivacao"></tbody>
        </table>
      </div>
    </section>

    <section class="painel">
      <div class="titulo-painel">
        Positivação por vendedor
      </div>

      <div class="tabela-area">
        <table class="tabela-positivacao-vendedor">
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Clientes ativos</th>
              <th>Positivados</th>
              <th>Não positivados</th>
              <th>% Positivação</th>
            </tr>
          </thead>

          <tbody id="linhasPositivacaoVendedor"></tbody>
        </table>
      </div>
    </section>
  </div>
</section>
<dialog id="modalNaoPositivados" aria-labelledby="tituloNaoPositivados">
  <div class="cabecalho-nao-positivados">
    <div>
      <h2 id="tituloNaoPositivados">Clientes não positivados</h2>
      <p id="periodoNaoPositivados"></p>
    </div>

    <button id="fecharNaoPositivados" type="button">
      Fechar
    </button>
  </div>

  <div class="lista-nao-positivados">
    <table>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              class="np-cabecalho"
              data-np-filtro="codigo"
            >
              Código do cliente
              <span aria-hidden="true">▾</span>
            </button>
          </th>
          <th>
            <button
              type="button"
              class="np-cabecalho"
              data-np-filtro="cliente"
            >
              Cliente
              <span aria-hidden="true">▾</span>
            </button>
          </th>
          <th>
            <button
              type="button"
              class="np-cabecalho"
              data-np-filtro="rede"
            >
              Rede
              <span aria-hidden="true">▾</span>
            </button>
          </th>
        </tr>
      </thead>

      <tbody id="linhasNaoPositivados"></tbody>
    </table>
  </div>

  <p id="contadorNaoPositivados" aria-live="polite"></p>
</dialog>
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

      function mesAno(data) {
  var partes = String(data || '').split('-');

  if (partes.length !== 3) return 'mensal';

  var meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return meses[Number(partes[1]) - 1] + ' ' + partes[0];
}

      var abaAtual = 'volume-produto';

function medida(valor) {
  if (abaAtual !== 'volume-produto') {
    return new Intl.NumberFormat('pt-BR', {
      style:'currency',
      currency:'BRL'
    }).format(Number(valor || 0));
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits:0,
    maximumFractionDigits:2
  }).format(Number(valor || 0));
}

function medidaMatriz(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits:0,
    maximumFractionDigits:2
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

      function renderizar(dados, dadosDevolucoes) {
        var modoAgrupado =
  abaAtual === 'financeiro-cliente' ||
  abaAtual === 'financeiro-praca' ||
  abaAtual === 'financeiro-vendedor';

var modoVendedor = abaAtual === 'financeiro-vendedor';

var campoAgrupamento =
  abaAtual === 'financeiro-vendedor'
    ? 'vendedor'
    : abaAtual === 'financeiro-praca'
      ? 'praca'
      : 'cliente';

var rotuloAgrupamento =
  abaAtual === 'financeiro-vendedor'
    ? 'Vendedor'
    : abaAtual === 'financeiro-praca'
      ? 'Praça'
      : 'Cliente';

var registros = abaAtual === 'financeiro-vendedor'
  ? (Array.isArray(dados.vendedores) ? dados.vendedores : [])
  : abaAtual === 'financeiro-praca'
    ? (Array.isArray(dados.pracas) ? dados.pracas : [])
    : abaAtual === 'financeiro-cliente'
      ? (Array.isArray(dados.clientes) ? dados.clientes : [])
      : (Array.isArray(dados.produtos) ? dados.produtos : []);
      var registrosVisiveis = registros.filter(function(registro) {
  if (!modoVendedor) return true;

  return Number(registro.quantidadeAtual || 0) !== 0;
});

var devolucoes = Array.isArray(dadosDevolucoes.devolucoes)
  ? dadosDevolucoes.devolucoes
  : [];

  var devolucoesVisiveis = devolucoes.filter(function(devolucao) {
  if (!modoVendedor) return true;

  return Number(devolucao.devolucaoAtual || 0) !== 0;
});

var registrosPorChave = {};

registros.forEach(function(registro) {
  var chave = modoAgrupado
    ? registro[campoAgrupamento]
    : registro.codigoProduto;

  registrosPorChave[chave] = registro;
});

document.body.classList.toggle('modo-cliente', modoAgrupado);
document.body.classList.toggle('modo-vendedor', modoVendedor);

$('cabecalhoDescricao').textContent =
  modoAgrupado ? rotuloAgrupamento : 'Produto';

$('cabecalhoDevolucao').textContent =
  modoAgrupado ? rotuloAgrupamento : 'Produto';

$('rotuloTotal').colSpan = modoAgrupado ? 1 : 2;

$('tituloMeta').textContent =
  'Meta ' + mesAno(dados.fim);

var nomeIndicador = abaAtual === 'volume-produto'
  ? 'Volume'
  : 'Faturamento';

$('tituloAnterior').textContent =
  nomeIndicador + ' ' +
  textoPeriodo(dados.inicioAnterior, dados.fimAnterior);

$('tituloAtual').textContent =
  nomeIndicador + ' ' +
  textoPeriodo(dados.inicio, dados.fim);

          $('tituloAcumuladoAnterior').textContent =
           'Acumulado ' +
           dados.fimAnterior.slice(0, 4) +
           ' até ' +
           formatarData(dados.fimAnterior);

          $('tituloAcumuladoAtual').textContent =
           'Acumulado ' +
            dados.fim.slice(0, 4) +
           ' até ' +
           formatarData(dados.fim);

        $('linhas').innerHTML = registrosVisiveis.map(function(registro) {
  var codigo = modoAgrupado ? '' : escapar(registro.codigoProduto);

var descricao = modoAgrupado
  ? registro[campoAgrupamento]
  : registro.produto;

  return (
    '<tr>' +
      '<td class="codigo coluna-codigo">' + codigo + '</td>' +
      '<td>' + escapar(descricao) + '</td>' +
      '<td>' + medida(registro.quantidadeAnterior) + '</td>' +
      '<td>' + medida(registro.quantidadeAtual) + '</td>' +
      '<td class="' + classeVariacao(registro.variacao) + '">' +
        percentual(registro.variacao) +
      '</td>' +
      '<td>' + medida(registro.acumuladoAnterior) + '</td>' +
      '<td>' + medida(registro.acumuladoAtual) + '</td>' +
            '<td class="' + classeVariacao(registro.variacaoAcumulado) + '">' +
        percentual(registro.variacaoAcumulado) +
      '</td>' +
      '<td class="coluna-meta">' +
        (modoVendedor ? medida(registro.meta) : '—') +
      '</td>' +
      '<td class="coluna-meta">' +
        (modoVendedor ? percentual(registro.percentualMeta) : '—') +
      '</td>' +
    '</tr>'
  );
}).join('');

        $('totalAnterior').textContent = medida(dados.totalAnterior);
        $('totalAtual').textContent = medida(dados.totalAtual);

        $('variacaoTotal').textContent = percentual(dados.variacaoTotal);
        $('variacaoTotal').className = classeVariacao(dados.variacaoTotal);
        $('totalAcumuladoAnterior').textContent =
         medida(dados.totalAcumuladoAnterior);

        $('totalAcumuladoAtual').textContent =
         medida(dados.totalAcumuladoAtual);

        $('variacaoTotalAcumulado').textContent =
         percentual(dados.variacaoTotalAcumulado);

        $('variacaoTotalAcumulado').className =
         classeVariacao(dados.variacaoTotalAcumulado);

         $('totalMeta').textContent = modoVendedor
          ? medida(dados.totalMeta)
          : '—';

        $('percentualMetaTotal').textContent = modoVendedor
         ? percentual(dados.percentualMetaTotal)
         : '—';

        $('tituloDevAnterior').textContent =
        'Dev ' + dados.fimAnterior.slice(0, 4);

        $('tituloDevAtual').textContent =
         'Dev ' + dados.fim.slice(0, 4);

$('tituloDevAcumAnterior').textContent =
  'Dev acum. ' + dados.fimAnterior.slice(0, 4);

$('tituloDevAcumAtual').textContent =
  'Dev acum. ' + dados.fim.slice(0, 4);

function percentualDevolucao(devolucao, volume) {
  if (!volume || volume <= 0) return null;
  return devolucao / volume;
}

$('linhasDevolucoes').innerHTML = devolucoesVisiveis.map(function(devolucao) {
  var chave = modoAgrupado
  ? devolucao[campoAgrupamento]
  : devolucao.codigoProduto;
  var registro = registrosPorChave[chave] || {};

  var percentualAnterior = percentualDevolucao(
    devolucao.devolucaoAnterior,
    registro.quantidadeAnterior
  );

  var percentualAtual = percentualDevolucao(
    devolucao.devolucaoAtual,
    registro.quantidadeAtual
  );

  var percentualAcumAnterior = percentualDevolucao(
    devolucao.devolucaoAcumuladaAnterior,
    registro.acumuladoAnterior
  );

  var percentualAcumAtual = percentualDevolucao(
    devolucao.devolucaoAcumuladaAtual,
    registro.acumuladoAtual
  );

  return (
    '<tr>' +
      '<td>' + escapar(
                  modoAgrupado
                    ? devolucao[campoAgrupamento]
                    : devolucao.produto
      ) + '</td>' +
      '<td>' + medida(devolucao.devolucaoAnterior) + '</td>' +
      '<td>' + medida(devolucao.devolucaoAtual) + '</td>' +
      '<td class="negativo">' + percentual(percentualAnterior) + '</td>' +
      '<td class="negativo">' + percentual(percentualAtual) + '</td>' +
      '<td>' + medida(devolucao.devolucaoAcumuladaAnterior) + '</td>' +
      '<td>' + medida(devolucao.devolucaoAcumuladaAtual) + '</td>' +
      '<td class="negativo">' +
        percentual(percentualAcumAnterior) +
      '</td>' +
      '<td class="negativo">' +
        percentual(percentualAcumAtual) +
      '</td>' +
    '</tr>'
  );
}).join('');

$('totalDevAnterior').textContent =
  medida(dadosDevolucoes.totalAnterior);

$('totalDevAtual').textContent =
  medida(dadosDevolucoes.totalAtual);

$('totalDevAcumAnterior').textContent =
  medida(dadosDevolucoes.totalAcumuladoAnterior);

$('totalDevAcumAtual').textContent =
  medida(dadosDevolucoes.totalAcumuladoAtual);

$('percentualDevAnterior').textContent = percentual(
  percentualDevolucao(
    dadosDevolucoes.totalAnterior,
    dados.totalAnterior
  )
);

$('percentualDevAtual').textContent = percentual(
  percentualDevolucao(
    dadosDevolucoes.totalAtual,
    dados.totalAtual
  )
);

$('percentualDevAcumAnterior').textContent = percentual(
  percentualDevolucao(
    dadosDevolucoes.totalAcumuladoAnterior,
    dados.totalAcumuladoAnterior
  )
);

$('percentualDevAcumAtual').textContent = percentual(
  percentualDevolucao(
    dadosDevolucoes.totalAcumuladoAtual,
    dados.totalAcumuladoAtual
  )
);

        $('estado').textContent = '';
        $('estado').className = 'estado';
      }

      function renderizarMatriz(dados) {
  var vendedores = Array.isArray(dados.vendedores)
    ? dados.vendedores
    : [];

  var produtos = Array.isArray(dados.produtos)
    ? dados.produtos
    : [];

  var cabecalhos =
    '<th>Produto</th>' +
    vendedores.map(function(vendedor) {
      return '<th>' + escapar(vendedor.vendedor) + '</th>';
    }).join('') +
    '<th>Total</th>';

  $('cabecalhosMatrizUnidades').innerHTML = cabecalhos;
  $('cabecalhosMatrizCaixas').innerHTML = cabecalhos;

  $('tituloMatrizUnidades').textContent =
    'BSC COMERCIAL - VENDEDOR POR PRODUTO - UNIDADES ' +
    mesAno(dados.fim).toUpperCase();

  $('tituloMatrizCaixas').textContent =
    'BSC COMERCIAL - VENDEDOR POR PRODUTO - CAIXAS ' +
    mesAno(dados.fim).toUpperCase();

  function linhasDaMatriz(campo) {
    return produtos.map(function(produto) {
      var total = 0;

      var colunas = vendedores.map(function(vendedor) {
        var valor = Number(
          produto[campo][vendedor.codigoVendedor] || 0
        );

        total += valor;

        return '<td>' + medidaMatriz(valor) + '</td>';
      }).join('');

      return (
        '<tr>' +
          '<td>' + escapar(produto.produto) + '</td>' +
          colunas +
          '<td>' + medidaMatriz(total) + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  $('linhasMatrizUnidades').innerHTML =
    linhasDaMatriz('unidadesPorVendedor');

  $('linhasMatrizCaixas').innerHTML =
    linhasDaMatriz('caixasPorVendedor');

  function totaisDaMatriz(totaisPorVendedor, totalGeral) {
    var colunas = vendedores.map(function(vendedor) {
      return (
        '<td>' +
          medidaMatriz(
            totaisPorVendedor[vendedor.codigoVendedor]
          ) +
        '</td>'
      );
    }).join('');

    return (
      '<td>TOTAL</td>' +
      colunas +
      '<td>' + medidaMatriz(totalGeral) + '</td>'
    );
  }

  $('totaisMatrizUnidades').innerHTML =
    totaisDaMatriz(
      dados.totaisUnidadesPorVendedor || {},
      dados.totalUnidades
    );

  $('totaisMatrizCaixas').innerHTML =
    totaisDaMatriz(
      dados.totaisCaixasPorVendedor || {},
      dados.totalCaixas
    );

  $('estado').textContent = '';
  $('estado').className = 'estado';
}

var detalhesPositivacao = null;
var clientesNaoPositivadosAbertos = [];
var filtrosNaoPositivados = {};
var menuNaoPositivados = null;

function fecharFiltroNaoPositivados() {
  if (menuNaoPositivados) {
    menuNaoPositivados.remove();
    menuNaoPositivados = null;
  }
}

function filtrarClientesNaoPositivados() {
  var campos = ['codigo', 'cliente', 'rede'];

  var filtrados = clientesNaoPositivadosAbertos.filter(function(item) {
    return campos.every(function(campo) {
      var selecao = filtrosNaoPositivados[campo];

      return !selecao ||
        selecao.has(String(item[campo] || ''));
    });
  });

  $('linhasNaoPositivados').innerHTML = filtrados.length
    ? filtrados.map(function(item) {
        return (
          '<tr>' +
            '<td>' + escapar(item.codigo) + '</td>' +
            '<td>' + escapar(item.cliente) + '</td>' +
            '<td>' + escapar(item.rede) + '</td>' +
          '</tr>'
        );
      }).join('')
    : '<tr><td colspan="3">Nenhum cliente encontrado.</td></tr>';

  $('contadorNaoPositivados').textContent =
    filtrados.length + ' de ' +
    clientesNaoPositivadosAbertos.length + ' clientes';

  document.querySelectorAll('[data-np-filtro]').forEach(function(botao) {
    botao.classList.toggle(
      'filtrado',
      !!filtrosNaoPositivados[botao.dataset.npFiltro]
    );
  });
}

function abrirFiltroNaoPositivados(campo, botao) {
  fecharFiltroNaoPositivados();

  var nomes = {
    codigo:'Código do cliente',
    cliente:'Cliente',
    rede:'Rede'
  };

  var valores = Array.from(new Set(
    clientesNaoPositivadosAbertos.map(function(item) {
      return String(item[campo] || '');
    })
  )).sort(function(a, b) {
    return a.localeCompare(b, 'pt-BR', { numeric:true });
  });

  var atual = filtrosNaoPositivados[campo] || new Set(valores);
  var menu = document.createElement('div');

  menu.className = 'np-menu-filtro';
  menu.setAttribute('popover', 'auto');

  menu.innerHTML =
    '<strong>Filtro: ' + escapar(nomes[campo]) + '</strong>' +
    '<input type="search" placeholder="Pesquisar"' +
      ' aria-label="Pesquisar opções">' +
    '<label class="np-todos">' +
      '<input type="checkbox"> Selecionar tudo' +
    '</label>' +
    '<div class="np-opcoes">' +
      valores.map(function(valor, indice) {
        return (
          '<label data-np-indice="' + indice + '">' +
            '<input type="checkbox" ' +
              (atual.has(valor) ? 'checked' : '') +
            '> ' + escapar(valor || '(Em branco)') +
          '</label>'
        );
      }).join('') +
    '</div>' +
    '<div class="np-acoes">' +
      '<button type="button" class="np-limpar">Limpar</button>' +
      '<button type="button" class="np-aplicar">Aplicar</button>' +
    '</div>';

  $('modalNaoPositivados').appendChild(menu);
  menuNaoPositivados = menu;
  menu.showPopover();

  var posicao = botao.getBoundingClientRect();

  menu.style.left = Math.max(
    8,
    Math.min(posicao.right - menu.offsetWidth,
      window.innerWidth - menu.offsetWidth - 8)
  ) + 'px';

  menu.style.top = Math.max(
    8,
    Math.min(posicao.bottom + 6,
      window.innerHeight - menu.offsetHeight - 8)
  ) + 'px';

  var busca = menu.querySelector('input[type="search"]');
  var todos = menu.querySelector('.np-todos input');

  function atualizarSelecionarTudo() {
    var visiveis = Array.from(
      menu.querySelectorAll('[data-np-indice]:not([hidden]) input')
    );

    var marcados = visiveis.filter(function(input) {
      return input.checked;
    }).length;

    todos.checked = visiveis.length > 0 &&
      marcados === visiveis.length;

    todos.indeterminate = marcados > 0 &&
      marcados < visiveis.length;
  }

  busca.addEventListener('input', function() {
    var texto = busca.value.toLocaleLowerCase('pt-BR').trim();

    menu.querySelectorAll('[data-np-indice]').forEach(function(label) {
      var valor = valores[Number(label.dataset.npIndice)];

      label.hidden = !(valor || '(Em branco)')
        .toLocaleLowerCase('pt-BR')
        .includes(texto);
    });

    atualizarSelecionarTudo();
  });

  todos.addEventListener('change', function() {
    menu.querySelectorAll('[data-np-indice]:not([hidden]) input')
      .forEach(function(input) {
        input.checked = todos.checked;
      });

    atualizarSelecionarTudo();
  });

  menu.querySelector('.np-opcoes').addEventListener(
    'change',
    atualizarSelecionarTudo
  );

  menu.querySelector('.np-limpar').addEventListener('click', function() {
    delete filtrosNaoPositivados[campo];
    fecharFiltroNaoPositivados();
    filtrarClientesNaoPositivados();
    botao.focus();
  });

  menu.querySelector('.np-aplicar').addEventListener('click', function() {
    var selecionados = new Set(
      Array.from(
        menu.querySelectorAll('[data-np-indice] input:checked')
      ).map(function(input) {
        return valores[Number(input.parentElement.dataset.npIndice)];
      })
    );

    if (selecionados.size === valores.length) {
      delete filtrosNaoPositivados[campo];
    } else {
      filtrosNaoPositivados[campo] = selecionados;
    }

    fecharFiltroNaoPositivados();
    filtrarClientesNaoPositivados();
    botao.focus();
  });

  atualizarSelecionarTudo();
  busca.focus();
}

document.querySelectorAll('[data-np-filtro]').forEach(function(botao) {
  botao.addEventListener('click', function() {
    abrirFiltroNaoPositivados(botao.dataset.npFiltro, botao);
  });
});

$('linhasPositivacaoVendedor').addEventListener('click', function(evento) {
  var botao = evento.target.closest('[data-ver-nao-positivados]');

  if (!botao || !detalhesPositivacao) return;

  var vendedor = (detalhesPositivacao.vendedores || []).find(
    function(item) {
      return String(item.codigoVendedor) ===
        botao.dataset.verNaoPositivados;
    }
  );

  if (!vendedor) return;

  fecharFiltroNaoPositivados();
  filtrosNaoPositivados = {};

  clientesNaoPositivadosAbertos =
    vendedor.clientesNaoPositivados || [];

  $('tituloNaoPositivados').textContent =
    'Clientes não positivados — ' + vendedor.vendedor;

  $('periodoNaoPositivados').textContent =
    textoPeriodo(detalhesPositivacao.inicio, detalhesPositivacao.fim);

  filtrarClientesNaoPositivados();
  $('modalNaoPositivados').showModal();
});

$('fecharNaoPositivados').addEventListener('click', function() {
  fecharFiltroNaoPositivados();
  $('modalNaoPositivados').close();
});

$('modalNaoPositivados').addEventListener(
  'close',
  fecharFiltroNaoPositivados
);

function renderizarPositivacao(dados) {
  detalhesPositivacao = dados;
  var produtos = Array.isArray(dados.produtos)
    ? dados.produtos
    : [];

  var vendedores = Array.isArray(dados.vendedores)
    ? dados.vendedores
    : [];

  var indicadores = dados.indicadores || {};

  var formatarMoeda = function(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style:'currency',
      currency:'BRL'
    }).format(Number(valor || 0));
  };

  var percentualInteiro = function(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style:'percent',
      minimumFractionDigits:1,
      maximumFractionDigits:1
    }).format(Number(valor || 0));
  };

  $('linhasPositivacao').innerHTML = produtos.map(function(produto) {
    return (
      '<tr>' +
        '<td>' + escapar(produto.produto) + '</td>' +
        '<td>' + medidaMatriz(produto.clientesPositivados) + '</td>' +
        '<td>' + medidaMatriz(produto.aPositivar) + '</td>' +
        '<td>' + percentual(produto.percentualPositivacao) + '</td>' +
        '<td>' + medidaMatriz(produto.quantidade) + '</td>' +
        '<td>' + formatarMoeda(produto.faturamentoLiquido) + '</td>' +
      '</tr>'
    );
  }).join('');

  $('tituloResultadoPositivacao').textContent =
    'Resultado ' + mesAno(dados.fim).toUpperCase();

  $('linhasIndicadoresPositivacao').innerHTML =
    '<tr>' +
      '<td>Clientes ativos</td>' +
      '<td>' + medidaMatriz(indicadores.clientesAtivos) + '</td>' +
    '</tr>' +
    '<tr>' +
      '<td>Clientes positivados</td>' +
      '<td>' + medidaMatriz(indicadores.clientesPositivados) + '</td>' +
    '</tr>' +
    '<tr>' +
      '<td>Clientes sem atendimento</td>' +
      '<td>' +
        medidaMatriz(indicadores.clientesSemAtendimento) +
      '</td>' +
    '</tr>' +
    '<tr>' +
      '<td>% Positivação</td>' +
      '<td>' +
        percentualInteiro(indicadores.percentualPositivacao) +
      '</td>' +
    '</tr>' +
    '<tr>' +
      '<td>% Sem atendimento</td>' +
      '<td>' +
        percentualInteiro(indicadores.percentualSemAtendimento) +
      '</td>' +
    '</tr>';

  $('linhasPositivacaoVendedor').innerHTML =
    vendedores.map(function(vendedor) {
      return (
        '<tr>' +
          '<td>' + escapar(vendedor.vendedor) + '</td>' +
          '<td>' + medidaMatriz(vendedor.clientesAtivos) + '</td>' +
          '<td>' + medidaMatriz(vendedor.positivados) + '</td>' +
          '<td>' +
  medidaMatriz(vendedor.naoPositivados) +
  '<button type="button" class="botao-ver-clientes"' +
    ' data-ver-nao-positivados="' +
      escapar(vendedor.codigoVendedor) + '"' +
    ' title="Visualizar clientes não positivados"' +
    ' aria-label="Ver clientes não positivados de ' +
      escapar(vendedor.vendedor) + '">' +
    '<svg class="olho-clientes" viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M3 12a9 9 0 0 1 18 0" />' +
  '<circle cx="12" cy="12" r="3.3" />' +
'</svg>' +
  '</button>' +
'</td>' +
          '<td>' +
            percentual(vendedor.percentualPositivacao) +
          '</td>' +
        '</tr>'
      );
    }).join('');

  $('estado').textContent = '';
  $('estado').className = 'estado';
}

      async function carregar() {
        var inicio = $('inicio').value;
        var fim = $('fim').value;

        if (!inicio || !fim) return;

        $('estado').textContent = 'Consultando dados...';
        $('estado').className = 'estado';

        if (abaAtual === 'positivacao-produto') {
  try {
    var respostaPositivacao = await fetch(
      '/api/bsc/positivacao-produto?inicio=' +
        encodeURIComponent(inicio) +
        '&fim=' +
        encodeURIComponent(fim),
      { cache:'no-store' }
    );

    var dadosPositivacao = await respostaPositivacao.json();

    if (!respostaPositivacao.ok) {
      throw Error(
        dadosPositivacao.error ||
        'Não foi possível consultar a positivação por produto.'
      );
    }

    renderizarPositivacao(dadosPositivacao);
    return;
  } catch (erro) {
    $('estado').textContent = erro.message;
    $('estado').className = 'estado erro';
    $('linhasPositivacao').innerHTML = '';
    $('linhasIndicadoresPositivacao').innerHTML = '';
    $('linhasPositivacaoVendedor').innerHTML = '';
    return;
  }
}

if (abaAtual === 'vendedor-produto') {
  try {
    var respostaMatriz = await fetch(
      '/api/bsc/vendedor-produto?inicio=' +
        encodeURIComponent(inicio) +
        '&fim=' +
        encodeURIComponent(fim),
      { cache:'no-store' }
    );

    var dadosMatriz = await respostaMatriz.json();

    if (!respostaMatriz.ok) {
      throw Error(
        dadosMatriz.error ||
        'Não foi possível consultar o vendedor por produto.'
      );
    }

    renderizarMatriz(dadosMatriz);
    return;
  } catch (erro) {
    $('estado').textContent = erro.message;
    $('estado').className = 'estado erro';
    return;
  }
}

try {
  var rotasPorAba = {
  'volume-produto': {
    principal:'/api/bsc/volume-produto',
    devolucoes:'/api/bsc/devolucoes-volume'
  },
  'financeiro-produto': {
    principal:'/api/bsc/financeiro-produto',
    devolucoes:'/api/bsc/devolucoes-financeiro-produto'
  },
    'financeiro-cliente': {
    principal:'/api/bsc/financeiro-cliente',
    devolucoes:'/api/bsc/devolucoes-financeiro-cliente'
  },
    'financeiro-praca': {
    principal:'/api/bsc/financeiro-praca',
    devolucoes:'/api/bsc/devolucoes-financeiro-praca'
  },
  'financeiro-vendedor': {
    principal:'/api/bsc/financeiro-vendedor',
    devolucoes:'/api/bsc/devolucoes-financeiro-vendedor'
  }
};

var rotas = rotasPorAba[abaAtual];

var respostas = await Promise.all([
  fetch(
    rotas.principal +
      '?inicio=' + encodeURIComponent(inicio) +
      '&fim=' + encodeURIComponent(fim),
    { cache:'no-store' }
  ),
  fetch(
    rotas.devolucoes +
      '?inicio=' + encodeURIComponent(inicio) +
      '&fim=' + encodeURIComponent(fim),
    { cache:'no-store' }
  )
]);

var dados = await respostas[0].json();
var dadosDevolucoes = await respostas[1].json();

if (!respostas[0].ok) {
  throw Error(
    dados.error || 'Não foi possível consultar o volume por produto.'
  );
}

if (!respostas[1].ok) {
  throw Error(
    dadosDevolucoes.error ||
    'Não foi possível consultar as devoluções.'
  );
}

renderizar(dados, dadosDevolucoes);
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
          $('linhas').innerHTML = '';
          $('totalAnterior').textContent = '—';
          $('totalAtual').textContent = '—';
          $('variacaoTotal').textContent = '—';
        }
      }

      function numeroExportacao(valor) {
        var numero = Number(valor);
        return Number.isFinite(numero) ? numero : 0;
      }

      function celulaTextoExportacao(valor) {
        return { valor: valor === null || valor === undefined ? '' : String(valor), tipo:'texto' };
      }

      function celulaNumeroExportacao(valor) {
        return { valor: numeroExportacao(valor), tipo:'numero' };
      }

      function celulaPercentualExportacao(valor) {
        return valor === null || valor === undefined || valor === ''
          ? { valor:'', tipo:'texto' }
          : { valor: numeroExportacao(valor), tipo:'percentual' };
      }

      function linhaExportacao(tipo, valores) {
        return { tipo:tipo, valores:valores };
      }

      function variacaoExportacao(anterior, atual) {
        var base = numeroExportacao(anterior);
        return base !== 0
          ? (numeroExportacao(atual) - base) / Math.abs(base)
          : null;
      }

      function nomeExportacaoDoPeriodo(inicio, fim) {
        return 'Período: ' + formatarData(inicio) + ' a ' + formatarData(fim);
      }

      function criarAbaComparativoExportacao(titulo, dados, devolucoes, opcoes) {
        var registros = dados[opcoes.campo] || [];
        var temProduto = opcoes.campo === 'produtos';
        var cabecalho = temProduto
          ? ['Código', 'Produto']
          : [opcoes.rotulo];
        var linhas = [
          linhaExportacao('titulo', [celulaTextoExportacao('BSC COMERCIAL - ' + titulo)]),
          linhaExportacao('periodo', [celulaTextoExportacao(nomeExportacaoDoPeriodo(dados.inicio, dados.fim))]),
          linhaExportacao('vazio', []),
          linhaExportacao('cabecalho', cabecalho.concat([
            'Ano anterior', 'Período atual', 'Variação',
            'Acumulado anterior', 'Acumulado atual', 'Variação acumulada'
          ]).concat(opcoes.incluirMeta ? ['Meta', '% meta'] : []).map(celulaTextoExportacao))
        ];

        registros.forEach(function(registro) {
          var valores = temProduto
            ? [
              celulaTextoExportacao(registro.codigoProduto),
              celulaTextoExportacao(registro.produto)
            ]
            : [celulaTextoExportacao(registro[opcoes.chave] || '')];

          linhas.push(linhaExportacao('linha', valores.concat([
            celulaNumeroExportacao(registro.quantidadeAnterior),
            celulaNumeroExportacao(registro.quantidadeAtual),
            celulaPercentualExportacao(registro.variacao),
            celulaNumeroExportacao(registro.acumuladoAnterior),
            celulaNumeroExportacao(registro.acumuladoAtual),
            celulaPercentualExportacao(registro.variacaoAcumulado)
          ]).concat(opcoes.incluirMeta ? [
            celulaNumeroExportacao(registro.meta),
            celulaPercentualExportacao(registro.percentualMeta)
          ] : [])));
        });

        var total = temProduto
          ? [celulaTextoExportacao(''), celulaTextoExportacao('TOTAL')]
          : [celulaTextoExportacao('TOTAL')];

        linhas.push(linhaExportacao('total', total.concat([
          celulaNumeroExportacao(dados.totalAnterior),
          celulaNumeroExportacao(dados.totalAtual),
          celulaPercentualExportacao(dados.variacaoTotal),
          celulaNumeroExportacao(dados.totalAcumuladoAnterior),
          celulaNumeroExportacao(dados.totalAcumuladoAtual),
          celulaPercentualExportacao(dados.variacaoTotalAcumulado)
        ]).concat(opcoes.incluirMeta ? [
          celulaNumeroExportacao(dados.totalMeta),
          celulaPercentualExportacao(dados.percentualMetaTotal)
        ] : [])));

        var itensDevolucao = devolucoes.devolucoes || [];
        if (itensDevolucao.length) {
          linhas.push(linhaExportacao('vazio', []));
          linhas.push(linhaExportacao('secao', [celulaTextoExportacao('DEVOLUÇÕES')]));
          linhas.push(linhaExportacao('cabecalho', cabecalho.concat([
            'Ano anterior', 'Período atual', 'Variação',
            'Acumulado anterior', 'Acumulado atual', 'Variação acumulada'
          ]).map(celulaTextoExportacao)));

          itensDevolucao.forEach(function(item) {
            var primeiraColuna = temProduto
              ? [
                celulaTextoExportacao(item.codigoProduto),
                celulaTextoExportacao(item.produto)
              ]
              : [celulaTextoExportacao(item[opcoes.chave] || '')];
            var anterior = numeroExportacao(item.devolucaoAnterior);
            var atual = numeroExportacao(item.devolucaoAtual);
            var acumuladoAnterior = numeroExportacao(item.devolucaoAcumuladaAnterior);
            var acumuladoAtual = numeroExportacao(item.devolucaoAcumuladaAtual);

            linhas.push(linhaExportacao('linha', primeiraColuna.concat([
              celulaNumeroExportacao(anterior),
              celulaNumeroExportacao(atual),
              celulaPercentualExportacao(variacaoExportacao(anterior, atual)),
              celulaNumeroExportacao(acumuladoAnterior),
              celulaNumeroExportacao(acumuladoAtual),
              celulaPercentualExportacao(
                variacaoExportacao(acumuladoAnterior, acumuladoAtual)
              )
            ])));
          });

          var totalDevolucao = temProduto
            ? [celulaTextoExportacao(''), celulaTextoExportacao('TOTAL DEVOLUÇÕES')]
            : [celulaTextoExportacao('TOTAL DEVOLUÇÕES')];

          linhas.push(linhaExportacao('total', totalDevolucao.concat([
            celulaNumeroExportacao(devolucoes.totalAnterior),
            celulaNumeroExportacao(devolucoes.totalAtual),
            celulaPercentualExportacao(
              variacaoExportacao(devolucoes.totalAnterior, devolucoes.totalAtual)
            ),
            celulaNumeroExportacao(devolucoes.totalAcumuladoAnterior),
            celulaNumeroExportacao(devolucoes.totalAcumuladoAtual),
            celulaPercentualExportacao(
              variacaoExportacao(
                devolucoes.totalAcumuladoAnterior,
                devolucoes.totalAcumuladoAtual
              )
            )
          ])));
        }

        return { nome:opcoes.nomeAba, linhas:linhas, colunas:linhas[3].valores.length };
      }

      function criarAbaMatrizExportacao(dados) {
        var vendedores = dados.vendedores || [];
        var colunas = vendedores.length + 2;
        var linhas = [
          linhaExportacao('titulo', [celulaTextoExportacao('BSC COMERCIAL - VENDEDOR POR PRODUTO')]),
          linhaExportacao('periodo', [celulaTextoExportacao(nomeExportacaoDoPeriodo(dados.inicio, dados.fim))]),
          linhaExportacao('vazio', []),
          linhaExportacao('secao', [celulaTextoExportacao('UNIDADES')]),
          linhaExportacao('cabecalho', ['Código', 'Produto'].concat(
            vendedores.map(function(vendedor) { return vendedor.vendedor; })
          ).concat(['Total']).map(celulaTextoExportacao))
        ];

        (dados.produtos || []).forEach(function(produto) {
          var valores = [
            celulaTextoExportacao(produto.codigoProduto),
            celulaTextoExportacao(produto.produto)
          ];
          var total = 0;
          vendedores.forEach(function(vendedor) {
            var valor = numeroExportacao(
              (produto.unidadesPorVendedor || {})[vendedor.codigoVendedor]
            );
            total += valor;
            valores.push(celulaNumeroExportacao(valor));
          });
          valores.push(celulaNumeroExportacao(total));
          linhas.push(linhaExportacao('linha', valores));
        });

        var totaisUnidades = [celulaTextoExportacao(''), celulaTextoExportacao('TOTAL UNIDADES')];
        vendedores.forEach(function(vendedor) {
          totaisUnidades.push(celulaNumeroExportacao(
            (dados.totaisUnidadesPorVendedor || {})[vendedor.codigoVendedor]
          ));
        });
        totaisUnidades.push(celulaNumeroExportacao(dados.totalUnidades));
        linhas.push(linhaExportacao('total', totaisUnidades));
        linhas.push(linhaExportacao('vazio', []));
        linhas.push(linhaExportacao('secao', [celulaTextoExportacao('CAIXAS')]));
        linhas.push(linhaExportacao('cabecalho', ['Código', 'Produto'].concat(
          vendedores.map(function(vendedor) { return vendedor.vendedor; })
        ).concat(['Total']).map(celulaTextoExportacao)));

        (dados.produtos || []).forEach(function(produto) {
          var valores = [
            celulaTextoExportacao(produto.codigoProduto),
            celulaTextoExportacao(produto.produto)
          ];
          var total = 0;
          vendedores.forEach(function(vendedor) {
            var valor = numeroExportacao(
              (produto.caixasPorVendedor || {})[vendedor.codigoVendedor]
            );
            total += valor;
            valores.push(celulaNumeroExportacao(valor));
          });
          valores.push(celulaNumeroExportacao(total));
          linhas.push(linhaExportacao('linha', valores));
        });

        var totaisCaixas = [celulaTextoExportacao(''), celulaTextoExportacao('TOTAL CAIXAS')];
        vendedores.forEach(function(vendedor) {
          totaisCaixas.push(celulaNumeroExportacao(
            (dados.totaisCaixasPorVendedor || {})[vendedor.codigoVendedor]
          ));
        });
        totaisCaixas.push(celulaNumeroExportacao(dados.totalCaixas));
        linhas.push(linhaExportacao('total', totaisCaixas));

        return { nome:'Vendedor Produto', linhas:linhas, colunas:colunas };
      }

      function criarAbaPositivacaoExportacao(dados) {
        var linhas = [
          linhaExportacao('titulo', [celulaTextoExportacao('BSC COMERCIAL - POSITIVAÇÃO')]),
          linhaExportacao('periodo', [celulaTextoExportacao(nomeExportacaoDoPeriodo(dados.inicio, dados.fim))]),
          linhaExportacao('vazio', []),
          linhaExportacao('secao', [celulaTextoExportacao('POSITIVAÇÃO POR PRODUTO')]),
          linhaExportacao('cabecalho', [
            'Código', 'Produto', 'Clientes positivados', 'A positivar',
            '% positivação', 'Quantidade', 'Faturamento líquido'
          ].map(celulaTextoExportacao))
        ];

        (dados.produtos || []).forEach(function(produto) {
          linhas.push(linhaExportacao('linha', [
            celulaTextoExportacao(produto.codigoProduto),
            celulaTextoExportacao(produto.produto),
            celulaNumeroExportacao(produto.clientesPositivados),
            celulaNumeroExportacao(produto.aPositivar),
            celulaPercentualExportacao(produto.percentualPositivacao),
            celulaNumeroExportacao(produto.quantidade),
            celulaNumeroExportacao(produto.faturamentoLiquido)
          ]));
        });

        var indicadores = dados.indicadores || {};
        linhas.push(linhaExportacao('vazio', []));
        linhas.push(linhaExportacao('secao', [celulaTextoExportacao('INDICADORES GERAIS')]));
        linhas.push(linhaExportacao('cabecalho', [
          'Clientes ativos', 'Clientes positivados', 'Clientes sem atendimento',
          '% positivação', '% sem atendimento'
        ].map(celulaTextoExportacao)));
        linhas.push(linhaExportacao('total', [
          celulaNumeroExportacao(indicadores.clientesAtivos),
          celulaNumeroExportacao(indicadores.clientesPositivados),
          celulaNumeroExportacao(indicadores.clientesSemAtendimento),
          celulaPercentualExportacao(indicadores.percentualPositivacao),
          celulaPercentualExportacao(indicadores.percentualSemAtendimento)
        ]));
        linhas.push(linhaExportacao('vazio', []));
        linhas.push(linhaExportacao('secao', [celulaTextoExportacao('POSITIVAÇÃO POR VENDEDOR')]));
        linhas.push(linhaExportacao('cabecalho', [
          'Código', 'Vendedor', 'Clientes ativos', 'Positivados',
          'Não positivados', '% positivação'
        ].map(celulaTextoExportacao)));

        (dados.vendedores || []).forEach(function(vendedor) {
          linhas.push(linhaExportacao('linha', [
            celulaTextoExportacao(vendedor.codigoVendedor),
            celulaTextoExportacao(vendedor.vendedor),
            celulaNumeroExportacao(vendedor.clientesAtivos),
            celulaNumeroExportacao(vendedor.positivados),
            celulaNumeroExportacao(vendedor.naoPositivados),
            celulaPercentualExportacao(vendedor.percentualPositivacao)
          ]));
        });

        return { nome:'Positivação', linhas:linhas, colunas:7 };
      }

      function escaparXmlExportacao(valor) {
        return String(valor)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;')
          .replace(/\n/g, '&#10;');
      }

      function colunaExportacao(numero) {
        var resultado = '';
        while (numero > 0) {
          var resto = (numero - 1) % 26;
          resultado = String.fromCharCode(65 + resto) + resultado;
          numero = Math.floor((numero - 1) / 26);
        }
        return resultado;
      }

      function estiloCelulaExportacao(tipoLinha, tipoCelula) {
        if (tipoLinha === 'titulo') return 1;
        if (tipoLinha === 'periodo') return 2;
        if (tipoLinha === 'secao') return 3;
        if (tipoLinha === 'cabecalho') return 4;
        if (tipoLinha === 'total') {
          return tipoCelula === 'percentual' ? 9 : tipoCelula === 'numero' ? 8 : 5;
        }
        return tipoCelula === 'percentual' ? 7 : tipoCelula === 'numero' ? 6 : 0;
      }

      function xmlCelulaExportacao(referencia, celula, estilo) {
        if (celula.tipo === 'numero' || celula.tipo === 'percentual') {
          return '<c r="' + referencia + '" s="' + estilo + '"><v>' + celula.valor + '</v></c>';
        }
        return '<c r="' + referencia + '" s="' + estilo + '" t="inlineStr"><is><t xml:space="preserve">' +
          escaparXmlExportacao(celula.valor) + '</t></is></c>';
      }

      function criarXmlAbaExportacao(aba) {
        var ultimaColuna = colunaExportacao(aba.colunas);
        var xmlLinhas = [];
        var mesclas = ['A1:' + ultimaColuna + '1', 'A2:' + ultimaColuna + '2'];

        aba.linhas.forEach(function(linha, indice) {
          var numeroLinha = indice + 1;
          var celulas = [];
          var quantidade = linha.tipo === 'titulo' || linha.tipo === 'periodo' || linha.tipo === 'secao'
            ? 1
            : Math.max(aba.colunas, linha.valores.length);

          for (var coluna = 0; coluna < quantidade; coluna += 1) {
            var celula = linha.valores[coluna] || celulaTextoExportacao('');
            celulas.push(xmlCelulaExportacao(
              colunaExportacao(coluna + 1) + numeroLinha,
              celula,
              estiloCelulaExportacao(linha.tipo, celula.tipo)
            ));
          }

          if (linha.tipo === 'secao') {
            mesclas.push('A' + numeroLinha + ':' + ultimaColuna + numeroLinha);
          }
          xmlLinhas.push('<row r="' + numeroLinha + '">' + celulas.join('') + '</row>');
        });

        var colunas = '<col min="1" max="1" width="14" customWidth="1"/>' +
          (aba.colunas > 1
            ? '<col min="2" max="2" width="42" customWidth="1"/>'
            : '') +
          (aba.colunas > 2
            ? '<col min="3" max="' + aba.colunas + '" width="16" customWidth="1"/>'
            : '');

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
          '<dimension ref="A1:' + ultimaColuna + aba.linhas.length + '"/>' +
          '<sheetViews><sheetView workbookViewId="0"><pane xSplit="2" ySplit="4" topLeftCell="C5" activePane="bottomRight" state="frozen"/></sheetView></sheetViews>' +
          '<sheetFormatPr defaultRowHeight="15"/><cols>' + colunas + '</cols><sheetData>' +
          xmlLinhas.join('') + '</sheetData><mergeCells count="' + mesclas.length + '">' +
          mesclas.map(function(mescla) { return '<mergeCell ref="' + mescla + '"/>'; }).join('') +
          '</mergeCells></worksheet>';
      }

      function crcTabelaExportacao() {
        var tabela = new Uint32Array(256);
        for (var indice = 0; indice < 256; indice += 1) {
          var valor = indice;
          for (var bit = 0; bit < 8; bit += 1) {
            valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1;
          }
          tabela[indice] = valor >>> 0;
        }
        return tabela;
      }

      var CRC_EXPORTACAO = crcTabelaExportacao();

      function crc32Exportacao(dados) {
        var valor = 0xffffffff;
        for (var indice = 0; indice < dados.length; indice += 1) {
          valor = CRC_EXPORTACAO[(valor ^ dados[indice]) & 255] ^ (valor >>> 8);
        }
        return (valor ^ 0xffffffff) >>> 0;
      }

      function juntarBytesExportacao(partes) {
        var tamanho = partes.reduce(function(total, parte) { return total + parte.length; }, 0);
        var resultado = new Uint8Array(tamanho);
        var inicio = 0;
        partes.forEach(function(parte) {
          resultado.set(parte, inicio);
          inicio += parte.length;
        });
        return resultado;
      }

      function criarZipExportacao(arquivos) {
        var codificador = new TextEncoder();
        var locais = [];
        var diretorio = [];
        var deslocamento = 0;

        Object.keys(arquivos).forEach(function(nome) {
          var nomeBytes = codificador.encode(nome);
          var dados = codificador.encode(arquivos[nome]);
          var crc = crc32Exportacao(dados);
          var local = new Uint8Array(30 + nomeBytes.length + dados.length);
          var visaoLocal = new DataView(local.buffer);
          visaoLocal.setUint32(0, 0x04034b50, true);
          visaoLocal.setUint16(4, 20, true);
          visaoLocal.setUint32(14, crc, true);
          visaoLocal.setUint32(18, dados.length, true);
          visaoLocal.setUint32(22, dados.length, true);
          visaoLocal.setUint16(26, nomeBytes.length, true);
          local.set(nomeBytes, 30);
          local.set(dados, 30 + nomeBytes.length);
          locais.push(local);

          var central = new Uint8Array(46 + nomeBytes.length);
          var visaoCentral = new DataView(central.buffer);
          visaoCentral.setUint32(0, 0x02014b50, true);
          visaoCentral.setUint16(4, 20, true);
          visaoCentral.setUint16(6, 20, true);
          visaoCentral.setUint32(16, crc, true);
          visaoCentral.setUint32(20, dados.length, true);
          visaoCentral.setUint32(24, dados.length, true);
          visaoCentral.setUint16(28, nomeBytes.length, true);
          visaoCentral.setUint32(42, deslocamento, true);
          central.set(nomeBytes, 46);
          diretorio.push(central);
          deslocamento += local.length;
        });

        var dadosDiretorio = juntarBytesExportacao(diretorio);
        var fim = new Uint8Array(22);
        var visaoFim = new DataView(fim.buffer);
        visaoFim.setUint32(0, 0x06054b50, true);
        visaoFim.setUint16(8, locais.length, true);
        visaoFim.setUint16(10, locais.length, true);
        visaoFim.setUint32(12, dadosDiretorio.length, true);
        visaoFim.setUint32(16, deslocamento, true);
        return juntarBytesExportacao(locais.concat([dadosDiretorio, fim]));
      }

      function estilosExportacao() {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
          '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0.00;[Red]-#,##0.00"/><numFmt numFmtId="165" formatCode="0.0%;[Red]-0.0%"/></numFmts>' +
          '<fonts count="4"><font><sz val="10"/><color rgb="FF163A5A"/><name val="Arial"/></font><font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF163A5A"/><name val="Arial"/></font></fonts>' +
          '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF163A5A"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8F0F6"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFCFDFEE"/></patternFill></fill></fills>' +
          '<borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs>' +
          '<cellXfs count="10"><xf xfId="0" applyAlignment="1"><alignment vertical="center"/></xf><xf fontId="1" fillId="2" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf applyAlignment="1"><alignment horizontal="left"/></xf><xf fontId="2" fillId="2" applyFont="1" applyFill="1"/><xf fontId="3" fillId="3" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf fontId="3" fillId="4" applyFont="1" applyFill="1"/><xf numFmtId="164" applyNumberFormat="1"/><xf numFmtId="165" applyNumberFormat="1"/><xf fontId="3" fillId="4" numFmtId="164" applyFont="1" applyFill="1" applyNumberFormat="1"/><xf fontId="3" fillId="4" numFmtId="165" applyFont="1" applyFill="1" applyNumberFormat="1"/></cellXfs></styleSheet>';
      }

      function criarArquivoXlsxExportacao(abas) {
        var arquivos = {};
        var tiposPlanilhas = abas.map(function(_, indice) {
          return '<Override PartName="/xl/worksheets/sheet' + (indice + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        }).join('');
        var planilhas = abas.map(function(aba, indice) {
          return '<sheet name="' + escaparXmlExportacao(aba.nome) + '" sheetId="' + (indice + 1) + '" r:id="rId' + (indice + 1) + '"/>';
        }).join('');
        var relacoes = abas.map(function(_, indice) {
          return '<Relationship Id="rId' + (indice + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (indice + 1) + '.xml"/>';
        }).join('') + '<Relationship Id="rId' + (abas.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';

        arquivos['[Content_Types].xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + tiposPlanilhas + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
        arquivos['_rels/.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
        arquivos['xl/workbook.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + planilhas + '</sheets></workbook>';
        arquivos['xl/_rels/workbook.xml.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + relacoes + '</Relationships>';
        arquivos['xl/styles.xml'] = estilosExportacao();
        abas.forEach(function(aba, indice) {
          arquivos['xl/worksheets/sheet' + (indice + 1) + '.xml'] = criarXmlAbaExportacao(aba);
        });
        return criarZipExportacao(arquivos);
      }

      function urlBscExportacao(rota, inicio, fim) {
        return rota + '?inicio=' + encodeURIComponent(inicio) + '&fim=' + encodeURIComponent(fim);
      }

      async function buscarJsonExportacao(rota, inicio, fim) {
        var resposta = await fetch(urlBscExportacao(rota, inicio, fim), { cache:'no-store' });
        var dados = await resposta.json();
        if (!resposta.ok) {
          throw Error(dados.error || 'Não foi possível gerar a planilha do BSC.');
        }
        return dados;
      }

      async function exportarPlanilhaBsc() {
        var inicio = $('inicio').value;
        var fim = $('fim').value;
        var botao = $('exportarBsc');
        if (!inicio || !fim) return;

        botao.disabled = true;
        botao.textContent = 'Gerando planilha...';
        $('estado').textContent = 'Preparando a planilha Excel...';
        $('estado').className = 'estado';

        try {
          var respostas = await Promise.all([
            buscarJsonExportacao('/api/bsc/volume-produto', inicio, fim),
            buscarJsonExportacao('/api/bsc/devolucoes-volume', inicio, fim),
            buscarJsonExportacao('/api/bsc/financeiro-produto', inicio, fim),
            buscarJsonExportacao('/api/bsc/devolucoes-financeiro-produto', inicio, fim),
            buscarJsonExportacao('/api/bsc/financeiro-cliente', inicio, fim),
            buscarJsonExportacao('/api/bsc/devolucoes-financeiro-cliente', inicio, fim),
            buscarJsonExportacao('/api/bsc/financeiro-praca', inicio, fim),
            buscarJsonExportacao('/api/bsc/devolucoes-financeiro-praca', inicio, fim),
            buscarJsonExportacao('/api/bsc/financeiro-vendedor', inicio, fim),
            buscarJsonExportacao('/api/bsc/devolucoes-financeiro-vendedor', inicio, fim),
            buscarJsonExportacao('/api/bsc/vendedor-produto', inicio, fim),
            buscarJsonExportacao('/api/bsc/positivacao-produto', inicio, fim)
          ]);
          var abas = [
            criarAbaComparativoExportacao('VOLUME POR PRODUTO', respostas[0], respostas[1], { nomeAba:'Volume Produto', campo:'produtos', rotulo:'Produto', chave:'produto' }),
            criarAbaComparativoExportacao('FINANCEIRO POR PRODUTO', respostas[2], respostas[3], { nomeAba:'Fin. Produto', campo:'produtos', rotulo:'Produto', chave:'produto' }),
            criarAbaComparativoExportacao('FINANCEIRO POR CLIENTE', respostas[4], respostas[5], { nomeAba:'Fin. Cliente', campo:'clientes', rotulo:'Cliente', chave:'cliente' }),
            criarAbaComparativoExportacao('FINANCEIRO POR PRAÇA', respostas[6], respostas[7], { nomeAba:'Fin. Praça', campo:'pracas', rotulo:'Praça', chave:'praca' }),
            criarAbaComparativoExportacao('FINANCEIRO POR VENDEDOR', respostas[8], respostas[9], { nomeAba:'Fin. Vendedor', campo:'vendedores', rotulo:'Vendedor', chave:'vendedor', incluirMeta:true }),
            criarAbaMatrizExportacao(respostas[10]),
            criarAbaPositivacaoExportacao(respostas[11])
          ];
          var bytes = criarArquivoXlsxExportacao(abas);
          var arquivo = new Blob([bytes], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(arquivo);
          link.download = 'BSC_COMERCIAL_' + inicio + '_a_' + fim + '.xlsx';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(link.href);
          $('estado').textContent = 'Planilha exportada com 7 abas.';
          $('estado').className = 'estado';
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
          botao.textContent = '⇩ Exportar planilha';
        }
      }

      var hoje = new Date();

$('inicio').value = iso(
  new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
);

$('fim').value = iso(
  new Date(hoje.getFullYear(), hoje.getMonth(), 0)
);

      $('inicio').addEventListener('change', carregar);
      $('fim').addEventListener('change', carregar);
      $('exportarBsc').addEventListener('click', exportarPlanilhaBsc);

      document.querySelectorAll('[data-aba]').forEach(function(botao) {
  botao.addEventListener('click', function() {
    abaAtual = botao.dataset.aba;

    document.querySelectorAll('[data-aba]').forEach(function(item) {
      item.classList.toggle(
        'ativa',
        item.dataset.aba === abaAtual
      );
    });

    var exibirMatriz = abaAtual === 'vendedor-produto';
var exibirPositivacao = abaAtual === 'positivacao-produto';

$('painelPrincipal').hidden = exibirMatriz || exibirPositivacao;
$('painelDevolucoes').hidden = exibirMatriz || exibirPositivacao;
$('painelMatriz').hidden = !exibirMatriz;
$('painelPositivacao').hidden = !exibirPositivacao;

    $('tituloPainel').textContent =
  abaAtual === 'financeiro-vendedor'
    ? 'BSC COMERCIAL - FINANCEIRO POR VENDEDOR'
    : abaAtual === 'financeiro-praca'
      ? 'BSC COMERCIAL - FINANCEIRO POR PRAÇA'
      : abaAtual === 'financeiro-cliente'
        ? 'BSC COMERCIAL - FINANCEIRO POR CLIENTE'
        : abaAtual === 'financeiro-produto'
          ? 'BSC COMERCIAL - FINANCEIRO POR PRODUTO'
          : 'BSC COMERCIAL - VOLUME POR PRODUTO';

$('tituloPainelDevolucoes').textContent =
  abaAtual === 'financeiro-vendedor'
    ? 'DEVOLUÇÕES VENDEDORES'
    : abaAtual === 'financeiro-praca'
      ? 'DEVOLUÇÕES PRAÇAS'
      : abaAtual === 'financeiro-cliente'
        ? 'DEVOLUÇÕES CLIENTES'
        : abaAtual === 'financeiro-produto'
          ? 'DEVOLUÇÕES FINANCEIRO POR PRODUTO'
          : 'DEVOLUÇÕES POR PRODUTO EM VOLUME';

    carregar();
  });
});

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
