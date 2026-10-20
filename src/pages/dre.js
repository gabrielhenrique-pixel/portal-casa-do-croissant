export function drePage({ regime = 'competencia' } = {}) {
  const caixa = regime === 'caixa';
  const titulo = caixa ? 'DRE Caixa' : 'DRE Competência';
  const api = caixa ? '/api/dre/caixa' : '/api/dre';
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo} | Casa do Croissant</title>

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

#atualizar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

#atualizar.carregando {
  opacity: 0.8;
  cursor: wait;
}

#atualizar.carregando::before {
  content: "";
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: girarAtualizacaoDre 0.7s linear infinite;
}

.status-atualizacao-dre {
  margin: 0 0 18px;
  padding: 0 20px;
  color: #173b59;
  font-size: 14px;
  font-weight: 600;
}

.status-atualizacao-dre[hidden] {
  display: none;
}

@keyframes girarAtualizacaoDre {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  #atualizar.carregando::before {
    animation: none;
  }
}
.resumo-dre{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-bottom:18px}
.indicador-dre{padding:18px;background:#fff;border:1px solid #dce7ec;border-radius:14px;min-width:0}
.indicador-dre h2{margin:0;color:#607a91;font-size:13px;font-weight:normal}
.indicador-dre strong{display:block;margin:16px 0 12px;font-size:20px;overflow-wrap:anywhere}
.indicador-dre small{color:#607a91;font-size:12px}
.busca-dre{display:flex;gap:12px;align-items:center;padding:12px 20px;flex-wrap:wrap}
.busca-dre input{max-width:350px;padding:10px;border:1px solid #cbd9e2;border-radius:8px;min-width:200px}
.busca-dre button{background:#edf3f7;color:#163a5a;border:1px solid #cbd9e2;border-radius:8px;padding:10px;cursor:pointer}
.busca-dre label{font-size:13px}.busca-dre [hidden]{display:none}
@media(max-width:1100px){.resumo-dre{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:680px){.resumo-dre{grid-template-columns:repeat(2,minmax(0,1fr))}.indicador-dre:last-child{grid-column:1/-1}.indicador-dre strong{font-size:18px}.cabecalho{padding:18px;gap:12px}h1{font-size:24px}.busca-dre input{min-width:0;width:100%}}
    
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <a class="voltar" href="/dre" aria-label="Voltar à seleção do DRE">←</a>

      <div>
        <h1>${titulo}</h1>
        <p class="subtitulo">
          ${caixa ? 'Resultado realizado por data de baixa · Integração Sankhya' : 'Demonstração do Resultado do Exercício · Critérios atuais por competência'}
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
          <select id="empresa" ${caixa ? 'hidden' : ''}>
            <option value="">Todas</option>
          </select>
          ${caixa ? '<input id="codigoEmpresaCaixa" inputmode="numeric" pattern="[0-9]*" placeholder="Todas (ou código Sankhya)" aria-label="Código da empresa no Sankhya">' : ''}
        </label>

        <button id="atualizar" type="button">
          Atualizar DRE
        </button>
      </div>
    </section>

    <p
      id="statusAtualizacaoDre"
      class="status-atualizacao-dre"
      role="status"
      aria-live="polite"
      hidden
    >
      Atualizando DRE...
    </p>

    ${caixa ? `<section class="resumo-dre" aria-label="Indicadores do período">
      ${[['receitaBruta', 'Receita Bruta'], ['receitaLiquida', 'Receita Líquida'], ['custosProducao', 'Custos'], ['despesasGerais', 'Despesas'], ['resultadoOperacional', 'Resultado Operacional']].map(([chave, nome]) => `<article class="indicador-dre"><h2>${nome}</h2><strong id="kpi-${chave}">—</strong><small id="comparacao-${chave}">vs. ano anterior</small></article>`).join('')}
    </section>` : ''}

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
            ⇩ <strong>XLSX</strong>
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

      ${caixa ? '<div class="busca-dre"><label for="buscarNatureza">Buscar grupo ou natureza</label><input id="buscarNatureza" type="search" placeholder="Digite para filtrar…"><button type="button" id="expandirTudo">Expandir grupos</button><button type="button" id="recolherTudo">Recolher grupos</button></div>' : ''}
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
  const DRE_CAIXA = ${caixa};
  const DRE_API = '${api}';
  let filtrosConsultados = null;
  let resultadoConsultado = null;
  const dataInicial = document.getElementById('dataInicial');
  const dataFinal = document.getElementById('dataFinal');
  const empresa = document.getElementById('empresa');
  const atualizar = document.getElementById('atualizar');
  const linhasDre = document.getElementById('linhasDre');
  const tabela = document.querySelector('table');
  const abrirExportacao = document.getElementById('abrirExportacao');
  const menuExportacao = document.getElementById('menuExportacao');
  const codigoEmpresaCaixa = document.getElementById('codigoEmpresaCaixa');
  const buscarNatureza = document.getElementById('buscarNatureza');
  function empresaSelecionada() { return codigoEmpresaCaixa ? codigoEmpresaCaixa.value.trim() : empresa.value; }

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
        '<th>' + (DRE_CAIXA ? 'Resultado Caixa' : 'Resultado') + '</th>' +
        '<th>% A.H.</th>' +
        '<th>% A.V.</th>'
      ).join('') +
      '<th class="coluna-total">' + (DRE_CAIXA ? 'Resultado Caixa' : 'Resultado') + '</th>' +
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
        escaparHtml(registro.nome) +
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
      const possuiAuditoria = DRE_CAIXA ||
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

function criarPlanilhaExcelLegada(modo) {
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
    (indicador, indice) => (
      '<Cell ' +
        (indice === 0 ? 'ss:Index="2" ' : '') +
        'ss:StyleID="cabecalhoIndicador">' +
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

function colunaXlsx(numero) {
  let resultado = '';
  let atual = numero;

  while (atual > 0) {
    const resto = (atual - 1) % 26;
    resultado = String.fromCharCode(65 + resto) + resultado;
    atual = Math.floor((atual - 1) / 26);
  }

  return resultado;
}

function xmlXlsx(valor) {
  return escaparXml(valor).replace(/\n/g, '&#10;');
}

function celulaXlsx(referencia, valor, estilo, tipo) {
  if (tipo === 'numero') {
    return '<c r="' + referencia + '" s="' + estilo + '"><v>' +
      valor + '</v></c>';
  }

  return '<c r="' + referencia + '" s="' + estilo +
    '" t="inlineStr"><is><t xml:space="preserve">' +
    xmlXlsx(valor) + '</t></is></c>';
}

function numeroBrasileiro(valor) {
  const texto = String(valor || '').trim();
  const numero = Number(texto.replace(/\./g, '').replace(',', '.'));

  return texto && Number.isFinite(numero) ? numero : null;
}

function estiloXlsx(linha, coluna, percentual) {
  const resultado = linha.classList.contains('linha-resultado');
  const subtotal = linha.classList.contains('linha-grupo');

  if (coluna === 0) {
    if (resultado) return 11;
    if (subtotal) return 10;
    if (linha.classList.contains('linha-nivel-3')) return 9;
    if (linha.classList.contains('linha-nivel-2')) return 8;
    if (linha.classList.contains('linha-nivel-1')) return 7;
    return 6;
  }

  if (percentual) {
    if (resultado) return 17;
    if (subtotal) return 16;
    return 15;
  }

  if (resultado) return 14;
  if (subtotal) return 13;
  return 12;
}

function tabelaCrc32Xlsx() {
  const tabela = new Uint32Array(256);

  for (let indice = 0; indice < 256; indice += 1) {
    let valor = indice;

    for (let bit = 0; bit < 8; bit += 1) {
      valor = valor & 1
        ? 0xedb88320 ^ (valor >>> 1)
        : valor >>> 1;
    }

    tabela[indice] = valor >>> 0;
  }

  return tabela;
}

const CRC32_XLSX = tabelaCrc32Xlsx();

function crc32Xlsx(dados) {
  let valor = 0xffffffff;

  for (const byte of dados) {
    valor = CRC32_XLSX[(valor ^ byte) & 255] ^ (valor >>> 8);
  }

  return (valor ^ 0xffffffff) >>> 0;
}

function concatenarBytesXlsx(partes) {
  const tamanho = partes.reduce(
    (total, parte) => total + parte.length,
    0
  );
  const resultado = new Uint8Array(tamanho);
  let inicio = 0;

  for (const parte of partes) {
    resultado.set(parte, inicio);
    inicio += parte.length;
  }

  return resultado;
}

function criarZipXlsx(arquivos) {
  const codificador = new TextEncoder();
  const locais = [];
  const diretorio = [];
  let deslocamento = 0;

  for (const [nome, conteudo] of Object.entries(arquivos)) {
    const nomeBytes = codificador.encode(nome);
    const dados = codificador.encode(conteudo);
    const crc = crc32Xlsx(dados);
    const local = new Uint8Array(30 + nomeBytes.length + dados.length);
    const visaoLocal = new DataView(local.buffer);

    visaoLocal.setUint32(0, 0x04034b50, true);
    visaoLocal.setUint16(4, 20, true);
    visaoLocal.setUint16(8, 0, true);
    visaoLocal.setUint32(14, crc, true);
    visaoLocal.setUint32(18, dados.length, true);
    visaoLocal.setUint32(22, dados.length, true);
    visaoLocal.setUint16(26, nomeBytes.length, true);
    local.set(nomeBytes, 30);
    local.set(dados, 30 + nomeBytes.length);
    locais.push(local);

    const central = new Uint8Array(46 + nomeBytes.length);
    const visaoCentral = new DataView(central.buffer);

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
  }

  const dadosDiretorio = concatenarBytesXlsx(diretorio);
  const fim = new Uint8Array(22);
  const visaoFim = new DataView(fim.buffer);

  visaoFim.setUint32(0, 0x06054b50, true);
  visaoFim.setUint16(8, arquivos ? Object.keys(arquivos).length : 0, true);
  visaoFim.setUint16(10, Object.keys(arquivos).length, true);
  visaoFim.setUint32(12, dadosDiretorio.length, true);
  visaoFim.setUint32(16, deslocamento, true);

  return concatenarBytesXlsx([
    ...locais,
    dadosDiretorio,
    fim
  ]);
}

function estilosXlsx() {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0.00;[Red]-#,##0.00"/>' +
      '<numFmt numFmtId="165" formatCode="0.0%;[Red]-0.0%"/></numFmts>' +
      '<fonts count="4"><font><sz val="10"/><color rgb="FF163A5A"/><name val="Arial"/></font>' +
      '<font><b/><sz val="10"/><color rgb="FF163A5A"/><name val="Arial"/></font>' +
      '<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
      '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts>' +
      '<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FF163A5A"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFE8F0F6"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFEEF3F8"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFCFDFEE"/></patternFill></fill></fills>' +
      '<borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs>' +
      '<cellXfs count="18">' +
      '<xf xfId="0"/><xf fontId="2" fillId="2" applyFont="1" applyFill="1"/><xf xfId="0"/>' +
      '<xf fontId="3" fillId="2" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
      '<xf fontId="3" fillId="2" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf fontId="1" fillId="3" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf applyAlignment="1"><alignment horizontal="left"/></xf><xf applyAlignment="1"><alignment horizontal="left" indent="1"/></xf>' +
      '<xf applyAlignment="1"><alignment horizontal="left" indent="2"/></xf><xf applyAlignment="1"><alignment horizontal="left" indent="3"/></xf>' +
      '<xf fontId="1" fillId="4" applyFont="1" applyFill="1"/><xf fontId="1" fillId="5" applyFont="1" applyFill="1"/>' +
      '<xf numFmtId="164" applyNumberFormat="1"/><xf fontId="1" fillId="4" numFmtId="164" applyFont="1" applyFill="1" applyNumberFormat="1"/>' +
      '<xf fontId="1" fillId="5" numFmtId="164" applyFont="1" applyFill="1" applyNumberFormat="1"/>' +
      '<xf numFmtId="165" applyNumberFormat="1"/><xf fontId="1" fillId="4" numFmtId="165" applyFont="1" applyFill="1" applyNumberFormat="1"/>' +
      '<xf fontId="1" fillId="5" numFmtId="165" applyFont="1" applyFill="1" applyNumberFormat="1"/>' +
      '</cellXfs></styleSheet>';
}

function criarPlanilhaExcel(modo) {
  const cabecalho = estruturaCabecalhoExcel();
  const quantidadeColunas = 1 + cabecalho.indicadores.length;
  const ultimaColuna = colunaXlsx(quantidadeColunas);
  const linhas = Array.from(linhasDre.querySelectorAll('tr'))
    .filter((linha) => linhaDeveSerExportada(linha, modo));
  const mesclas = ['A1:' + ultimaColuna + '1', 'A2:' + ultimaColuna + '2', 'A4:A5'];
  const linhasXml = [];

  linhasXml.push('<row r="1" ht="26" customHeight="1">' +
    celulaXlsx('A1', DRE_CAIXA ? 'DRE Caixa - Resultado realizado' : 'DRE Competência - Demonstração do Resultado do Exercício', 1) + '</row>');
  linhasXml.push('<row r="2">' + celulaXlsx('A2',
    'Período: ' + formatarDataPlanilha(filtrosConsultados?.inicio || dataInicial.value) + ' a ' +
    formatarDataPlanilha(filtrosConsultados?.fim || dataFinal.value) + ' | Empresa: ' + (filtrosConsultados?.empresa || 'Todas') + ' | Visualização: ' +
    nomeModoExportacao(modo), 2) + '</row>');
  if (DRE_CAIXA) {
    const pendencias = resultadoConsultado?.pendenciasClassificacao || [];
    const aviso = pendencias.length ? ' | ATENÇÃO: NÃO INCLUÍDAS NOS SUBTOTAIS: ' + pendencias.map(item => item.codigo + ' ' + item.nome + ' R$ ' + formatarNumero(item.valor) + ' (anterior R$ ' + formatarNumero(item.valorAnterior) + ')').join('; ') : '';
    linhasXml.push('<row r="3">' + celulaXlsx('A3', 'EM HOMOLOGAÇÃO | Sankhya | Baixa (DHBAIXA / VLRBAIXA), valores rateados. Não é conciliação bancária.' + aviso, 2) + '</row>');
    mesclas.push('A3:' + ultimaColuna + '3');
  } else linhasXml.push('<row r="3"/>');

  let colunaPeriodo = 2;
  let periodosXml = celulaXlsx('A4', cabecalho.grupo, 3);

  for (const periodo of cabecalho.periodos) {
    const inicio = colunaXlsx(colunaPeriodo);
    const fim = colunaXlsx(colunaPeriodo + periodo.colunas - 1);

    periodosXml += celulaXlsx(inicio + '4', periodo.nome, 4);
    mesclas.push(inicio + '4:' + fim + '4');
    colunaPeriodo += periodo.colunas;
  }

  linhasXml.push('<row r="4" ht="22" customHeight="1">' + periodosXml + '</row>');
  linhasXml.push('<row r="5" ht="20" customHeight="1">' +
    cabecalho.indicadores.map((indicador, indice) =>
      celulaXlsx(colunaXlsx(indice + 2) + '5', indicador, 5)
    ).join('') + '</row>');

  linhas.forEach((linha, indice) => {
    const numeroLinha = indice + 6;
    const valores = Array.from(linha.cells).map(textoCelula);
    const celulas = Array.from({ length: quantidadeColunas }, (_, coluna) => {
      const valor = valores[coluna] || '';
      const percentual = coluna > 0 && valor.includes('%');
      const numero = percentual
        ? numeroBrasileiro(valor.replace('%', '')) / 100
        : numeroBrasileiro(valor);
      const estilo = estiloXlsx(linha, coluna, percentual);

      return numero === null
        ? celulaXlsx(colunaXlsx(coluna + 1) + numeroLinha, valor, estilo)
        : celulaXlsx(
          colunaXlsx(coluna + 1) + numeroLinha,
          numero,
          estilo,
          'numero'
        );
    }).join('');

    linhasXml.push('<row r="' + numeroLinha + '">' + celulas + '</row>');
  });

  const colunasXml = '<col min="1" max="1" width="38" customWidth="1"/>' +
    cabecalho.indicadores.map((_, indice) =>
      '<col min="' + (indice + 2) + '" max="' + (indice + 2) +
      '" width="' + (indice % 3 === 0 ? '17' : '11') +
      '" customWidth="1"/>'
    ).join('');
  const planilha = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<dimension ref="A1:' + ultimaColuna + (linhas.length + 5) + '"/>' +
    '<sheetViews><sheetView workbookViewId="0"><pane xSplit="1" ySplit="5" topLeftCell="B6" activePane="bottomRight" state="frozen"/></sheetView></sheetViews>' +
    '<sheetFormatPr defaultRowHeight="15"/><cols>' + colunasXml + '</cols><sheetData>' +
    linhasXml.join('') + '</sheetData><mergeCells count="' + mesclas.length + '">' +
    mesclas.map((mescla) => '<mergeCell ref="' + mescla + '"/>').join('') +
    '</mergeCells></worksheet>';

  return criarZipXlsx({
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="DRE" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
    'xl/styles.xml': estilosXlsx(),
    'xl/worksheets/sheet1.xml': planilha
  });
}

function exportarExcel(modo) {
  const planilha = criarPlanilhaExcel(modo);
  const arquivo = new Blob([planilha], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const link = document.createElement('a');
  const urlArquivo = URL.createObjectURL(arquivo);
  const periodo = (filtrosConsultados?.inicio || dataInicial.value) + '_a_' + (filtrosConsultados?.fim || dataFinal.value);

  link.href = urlArquivo;
  link.download = (DRE_CAIXA ? 'DRE_Caixa_' : 'DRE_Competencia_') + periodo + '_' + modo + '.xlsx';
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
    inicio: filtrosConsultados?.inicio || dataInicial.value,
    fim: filtrosConsultados?.fim || dataFinal.value,
    natureza: natureza
  });

  const empresaConsulta = filtrosConsultados?.empresa || '';
  if (empresaConsulta) {
    parametros.set('empresa', empresaConsulta);
  }

  try {
    const resposta = await fetch(
      DRE_API + '/auditoria?' + parametros.toString()
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
  if (atualizar.disabled) return;

  const statusAtualizacao = document.getElementById(
    'statusAtualizacaoDre'
  );

  atualizar.disabled = true;
  atualizar.classList.add('carregando');
  atualizar.setAttribute('aria-busy', 'true');
  statusAtualizacao.hidden = false;
  abrirExportacao.disabled = true;
  [dataInicial, dataFinal, empresa, codigoEmpresaCaixa].filter(Boolean).forEach(input => { input.disabled = true; });
  menuExportacao.hidden = true;
  abrirExportacao.setAttribute('aria-expanded', 'false');
  if (DRE_CAIXA) atualizarResumoCaixa(null);

  try {
    const parametros = new URLSearchParams({
      inicio: dataInicial.value,
      fim: dataFinal.value
    });

    if (empresaSelecionada()) {
      parametros.set('empresa', empresaSelecionada());
    }

    const resposta = await fetch(
      DRE_API + '?' + parametros.toString()
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
    filtrosConsultados = { inicio: parametros.get('inicio'), fim: parametros.get('fim'), empresa: parametros.get('empresa') || '' };
    resultadoConsultado = dados;
    abrirExportacao.disabled = false;
    if (DRE_CAIXA) {
      atualizarResumoCaixa(dados);
      if (buscarNatureza.value) filtrarNaturezas();
    }
  } catch (error) {
    console.error('Erro ao carregar DRE:', error);
    filtrosConsultados = null;
    resultadoConsultado = null;

    const linhaErro = document.createElement('tr');
    const celulaErro = document.createElement('td');

    celulaErro.className = 'vazio';
    celulaErro.colSpan =
      tabela.querySelectorAll('thead tr:last-child th').length || 4;

    celulaErro.textContent =
      error.message || 'Não foi possível carregar a DRE.';

    linhaErro.appendChild(celulaErro);
    linhasDre.replaceChildren(linhaErro);
  } finally {
    atualizar.disabled = false;
    atualizar.classList.remove('carregando');
    atualizar.removeAttribute('aria-busy');
    statusAtualizacao.hidden = true;
    [dataInicial, dataFinal, empresa, codigoEmpresaCaixa].filter(Boolean).forEach(input => { input.disabled = false; });
  }
}

  const hoje = new Date();

  dataInicial.value = dataLocal(
    DRE_CAIXA ? new Date(hoje.getFullYear(), 0, 1) : primeiroDiaDoMes(hoje)
  );

  dataFinal.value = dataLocal(hoje);
  if (DRE_CAIXA) {
    dataInicial.max = dataLocal(hoje);
    dataFinal.max = dataLocal(hoje);
  }

  function atualizarResumoCaixa(dados) {
    for (const chave of ['receitaBruta', 'receitaLiquida', 'custosProducao', 'despesasGerais', 'resultadoOperacional']) {
      const total = dados?.subtotais?.[chave]?.total;
      const valor = document.getElementById('kpi-' + chave);
      valor.textContent = total ? 'R$ ' + formatarNumero(total.resultado) : '—';
      valor.className = total ? classeResultado(total.resultado) : '';
      document.getElementById('comparacao-' + chave).textContent = !total ? 'Aguardando consulta' :
        total.anoAnterior === 0 ? 'Sem base no ano anterior' : formatarPercentual(total.ah) + ' vs. ano anterior';
    }
  }

  function expandirGrupos(aberto) {
    linhasDre.querySelectorAll('tr[data-linha]:not(.linha-auditoria)').forEach(linha => {
      linha.style.display = aberto || !linha.dataset.pai ? 'table-row' : 'none';
      if (linha.hasAttribute('data-aberto') && (!aberto || !linha.querySelector('[data-auditoria]'))) linha.dataset.aberto = String(aberto);
      atualizarBotaoExpansao(linha);
    });
    if (!aberto) linhasDre.querySelectorAll('.linha-auditoria').forEach(linha => { linha.style.display = 'none'; });
  }

  function filtrarNaturezas() {
    const termo = buscarNatureza.value.trim().toLocaleLowerCase('pt-BR');
    if (!termo) { expandirGrupos(false); return; }
    const linhas = Array.from(linhasDre.querySelectorAll('tr[data-linha]'));
    const visiveis = new Set();
    for (const linha of linhas) {
      if (!linha.cells[0].textContent.toLocaleLowerCase('pt-BR').includes(termo)) continue;
      visiveis.add(linha.dataset.linha);
      let pai = linha.dataset.pai;
      while (pai) {
        visiveis.add(pai);
        pai = linhas.find(item => item.dataset.linha === pai)?.dataset.pai;
      }
      // Ao encontrar um grupo, inclui seus descendentes já consultados.
      const descendentes = [linha.dataset.linha];
      while (descendentes.length) {
        const id = descendentes.pop();
        for (const filho of linhas.filter(item => item.dataset.pai === id)) {
          visiveis.add(filho.dataset.linha); descendentes.push(filho.dataset.linha);
        }
      }
    }
    for (const linha of linhas) linha.style.display = visiveis.has(linha.dataset.linha) ? 'table-row' : 'none';
  }
  if (DRE_CAIXA) {
    buscarNatureza.addEventListener('input', filtrarNaturezas);
    document.getElementById('expandirTudo').addEventListener('click', () => { buscarNatureza.value = ''; expandirGrupos(true); });
    document.getElementById('recolherTudo').addEventListener('click', () => { buscarNatureza.value = ''; expandirGrupos(false); });
  }

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
