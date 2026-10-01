export function drePage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DRE | Casa do Croissant</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #eaf1f6;
      color: #163a5a;
      font-family: Arial, sans-serif;
    }

    main {
      max-width: 1500px;
      margin: 0 auto;
      padding: 14px 16px 36px;
    }

    .cabecalho {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 20px 26px;
      margin-bottom: 16px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 22px #17305212;
    }

    .voltar {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fff;
      color: #163a5a;
      text-decoration: none;
      font-size: 25px;
      box-shadow: 0 5px 16px #17305216;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    .subtitulo {
      margin: 7px 0 0;
      color: #607a91;
      font-size: 13px;
    }

    .painel {
      overflow: hidden;
      margin-bottom: 18px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 6px 18px #17305212;
    }

    .titulo-painel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 15px 20px;
      background: #163a5a;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }

    .acoes-titulo {
      position: relative;
    }

    .exportar-excel {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-height: 30px;
      padding: 0 9px;
      border: 1px solid #9db8cd;
      border-radius: 7px;
      background: #fff;
      color: #163a5a;
      font-size: 10px;
    }

    .exportar-excel strong {
      font-size: 9px;
    }

    .menu-exportar {
      position: absolute;
      z-index: 10;
      top: calc(100% + 8px);
      right: 0;
      min-width: 230px;
      overflow: hidden;
      border-radius: 9px;
      background: #fff;
      box-shadow: 0 8px 20px #17305233;
    }

    .menu-exportar button {
      width: 100%;
      min-height: 38px;
      padding: 0 14px;
      border: 0;
      border-radius: 0;
      background: #fff;
      color: #315a78;
      text-align: left;
      font-size: 12px;
      font-weight: normal;
    }

    .menu-exportar button:hover {
      background: #eef3f8;
    }

    .filtros {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 14px;
      padding: 18px 20px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: #315a78;
      font-size: 12px;
      font-weight: bold;
    }

    input,
    select,
    button {
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid #b9cfe2;
      border-radius: 8px;
      background: #fff;
      color: #163a5a;
      font: inherit;
    }

    input,
    select {
      min-width: 180px;
    }

    button {
      border: 0;
      background: #163a5a;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }

    .tabela-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 720px;
      border-collapse: collapse;
    }

    th {
      padding: 12px 14px;
      background: #e8f0f6;
      color: #315a78;
      text-align: right;
      font-size: 11px;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    td {
      padding: 11px 14px;
      border-top: 1px solid #dce6ee;
      text-align: right;
      font-size: 12px;
    }

    .linha-grupo {
      background: #eef3f8;
      font-weight: bold;
    }

    .linha-resultado {
      background: #dce8f3;
      font-weight: bold;
    }

    .linha-filho {
  display: none;
}

.linha-nivel-1 td:first-child {
  padding-left: 34px;
}

.linha-nivel-2 td:first-child {
  padding-left: 62px;
  color: #45667f;
  font-size: 11px;
}

.linha-nivel-3 td:first-child {
  padding-left: 88px;
  color: #607a91;
  font-size: 11px;
}

.linha-auditoria td {
  background: #f8fbfd;
  color: #45667f;
  font-size: 11px;
}

.auditoria-meta {
  display: block;
  margin-top: 3px;
  color: #71889b;
  font-size: 10px;
  font-weight: normal;
}

.expandir-dre {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  min-height: 24px;
  max-height: 24px;
  flex: 0 0 24px;
  vertical-align: middle;
  appearance: none;
  -webkit-appearance: none;
  margin-right: 8px;
  padding: 0;
  border: 1px solid #9db8cd;
  border-radius: 50%;
  background: #fff;
  color: #163a5a;
  font-size: 16px;
  line-height: 1;
}

.espaco-expansao {
  display: inline-block;
  width: 32px;
}

.tabela-wrap {
  max-width: 100%;
  max-height: 70vh;
  overflow: auto;
  border: 1px solid #d6e3ed;
  border-radius: 10px;
}

thead th {
  position: sticky;
  z-index: 4;
  box-shadow: 0 2px 5px rgba(22, 58, 90, 0.16);
}

thead tr:first-child th {
  top: 0;
}

thead tr:nth-child(2) th {
  top: 39px;
}

thead tr:first-child th:first-child {
  z-index: 6;
}

table {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th,
td {
  min-width: 92px;
  white-space: nowrap;
}

th:first-child,
td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  width: 260px;
  min-width: 260px;
  max-width: 260px;
  white-space: normal;
  box-shadow: 2px 0 0 #dce6ee;
}

thead th:first-child {
  z-index: 3;
  background: #e8f0f6;
}

tbody td:first-child {
  background: #fff;
}

tbody .linha-grupo td:first-child {
  background: #eef3f8;
}

tbody .linha-resultado td:first-child {
  background: #dce8f3;
}

.linha-resultado td {
  background: #cfdfee;
  color: #0d3658;
  font-size: 14px;
  font-weight: 700;
  border-top: 2px solid #789bb7;
  border-bottom: 1px solid #a9c1d5;
}

td.valor-negativo {
  color: #b42318;
}

.linha-resultado-final td.valor-positivo {
  color: #16803c;
}

tbody .linha-resultado td:first-child {
  background: #cfdfee;
}

thead tr:first-child th:not(:first-child) {
  text-align: center;
  background: #d5e2ed;
  border-left: 2px solid #b8cce0;
}

thead tr:nth-child(2) th:nth-child(3n + 1) {
  border-left: 2px solid #b8cce0;
}

tbody td:nth-child(3n + 2) {
  border-left: 2px solid #b8cce0;
}

    .vazio {
      padding: 28px;
      color: #607a91;
      text-align: center;
    }

   tbody tr:hover td {
  background: #eaf4ff;
}

tbody tr:hover td:first-child {
  background: #eaf4ff;
}

.cabecalho-total {
  background: #c7dbea !important;
  border-left: 2px solid #789bb7 !important;
}

thead tr:nth-child(2) th.coluna-total {
  border-left: 2px solid #789bb7;
  background: #d9e8f3;
}

td.coluna-total {
  background: #eef5fa;
  font-weight: 700;
  border-left: 2px solid #789bb7;
}

tbody .linha-grupo td.coluna-total {
  background: #e3edf5;
}

tbody .linha-resultado td.coluna-total {
  background: #cfdfee;
}
    
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <a class="voltar" href="/" aria-label="Voltar">←</a>

      <div>
        <h1>DRE</h1>
        <p class="subtitulo">
          Demonstração do Resultado do Exercício
        </p>
      </div>
    </header>

    <section class="painel">
      <div class="titulo-painel">Filtros</div>

      <div class="filtros">
        <label>
          Data inicial
          <input id="dataInicial" type="date">
        </label>

        <label>
          Data final
          <input id="dataFinal" type="date">
        </label>

        <label>
          Empresa
          <select id="empresa">
            <option value="">Todas</option>
          </select>
        </label>

        <button id="atualizar" type="button">
          Atualizar DRE
        </button>
      </div>
    </section>

    <section class="painel">
      <div class="titulo-painel">
        <span>Resultado por período</span>

        <div class="acoes-titulo">
          <button
            id="abrirExportacao"
            class="exportar-excel"
            type="button"
            aria-expanded="false"
            aria-controls="menuExportacao"
            title="Exportar DRE para Excel"
          >
            ⇩ <strong>XLS</strong>
          </button>

          <div id="menuExportacao" class="menu-exportar" hidden>
            <button type="button" data-exportar="expandido">
              Exportar com níveis expandidos
            </button>
            <button type="button" data-exportar="retraido">
              Exportar com níveis retraídos
            </button>
            <button type="button" data-exportar="atual">
              Exportar como está
            </button>
          </div>
        </div>
      </div>

      <div class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Grupo DRE</th>
              <th>Resultado</th>
              <th>% A.H.</th>
              <th>% A.V.</th>
            </tr>
          </thead>

          <tbody id="linhasDre">
            <tr>
              <td class="vazio" colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <script>
  const dataInicial = document.getElementById('dataInicial');
  const dataFinal = document.getElementById('dataFinal');
  const empresa = document.getElementById('empresa');
  const atualizar = document.getElementById('atualizar');
  const linhasDre = document.getElementById('linhasDre');
  const tabela = document.querySelector('table');
  const abrirExportacao = document.getElementById('abrirExportacao');
  const menuExportacao = document.getElementById('menuExportacao');

  function dataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return ano + '-' + mes + '-' + dia;
}

  function primeiroDiaDoMes(data) {
    return new Date(
      data.getFullYear(),
      data.getMonth(),
      1
    );
  }

  function formatarMes(mes) {
  const partes = mes.split('-');

  return partes[1] + '/' + partes[0];
}

  function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(valor || 0));
  }

  function formatarPercentual(valor) {
    if (valor === null || valor === undefined) {
      return '—';
    }

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(Number(valor)) + '%';
  }

  function montarCabecalho(meses) {
  const cabecalho = tabela.createTHead();

  cabecalho.innerHTML =
    '<tr>' +
      '<th rowspan="2">Grupo DRE</th>' +
      meses.map((mes) =>
        '<th colspan="3">' + formatarMes(mes) + '</th>'
      ).join('') +
      '<th colspan="3" class="cabecalho-total">Total</th>' +
    '</tr>' +
    '<tr>' +
      meses.map(() =>
        '<th>Resultado</th>' +
        '<th>% A.H.</th>' +
        '<th>% A.V.</th>'
      ).join('') +
      '<th class="coluna-total">Resultado</th>' +
      '<th>% A.H.</th>' +
      '<th>% A.V.</th>' +
    '</tr>';
}

  function classeResultado(valor) {
  if (Number(valor) < 0) {
    return 'valor-negativo';
  }

  if (Number(valor) > 0) {
    return 'valor-positivo';
  }

  return '';
}

  function montarCelulas(item, meses) {
  const celulasMensais = meses.map((mes) => {
    const indicador = item.indicadores?.[mes] || {
      resultado: 0,
      ah: 0,
      av: null
    };

    return (
      '<td class="' +
        classeResultado(indicador.resultado) +
      '">' +
        formatarNumero(indicador.resultado) +
      '</td>' +
      '<td>' + formatarPercentual(indicador.ah) + '</td>' +
      '<td>' + formatarPercentual(indicador.av) + '</td>'
    );
  }).join('');

  const total = item.total || {
    resultado: 0,
    ah: 0,
    av: null
  };

  return (
    celulasMensais +
    '<td class="coluna-total ' +
      classeResultado(total.resultado) +
    '">' +
      formatarNumero(total.resultado) +
    '</td>' +
    '<td>' + formatarPercentual(total.ah) + '</td>' +
    '<td>' + formatarPercentual(total.av) + '</td>'
  );
}

  function localizarGrupo(dados, codigo) {
    return dados.grupos.find(
      (grupo) => Number(grupo.codigo) === Number(codigo)
    );
  }

