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
      padding: 15px 20px;
      background: #163a5a;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
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
      font-size: 12px;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    td {
      padding: 11px 14px;
      border-top: 1px solid #dce6ee;
      text-align: right;
      font-size: 13px;
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
  font-size: 12px;
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
      <div class="titulo-painel">Resultado por período</div>

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
  '</tr>' +
  '<tr>' +
    meses.map(() =>
      '<th>Resultado</th>' +
      '<th>% A.H.</th>' +
      '<th>% A.V.</th>'
    ).join('') +
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
    return meses.map((mes) => {
      const indicador = item.indicadores?.[mes] || {
        resultado: 0,
        ah: 0,
        av: null
      };

      return (
  '<td class="' + classeResultado(indicador.resultado) + '">' +
   formatarNumero(indicador.resultado) +
  '</td>' +
  '<td>' + formatarPercentual(indicador.ah) + '</td>' +
  '<td>' + formatarPercentual(indicador.av) + '</td>'
);
    }).join('');
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
    'linha-nivel-' + opcoes.nivel
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
          opcoes.possuiFilhos
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
      linhas.push(
        montarLinhaDre(
          detalhe,
          {
            id: 'natureza-' +
              item.codigo + '-' +
              detalhe.codigo,
            pai: id,
            nivel: 2,
            possuiFilhos: false,
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

  alternarLinhaDre(botao.dataset.toggle);
});

 function controleExpansao(id, possuiFilhos) {
  if (!possuiFilhos) {
    return '<span class="espaco-expansao"></span>';
  }

  return (
    '<button type="button" class="expandir-dre" ' +
      'data-toggle="' + id + '" ' +
      'aria-expanded="false">+</button>'
  );
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
