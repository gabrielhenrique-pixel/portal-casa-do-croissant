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
      justify-content:space-between;
      gap:18px;
      padding:13px 18px 10px;
      background:var(--navy);
      color:#fff;
    }

    .marca {
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:12px;
    }

    .marca strong { font-size:16px; }

    .marca i {
      width:1px;
      height:20px;
      background:#fff;
      opacity:.75;
    }

    .marca span {
      color:#ffde16;
      font-size:15px;
    }

    .controles {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:12px;
    }

    .campo {
      display:grid;
      grid-template-columns:auto 1fr;
      align-items:center;
      gap:6px;
      color:#fff;
      font-size:9px;
      font-weight:700;
    }

    input[type=date] {
      width:110px;
      height:27px;
      border:1px solid #e1b900;
      border-radius:5px;
      background:#123a58;
      color:#fff;
      padding:4px 6px;
      font:inherit;
      font-size:11px;
    }

    input[type=date]::-webkit-calendar-picker-indicator {
      filter:invert(1);
    }

    button {
      border:0;
      border-radius:5px;
      font:inherit;
      cursor:pointer;
    }

    #atualizar {
      min-height:29px;
      padding:6px 11px;
      border:1px solid #eaf5fb;
      background:#176990;
      color:#fff;
      font-size:9px;
      font-weight:700;
    }

    #atualizar:disabled {
      opacity:.7;
      cursor:wait;
    }

    .voltar {
      color:#dceaf1;
      text-decoration:none;
      font-size:11px;
      font-weight:700;
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
      font-size:22px;
      font-weight:700;
    }

    .azul { background:#8bd2ec; }
    .verde { background:#91e58e; }
    .laranja { background:#f3b28b; }
    .limao { background:#b7e988; }
    .amarelo { background:#fff059; }

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

    .acoes a:last-child {
      background:#0a6237;
    }

    @media(max-width:700px) {
      .cards { grid-template-columns:repeat(3,1fr); }
      .grade { grid-template-columns:1fr; }
      .tabela-area { min-height:0; }
    }

    @media(max-width:620px) {
      main { padding:4px; }
      .topo {
        align-items:flex-start;
        flex-direction:column;
      }
      .cards { grid-template-columns:repeat(2,1fr); }
      .controles { width:100%; }
      .campo {
        width:100%;
        grid-template-columns:80px 1fr;
      }
      .campo input { width:100%; }
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
      <div class="marca">
  <span>RENTABILIDADE COMERCIAL</span>
</div>
      <form id="filtros" class="controles">
        <label class="campo">
          Data inicial
          <input id="inicio" type="date" required>
        </label>

        <label class="campo">
          Data final
          <input id="fim" type="date" required>
        </label>

        <button id="atualizar" type="submit">↻ ATUALIZAR DADOS</button>
      </form>

      <a class="voltar" href="/">Página inicial</a>
    </header>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="cards">
      <article class="card">
        <span class="icone azul">▥</span>
        <div>
          <span class="rotulo">Faturamento bruto</span>
          <strong id="faturamento" class="valor">—</strong>
        </div>
      </article>

      <article class="card">
        <span class="icone verde">$</span>
        <div>
          <span class="rotulo">Receita líquida</span>
          <strong id="receita" class="valor">—</strong>
        </div>
      </article>

      <article class="card">
        <span class="icone azul">⌁</span>
        <div>
          <span class="rotulo">Resultado</span>
          <strong id="resultado" class="valor">—</strong>
        </div>
      </article>

      <article class="card">
        <span class="icone laranja">%</span>
        <div>
          <span class="rotulo">Margem</span>
          <strong id="margem" class="valor">—</strong>
        </div>
      </article>

      <article class="card">
        <span class="icone limao">♟</span>
        <div>
          <span class="rotulo">Clientes positivados</span>
          <strong id="clientes" class="valor">—</strong>
        </div>
      </article>

      <article class="card">
        <span class="icone amarelo">◎</span>
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

        <article class="painel">
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

  var graus = v * 360;
  var grafico = $(id);

  if (graus === 0) {
    grafico.style.background = '#858585';
  } else if (graus < 6) {
    grafico.style.background =
      'conic-gradient(' +
        '#858585 0deg ' + (360 - graus) + 'deg, ' +
        'var(--cor) ' + (360 - graus) + 'deg 360deg' +
      ')';
  } else {
    var inicioCor = 360 - graus + 3;
    var inicioSeparacao = inicioCor - 3;

    grafico.style.background =
      'conic-gradient(' +
        '#fff 0deg 3deg, ' +
        '#858585 3deg ' + inicioSeparacao + 'deg, ' +
        '#fff ' + inicioSeparacao + 'deg ' + inicioCor + 'deg, ' +
        'var(--cor) ' + inicioCor + 'deg 357deg, ' +
        '#fff 357deg 360deg' +
      ')';
  }

  $(pid).textContent = pf.format(v);
}

      function tabela(redes) {
        var h = '';

        redes.forEach(function(r) {
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

      function render(d) {
        var redes = Array.isArray(d.redes) ? d.redes : [];

        var soma = function(campo) {
          return redes.reduce(function(total, rede) {
            return total + n(rede[campo]);
          }, 0);
        };

        var faturamento = soma('faturamentoBruto');
        var receita = soma('receitaLiquida');
        var resultado = soma('resultadoFinal');
        var investimentos = soma('investimentos');
        var devolucoes = soma('devolucoes');
        var frete = soma('frete');
        var clientes = soma('clientesPositivados');
        var margem = receita ? resultado / Math.abs(receita) : 0;
        var atingido = faturamento / meta;
        var faltam = Math.max(meta - faturamento, 0);
        var angulo = Math.max(-90, Math.min(90, -90 + atingido * 180));

        $('faturamento').textContent = nf.format(faturamento);
        $('receita').textContent = nf.format(receita);
        $('resultado').textContent = nf.format(resultado);
        $('resultado').className = 'valor ' + cn(resultado);
        $('margem').textContent = pf.format(margem);
        $('clientes').textContent = ni.format(clientes);

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
        $('faturamentoMeta').textContent = nf.format(faturamento);
        $('metaExibida').textContent = nf.format(meta);
        $('faltamMeta').textContent = nf.format(faltam);

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
        var botao = $('atualizar');

        if (!inicio || !fim) return;

        botao.disabled = true;
        $('estado').textContent = 'Calculando rentabilidade...';

        try {
          await carregarMeta();

          var resposta = await fetch(
            '/api/rentabilidade/margem-rede?inicio=' +
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

          render(dados);
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
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

      $('filtros').addEventListener('submit', function(evento) {
        evento.preventDefault();
        carregar();
      });

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
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff'
    }
  });
}