function montarLinhaDre(registro, opcoes, meses) {
  const classes = [
  opcoes.classe,
  opcoes.pai ? 'linha-filho' : '',
  'linha-nivel-' + opcoes.nivel,
  opcoes.id === 'resultadoFinal'
    ? 'linha-resultado-final'
    : '',
].filter(Boolean).join(' ');

  const atributos =
    ' data-linha="' + opcoes.id + '"' +
    (opcoes.pai
      ? ' data-pai="' + opcoes.pai + '"'
      : '') +
    (opcoes.possuiFilhos
      ? ' data-aberto="false"'
      : '');

  return (
    '<tr class="' + classes + '"' + atributos + '>' +
      '<td>' +
        controleExpansao(
          opcoes.id,
          opcoes.possuiFilhos,
          opcoes.auditoria
        ) +
        registro.nome +
      '</td>' +
      montarCelulas(registro, meses) +
    '</tr>'
  );
}

function montarLinhas(dados) {
  const ordem = [
    { tipo: 'subtotal', chave: 'receitaBruta' },
    { tipo: 'grupo', codigo: 1, pai: 'receitaBruta' },
    { tipo: 'grupo', codigo: 2, pai: 'receitaBruta' },

    { tipo: 'subtotal', chave: 'deducoes' },
    { tipo: 'grupo', codigo: 3, pai: 'deducoes' },
    { tipo: 'grupo', codigo: 14, pai: 'deducoes' },

    { tipo: 'resultado', chave: 'receitaLiquida' },

    { tipo: 'subtotal', chave: 'custosProducao' },
    { tipo: 'grupo', codigo: 4, pai: 'custosProducao' },
    { tipo: 'grupo', codigo: 5, pai: 'custosProducao' },

    { tipo: 'resultado', chave: 'resultadoBruto' },

    { tipo: 'subtotal', chave: 'despesasGerais' },
    { tipo: 'grupo', codigo: 6, pai: 'despesasGerais' },
    { tipo: 'grupo', codigo: 7, pai: 'despesasGerais' },
    { tipo: 'grupo', codigo: 8, pai: 'despesasGerais' },
    { tipo: 'grupo', codigo: 9, pai: 'despesasGerais' },
    { tipo: 'grupo', codigo: 13, pai: 'despesasGerais' },
    { tipo: 'grupo', codigo: 17, pai: 'despesasGerais' },

    { tipo: 'resultado', chave: 'resultadoOperacional' },

    {
      tipo: 'subtotal',
      chave: 'receitasDespesasFinanceiras'
    },
    {
      tipo: 'grupo',
      codigo: 10,
      pai: 'receitasDespesasFinanceiras'
    },

    { tipo: 'subtotal', chave: 'outrasReceitas' },
    { tipo: 'grupo', codigo: 16, pai: 'outrasReceitas' },

    { tipo: 'resultado', chave: 'resultadoLiquido' },

    { tipo: 'subtotal', chave: 'investimentos' },
    { tipo: 'grupo', codigo: 11, pai: 'investimentos' },

    { tipo: 'subtotal', chave: 'emprestimos' },
    { tipo: 'grupo', codigo: 15, pai: 'emprestimos' },

    { tipo: 'subtotal', chave: 'impostos' },
    { tipo: 'grupo', codigo: 12, pai: 'impostos' },

    { tipo: 'resultado', chave: 'resultadoFinal' }
  ];

  const linhas = [];

  for (const item of ordem) {
    const registro = item.tipo === 'grupo'
      ? localizarGrupo(dados, item.codigo)
      : dados.subtotais[item.chave];

    if (!registro) {
      continue;
    }

    const id = item.tipo === 'grupo'
      ? 'grupo-' + item.codigo
      : item.chave;

    const possuiFilhos = item.tipo === 'subtotal' ||
      (
        item.tipo === 'grupo' &&
        Array.isArray(registro.detalhes) &&
        registro.detalhes.length > 0
      );

    linhas.push(
      montarLinhaDre(
        registro,
        {
          id,
          pai: item.pai || '',
          nivel: item.tipo === 'grupo' ? 1 : 0,
          possuiFilhos,
          classe: item.tipo === 'resultado'
            ? 'linha-resultado'
            : item.tipo === 'subtotal'
              ? 'linha-grupo'
              : ''
        },
        dados.meses
      )
    );

    if (item.tipo !== 'grupo') {
      continue;
    }

    for (const detalhe of registro.detalhes || []) {
      const possuiAuditoria =
        Number(detalhe.total?.resultado || 0) !== 0;

      linhas.push(
        montarLinhaDre(
          detalhe,
          {
            id: 'natureza-' +
              item.codigo + '-' +
              detalhe.codigo,
            pai: id,
            nivel: 2,
            possuiFilhos: possuiAuditoria,
            auditoria: possuiAuditoria
              ? detalhe.codigo
              : '',
            classe: ''
          },
          dados.meses
        )
      );
    }
  }

  return linhas.join('');
}

