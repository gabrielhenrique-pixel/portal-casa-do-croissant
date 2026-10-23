export function dashboardRentabilidadePage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Rentabilidade Comercial</title>

  <style>
    :root {
      --navy:#102e49;
      --blue:#1f4e78;
      --bg:#f5f7f6;
      --red:#e63333;
      --green:#008b42;
      --ink:#142b3d;
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
      width:48px;
      height:48px;
      place-items:center;
      border-radius:50%;
      background:#fff;
      box-shadow:0 5px 15px #1730521c;
      color:var(--navy);
      font-size:25px;
      font-weight:700;
      text-decoration:none;
      transition:transform .15s,background .15s;
    }

    .nav-icone:hover {
      background:#edf3f9;
      transform:translateY(-2px);
    }

    .marca {
      flex:1;
    }

    .marca span {
      color:var(--navy);
      font-size:30px;
      font-weight:700;
    }

    .controles {
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
      font:inherit;
      font-size:14px;
    }

    input[type=date]::-webkit-calendar-picker-indicator {
      filter:none;
    }

    button {
      border:0;
      border-radius:8px;
      font:inherit;
      cursor:pointer;
    }

    .estado {
      min-height:0px;
      margin:0px;
      color:#63716e;
      font-size:11px;
    }

    .estado.erro {
      color:#b00020;
    }

    .cards {
     display:grid;
     grid-template-columns:repeat(6,minmax(122px,1fr));
     gap:7px;
     margin-top:14px;
   }

    .card {
      display:grid;
      grid-template-columns:42px minmax(0,1fr);
      align-items:center;
      min-height:60px;
      padding:8px 9px;
      border:1px solid #cfd6d4;
      border-radius:12px;
      background:#fff;
      box-shadow:0 2px 4px #1232;
    }

    .icone {
  display:grid;
  place-items:center;
  width:38px;
  height:38px;
  border-radius:50%;
  color:#123d55;
}

.icone svg {
  width:32px;
  height:32px;
  stroke:currentColor;
  stroke-width:2.1;
  fill:none;
  stroke-linecap:round;
  stroke-linejoin:round;
}

