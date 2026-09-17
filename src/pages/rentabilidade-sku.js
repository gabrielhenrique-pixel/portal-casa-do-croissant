export function rentabilidadeSkuPage() {
  return new Response(String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rentabilidade SKU</title>
  <style>
    :root {
      --azul: #1f4e78;
      --azul-escuro: #102e49;
      --verde: #0d4b2b;
      --fundo: #f4f7f5;
      --borda: #d6e1da;
      --texto: #163126;
      --vermelho: #e02020;
      --amarelo: #fff2cc;
      --verde-margem: #e2f0d9;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--fundo);
      color: var(--texto);
      font-family: Arial, sans-serif;
    }

    main {
      max-width: 1800px;
      margin: 0 auto;
      padding: 24px 18px 34px;
    }

    .cabecalho {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 18px;
      padding: 18px 22px;
      border-radius: 12px;
      background: var(--azul-escuro);
      color: white;
    }

    h1 {
      margin: 0;
      font-size: 25px;
      letter-spacing: .3px;
    }

    .subtitulo {
      margin: 5px 0 0;
      color: #d8e5ee;
      font-size: 14px;
    }

    .filtros {
      display: flex;
      align-items: end;
      flex-wrap: wrap;
      gap: 14px;
      margin: 0;
    }

    .campo {
      display: grid;
      gap: 6px;
      min-width: 158px;
    }

    .campo span {
      color: #e5eff5;
      font-size: 12px;
      font-weight: bold;
    }

    input[type="date"] {
      min-height: 38px;
      border: 1px solid #72a8cf;
      border-radius: 7px;
      padding: 7px 9px;
      background: white;
      color: #1f3544;
      font: inherit;
    }

    button {
      min-height: 38px;
      border: 1px solid #8ec7e8;
      border-radius: 7px;
      padding: 8px 16px;
      background: #176596;
      color: white;
      font: inherit;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover:not(:disabled) { background: #0d527d; }
    button:disabled { cursor: wait; opacity: .7; }

    .estado {
      min-height: 22px;
      margin: 16px 0 10px;
      color: #52645a;
      font-size: 14px;
    }

    .estado.erro {
      padding: 12px 14px;
      border: 1px solid #f2b8b5;
      border-radius: 8px;
      background: #fde9e7;
      color: #b42318;
    }

    .tabela-area {
      overflow-x: auto;
      border: 1px solid var(--borda);
      border-radius: 9px;
      background: white;
      box-shadow: 0 3px 12px rgba(18, 47, 35, .08);
    }

    table {
      width: 100%;
      min-width: 2460px;
      border-collapse: collapse;
      font-size: 12px;
    }

    th {
      position: sticky;
      top: 0;
      z-index: 1;
      border: 1px solid #d1dce4;
      padding: 9px 8px;
      background: var(--azul);
      color: white;
      font-size: 11px;
      line-height: 1.15;
      text-align: center;
      text-transform: uppercase;
      white-space: normal;
    }

    th.coluna-vazia {
      min-width: 68px;
      color: #d6e6ef;
      text-transform: none;
    }

    td {
      border: 1px solid #e1e7e3;
      padding: 7px 8px;
      color: #17291f;
      text-align: right;
      vertical-align: middle;
      white-space: nowrap;
    }

    tbody tr:nth-child(even) { background: #f8faf9; }
    tbody tr:hover { background: #edf5f0; }
    td.texto { text-align: left; }
    td.centralizado { text-align: center; }
    td.negativo { color: var(--vermelho); }
    td.margem-critica { background: #f4cccc; color: #c00000; font-weight: bold; }
    td.margem-alerta { background: var(--amarelo); color: #8a5b00; font-weight: bold; }
    td.margem-boa { background: var(--verde-margem); color: #25713b; font-weight: bold; }

    .sem-dados td {
      padding: 26px;
      color: #5d6f65;
      text-align: center;
    }

    main {
  max-width:1440px;
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
  color:#102e49;
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
  color:#102e49;
  font-size:30px;
  font-weight:700;
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

.campo {
  display:grid;
  gap:5px;
  min-width:175px;
}

.campo span {
  color:#17375f;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
}

.campo input[type="date"] {
  width:175px;
  min-height:39px;
  border:1px solid #c6d4e4;
  border-radius:7px;
  padding:0 10px;
  color:#142f57;
  background:#fff;
  font-size:14px;
}

#botaoAtualizar {
  min-height:39px;
  border:0;
  border-radius:8px;
  padding:10px 18px;
  background:#102e49;
  color:#fff;
  font-size:13px;
  font-weight:700;
}

#botaoAtualizar:hover:not(:disabled) {
  background:#1b4b7b;
}

.th-com-filtro {
  position: sticky;
  padding-right: 34px;
}

.botao-filtro-coluna {
  position: absolute;
  top: 50%;
  right: 7px;
  width: 23px;
  min-height: 23px;
  transform: translateY(-50%);
  border: 0;
  border-radius: 5px;
  padding: 0;
  background: #39729d;
  color: #fff;
  font-size: 11px;
  line-height: 1;
}

.botao-filtro-coluna:hover,
.botao-filtro-coluna.ativo {
  background: #0d3858;
}

.menu-filtro-coluna {
  position: fixed;
  z-index: 50;
  width: 290px;
  padding: 12px;
  border: 1px solid #b9cad9;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 10px 26px rgba(16, 46, 73, .24);
  color: #17375f;
}

.menu-filtro-titulo {
  margin-bottom: 9px;
  font-size: 16px;
  font-weight: bold;
}

.menu-filtro-pesquisa {
  width: 100%;
  min-height: 34px;
  margin-bottom: 8px;
  border: 1px solid #bdcede;
  border-radius: 5px;
  padding: 7px 9px;
  color: #17375f;
  font: inherit;
}

.menu-filtro-selecionar-todos,
.menu-filtro-opcao {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #263e55;
  font-size: 13px;
}

.menu-filtro-selecionar-todos {
  margin: 4px 0 7px;
}

.menu-filtro-opcoes {
  max-height: 235px;
  overflow-y: auto;
  border: 1px solid #d5e0e9;
  padding: 4px 7px;
}

.menu-filtro-opcao {
  min-height: 27px;
}

.menu-filtro-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 11px;
}

.menu-filtro-acoes button {
  min-height: 37px;
  border: 0;
  border-radius: 6px;
  padding: 8px 13px;
  background: #102e49;
  color: #fff;
}

.menu-filtro-acoes .limpar {
  border: 1px solid #bdcede;
  background: #fff;
  color: #17375f;
}

    @media (max-width: 720px) {
      main { padding: 12px 10px 24px; }
      .cabecalho { align-items: stretch; flex-direction: column; padding: 16px; }
      .filtros { align-items: stretch; }
      .campo { flex: 1 1 140px; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <main>

    <header class="topo">
  <nav class="navegacao-topo" aria-label="Navegação">
    <a class="nav-icone" href="/dashboard-rentabilidade" aria-label="Voltar à rentabilidade">←</a>
    <a class="nav-icone" href="/" aria-label="Voltar à página inicial">⌂</a>
  </nav>

  <div class="marca">
    <span>RENTABILIDADE SKU</span>
  </div>
</header>

<form class="filtros" id="formFiltros">
  <label class="campo">
    <span>Data inicial</span>
    <input id="inicio" name="inicio" type="date" required>
  </label>

  <label class="campo">
    <span>Data final</span>
    <input id="fim" name="fim" type="date" required>
  </label>

  <button id="botaoAtualizar" type="submit">↻ ATUALIZAR DADOS</button>
</form>

    <p class="estado" id="estado" aria-live="polite">Carregando dados...</p>

    <section class="tabela-area" aria-label="Tabela de rentabilidade SKU">
      <table>
        <thead>
          <tr>
            <th>DATA</th>
            <th>COD_PARCEIRO</th>
            <th>PARCEIRO</th>
            <th>PRODUTO</th>
            <th>QTD_NEG</th>
            <th>VLR_LIQUIDO</th>
            <th>VLR_ST</th>
            <th class="coluna-vazia">Column8</th>
            <th>Faturamento</th>
            <th>Impostos</th>
            <th>acordos</th>
            <th>Receita Líquida</th>
            <th>CMV Unit.</th>
            <th>CMV Total</th>
            <th>Promotoria (%)</th>
            <th>Custo Promotoria</th>
            <th>Contrato (%)</th>
            <th>Custo Contrato</th>
            <th>Investimentos</th>
            <th>Comissão (%)</th>
            <th>Custo Comissão</th>
            <th>Resultado</th>
            <th>Margem %</th>
            <th>Meta Margem</th>
            <th>Gap Margem</th>
          </tr>
        </thead>
        <tbody id="linhasTabela"></tbody>
      </table>
    </section>
  </main>

  <script>
    (function() {
      var form = document.getElementById('formFiltros');
      var inicio = document.getElementById('inicio');
      var fim = document.getElementById('fim');
      var botaoAtualizar = document.getElementById('botaoAtualizar');
      var estado = document.getElementById('estado');
      var linhasTabela = document.getElementById('linhasTabela');
      var quantidadeColunas = 25;

      var todosItens = [];
var filtrosColunas = {};
var menusFiltroAbertos = [];

function tituloDaColuna(indice) {
  var titulos = [
    'Data', 'Código do parceiro', 'Parceiro', 'Produto', 'Quantidade',
    'Valor líquido', 'Valor ST', '', 'Faturamento', 'Impostos',
    'Acordos', 'Receita líquida', 'CMV unitário', 'CMV total',
    'Promotoria', 'Custo promotoria', 'Contrato', 'Custo contrato',
    'Investimentos', 'Comissão', 'Custo comissão', 'Resultado',
    'Margem', 'Meta margem', 'Gap margem'
  ];

  return titulos[indice] || 'Coluna';
}

function valorDaColuna(item, indice) {
  var valorLiquido = valorDoItem(item, ['valorLiquido', 'vlrLiquido']);
  var valorSt = valorDoItem(item, ['valorSt', 'vlrSt']);
  var faturamento = valorDoItem(item, ['faturamento', 'faturamentoBruto']);
  var impostos = valorDoItem(item, ['impostos']);
  var acordos = valorDoItem(item, ['acordos']);
  var receitaLiquida = valorDoItem(item, ['receitaLiquida']);
  var cmvUnitario = valorDoItem(item, ['cmvUnitario']);
  var cmvTotal = valorDoItem(item, ['cmvTotal']);
  var promotoria = valorDoItem(item, ['percentualPromotoria', 'promotoria']);
  var custoPromotoria = valorDoItem(item, ['custoPromotoria']);
  var contrato = valorDoItem(item, ['percentualContrato', 'contrato']);
  var custoContrato = valorDoItem(item, ['custoContrato']);
  var investimentos = valorDoItem(item, ['investimentos']);
  var comissao = valorDoItem(item, ['percentualComissao', 'comissao']);
  var custoComissao = valorDoItem(item, ['custoComissao']);
  var resultado = valorDoItem(item, ['resultado']);
  var margem = valorDoItem(item, ['margem', 'margemPercentual']);
  var metaMargem = valorDoItem(item, ['metaMargem']);
  var gapMargem = valorDoItem(item, ['gapMargem']);

  var valores = [
    formatarData(item.data),
    item.codigoParceiro || '—',
    item.parceiro || '—',
    item.produto || '—',
    formatarNumero(item.quantidade),
    formatarMoeda(valorLiquido),
    formatarMoeda(valorSt),
    '—',
    formatarMoeda(faturamento),
    formatarMoeda(impostos),
    formatarMoeda(acordos),
    formatarMoeda(receitaLiquida),
    formatarMoeda(cmvUnitario),
    formatarMoeda(cmvTotal),
    formatarPercentual(promotoria),
    formatarMoeda(custoPromotoria),
    formatarPercentual(contrato),
    formatarMoeda(custoContrato),
    formatarMoeda(investimentos),
    formatarPercentual(comissao),
    formatarMoeda(custoComissao),
    formatarMoeda(resultado),
    formatarPercentual(margem),
    formatarPercentual(metaMargem),
    formatarPercentual(gapMargem)
  ];

  return String(valores[indice] || '—');
}

      function dataParaInput(data) {
        return [
          data.getFullYear(),
          String(data.getMonth() + 1).padStart(2, '0'),
          String(data.getDate()).padStart(2, '0')
        ].join('-');
      }

      function definirPeriodoInicial() {
        var hoje = new Date();
        var primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        inicio.value = dataParaInput(primeiroDia);
        fim.value = dataParaInput(hoje);
      }

      function numero(valor) {
        if (typeof valor === 'number') {
          return Number.isFinite(valor) ? valor : 0;
        }

        if (valor === null || valor === undefined || valor === '') {
          return 0;
        }

        var texto = String(valor).trim()
          .replace(/^R\$\s?/, '')
          .replace(/\s/g, '');

        if (texto.indexOf(',') !== -1 && texto.indexOf('.') !== -1) {
          if (texto.lastIndexOf(',') > texto.lastIndexOf('.')) {
            texto = texto.replace(/\./g, '').replace(',', '.');
          } else {
            texto = texto.replace(/,/g, '');
          }
        } else if (texto.indexOf(',') !== -1) {
          texto = texto.replace(',', '.');
        }

        var convertido = Number(texto);
        return Number.isFinite(convertido) ? convertido : 0;
      }

      function valorDoItem(item, nomes) {
        for (var i = 0; i < nomes.length; i++) {
          if (item[nomes[i]] !== undefined && item[nomes[i]] !== null) {
            return item[nomes[i]];
          }
        }

        return null;
      }

      function formatarData(valor) {
        if (!valor) return '—';

        var texto = String(valor);
        var partes = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

        return partes
          ? partes[3] + '/' + partes[2] + '/' + partes[1]
          : texto;
      }

      function formatarNumero(valor) {
        var numeroFormatado = numero(valor);
        return numeroFormatado === 0
          ? '—'
          : numeroFormatado.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
      }

      function formatarMoeda(valor) {
        var numeroFormatado = numero(valor);
        return numeroFormatado === 0
          ? '—'
          : numeroFormatado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
      }

      function formatarPercentual(valor) {
        if (valor === null || valor === undefined || valor === '') {
          return '—';
        }

        return numero(valor).toLocaleString('pt-BR', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        });
      }

      function classeNegativa(valor) {
        return numero(valor) < 0 ? 'negativo' : '';
      }

      function classeMargem(valor) {
        if (valor === null || valor === undefined || valor === '') {
          return '';
        }

        var margem = numero(valor);

        if (margem < 0.15) return 'margem-critica';
        if (margem < 0.2) return 'margem-alerta';
        return 'margem-boa';
      }

      function adicionarCelula(linha, conteudo, classes) {
        var celula = document.createElement('td');
        celula.textContent = conteudo;

        if (classes) {
          classes.split(' ').filter(Boolean).forEach(function(nomeClasse) {
            celula.classList.add(nomeClasse);
          });
        }

        linha.appendChild(celula);
      }

      function renderizarLinhas(itens) {
        linhasTabela.replaceChildren();

        if (!itens.length) {
          var semDados = document.createElement('tr');
          var celula = document.createElement('td');
          celula.colSpan = quantidadeColunas;
          celula.textContent = 'Nenhuma venda encontrada para o período selecionado.';
          semDados.className = 'sem-dados';
          semDados.appendChild(celula);
          linhasTabela.appendChild(semDados);
          return;
        }

        var fragmento = document.createDocumentFragment();

        itens.forEach(function(item) {
          var linha = document.createElement('tr');
          var valorLiquido = valorDoItem(item, ['valorLiquido', 'vlrLiquido']);
          var valorSt = valorDoItem(item, ['valorSt', 'vlrSt']);
          var faturamento = valorDoItem(item, ['faturamento', 'faturamentoBruto']);
          var impostos = valorDoItem(item, ['impostos']);
          var acordos = valorDoItem(item, ['acordos']);
          var receitaLiquida = valorDoItem(item, ['receitaLiquida']);
          var cmvUnitario = valorDoItem(item, ['cmvUnitario']);
          var cmvTotal = valorDoItem(item, ['cmvTotal']);
          var percentualPromotoria = valorDoItem(item, ['percentualPromotoria', 'promotoria']);
          var custoPromotoria = valorDoItem(item, ['custoPromotoria']);
          var percentualContrato = valorDoItem(item, ['percentualContrato', 'contrato']);
          var custoContrato = valorDoItem(item, ['custoContrato']);
          var investimentos = valorDoItem(item, ['investimentos']);
          var percentualComissao = valorDoItem(item, ['percentualComissao', 'comissao']);
          var custoComissao = valorDoItem(item, ['custoComissao']);
          var resultado = valorDoItem(item, ['resultado']);
          var margem = valorDoItem(item, ['margem', 'margemPercentual']);
          var metaMargem = valorDoItem(item, ['metaMargem']);
          var gapMargem = valorDoItem(item, ['gapMargem']);

          adicionarCelula(linha, formatarData(item.data), 'centralizado');
          adicionarCelula(linha, item.codigoParceiro || '', 'centralizado');
          adicionarCelula(linha, item.parceiro || '', 'texto');
          adicionarCelula(linha, item.produto || '', 'texto');
          adicionarCelula(linha, formatarNumero(item.quantidade), '');
          adicionarCelula(linha, formatarMoeda(valorLiquido), classeNegativa(valorLiquido));
          adicionarCelula(linha, formatarMoeda(valorSt), classeNegativa(valorSt));
          adicionarCelula(linha, '', 'centralizado');
          adicionarCelula(linha, formatarMoeda(faturamento), classeNegativa(faturamento));
          adicionarCelula(linha, formatarMoeda(impostos), classeNegativa(impostos));
          adicionarCelula(linha, formatarMoeda(acordos), classeNegativa(acordos));
          adicionarCelula(linha, formatarMoeda(receitaLiquida), classeNegativa(receitaLiquida));
          adicionarCelula(linha, formatarMoeda(cmvUnitario), classeNegativa(cmvUnitario));
          adicionarCelula(linha, formatarMoeda(cmvTotal), classeNegativa(cmvTotal));
          adicionarCelula(linha, formatarPercentual(percentualPromotoria), classeNegativa(percentualPromotoria));
          adicionarCelula(linha, formatarMoeda(custoPromotoria), classeNegativa(custoPromotoria));
          adicionarCelula(linha, formatarPercentual(percentualContrato), classeNegativa(percentualContrato));
          adicionarCelula(linha, formatarMoeda(custoContrato), classeNegativa(custoContrato));
          adicionarCelula(linha, formatarMoeda(investimentos), classeNegativa(investimentos));
          adicionarCelula(linha, formatarPercentual(percentualComissao), classeNegativa(percentualComissao));
          adicionarCelula(linha, formatarMoeda(custoComissao), classeNegativa(custoComissao));
          adicionarCelula(linha, formatarMoeda(resultado), classeNegativa(resultado));
          adicionarCelula(linha, formatarPercentual(margem), classeMargem(margem));
          adicionarCelula(linha, formatarPercentual(metaMargem), '');
          adicionarCelula(linha, formatarPercentual(gapMargem), classeNegativa(gapMargem));

          fragmento.appendChild(linha);
        });

        linhasTabela.appendChild(fragmento);
      }

      function fecharMenusFiltro() {
  menusFiltroAbertos.forEach(function(menu) {
    menu.remove();
  });

  menusFiltroAbertos = [];
}

function atualizarIndicadoresFiltros() {
  document.querySelectorAll('.botao-filtro-coluna').forEach(function(botao) {
    var indice = Number(botao.dataset.indice);
    botao.classList.toggle(
      'ativo',
      filtrosColunas[indice] instanceof Set
    );
  });
}

function aplicarFiltrosTabela() {
  var itensFiltrados = todosItens.filter(function(item) {
    return Object.keys(filtrosColunas).every(function(chave) {
      var valoresSelecionados = filtrosColunas[chave];

      return valoresSelecionados.has(
        valorDaColuna(item, Number(chave))
      );
    });
  });

  renderizarLinhas(itensFiltrados);
  atualizarIndicadoresFiltros();
}

function renderizarTabela(itens) {
  todosItens = Array.isArray(itens) ? itens : [];
  aplicarFiltrosTabela();
}

function abrirFiltroColuna(indice, botao) {
  fecharMenusFiltro();

  var valores = Array.from(
    new Set(
      todosItens.map(function(item) {
        return valorDaColuna(item, indice);
      })
    )
  ).sort(function(a, b) {
    return a.localeCompare(b, 'pt-BR', { numeric: true });
  });

  var selecionados = filtrosColunas[indice]
    ? new Set(filtrosColunas[indice])
    : new Set(valores);

  var menu = document.createElement('div');
  menu.className = 'menu-filtro-coluna';

  var posicao = botao.getBoundingClientRect();
  menu.style.top = Math.min(posicao.bottom + 6, window.innerHeight - 420) + 'px';
  menu.style.left = Math.min(posicao.left - 250, window.innerWidth - 300) + 'px';

  var titulo = document.createElement('div');
  titulo.className = 'menu-filtro-titulo';
  titulo.textContent = 'Filtro: ' + tituloDaColuna(indice);

  var pesquisa = document.createElement('input');
  pesquisa.type = 'search';
  pesquisa.className = 'menu-filtro-pesquisa';
  pesquisa.placeholder = 'Pesquisar';

  var selecionarTudoLabel = document.createElement('label');
  selecionarTudoLabel.className = 'menu-filtro-selecionar-todos';

  var selecionarTudo = document.createElement('input');
  selecionarTudo.type = 'checkbox';

  selecionarTudoLabel.appendChild(selecionarTudo);
  selecionarTudoLabel.appendChild(
    document.createTextNode('Selecionar tudo')
  );

  var opcoes = document.createElement('div');
  opcoes.className = 'menu-filtro-opcoes';

  function atualizarSelecaoTotal() {
    selecionarTudo.checked = valores.length > 0 &&
      valores.every(function(valor) {
        return selecionados.has(valor);
      });

    selecionarTudo.indeterminate = !selecionarTudo.checked &&
      valores.some(function(valor) {
        return selecionados.has(valor);
      });
  }

  function desenharOpcoes() {
    var termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    opcoes.replaceChildren();

    valores.filter(function(valor) {
      return valor.toLocaleLowerCase('pt-BR').includes(termo);
    }).forEach(function(valor) {
      var label = document.createElement('label');
      label.className = 'menu-filtro-opcao';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selecionados.has(valor);

      checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
          selecionados.add(valor);
        } else {
          selecionados.delete(valor);
        }

        atualizarSelecaoTotal();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(valor));
      opcoes.appendChild(label);
    });

    atualizarSelecaoTotal();
  }

  selecionarTudo.addEventListener('change', function() {
    if (selecionarTudo.checked) {
      valores.forEach(function(valor) {
        selecionados.add(valor);
      });
    } else {
      selecionados.clear();
    }

    desenharOpcoes();
  });

  pesquisa.addEventListener('input', desenharOpcoes);

  var acoes = document.createElement('div');
  acoes.className = 'menu-filtro-acoes';

  var limpar = document.createElement('button');
  limpar.type = 'button';
  limpar.className = 'limpar';
  limpar.textContent = 'Limpar';

  limpar.addEventListener('click', function() {
    delete filtrosColunas[indice];
    fecharMenusFiltro();
    aplicarFiltrosTabela();
  });

  var aplicar = document.createElement('button');
  aplicar.type = 'button';
  aplicar.textContent = 'Aplicar';

  aplicar.addEventListener('click', function() {
    filtrosColunas[indice] = new Set(selecionados);
    fecharMenusFiltro();
    aplicarFiltrosTabela();
  });

  acoes.appendChild(limpar);
  acoes.appendChild(aplicar);

  menu.appendChild(titulo);
  menu.appendChild(pesquisa);
  menu.appendChild(selecionarTudoLabel);
  menu.appendChild(opcoes);
  menu.appendChild(acoes);

  document.body.appendChild(menu);
  menusFiltroAbertos.push(menu);
  desenharOpcoes();
}

function prepararFiltrosColunas() {
  document.querySelectorAll('thead th').forEach(function(cabecalho, indice) {
    if (indice === 7) return;

    cabecalho.classList.add('th-com-filtro');

    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-filtro-coluna';
    botao.dataset.indice = indice;
    botao.title = 'Filtrar ' + tituloDaColuna(indice);
    botao.textContent = '▼';

    botao.addEventListener('click', function(evento) {
      evento.stopPropagation();
      abrirFiltroColuna(indice, botao);
    });

    cabecalho.appendChild(botao);
  });

  document.addEventListener('click', function(evento) {
    if (
      !evento.target.closest('.menu-filtro-coluna') &&
      !evento.target.closest('.botao-filtro-coluna')
    ) {
      fecharMenusFiltro();
    }
  });
}

      function mostrarEstado(mensagem, erro) {
        estado.textContent = mensagem;
        estado.classList.toggle('erro', Boolean(erro));
      }

      async function carregarDados() {
        if (!inicio.value || !fim.value) {
          mostrarEstado('Informe a data inicial e a data final.', true);
          return;
        }

        if (inicio.value > fim.value) {
          mostrarEstado('A data inicial não pode ser posterior à data final.', true);
          return;
        }

        botaoAtualizar.disabled = true;
        mostrarEstado('Carregando dados de rentabilidade...');

        try {
          var parametros = new URLSearchParams({
            inicio: inicio.value,
            fim: fim.value
          });
          var resposta = await fetch('/api/rentabilidade/sku?' + parametros.toString(), {
            headers: { accept: 'application/json' }
          });
          var dados = await resposta.json().catch(function() { return {}; });

          if (!resposta.ok) {
            throw new Error(dados.error || 'Não foi possível consultar a rentabilidade SKU.');
          }

          var itens = Array.isArray(dados)
            ? dados
            : (Array.isArray(dados.items) ? dados.items : []);

          renderizarTabela(itens);
          mostrarEstado(
            itens.length.toLocaleString('pt-BR') +
            (itens.length === 1 ? ' item carregado.' : ' itens carregados.')
          );
        } catch (erro) {
          renderizarTabela([]);
          mostrarEstado(erro.message || 'Não foi possível carregar os dados.', true);
        } finally {
          botaoAtualizar.disabled = false;
        }
      }

      form.addEventListener('submit', function(evento) {
        evento.preventDefault();
        carregarDados();
      });

      prepararFiltrosColunas();
      definirPeriodoInicial();
      carregarDados();
    })();
  </script>
</body>
</html>
`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