function atualizarBotaoExpansao(linha) {
  const botao = linha.querySelector('.expandir-dre');

  if (!botao) {
    return;
  }

  const aberto = linha.dataset.aberto === 'true';

  botao.textContent = aberto ? '−' : '+';

  botao.setAttribute(
    'aria-expanded',
    String(aberto)
  );
}

function ocultarDescendentes(id) {
  const filhos = linhasDre.querySelectorAll(
    '[data-pai="' + id + '"]'
  );

  filhos.forEach((filho) => {
    filho.style.display = 'none';
    filho.dataset.aberto = 'false';

    atualizarBotaoExpansao(filho);

    ocultarDescendentes(filho.dataset.linha);
  });
}

function alternarLinhaDre(id) {
  const linha = linhasDre.querySelector(
    '[data-linha="' + id + '"]'
  );

  if (!linha) {
    return;
  }

  const aberto = linha.dataset.aberto === 'true';

  linha.dataset.aberto = aberto ? 'false' : 'true';

  atualizarBotaoExpansao(linha);

  if (aberto) {
    ocultarDescendentes(id);
    return;
  }

  const filhos = linhasDre.querySelectorAll(
    '[data-pai="' + id + '"]'
  );

  filhos.forEach((filho) => {
    filho.style.display = 'table-row';
  });
}

