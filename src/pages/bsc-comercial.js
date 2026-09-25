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
  min-width:190px;
  padding:14px 18px;
  border:0;
  border-radius:10px;
  background:linear-gradient(135deg,#168454,#0d5e3d);
  box-shadow:0 7px 15px #0f5b3c2e;
  color:#fff;
  cursor:pointer;
  font-size:13px;
  font-weight:700;
  text-transform:uppercase;
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
</section>

    <p id="estado" class="estado">Carregando dados...</p>

    <section id="painelPrincipal" class="painel">
  <div id="tituloPainel" class="titulo-painel">

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

  function medidaMatriz(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits:0,
    maximumFractionDigits:2
  }).format(Number(valor || 0));
}

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

      async function carregar() {
        var inicio = $('inicio').value;
        var fim = $('fim').value;

        if (!inicio || !fim) return;

        $('estado').textContent = 'Consultando dados...';
        $('estado').className = 'estado';

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

      var hoje = new Date();

$('inicio').value = iso(
  new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
);

$('fim').value = iso(
  new Date(hoje.getFullYear(), hoje.getMonth(), 0)
);

      $('inicio').addEventListener('change', carregar);
      $('fim').addEventListener('change', carregar);

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

$('painelPrincipal').hidden = exibirMatriz;
$('painelDevolucoes').hidden = exibirMatriz;
$('painelMatriz').hidden = !exibirMatriz;

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