.azul { background:#e2f3ff; }
.verde { background:#e2f9dd; }
.laranja { background:#ffe7d7; }
.limao { background:#dcf8d6; }
.amarelo { background:#fff3b6; }

    .rotulo {
      display:block;
      overflow:hidden;
      color:#182f3f;
      font-size:8px;
      line-height:1.1;
      text-align:center;
      text-overflow:ellipsis;
      text-transform:uppercase;
      white-space:nowrap;
    }

    .valor {
      display:block;
      margin-top:6px;
      color:#17476d;
      font-size:14px;
      font-weight:700;
      text-align:center;
      white-space:nowrap;
    }

    .valor.positivo { color:var(--green); }
    .valor.negativo { color:var(--red); }

    .grade {
      display:grid;
      grid-template-columns:minmax(500px,1.27fr) minmax(360px,.98fr);
      gap:10px;
      margin-top:9px;
      align-items:start;
    }

    .tabela-area {
      overflow:auto;
      min-height:420px;
      border:1px solid #d7ddda;
      background:#fff;
    }

    .titulo-tabela {
      padding:5px 8px;
      background:var(--navy);
      color:#fff;
      font-size:11px;
      font-weight:700;
    }

    table {
      width:100%;
      min-width:650px;
      border-collapse:collapse;
      font-size:8px;
    }

    th {
      padding:5px 3px;
      border:1px solid #dae0dc;
      background:#fff;
      color:#182b39;
      font-size:8px;
      line-height:1.1;
      text-align:center;
      text-transform:uppercase;
    }

    td {
      padding:4px 5px;
      border:1px solid #d9d5ca;
      color:#111;
      text-align:right;
      white-space:nowrap;
    }

    td:first-child {
      background:#d9eaf7;
      text-align:left;
      font-weight:700;
    }

    td.negativo,
    td.devolucao {
      color:#f00;
    }

    td.margem-boa {
      background:#dff0d8;
      color:#2c7c29;
      font-weight:700;
    }

    td.margem-alerta {
      background:#fff2cc;
      color:#a06c00;
      font-weight:700;
    }

    td.margem-critica {
      background:#f4cccc;
      color:#d40000;
      font-weight:700;
    }

    .lado {
      display:grid;
      gap:10px;
    }

    .painel {
      padding:11px 14px;
      border:1px solid #ccd4d1;
      border-radius:28px;
      background:#fff;
      box-shadow:0 2px 5px #1232;
    }

    .painel h2 {
      margin:0;
      color:var(--navy);
      font-size:12px;
      text-align:center;
    }

    .gauge-wrap {
      display:grid;
      place-items:center;
      margin-top:5px;
    }

    .gauge {
      position:relative;
      width:300px;
      max-width:100%;
      height:145px;
      ooverflow:visible;
    }

    .gauge svg {
      width:100%;
      height:100%;
    }

    .ponteiro {
      position:absolute;
      left:calc(50% - 1px);
      bottom:26px;
      z-index:2;
      width:3px;
      height:83px;
      border-radius:3px;
      background:#111;
      transform-origin:50% 100%;
      transition:transform .25s ease;
    }

    .pino {
      position:absolute;
      left:calc(50% - 6px);
      bottom:20px;
      z-index:3;
      width:12px;
      height:12px;
      border-radius:50%;
      background:#111;
    }

    .percentual-meta {
      position:absolute;
      right:0;
      bottom:-3px;
      left:0;
      color:#f11;
      font-size:18px;
      font-weight:700;
      text-align:center;
    }

    .atingido {
      position:absolute;
      right:0;
      bottom:-14px;
      left:0;
      color:#25516a;
      font-size:10px;
      text-align:center;
    }

    .meta-valores {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:9px;
      margin:15px auto 7px;
    }

    .meta-valor {
      min-height:52px;
      padding:7px 4px;
      border:1px solid #d9dfdc;
      border-radius:7px;
      box-shadow:0 2px 4px #1232;
      text-align:center;
    }

    .meta-valor span {
      color:#52626b;
      font-size:8px;
    }

    .meta-valor strong {
      display:block;
      margin-top:5px;
      color:#17476d;
      font-size:12px;
      white-space:nowrap;
    }

    .meta-valor.faltam strong {
      color:#f11;
    }

    .editar-meta {
      margin-left:3px;
      padding:0;
      background:none;
      color:#17476d;
      font-size:12px;
      font-weight:700;
    }

    .salvar-meta {
      display:none;
      margin-top:4px;
      padding:3px 7px;
      background:#0a6237;
      color:#fff;
      font-size:9px;
    }

    #campoMeta {
      display:none;
      width:100%;
      margin-top:4px;
      border:1px solid #93ad9f;
      border-radius:4px;
      padding:3px;
      color:#17476d;
      font-size:11px;
      font-weight:700;
      text-align:center;
    }

    .editando #metaExibida {
      display:none;
    }

    .editando #campoMeta,
    .editando .salvar-meta {
      display:inline-block;
    }

   .impactos {
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:8px;
  margin-top:15px;
}

.impacto {
  text-align:center;
}

.impacto h3 {
  margin:0 0 7px;
  color:#5e6164;
  font-size:7px;
  text-transform:uppercase;
}

.rosca {
  --cor:#087ac1;
  --progresso:0deg;
  display:grid;
  place-items:center;
  position:relative;
  width:80px;
  height:80px;
  margin:auto;
  border-radius:50%;
}

.rosca:after {
  width:50px;
  height:50px;
  border-radius:50%;
  background:#fff;
  content:"";
}

.rosca span {
  position:absolute;
  z-index:1;
  color:var(--cor);
  font-size:13px;
  font-weight:700;
}

.rosca svg {
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
}

.rosca svg circle,
.rosca svg path {
  fill:none;
}

.impacto strong {
  display:block;
  margin-top:8px;
  color:#17476d;
  font-size:11px;
  white-space:nowrap;
}

.impacto strong::before {
  display:inline-block;
  width:11px;
  height:11px;
  margin-right:8px;
  border-radius:50%;
  content:"";
  vertical-align:-2px;
}

.impacto:nth-child(1) strong::before {
  background:#ffb900;
}

.impacto:nth-child(2) strong::before {
  background:#f10c0c;
}

.impacto:nth-child(3) strong::before {
  background:#087ac1;
}
.painel-impacto {
  width:100%;
  max-width:100%;
  min-height:225px;
  justify-self:center;
  padding:10px 5px 15px;
  border-radius:32px;
}

.painel-impacto h2 {
  font-size:10px;
}

.painel-impacto .impactos {
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:0;
  margin-top:18px;
}

.painel-impacto .impacto {
  text-align:center;
}

.painel-impacto .impacto h3 {
  margin:0 0 14px;
  color:#5e6164;
  font-size:7px;
  text-transform:uppercase;
}

.painel-impacto .rosca {
  width:100px;
  height:100px;
}

.painel-impacto .rosca:after {
  width:50px;
  height:50px;
}

.painel-impacto .rosca span {
  font-size:13px;
}

.painel-impacto .impacto strong {
  margin-top:10px;
  font-size:11px;
}

.painel-impacto .impacto strong::before {
  width:11px;
  height:11px;
  margin-right:8px;
}

    .acoes {
      display:flex;
      justify-content:center;
      flex-wrap:wrap;
      gap:12px;
      margin-top:17px;
    }

    .acoes a {
      min-width:230px;
      padding:11px 16px;
      border-radius:7px;
      background:var(--navy);
      color:#fff;
      font-size:13px;
      font-weight:700;
      text-align:center;
      text-decoration:none;
    }

    @media(max-width:700px) {
      .cards { grid-template-columns:repeat(3,1fr); }
      .grade { grid-template-columns:1fr; }
      .tabela-area { min-height:0; }
    }

    @media(max-width:620px) {
      main { padding:8px 10px 24px; }
      .topo {
        gap:12px;
        padding:16px;
      }
      .nav-icone {
        width:42px;
        height:42px;
        font-size:22px;
      }
      .marca span {
        font-size:23px;
      }
             .controles {
         display:grid;
         grid-template-columns:1fr;
         gap:12px;
         width:100%;
         max-width:100%;
         padding:14px;
       }

       .campo {
         display:grid;
         grid-template-columns:1fr;
         gap:5px;
         width:100%;
         min-width:0;
         padding-right:14px;
       }

       .campo input[type="date"] {
         display:block;
         width:100%;
         min-width:0;
         max-width:100%;
         box-sizing:border-box;
       }
      .impactos { grid-template-columns:1fr; }
      .painel { border-radius:16px; }
      .acoes a {
        width:100%;
        min-width:0;
      }
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
      <div class="marca"><span>RENTABILIDADE COMERCIAL</span></div>
    </header>

    <form id="filtros" class="controles">
      <label class="campo">
        Data inicial
        <input id="inicio" type="date" required>
      </label>

      <label class="campo">
        Data final
        <input id="fim" type="date" required>
      </label>

    </form>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="cards">
  <article class="card">
    <span class="icone azul">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 40h34"></path>
        <rect x="9" y="28" width="7" height="12"></rect>
        <rect x="21" y="20" width="7" height="20"></rect>
        <rect x="33" y="12" width="7" height="28"></rect>
      </svg>
    </span>

    <div>
      <span class="rotulo">Faturamento bruto</span>
      <strong id="faturamento" class="valor">—</strong>
    </div>
  </article>

  <article class="card">
    <span class="icone verde">
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    fill="none"
    stroke="#102e49"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="8" width="26" height="16" rx="2"></rect>
    <path d="M3 13a5 5 0 0 0 5-5"></path>
    <path d="M24 8a5 5 0 0 0 5 5"></path>
    <path d="M3 19a5 5 0 0 1 5 5"></path>
    <path d="M24 24a5 5 0 0 1 5-5"></path>
    <ellipse cx="16" cy="16" rx="4" ry="5"></ellipse>
    <path d="M10 16h1M21 16h1"></path>
  </svg>
</span>
    <div>
      <span class="rotulo">Receita líquida</span>
      <strong id="receita" class="valor">—</strong>
    </div>
  </article>

  <article class="card">
    <span class="icone azul">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 33l11-11 8 8 15-17"></path>
        <path d="M32 13h9v9"></path>
      </svg>
    </span>

    <div>
      <span class="rotulo">Resultado</span>
      <strong id="resultado" class="valor">—</strong>
    </div>
  </article>

  <article class="card">
    <span class="icone laranja">
      <svg viewBox="0 0 48 48" aria-hidden="true">
  <path d="M23 7a17 17 0 1 0 17 17H23z"></path>
  <path d="M27 7v13h13"></path>
  <circle cx="30" cy="33" r="2.5"></circle>
  <circle cx="39" cy="40" r="2.5"></circle>
  <path d="M32 41l5-9"></path>
</svg>
    </span>

    <div>
      <span class="rotulo">Margem</span>
      <strong id="margem" class="valor">—</strong>
    </div>
  </article>

  <article class="card">
    <span class="icone limao">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="17" cy="16" r="6"></circle>
        <circle cx="30" cy="17" r="5"></circle>
        <path d="M6 37c1-8 6-12 11-12s10 4 11 12"></path>
        <path d="M25 29c2-3 5-4 8-4 5 0 8 4 9 8"></path>
        <circle cx="35" cy="35" r="7"></circle>
        <path d="M32 35l2 2 4-5"></path>
      </svg>
    </span>

    <div>
      <span class="rotulo">Clientes positivados</span>
      <strong id="clientes" class="valor">—</strong>
    </div>
  </article>

  <article class="card">
    <span class="icone amarelo">
      <svg viewBox="0 0 48 48" aria-hidden="true">
  <circle cx="20" cy="27" r="14"></circle>
  <circle cx="20" cy="27" r="9"></circle>
  <circle cx="20" cy="27" r="3"></circle>
  <path d="M25 22L41 6"></path>
  <path d="M34 6h7v7"></path>
  <circle cx="30" cy="34" r="2"></circle>
  <circle cx="38" cy="41" r="2"></circle>
  <path d="M32 41l5-7"></path>
</svg>
    </span>

    <div>
      <span class="rotulo">Meta margem</span>
      <strong class="valor">20,0%</strong>
    </div>
  </article>
</section>

    <section class="grade">
      <section class="tabela-area">
        <div class="titulo-tabela">Rentabilidade por rede</div>

        <table>
          <thead>
            <tr>
              <th>Rede</th>
              <th>Faturamento<br>bruto</th>
              <th>Devoluções</th>
              <th>Receita líquida</th>
              <th>Resultado</th>
              <th>Margem %</th>
              <th>Participação</th>
              <th>Clientes<br>positivados</th>
              <th>Total de<br>clientes</th>
            </tr>
          </thead>
          <tbody id="linhas"></tbody>
        </table>
      </section>

      <section class="lado">
        <article class="painel">
          <h2>META DE FATURAMENTO</h2>

          <div class="gauge-wrap">
            <div class="gauge">
              <svg viewBox="0 0 300 155" aria-hidden="true">
                <path d="M 40 126 A 110 110 0 0 1 260 126" fill="none" stroke="#f11" stroke-width="27" stroke-dasharray="130 215"/>
                <path d="M 108.4 24.1 A 110 110 0 0 1 191.6 24.1" fill="none" stroke="#ffef00" stroke-width="27"/>
                <path d="M 191.6 24.1 A 110 110 0 0 1 260 126" fill="none" stroke="#00b84a" stroke-width="27"/>
              </svg>

              <i id="ponteiro" class="ponteiro"></i>
              <i class="pino"></i>
              <strong id="percentualMeta" class="percentual-meta">—</strong>
              <span class="atingido">Atingido</span>
            </div>
          </div>

          <div class="meta-valores">
            <div class="meta-valor">
              <span>Faturamento</span>
              <strong id="faturamentoMeta">—</strong>
            </div>

            <div id="metaEditavel" class="meta-valor">
              <span>
                Meta
                <button id="editarMeta" class="editar-meta" type="button">✎</button>
              </span>

              <strong id="metaExibida">—</strong>
              <input id="campoMeta" type="number" min="0" step="0.01">
              <button id="salvarMeta" class="salvar-meta" type="button">Salvar</button>
            </div>

            <div class="meta-valor faltam">
              <span>Faltam</span>
              <strong id="faltamMeta">—</strong>
            </div>
          </div>
        </article>

        <article class="painel painel-impacto">
  <h2>IMPACTO NO FATURAMENTO</h2>

          <div class="impactos">
            <div class="impacto">
              <h3>Investimentos</h3>
              <div id="roscaInvestimentos" class="rosca" style="--cor:#ffb900">
                <span id="pctInvestimentos">—</span>
              </div>
              <strong id="investimentos">—</strong>
            </div>

            <div class="impacto">
              <h3>Devoluções</h3>
              <div id="roscaDevolucoes" class="rosca" style="--cor:#f10c0c">
                <span id="pctDevolucoes">—</span>
              </div>
              <strong id="devolucoes">—</strong>
            </div>

            <div class="impacto">
              <h3>Frete total</h3>
              <div id="roscaFrete" class="rosca" style="--cor:#087ac1">
                <span id="pctFrete">—</span>
              </div>
              <strong id="frete">—</strong>
            </div>
          </div>
        </article>
      </section>
    </section>

          <nav class="acoes">
        <a href="/margem-rede">Abrir Margem por Rede</a>
        <a href="/rentabilidade-sku">Abrir Rentabilidade SKU</a>

        <a
          href="/contratos-rede"
          onclick="this.href = '/contratos-rede?' + new URLSearchParams({
            inicio: document.getElementById('inicio').value,
            fim: document.getElementById('fim').value
          }).toString();"
        >Contratos por rede</a>
      </nav>
  </main>

  <script>
    (function() {
      var $ = function(id) {
        return document.getElementById(id);
      };

      var meta = 1500000;

      var nf = new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
      });

      var pf = new Intl.NumberFormat('pt-BR', {
        style:'percent',
        minimumFractionDigits:1,
        maximumFractionDigits:1
      });

      var ni = new Intl.NumberFormat('pt-BR');

      function n(v) {
        v = Number(v);
        return Number.isFinite(v) ? v : 0;
      }

      function iso(d) {
        return d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
      }

      function fmt(v) {
        return n(v) === 0 ? '—' : nf.format(v);
      }

      function cm(v) {
        v = n(v);
        return v < 0 ? 'margem-critica' :
          v < .15 ? 'margem-alerta' : 'margem-boa';
      }

      function cn(v) {
        return n(v) < 0 ? 'negativo' : '';
      }

      function esc(v) {
        var d = document.createElement('div');
        d.textContent = String(v || '');
        return d.innerHTML;
      }

      function rosca(id, pid, v) {
  v = Math.max(0, Math.min(n(v), 1));

  var grafico = $(id);
  var cor = getComputedStyle(grafico)
    .getPropertyValue('--cor')
    .trim() || '#087ac1';

  var graus = v * 360;
  var raio = 39;
  var inicio = -90 - graus;
  var fim = -90;
  var radiano = Math.PI / 180;

  var inicioX = 50 + raio * Math.cos(inicio * radiano);
  var inicioY = 50 + raio * Math.sin(inicio * radiano);
  var fimX = 50 + raio * Math.cos(fim * radiano);
  var fimY = 50 + raio * Math.sin(fim * radiano);

  var arcoColorido = '';

  if (graus > 0.01) {
    arcoColorido =
      '<path d="M ' +
      inicioX.toFixed(3) + ' ' +
      inicioY.toFixed(3) +
      ' A ' + raio + ' ' + raio +
      ' 0 ' + (graus > 180 ? 1 : 0) +
      ' 1 ' +
      fimX.toFixed(3) + ' ' +
      fimY.toFixed(3) +
      '" stroke="' + cor +
      '" stroke-width="22"/>';
  }

  grafico.style.background = 'none';

  grafico.innerHTML =
    '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="39" stroke="#858585" stroke-width="22"/>' +
      arcoColorido +
    '</svg>' +
    '<span id="' + pid + '">' + pf.format(v) + '</span>';
}

      function tabela(redes) {
        var h = '';

        redes.forEach(function(r) {
            if (
      n(r.faturamentoBruto) === 0 &&
      n(r.devolucoes) === 0
    ) {
      return;
    }
          h += '<tr>' +
            '<td>' + esc(r.rede) + '</td>' +
            '<td>' + fmt(r.faturamentoBruto) + '</td>' +
            '<td class="devolucao">' + fmt(r.devolucoes) + '</td>' +
            '<td class="' + cn(r.receitaLiquida) + '">' + fmt(r.receitaLiquida) + '</td>' +
            '<td class="' + cn(r.resultadoFinal) + '">' + fmt(r.resultadoFinal) + '</td>' +
            '<td class="' + cm(r.margem) + '">' + (r.margem == null ? '—' : pf.format(r.margem)) + '</td>' +
            '<td>' + pf.format(n(r.participacao)) + '</td>' +
            '<td>' + ni.format(n(r.clientesPositivados)) + '</td>' +
            '<td>' + ni.format(n(r.totalClientes)) + '</td>' +
          '</tr>';
        });

        $('linhas').innerHTML = h ||
          '<tr><td colspan="9">Nenhum dado encontrado.</td></tr>';
      }

      function atualizarVelocimetro(faturamentoMesAtual) {
  var faturamentoVelocimetro = n(faturamentoMesAtual);
  var atingido = faturamentoVelocimetro / meta;
  var faltam = Math.max(meta - faturamentoVelocimetro, 0);
  var angulo = Math.max(
    -90,
    Math.min(90, -90 + atingido * 180)
  );

  var corMeta;

  if (atingido < 0.38) {
    corMeta = '#f11';
  } else if (atingido < 0.62) {
    corMeta = '#b78b00';
  } else {
    corMeta = '#00a84f';
  }

  $('percentualMeta').textContent = pf.format(atingido);
  $('percentualMeta').style.color = corMeta;
  $('ponteiro').style.transform = 'rotate(' + angulo + 'deg)';
  $('faturamentoMeta').textContent = nf.format(faturamentoVelocimetro);
  $('metaExibida').textContent = nf.format(meta);
  $('faltamMeta').textContent = nf.format(faltam);
}

function render(d) {
  var redes = Array.isArray(d.redes) ? d.redes : [];

  var soma = function(campo) {
    return redes.reduce(function(total, rede) {
      return total + n(rede[campo]);
    }, 0);
  };

  var faturamentoPorRedes = soma('faturamentoBruto');
  var faturamento = typeof d.faturamentoGeral === 'number'
    ? n(d.faturamentoGeral)
    : faturamentoPorRedes;
  var receita = soma('receitaLiquida');
  var resultado = soma('resultadoFinal');
  var investimentos = soma('investimentos');
  var devolucoesPorRedes = soma('devolucoes');

  var devolucoes = typeof d.devolucoesGeral === 'number'
  ? n(d.devolucoesGeral)
  : devolucoesPorRedes;
  var frete = soma('frete');
  var clientes = soma('clientesPositivados');
  var margem = receita ? resultado / Math.abs(receita) : 0;

  $('faturamento').textContent = nf.format(faturamento);
  $('receita').textContent = nf.format(receita);
  $('resultado').textContent = nf.format(resultado);
  $('resultado').className = 'valor ' + cn(resultado);
  $('margem').textContent = pf.format(margem);
  $('margem').className = 'valor ' + cn(margem);
  $('clientes').textContent = ni.format(clientes);

  rosca(
    'roscaInvestimentos',
    'pctInvestimentos',
    faturamento ? investimentos / faturamento : 0
  );

  rosca(
    'roscaDevolucoes',
    'pctDevolucoes',
    faturamento ? devolucoes / faturamento : 0
  );

  rosca(
    'roscaFrete',
    'pctFrete',
    faturamento ? frete / faturamento : 0
  );

  $('investimentos').textContent = nf.format(investimentos);
  $('devolucoes').textContent = nf.format(devolucoes);
  $('frete').textContent = nf.format(frete);

  tabela(redes);

  $('estado').textContent = '';
  $('estado').className = 'estado';
}

      async function carregarMeta() {
        var resposta = await fetch('/api/rentabilidade/meta-faturamento');
        var dados = await resposta.json();

        if (!resposta.ok) {
          throw Error(dados.error || 'Não foi possível carregar a meta.');
        }

        meta = n(dados.metaFaturamento) || 1500000;
      }

      async function carregar() {
  var inicio = $('inicio').value;
  var fim = $('fim').value;

  if (!inicio || !fim) {
    return;
  }

  function dataIso(data) {
    var ano = data.getFullYear();
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var dia = String(data.getDate()).padStart(2, '0');

    return ano + '-' + mes + '-' + dia;
  }

  var hoje = new Date();
  var primeiroDiaMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  var inicioMesAtual = dataIso(primeiroDiaMes);
  var fimMesAtual = dataIso(hoje);
  
  $('estado').textContent = 'Calculando rentabilidade...';

  try {
    await carregarMeta();

    var resposta = await fetch(
      '/api/rentabilidade/dashboard?inicio=' +
        encodeURIComponent(inicio) +
        '&fim=' +
        encodeURIComponent(fim)
    );

    var dados = await resposta.json();

    if (!resposta.ok) {
      throw Error(
        dados.error || 'Não foi possível carregar o dashboard.'
      );
    }

    var respostaMesAtual = await fetch(
      '/api/rentabilidade/dashboard?inicio=' +
        encodeURIComponent(inicioMesAtual) +
        '&fim=' +
        encodeURIComponent(fimMesAtual)
    );

    var dadosMesAtual = await respostaMesAtual.json();

    if (!respostaMesAtual.ok) {
      throw Error(
        dadosMesAtual.error ||
          'Não foi possível carregar o faturamento do mês atual.'
      );
    }

    var redesMesAtual = Array.isArray(dadosMesAtual.redes)
      ? dadosMesAtual.redes
      : [];

    var faturamentoMesAtual = typeof dadosMesAtual.faturamentoGeral === 'number'
      ? n(dadosMesAtual.faturamentoGeral)
      : redesMesAtual.reduce(
          function(total, rede) {
            return total + n(rede.faturamentoBruto);
          },
          0
        );

    render(dados);
    atualizarVelocimetro(faturamentoMesAtual);
  } catch (erro) {
    $('estado').textContent = erro.message;
    $('estado').className = 'estado erro';
}
}

      function editar() {
        $('campoMeta').value = meta;
        $('metaEditavel').classList.add('editando');
        $('campoMeta').focus();
      }

      async function salvar() {
        var valor = Number($('campoMeta').value);

        if (!Number.isFinite(valor) || valor <= 0) {
          $('estado').textContent = 'Informe uma meta maior que zero.';
          $('estado').className = 'estado erro';
          return;
        }

        var botao = $('salvarMeta');
        botao.disabled = true;

        try {
          var resposta = await fetch(
            '/api/rentabilidade/meta-faturamento',
            {
              method:'PUT',
              headers:{'content-type':'application/json'},
              body:JSON.stringify({ metaFaturamento:valor })
            }
          );

          var dados = await resposta.json();

          if (!resposta.ok) {
            throw Error(
              dados.error || 'Não foi possível salvar a meta.'
            );
          }

          meta = n(dados.metaFaturamento);
          $('metaEditavel').classList.remove('editando');
          carregar();
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
        }
      }

      var hoje = new Date();

      $('inicio').value = iso(
        new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      );

      $('fim').value = iso(hoje);

      $('inicio').addEventListener('change', carregar);
$('fim').addEventListener('change', carregar);

      $('editarMeta').addEventListener('click', editar);
      $('salvarMeta').addEventListener('click', salvar);

      $('campoMeta').addEventListener('keydown', function(evento) {
        if (evento.key === 'Enter') {
          evento.preventDefault();
          salvar();
        }

        if (evento.key === 'Escape') {
          $('metaEditavel').classList.remove('editando');
        }
      });

      carregar();
    })();
  </script>