linhasDre.addEventListener('click', (event) => {
  const botao = event.target.closest('.expandir-dre');

  if (!botao) {
    return;
  }

  if (botao.dataset.auditoria) {
    carregarLancamentos(
      botao.dataset.toggle,
      botao.dataset.auditoria
    );
    return;
  }

  alternarLinhaDre(botao.dataset.toggle);
});

 function controleExpansao(id, possuiFilhos, auditoria) {
  if (!possuiFilhos) {
    return '<span class="espaco-expansao"></span>';
  }

  return (
    '<button type="button" class="expandir-dre" ' +
      'data-toggle="' + id + '" ' +
      (auditoria
        ? 'data-auditoria="' + auditoria + '" '
        : '') +
      'aria-expanded="false">+</button>'
  );
}

function escaparHtml(valor) {
  const elemento = document.createElement('span');
  elemento.textContent = String(valor || '');
  return elemento.innerHTML;
}

function escaparXml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function textoCelula(celula) {
  const copia = celula.cloneNode(true);

  copia.querySelectorAll(
    '.expandir-dre, .espaco-expansao'
  ).forEach((elemento) => elemento.remove());

  return copia.textContent.replace(/\s+/g, ' ').trim();
}

function estruturaCabecalhoExcel() {
  const linhas = tabela.querySelectorAll('thead tr');

  if (linhas.length < 2) {
    return {
      grupo: 'Grupo DRE',
      periodos: [],
      indicadores: []
    };
  }

  const periodos = Array.from(linhas[0].cells)
    .slice(1)
    .map((celula) => ({
      nome: textoCelula(celula),
      colunas: Number(celula.getAttribute('colspan') || 1)
    }));

  const indicadores = Array.from(linhas[1].cells)
    .map((celula) => textoCelula(celula));

  return {
    grupo: textoCelula(linhas[0].cells[0]),
    periodos,
    indicadores
  };
}

