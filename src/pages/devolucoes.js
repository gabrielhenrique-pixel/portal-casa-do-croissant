export function devolucoesPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Painel de devoluções | Casa do Croissant</title>
  <style>
    :root {
      --verde:#168447;
      --escuro:#0d4b2b;
      --fundo:#f6f8f7;
      --texto:#183128;
      --borda:#d6e4dd;
      --vermelho:#c1362d;
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
      max-width:1440px;
      margin:0 auto;
      padding:34px 36px 48px;
    }

    .topo {
      display:flex;
      justify-content:space-between;
      gap:20px;
      align-items:center;
      margin-bottom:26px;
    }

    .titulo {
      display:flex;
      align-items:center;
      gap:16px;
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

    .atualizado {
      padding:10px 14px;
      border:1px solid var(--borda);
      border-radius:8px;
      background:#fff;
      color:#52635a;
      font-size:13px;
    }

    .filtros {
      display:grid;
      grid-template-columns:1.4fr 1fr 1fr 1fr;
      gap:12px;
      margin-bottom:20px;
      padding:16px;
      border:1px solid var(--borda);
      border-radius:10px;
      background:#fff;
    }

    label {
      display:block;
      margin-bottom:7px;
      font-size:13px;
      font-weight:700;
    }

    input, select {
      width:100%;
      height:42px;
      padding:0 10px;
      border:1px solid #b9cfc3;
      border-radius:7px;
      background:#fff;
      color:var(--texto);
      font:inherit;
    }

    .periodo {
      display:flex;
      gap:8px;
      align-items:center;
    }

    .periodo span {
      color:#66746d;
      font-size:13px;
    }

    .indicadores {
      display:grid;
      grid-template-columns:repeat(5, minmax(0, 1fr));
      gap:14px;
      margin-bottom:20px;
    }

    .card, .painel {
      border:1px solid var(--borda);
      border-radius:10px;
      background:#fff;
    }

    .card {
      min-height:135px;
      padding:18px;
    }

    .card-titulo {
      color:#66746d;
      font-size:13px;
    }

    .card-valor {
      margin-top:16px;
      color:var(--escuro);
      font-size:24px;
      font-weight:700;
    }

    .card-detalhe {
      margin-top:8px;
      color:#66746d;
      font-size:13px;
    }

    .grade {
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:14px;
      margin-bottom:20px;
    }

    .painel {
      padding:18px;
    }

    .painel h2 {
      margin:0 0 18px;
      font-size:17px;
    }

    .ranking {
      display:grid;
      gap:12px;
    }

    .ranking-linha {
      display:grid;
      grid-template-columns:minmax(90px, 1fr) 2fr auto;
      gap:10px;
      align-items:center;
      font-size:13px;
    }

    .ranking-nome {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }

    .barra {
      height:9px;
      overflow:hidden;
      border-radius:999px;
      background:#e6efea;
    }

    .barra > span {
      display:block;
      height:100%;
      border-radius:inherit;
      background:var(--verde);
    }

    .vazio {
      color:#66746d;
      font-size:14px;
      text-align:center;
    }

    .tabela-area {
      overflow-x:auto;
      padding:0;
    }

    .tabela-titulo {
      padding:18px 18px 0;
      font-size:17px;
      font-weight:700;
    }

    table {
      width:100%;
      min-width:850px;
      margin-top:16px;
      border-collapse:collapse;
    }

    th, td {
      padding:12px 18px;
      border-top:1px solid #e3ece7;
      text-align:left;
      font-size:14px;
    }

    th {
      background:#edf6f0;
      color:#123d2d;
    }

    .status {
      display:inline-block;
      padding:5px 8px;
      border-radius:999px;
      background:#e2f3e8;
      color:#12623e;
      font-size:12px;
      font-weight:700;
    }

    .erro {
      display:none;
      margin-bottom:18px;
      padding:12px 14px;
      border-radius:8px;
      background:#fde5e2;
      color:#a22b24;
    }

    .erro.visivel {
      display:block;
    }

    .carregando {
      padding:34px;
      color:#66746d;
      text-align:center;
    }

    @media (max-width:1050px) {
      .indicadores { grid-template-columns:repeat(3, minmax(0, 1fr)); }
      .grade { grid-template-columns:1fr; }
      .filtros { grid-template-columns:1fr 1fr; }
    }

    @media (max-width:700px) {
      main { padding:24px 16px; }
      .topo { align-items:flex-start; flex-direction:column; }
      .indicadores, .filtros { grid-template-columns:1fr; }
      .atualizado { width:100%; }
    }
  </style>
</head>
<body>
  <main>
    <header class="topo">
      <div class="titulo">
        <a class="voltar" href="/" aria-label="Voltar à Página inicial">↩</a>
        <div>
          <h1>Painel de devoluções</h1>
          <p class="subtitulo">Consulta gerencial de devoluções e análise por parceiro e produto.</p>
        </div>
      </div>

      <div class="atualizado">
        <strong>Atualizado em:</strong><br>
        <span id="atualizadoEm">—</span>
      </div>
    </header>

    <section class="filtros">
      <div>
        <label>Período</label>
        <div class="periodo">
          <input id="inicio" type="date">
          <span>até</span>
          <input id="fim" type="date">
        </div>
      </div>

      <div>
        <label for="parceiro">Parceiro</label>
        <select id="parceiro">
          <option value="">Todos</option>
        </select>
      </div>

      <div>
        <label for="codigo">Código do parceiro</label>
        <select id="codigo">
          <option value="">Todos</option>
        </select>
      </div>

      <div>
        <label for="produto">Produto</label>
        <select id="produto">
          <option value="">Todos</option>
        </select>
      </div>
    </section>

    <div id="erro" class="erro" role="alert"></div>

    <section class="indicadores">
      <article class="card">
        <div class="card-titulo">Valor total devolvido</div>
        <div id="valorTotal" class="card-valor">R$ 0,00</div>
      </article>

      <article class="card">
        <div class="card-titulo">Qtd. de itens devolvidos</div>
        <div id="quantidade" class="card-valor">0</div>
      </article>

      <article class="card">
        <div class="card-titulo">Nº de ocorrências</div>
        <div id="ocorrencias" class="card-valor">0</div>
      </article>

      <article class="card">
        <div class="card-titulo">Ticket médio da devolução</div>
        <div id="ticketMedio" class="card-valor">R$ 0,00</div>
      </article>

      <article class="card">
        <div class="card-titulo">Impacto no faturamento</div>
        <div id="impacto" class="card-valor">0,00%</div>
        <div id="faturamento" class="card-detalhe">Faturamento: R$ 0,00</div>
      </article>
    </section>

    <section class="grade">
      <article class="painel">
        <h2>Top 5 parceiros com maior devolução</h2>
        <div id="rankingParceiros" class="ranking"></div>
      </article>

      <article class="painel">
        <h2>Top 5 produtos com mais devolução</h2>
        <div id="rankingProdutos" class="ranking"></div>
      </article>

      <article class="painel">
        <h2>Maior devolução no período</h2>
        <div id="maiorParceiro" class="card-valor">—</div>
        <div id="maiorParceiroValor" class="card-detalhe">R$ 0,00</div>
      </article>
    </section>

    <section class="painel tabela-area">
      <div class="tabela-titulo">Devoluções registradas</div>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Nota</th>
            <th>Parceiro</th>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="linhas">
          <tr>
            <td class="carregando" colspan="7">Carregando devoluções...</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <script>
    const inicio = document.getElementById('inicio');
    const fim = document.getElementById('fim');
    const parceiro = document.getElementById('parceiro');
    const codigo = document.getElementById('codigo');
    const produto = document.getElementById('produto');
    const linhas = document.getElementById('linhas');
    const erro = document.getElementById('erro');
    let devolucoes = [];
    let faturamento = 0;

    function dataParaInput(data) {
      var ano = data.getFullYear();
      var mes = String(data.getMonth() + 1).padStart(2, '0');
      var dia = String(data.getDate()).padStart(2, '0');
      return ano + '-' + mes + '-' + dia;
    }

    function moeda(valor) {
      return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    function numero(valor) {
      return Number(valor || 0).toLocaleString('pt-BR');
    }

    function escapar(valor) {
      var elemento = document.createElement('span');
      elemento.textContent = valor || '';
      return elemento.innerHTML;
    }

    function preencherSelect(elemento, valores) {
      var selecionado = elemento.value;
      var unicos = valores
        .filter(function(valor) { return valor !== null && valor !== undefined && valor !== ''; })
        .filter(function(valor, indice, lista) { return lista.indexOf(valor) === indice; })
        .sort(function(a, b) { return String(a).localeCompare(String(b), 'pt-BR'); });

      elemento.innerHTML = '<option value="">Todos</option>';

      unicos.forEach(function(valor) {
        var opcao = document.createElement('option');
        opcao.value = valor;
        opcao.textContent = valor;
        elemento.appendChild(opcao);
      });

      elemento.value = selecionado;
    }

    function somarPor(campo, itens) {
      var totais = {};

      itens.forEach(function(item) {
        var nome = item[campo] || 'Não informado';
        totais[nome] = (totais[nome] || 0) + Number(item.valorTotal || 0);
      });

      return Object.keys(totais)
        .map(function(nome) {
          return { nome: nome, valor: totais[nome] };
        })
        .sort(function(a, b) {
          return b.valor - a.valor;
        });
    }

    function montarRanking(id, dados) {
      var area = document.getElementById(id);

      if (!dados.length) {
        area.innerHTML = '<div class="vazio">Nenhuma devolução encontrada.</div>';
        return;
      }

      var maior = dados[0].valor || 1;

      area.innerHTML = dados.slice(0, 5).map(function(item) {
        var percentual = Math.max(2, (item.valor / maior) * 100);

        return '<div class="ranking-linha">' +
          '<span class="ranking-nome" title="' + escapar(item.nome) + '">' + escapar(item.nome) + '</span>' +
          '<div class="barra"><span style="width:' + percentual + '%"></span></div>' +
          '<strong>' + moeda(item.valor) + '</strong>' +
        '</div>';
      }).join('');
    }

    function aplicarFiltros() {
      var filtradas = devolucoes.filter(function(item) {
        return (!parceiro.value || item.parceiro === parceiro.value) &&
          (!codigo.value || item.codigoParceiro === codigo.value) &&
          (!produto.value || item.produto === produto.value);
      });

      var valorTotal = filtradas.reduce(function(total, item) {
        return total + Number(item.valorTotal || 0);
      }, 0);

      var quantidade = filtradas.reduce(function(total, item) {
        return total + Number(item.quantidade || 0);
      }, 0);

      var notas = {};

      filtradas.forEach(function(item) {
        if (item.numeroNota) {
          notas[item.numeroNota] = true;
        }
      });

      var ocorrencias = Object.keys(notas).length;
      var ticket = ocorrencias ? valorTotal / ocorrencias : 0;
      var impacto = faturamento ? (valorTotal / faturamento) * 100 : 0;
      var parceiros = somarPor('parceiro', filtradas);

      document.getElementById('valorTotal').textContent = moeda(valorTotal);
      document.getElementById('quantidade').textContent = numero(quantidade);
      document.getElementById('ocorrencias').textContent = numero(ocorrencias);
      document.getElementById('ticketMedio').textContent = moeda(ticket);
      document.getElementById('impacto').textContent = impacto.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + '%';
      document.getElementById('faturamento').textContent = 'Faturamento: ' + moeda(faturamento);
      document.getElementById('maiorParceiro').textContent = parceiros.length ? parceiros[0].nome : '—';
      document.getElementById('maiorParceiroValor').textContent = parceiros.length ? moeda(parceiros[0].valor) : 'R$ 0,00';

      montarRanking('rankingParceiros', parceiros);
      montarRanking('rankingProdutos', somarPor('produto', filtradas));

      if (!filtradas.length) {
        linhas.innerHTML = '<tr><td colspan="7" class="carregando">Nenhuma devolução encontrada.</td></tr>';
        return;
      }

      linhas.innerHTML = filtradas.map(function(item) {
        return '<tr>' +
          '<td>' + escapar(item.data) + '</td>' +
          '<td>' + escapar(item.numeroNota) + '</td>' +
          '<td>' + escapar(item.parceiro) + '</td>' +
          '<td>' + escapar(item.produto) + '</td>' +
          '<td>' + escapar(numero(item.quantidade)) + '</td>' +
          '<td>' + escapar(moeda(item.valorTotal)) + '</td>' +
          '<td><span class="status">Liberada</span></td>' +
        '</tr>';
      }).join('');
    }

    async function carregarDevolucoes() {
      erro.classList.remove('visivel');
      linhas.innerHTML = '<tr><td class="carregando" colspan="7">Carregando devoluções...</td></tr>';

      try {
        var resposta = await fetch(
          '/api/devolucoes?inicio=' + encodeURIComponent(inicio.value) +
          '&fim=' + encodeURIComponent(fim.value),
          { credentials: 'same-origin' }
        );

        var dados = await resposta.json().catch(function() {
          return {};
        });

        if (!resposta.ok) {
          throw new Error(dados.error || 'Não foi possível consultar o Sankhya.');
        }

        devolucoes = dados.items || [];
        faturamento = Number(dados.faturamento || 0);

        preencherSelect(parceiro, devolucoes.map(function(item) { return item.parceiro; }));
        preencherSelect(codigo, devolucoes.map(function(item) { return item.codigoParceiro; }));
        preencherSelect(produto, devolucoes.map(function(item) { return item.produto; }));

        document.getElementById('atualizadoEm').textContent =
          new Date().toLocaleString('pt-BR');

        aplicarFiltros();
      } catch (falha) {
        linhas.innerHTML = '';
        erro.textContent = falha.message;
        erro.classList.add('visivel');
      }
    }

    var hoje = new Date();
    var mesAnterior = new Date();
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);

    inicio.value = dataParaInput(mesAnterior);
    fim.value = dataParaInput(hoje);

    inicio.addEventListener('change', carregarDevolucoes);
    fim.addEventListener('change', carregarDevolucoes);
    parceiro.addEventListener('change', aplicarFiltros);
    codigo.addEventListener('change', aplicarFiltros);
    produto.addEventListener('change', aplicarFiltros);

    carregarDevolucoes();
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