<style>
  .card[data-evolucao] {
    cursor:pointer;
  }

  .card[data-evolucao]:hover {
    outline:2px solid #1f4e78;
  }

  .card[data-evolucao]:focus-visible {
    outline:3px solid #168447;
    outline-offset:3px;
  }

  #janelaEvolucao {
    width:min(1000px,94vw);
    max-height:90vh;
    padding:24px;
    border:0;
    border-radius:18px;
    color:#102e49;
    background:#fff;
    box-shadow:0 20px 70px #102e4940;
    overflow:auto;
    font-family:Arial,sans-serif;
  }

  #janelaEvolucao::backdrop {
    background:rgba(16,46,73,.55);
  }

  .evolucao-topo {
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:16px;
  }

  #tituloEvolucao {
    margin:0;
    font-size:22px;
  }

  #periodoEvolucao {
    margin:7px 0 0;
    color:#637589;
    font-size:13px;
  }

  #fecharEvolucao {
    width:36px;
    height:36px;
    flex-shrink:0;
    border:0;
    border-radius:50%;
    background:#edf3f9;
    color:#102e49;
    font-size:25px;
    cursor:pointer;
  }

  #estadoEvolucao {
    color:#637589;
    font-size:14px;
  }

  #areaEvolucao {
    overflow-x:auto;
    margin-top:18px;
  }

  #areaEvolucao svg {
    display:block;
    width:100%;
    min-width:760px;
    height:auto;
  }

  #repetirEvolucao {
    padding:10px 16px;
    border:0;
    border-radius:8px;
    background:#102e49;
    color:white;
    cursor:pointer;
  }

  @media(max-width:600px) {
    #janelaEvolucao {
      padding:18px;
    }

    #tituloEvolucao {
      font-size:19px;
    }
  }