function linhaDeveSerExportada(linha, modo) {
  if (modo === 'expandido') {
    return true;
  }

  if (modo === 'retraido') {
    return !linha.dataset.pai;
  }

  return getComputedStyle(linha).display !== 'none';
}

function estiloLinhaExcel(linha, coluna) {
  const resultado = linha.classList.contains('linha-resultado');
  const subtotal = linha.classList.contains('linha-grupo');

  if (coluna === 0) {
    if (resultado) {
      return 'primeiraResultado';
    }

    if (subtotal) {
      return 'primeiraSubtotal';
    }

    if (linha.classList.contains('linha-nivel-3')) {
      return 'primeiraNivel3';
    }

    if (linha.classList.contains('linha-nivel-2')) {
      return 'primeiraNivel2';
    }

    if (linha.classList.contains('linha-nivel-1')) {
      return 'primeiraNivel1';
    }

    return 'primeira';
  }

  if (resultado) {
    return 'resultado';
  }

  if (subtotal) {
    return 'subtotal';
  }

  return 'corpo';
}

function celulaExcel(texto, indice, estilo) {
  const valor = String(texto || '').trim();

  if (indice > 0 && !valor.includes('%')) {
    const numero = Number(
      valor.replace(/\./g, '').replace(',', '.')
    );

    if (valor && Number.isFinite(numero)) {
      return (
        '<Cell ss:StyleID="numero' +
          (estilo === 'resultado'
            ? 'Resultado'
            : estilo === 'subtotal'
              ? 'Subtotal'
              : '') +
        '">' +
          '<Data ss:Type="Number">' + numero + '</Data>' +
        '</Cell>'
      );
    }
  }

  return (
    '<Cell ss:StyleID="' + estilo + '"><Data ss:Type="String">' +
      escaparXml(valor) +
    '</Data></Cell>'
  );
}

function nomeModoExportacao(modo) {
  const nomes = {
    expandido: 'Níveis expandidos',
    retraido: 'Níveis retraídos',
    atual: 'Como está na tela'
  };

  return nomes[modo] || nomes.atual;
}

function formatarDataPlanilha(data) {
  const partes = String(data || '').split('-');

  return partes.length === 3
    ? partes[2] + '/' + partes[1] + '/' + partes[0]
    : data;
}

function criarPlanilhaExcel(modo) {
  const cabecalho = estruturaCabecalhoExcel();
  const quantidadeColunas = 1 + cabecalho.indicadores.length;
  const linhas = Array.from(linhasDre.querySelectorAll('tr'))
    .filter((linha) => linhaDeveSerExportada(linha, modo))
    .map((linha) => ({
      valores: Array.from(linha.cells)
        .map((celula) => textoCelula(celula)),
      elemento: linha
    }));

  const linhasDadosXml = linhas
    .map((linha) => (
      '<Row>' +
        Array.from({ length: quantidadeColunas }, (_, coluna) =>
          celulaExcel(
            linha.valores[coluna] || '',
            coluna,
            estiloLinhaExcel(linha.elemento, coluna)
          )
        ).join('') +
      '</Row>'
    ))
    .join('');

  const cabecalhoPeriodoXml = cabecalho.periodos.map((periodo) => (
    '<Cell ss:StyleID="cabecalhoPeriodo" ss:MergeAcross="' +
      (periodo.colunas - 1) + '"><Data ss:Type="String">' +
      escaparXml(periodo.nome) +
    '</Data></Cell>'
  )).join('');

  const cabecalhoIndicadorXml = cabecalho.indicadores.map(
    (indicador) => (
      '<Cell ss:StyleID="cabecalhoIndicador">' +
        '<Data ss:Type="String">' +
          escaparXml(indicador) +
        '</Data></Cell>'
    )
  ).join('');

  const colunasXml =
    '<Column ss:Width="245" />' +
    cabecalho.indicadores.map((_, indice) =>
      '<Column ss:Width="' +
        (indice % 3 === 0 ? '105' : '68') +
      '" />'
    ).join('');

  return (
    '<?xml version="1.0"?>' +
    '<?mso-application progid="Excel.Sheet"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
      'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles>' +
        '<Style ss:ID="Default" ss:Name="Normal">' +
          '<Font ss:FontName="Arial" ss:Size="10" ss:Color="#163A5A" />' +
          '<Alignment ss:Vertical="Center" />' +
        '</Style>' +
        '<Style ss:ID="titulo">' +
          '<Font ss:Bold="1" ss:Size="16" ss:Color="#FFFFFF" />' +
          '<Interior ss:Color="#163A5A" ss:Pattern="Solid" />' +
        '</Style>' +
        '<Style ss:ID="informacao">' +
          '<Font ss:Italic="1" ss:Color="#607A91" />' +
        '</Style>' +
        '<Style ss:ID="cabecalhoGrupo">' +
          '<Font ss:Bold="1" ss:Color="#FFFFFF" />' +
          '<Interior ss:Color="#163A5A" ss:Pattern="Solid" />' +
          '<Alignment ss:Vertical="Center" ss:Horizontal="Left" />' +
        '</Style>' +
        '<Style ss:ID="cabecalhoPeriodo">' +
          '<Font ss:Bold="1" ss:Color="#FFFFFF" />' +
          '<Interior ss:Color="#163A5A" ss:Pattern="Solid" />' +
          '<Alignment ss:Horizontal="Center" ss:Vertical="Center" />' +
        '</Style>' +
        '<Style ss:ID="cabecalhoIndicador">' +
          '<Font ss:Bold="1" ss:Color="#315A78" />' +
          '<Interior ss:Color="#E8F0F6" ss:Pattern="Solid" />' +
          '<Alignment ss:Horizontal="Center" ss:Vertical="Center" />' +
        '</Style>' +
        '<Style ss:ID="primeira"><Alignment ss:Horizontal="Left" /></Style>' +
        '<Style ss:ID="primeiraNivel1">' +
          '<Alignment ss:Horizontal="Left" ss:Indent="1" />' +
        '</Style>' +
        '<Style ss:ID="primeiraNivel2">' +
          '<Alignment ss:Horizontal="Left" ss:Indent="2" />' +
        '</Style>' +
        '<Style ss:ID="primeiraNivel3">' +
          '<Alignment ss:Horizontal="Left" ss:Indent="3" />' +
        '</Style>' +
        '<Style ss:ID="primeiraSubtotal">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#EEF3F8" ss:Pattern="Solid" />' +
        '</Style>' +
        '<Style ss:ID="primeiraResultado">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#CFDFEE" ss:Pattern="Solid" />' +
        '</Style>' +
        '<Style ss:ID="corpo"></Style>' +
        '<Style ss:ID="subtotal">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#EEF3F8" ss:Pattern="Solid" />' +
        '</Style>' +
        '<Style ss:ID="resultado">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#CFDFEE" ss:Pattern="Solid" />' +
        '</Style>' +
        '<Style ss:ID="numero">' +
          '<Alignment ss:Horizontal="Right" />' +
          '<NumberFormat ss:Format="#,##0.00" />' +
        '</Style>' +
        '<Style ss:ID="numeroSubtotal">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#EEF3F8" ss:Pattern="Solid" />' +
          '<Alignment ss:Horizontal="Right" />' +
          '<NumberFormat ss:Format="#,##0.00" />' +
        '</Style>' +
        '<Style ss:ID="numeroResultado">' +
          '<Font ss:Bold="1" />' +
          '<Interior ss:Color="#CFDFEE" ss:Pattern="Solid" />' +
          '<Alignment ss:Horizontal="Right" />' +
          '<NumberFormat ss:Format="#,##0.00" />' +
        '</Style>' +
      '</Styles>' +
      '<Worksheet ss:Name="DRE">' +
        '<Table ss:ExpandedColumnCount="' + quantidadeColunas +
          '" ss:ExpandedRowCount="' + (linhas.length + 5) + '">' +
          colunasXml +
          '<Row ss:Height="26"><Cell ss:StyleID="titulo" ss:MergeAcross="' +
            (quantidadeColunas - 1) + '"><Data ss:Type="String">' +
            'DRE — Demonstração do Resultado do Exercício' +
          '</Data></Cell></Row>' +
          '<Row><Cell ss:StyleID="informacao" ss:MergeAcross="' +
            (quantidadeColunas - 1) + '"><Data ss:Type="String">' +
            'Período: ' + formatarDataPlanilha(dataInicial.value) +
            ' a ' + formatarDataPlanilha(dataFinal.value) +
            ' | Visualização: ' + nomeModoExportacao(modo) +
          '</Data></Cell></Row>' +
          '<Row></Row>' +
          '<Row ss:Height="22">' +
            '<Cell ss:StyleID="cabecalhoGrupo" ss:MergeDown="1">' +
              '<Data ss:Type="String">' +
                escaparXml(cabecalho.grupo) +
              '</Data></Cell>' +
            cabecalhoPeriodoXml +
          '</Row>' +
          '<Row ss:Height="20">' + cabecalhoIndicadorXml + '</Row>' +
          linhasDadosXml +
        '</Table>' +
        '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">' +
          '<FreezePanes /><FrozenNoSplit />' +
          '<SplitHorizontal>5</SplitHorizontal>' +
          '<TopRowBottomPane>5</TopRowBottomPane>' +
          '<Panes><Pane><Number>3</Number></Pane></Panes>' +
        '</WorksheetOptions>' +
      '</Worksheet>' +
    '</Workbook>'
  );
}