</style>

<dialog id="janelaEvolucao" aria-labelledby="tituloEvolucao">
  <div class="evolucao-topo">
    <div>
      <h2 id="tituloEvolucao"></h2>
      <p id="periodoEvolucao"></p>
    </div>

    <button
      id="fecharEvolucao"
      type="button"
      aria-label="Fechar gráfico"
      autofocus
    >×</button>
  </div>

  <p id="estadoEvolucao" role="status"></p>

  <button id="repetirEvolucao" type="button" hidden>
    Tentar novamente
  </button>

  <div id="areaEvolucao"></div>
</dialog>

<script>
(function () {
  var dialogo = document.getElementById('janelaEvolucao');
  var titulo = document.getElementById('tituloEvolucao');
  var periodo = document.getElementById('periodoEvolucao');
  var estado = document.getElementById('estadoEvolucao');
  var area = document.getElementById('areaEvolucao');
  var repetir = document.getElementById('repetirEvolucao');

  var controlador = null;
  var indicadorAtual = null;
  var cache = new Map();

  var meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  var indicadores = {
    faturamento: {
      titulo:'Faturamento bruto',
      tipo:'dinheiro'
    },
    receita: {
      titulo:'Receita líquida',
      tipo:'dinheiro'
    },
    resultado: {
      titulo:'Resultado',
      tipo:'dinheiro'
    },
    margem: {
      titulo:'Margem',
      tipo:'percentual'
    },
    clientes: {
      titulo:'Clientes positivados',
      tipo:'inteiro'
    }
  };

  var dinheiro = new Intl.NumberFormat('pt-BR', {
    style:'currency',
    currency:'BRL'
  });

  var porcentagem = new Intl.NumberFormat('pt-BR', {
    style:'percent',
    minimumFractionDigits:1,
    maximumFractionDigits:1
  });

  var inteiro = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits:0
  });

  function numero(valor) {
    var convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : 0;
  }

  function dois(valor) {
    return String(valor).padStart(2, '0');
  }

  function hojeBrasil() {
    var partes = new Intl.DateTimeFormat('en-US', {
      timeZone:'America/Sao_Paulo',
      year:'numeric',
      month:'2-digit',
      day:'2-digit'
    }).formatToParts(new Date());

    var valores = {};

    partes.forEach(function (parte) {
      valores[parte.type] = parte.value;
    });

    return {
      ano:Number(valores.year),
      mes:Number(valores.month),
      dia:Number(valores.day)
    };
  }

  function formatar(valor, indicador) {
    var tipo = indicadores[indicador].tipo;

    if (tipo === 'dinheiro') return dinheiro.format(valor);
    if (tipo === 'percentual') return porcentagem.format(valor);

    return inteiro.format(valor);
  }

  function resumir(dados) {
    if (!Array.isArray(dados.redes)) {
      throw new Error('A consulta não retornou os dados das redes.');
    }

    function soma(campo) {
      return dados.redes.reduce(function (total, rede) {
        return total + numero(rede[campo]);
      }, 0);
    }

    var receita = soma('receitaLiquida');
    var resultado = soma('resultadoFinal');

    return {
      faturamento:typeof dados.faturamentoGeral === 'number'
        ? numero(dados.faturamentoGeral)
        : soma('faturamentoBruto'),
      receita:receita,
      resultado:resultado,
      margem:receita ? resultado / Math.abs(receita) : 0,
      clientes:soma('clientesPositivados')
    };
  }

  async function consultarMes(inicio, fim, signal) {
    var chave = inicio + '/' + fim;
    var salvo = cache.get(chave);

    if (salvo && Date.now() - salvo.horario < 300000) {
      return salvo.dados;
    }

    var parametros = new URLSearchParams({
      inicio:inicio,
      fim:fim
    });

    var resposta = await fetch(
      '/api/rentabilidade/dashboard?' + parametros.toString(),
      {
        credentials:'same-origin',
        cache:'no-store',
        signal:signal
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      cache.clear();
    }

    var dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.error || 'Não foi possível consultar este mês.'
      );
    }

    var resumo = resumir(dados);

    cache.set(chave, {
      horario:Date.now(),
      dados:resumo
    });

    return resumo;
  }

  function elementoSvg(nome, atributos, texto) {
    var elemento = document.createElementNS(
      'http://www.w3.org/2000/svg',
      nome
    );

    Object.keys(atributos || {}).forEach(function (chave) {
      elemento.setAttribute(chave, atributos[chave]);
    });

    if (texto !== undefined) elemento.textContent = texto;

    return elemento;
  }

  function desenhar(dados, indicador) {
    area.replaceChildren();

    var largura = Math.max(800, dados.length * 115);
    var altura = 370;
    var esquerda = 105;
    var direita = largura - 70;
    var topo = 55;
    var base = 305;

        var valores = dados.map(function (item) {
      return item.valores == null
        ? null
        : item.valores[indicador];
    });

    var disponiveis = valores.filter(function (valor) {
      return valor !== null;
    });

    var minimo = Math.min.apply(null, [0].concat(disponiveis));
    var maximo = Math.max.apply(null, [0].concat(disponiveis));
    var intervalo = maximo - minimo || 1;

    maximo += intervalo * 0.15;
    if (minimo < 0) minimo -= intervalo * 0.15;

    function x(indice) {
      if (dados.length === 1) return (esquerda + direita) / 2;

      return esquerda +
        indice * (direita - esquerda) / (dados.length - 1);
    }

    function y(valor) {
      return base -
        (valor - minimo) / (maximo - minimo) * (base - topo);
    }

    var svg = elementoSvg('svg', {
      viewBox:'0 0 ' + largura + ' ' + altura,
      role:'img',
      'aria-label':indicadores[indicador].titulo + ': ' +
        dados.map(function (item) {
                    return item.mes + ' ' +
            (item.valores == null
              ? 'Pendente'
              : formatar(item.valores[indicador], indicador));
        }).join('; ')
    });

    for (var i = 0; i <= 4; i++) {
      var valorEixo = minimo + (maximo - minimo) * i / 4;
      var posicaoY = y(valorEixo);

      svg.appendChild(elementoSvg('line', {
        x1:esquerda,
        x2:direita,
        y1:posicaoY,
        y2:posicaoY,
        stroke:'#e1e8ef'
      }));

      var textoEixo = indicadores[indicador].tipo === 'dinheiro'
        ? new Intl.NumberFormat('pt-BR', {
            notation:'compact',
            maximumFractionDigits:1
          }).format(valorEixo)
        : formatar(valorEixo, indicador);

      svg.appendChild(elementoSvg('text', {
        x:esquerda - 12,
        y:posicaoY + 4,
        'text-anchor':'end',
        fill:'#637589',
        'font-size':12
      }, textoEixo));
    }

    svg.appendChild(elementoSvg('line', {
      x1:esquerda,
      x2:direita,
      y1:y(0),
      y2:y(0),
      stroke:'#9aafc2'
    }));

        var caminho = '';
    var continuarLinha = false;

    valores.forEach(function (valor, indice) {
      if (valor === null) {
        continuarLinha = false;
        return;
      }

      caminho += (continuarLinha ? ' L ' : ' M ') +
        x(indice) + ' ' + y(valor);

      continuarLinha = true;
    });

    svg.appendChild(elementoSvg('path', {
      d:caminho,
      fill:'none',
      stroke:'#1f4e78',
      'stroke-width':3,
      'stroke-linejoin':'round'
    }));

        dados.forEach(function (item, indice) {
      var valor = valores[indice];

      if (valor === null) {
        svg.appendChild(elementoSvg('text', {
          x:x(indice),
          y:base - 15,
          'text-anchor':'middle',
          fill:'#8a97a5',
          'font-size':11
        }, 'Pendente'));

        svg.appendChild(elementoSvg('text', {
          x:x(indice),
          y:base + 30,
          'text-anchor':'middle',
          fill:'#102e49',
          'font-size':13
        }, item.mes));

        return;
      }

      var cor = valor < 0 ? '#dc2626' : '#1f4e78';

      var ponto = elementoSvg('circle', {
        cx:x(indice),
        cy:y(valor),
        r:5,
        fill:cor,
        stroke:'#fff',
        'stroke-width':2
      });

      ponto.appendChild(elementoSvg(
        'title',
        {},
                item.mes + ': ' + formatar(valor, indicador) +
        (item.atualizadoEm
          ? ' — salvo em ' +
            new Date(item.atualizadoEm).toLocaleString('pt-BR', {
              timeZone:'America/Sao_Paulo'
            })
          : '') +
        (item.vencido ? ' — atualização pendente' : '')
      ));

      svg.appendChild(ponto);

      svg.appendChild(elementoSvg('text', {
        x:x(indice),
        y:y(valor) - 15,
        'text-anchor':'middle',
        fill:cor,
        'font-size':11,
        'font-weight':700
      }, formatar(valor, indicador)));

      svg.appendChild(elementoSvg('text', {
        x:x(indice),
        y:base + 30,
        'text-anchor':'middle',
        fill:'#102e49',
        'font-size':13
      }, item.mes));
    });

    area.appendChild(svg);
  }

  async function abrir(indicador) {
  if (controlador) controlador.abort();

  var requisicao = new AbortController();
  controlador = requisicao;
  indicadorAtual = indicador;

  titulo.textContent = indicadores[indicador].titulo;
  area.replaceChildren();
  repetir.hidden = true;
  repetir.textContent = 'Atualizar consulta';
  estado.textContent = 'Lendo dados salvos...';

  if (!dialogo.open) dialogo.showModal();

  function ativo() {
    return !requisicao.signal.aborted && dialogo.open;
  }

  async function lerSalvos() {
    var resposta = await fetch(
      '/api/rentabilidade/evolucao-salva',
      {
        credentials:'same-origin',
        cache:'no-store',
        signal:requisicao.signal
      }
    );

    var dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.error || 'Não foi possível ler os dados salvos.'
      );
    }

    if (!Array.isArray(dados.meses)) {
      throw new Error('A consulta não retornou os meses.');
    }

    return dados;
  }

  function mostrarSalvos(dados) {
    if (!ativo()) return;

    var partes = dados.hoje.split('-');

    periodo.textContent =
      'Evolução mensal · 01/01/' + partes[0] +
      ' a ' + partes[2] + '/' + partes[1] + '/' + partes[0] +
      ' · mês atual parcial';

    var pontos = dados.meses.map(function (item) {
      return {
        mes:meses[item.mes - 1],
        valores:item.dados ? resumir(item.dados) : null,
        atualizadoEm:item.atualizadoEm,
        vencido:item.vencido
      };
    });

    desenhar(pontos, indicador);

    var faltantes = dados.meses.filter(function (item) {
      return !item.dados;
    }).length;

    var vencidos = dados.meses.filter(function (item) {
      return item.dados && item.vencido;
    }).length;

    var avisos = [];

    if (faltantes) {
      avisos.push(faltantes + ' mês(es) pendente(s)');
    }

    if (vencidos) {
      avisos.push(vencidos + ' mês(es) com atualização pendente');
    }

    estado.textContent = avisos.join(' · ');
    repetir.hidden = !(faltantes || vencidos);
  }

  try {
    // Uma única leitura mostra todos os meses disponíveis.
    var salvos = await lerSalvos();

    if (!ativo()) return;

    mostrarSalvos(salvos);

    // Primeiro o mês atual, depois os anteriores.
    var pendentes = salvos.meses.filter(function (item) {
      return !item.dados || item.vencido;
    });

    var mesAtual = Number(salvos.hoje.slice(5, 7));

    pendentes.sort(function (a, b) {
      if (a.mes === mesAtual) return -1;
      if (b.mes === mesAtual) return 1;
      return a.mes - b.mes;
    });

    var falhas = [];

    for (var i = 0; i < pendentes.length; i++) {
      if (!ativo()) return;

      var item = pendentes[i];

      // Não disputa um cálculo já reservado.
      if (item.bloqueadoAte > Date.now()) continue;

      estado.textContent =
        'Atualizando ' + meses[item.mes - 1] + '...';

      var parametros = new URLSearchParams({
        inicio:item.inicio,
        fim:item.fim
      });

      try {
        // Não aborta este cálculo ao fechar apenas a janela.
        // A próxima atualização só começa se a janela seguir aberta.
        var resposta = await fetch(
          '/api/rentabilidade/dashboard?' + parametros.toString(),
          {
            credentials:'same-origin',
            cache:'no-store',
            headers:{
              'x-rentabilidade-preparar':'1'
            }
          }
        );

        var retorno = await resposta.json();

        if (!ativo()) return;

        if (resposta.status === 401 || resposta.status === 403) {
          area.replaceChildren();
          throw new Error('Sessão expirada ou acesso não autorizado.');
        }

        if (!resposta.ok) {
          falhas.push(meses[item.mes - 1]);
          continue;
        }

        if (resposta.status === 202) continue;
      } catch (erro) {
        if (!ativo()) return;

        if (
          erro.message ===
          'Sessão expirada ou acesso não autorizado.'
        ) {
          throw erro;
        }

        falhas.push(meses[item.mes - 1]);
        continue;
      }

      // Atualiza o gráfico sem esperar os demais meses.
      salvos = await lerSalvos();

      if (!ativo()) return;

      mostrarSalvos(salvos);
    }

    if (!ativo()) return;

    salvos = await lerSalvos();
    mostrarSalvos(salvos);

    if (falhas.length) {
      estado.textContent +=
        (estado.textContent ? ' · ' : '') +
        'Falha ao atualizar: ' + falhas.join(', ');

      repetir.hidden = false;
    }
  } catch (erro) {
    if (!ativo()) return;

    estado.textContent = erro.message;
    repetir.hidden = false;
  }
}

  Object.keys(indicadores).forEach(function (indicador) {
    var valor = document.getElementById(indicador);
    var card = valor ? valor.closest('.card') : null;

    if (!card) return;

    card.dataset.evolucao = indicador;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-controls', 'janelaEvolucao');
    card.setAttribute(
      'aria-label',
      'Ver evolução mensal de ' + indicadores[indicador].titulo
    );

    card.addEventListener('click', function () {
      abrir(indicador);
    });

    card.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        abrir(indicador);
      }
    });
  });

  document.getElementById('fecharEvolucao')
    .addEventListener('click', function () {
      dialogo.close();
    });

  dialogo.addEventListener('close', function () {
    if (controlador) controlador.abort();
  });

  repetir.addEventListener('click', function () {
    if (indicadorAtual) abrir(indicadorAtual);
  });
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