function exportarExcel(modo) {
  const planilha = criarPlanilhaExcel(modo);
  const arquivo = new Blob([planilha], {
    type: 'application/vnd.ms-excel;charset=utf-8'
  });
  const link = document.createElement('a');
  const urlArquivo = URL.createObjectURL(arquivo);
  const periodo = dataInicial.value + '_a_' + dataFinal.value;

  link.href = urlArquivo;
  link.download = 'DRE_' + periodo + '_' + modo + '.xls';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(urlArquivo);
  }, 0);
}

abrirExportacao.addEventListener('click', () => {
  const aberto = !menuExportacao.hidden;

  menuExportacao.hidden = aberto;
  abrirExportacao.setAttribute(
    'aria-expanded',
    String(!aberto)
  );
});

menuExportacao.addEventListener('click', (event) => {
  const botao = event.target.closest('[data-exportar]');

  if (!botao) {
    return;
  }

  exportarExcel(botao.dataset.exportar);
  menuExportacao.hidden = true;
  abrirExportacao.setAttribute('aria-expanded', 'false');
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.acoes-titulo')) {
    return;
  }

  menuExportacao.hidden = true;
  abrirExportacao.setAttribute('aria-expanded', 'false');
});

function montarCelulasLancamento(lancamento, meses) {
  const celulasMensais = meses.map((mes) => {
    const pertenceAoMes = lancamento.mes === mes;
    const valor = pertenceAoMes
      ? formatarNumero(lancamento.valor)
      : '';

    return (
      '<td class="' +
        (pertenceAoMes
          ? classeResultado(lancamento.valor)
          : '') +
      '">' + valor + '</td>' +
      '<td></td><td></td>'
    );
  }).join('');

  return (
    celulasMensais +
    '<td class="coluna-total ' +
      classeResultado(lancamento.valor) +
    '">' + formatarNumero(lancamento.valor) +
    '</td><td></td><td></td>'
  );
}

function montarLinhasLancamentos(id, lancamentos, meses) {
  if (!lancamentos.length) {
    return (
      '<tr class="linha-filho linha-nivel-3 linha-auditoria" ' +
        'data-linha="vazio-' + id + '" data-pai="' + id + '">' +
        '<td colspan="' + (1 + meses.length * 3 + 3) + '">' +
          'Nenhum lançamento encontrado para esta natureza.' +
        '</td></tr>'
    );
  }

  return lancamentos.map((lancamento, indice) => {
    const titulo = lancamento.origem === 'Venda'
      ? 'Nota ' + lancamento.documento
      : 'NUFIN ' + lancamento.documento;

    return (
      '<tr class="linha-filho linha-nivel-3 linha-auditoria" ' +
        'data-linha="lancamento-' + id + '-' + indice + '" ' +
        'data-pai="' + id + '">' +
        '<td><strong>' + escaparHtml(titulo) + '</strong>' +
          '<span class="auditoria-meta">' +
            escaparHtml(lancamento.data) + ' · ' +
            escaparHtml(lancamento.parceiro) +
          '</span></td>' +
        montarCelulasLancamento(lancamento, meses) +
      '</tr>'
    );
  }).join('');
}

async function carregarLancamentos(id, natureza) {
  const linha = linhasDre.querySelector(
    '[data-linha="' + id + '"]'
  );

  if (!linha) {
    return;
  }

  if (linha.dataset.carregado === 'true') {
    alternarLinhaDre(id);
    return;
  }

  const botao = linha.querySelector('.expandir-dre');

  if (botao) {
    botao.disabled = true;
    botao.textContent = '…';
  }

  const parametros = new URLSearchParams({
    inicio: dataInicial.value,
    fim: dataFinal.value,
    natureza: natureza
  });

  if (empresa.value) {
    parametros.set('empresa', empresa.value);
  }

  try {
    const resposta = await fetch(
      '/api/dre/auditoria?' + parametros.toString()
    );
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.error || 'Não foi possível carregar os lançamentos.'
      );
    }

    linha.insertAdjacentHTML(
      'afterend',
      montarLinhasLancamentos(
        id,
        dados.lancamentos || [],
        dados.meses || []
      )
    );

    linha.dataset.carregado = 'true';
    alternarLinhaDre(id);
  } catch (error) {
    window.alert(error.message || 'Não foi possível carregar os lançamentos.');
  } finally {
    if (botao) {
      botao.disabled = false;
      atualizarBotaoExpansao(linha);
    }
  }
}

  async function carregarDre() {
    const parametros = new URLSearchParams({
      inicio: dataInicial.value,
      fim: dataFinal.value
    });

    if (empresa.value) {
      parametros.set('empresa', empresa.value);
    }

    try {
      const resposta = await fetch(
        '/api/dre?' + parametros.toString()
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Não foi possível carregar a DRE.'
        );
      }

      tabela.querySelector('thead')?.remove();
      montarCabecalho(dados.meses);

      linhasDre.innerHTML = montarLinhas(dados);
    } catch (error) {
  console.error('Erro ao carregar DRE:', error);

  linhasDre.innerHTML =
    '<tr>' +
      '<td class="vazio" colspan="4">' +
        (error.message || 'Não foi possível carregar a DRE.') +
      '</td>' +
    '</tr>';
}
  }

  const hoje = new Date();

  dataInicial.value = dataLocal(
    primeiroDiaDoMes(hoje)
  );

  dataFinal.value = dataLocal(hoje);

  atualizar.addEventListener(
    'click',
    carregarDre
  );

  carregarDre();
</script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8'
    }
  });
}
