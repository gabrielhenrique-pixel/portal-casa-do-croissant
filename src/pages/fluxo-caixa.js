export function fluxoCaixaPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fluxo de Caixa | Casa do Croissant</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: #173247;
      background: #eef4f7;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .painel {
      margin-bottom: 18px;
      padding: 22px;
      border: 1px solid #dce6ec;
      border-radius: 16px;
      background: #fff;
    }

    header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .voltar {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      border: 1px solid #dce6ec;
      border-radius: 50%;
      color: #173247;
      text-decoration: none;
      font-size: 24px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    h2 {
      margin-top: 0;
      font-size: 20px;
    }

    p {
      line-height: 1.5;
    }

    .aviso {
      padding: 14px;
      border-left: 4px solid #c78b1b;
      background: #fff8e8;
    }

    .observacao {
      color: #526575;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      main {
        padding: 12px;
      }

      .painel {
        padding: 16px;
      }

      h1 {
        font-size: 23px;
      }
    }

        #seletorContas {
      min-width: 0;
      margin: 16px 0;
      padding: 14px;
      border: 1px solid #dce6ec;
      border-radius: 8px;
    }

    #seletorContas legend {
      padding: 0 6px;
      font-weight: bold;
    }

    #listaContas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 10px;
    }

    .opcao-conta {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      padding: 10px;
      border: 1px solid #dce6ec;
      border-radius: 6px;
      cursor: pointer;
      overflow-wrap: anywhere;
    }

    .opcao-conta input {
      flex-shrink: 0;
      margin-top: 2px;
    }

    #recarregarContas {
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #173f59;
      color: #fff;
      cursor: pointer;
    }

    #recarregarContas:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    @media (max-width: 400px) {
      #listaContas {
        grid-template-columns: 1fr;
      }
    }

        .periodo-fluxo {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 240px));
      gap: 16px;
      margin-bottom: 20px;
    }

    .periodo-fluxo label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      font-size: 14px;
      font-weight: bold;
    }

    .periodo-fluxo input {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      padding: 10px;
      border: 1px solid #b9cbd8;
      border-radius: 6px;
      background: #fff;
      color: #173247;
      font: inherit;
    }

    .opcoes-fluxo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
    }

    .opcoes-fluxo label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
    }

    .opcoes-fluxo input {
      flex-shrink: 0;
      margin-top: 2px;
    }

    @media (max-width: 540px) {
      .periodo-fluxo,
      .opcoes-fluxo {
        grid-template-columns: 1fr;
      }
    }

     .tabela-fluxo-container {
  overflow-x: auto;
  margin: 14px 0 24px;
}

.tabela-fluxo {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tabela-fluxo th,
.tabela-fluxo td {
  padding: 10px 12px;
  border-bottom: 1px solid #dce6ec;
  text-align: right;
  white-space: nowrap;
}

.tabela-fluxo th {
  background: #173c54;
  color: #fff;
}

.tabela-fluxo th:first-child,
.tabela-fluxo td:first-child {
  text-align: left;
}

.tabela-fluxo tbody tr:nth-child(even) {
  background: #f3f7fa;
}

.tabela-fluxo .linha-saldo {
  background: #e8f0f6;
  font-weight: bold;
}

[hidden] {
  display: none !important;
}

#estadoContas:empty,
#estadoDiarioFluxo:empty {
  display: none;
}

.filtros-caixa {
  padding: 20px;
}

.barra-filtros-caixa {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(160px, 220px) auto;
  align-items: end;
  gap: 14px;
}

.campo-caixa {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.campo-caixa label {
  color: #29475d;
  font-size: 13px;
  font-weight: 600;
}

.campo-caixa input {
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #cbd8e3;
  border-radius: 9px;
  background: #fff;
  color: #173247;
  font: inherit;
}

.campo-caixa input:focus-visible {
  outline: 2px solid #2d739c;
  outline-offset: 2px;
}

.botao-consultar-caixa {
  justify-self: end;
  min-width: 140px;
  height: 44px;
  padding: 0 24px;
  border: 0;
  border-radius: 9px;
  background: #173f59;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.botao-consultar-caixa:hover:not(:disabled) {
  background: #215574;
}

.botao-consultar-caixa:disabled {
  opacity: 0.6;
  cursor: wait;
}

.opcoes-caixa {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.opcao-caixa {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid #dce6ec;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
  cursor: pointer;
}

.opcao-caixa input,
.opcao-conta input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #173f59;
}

.opcao-caixa.indisponivel {
  color: #71808d;
  background: #f1f4f7;
  cursor: not-allowed;
}

.contas-caixa {
  margin-top: 18px;
  border: 1px solid #dce6ec;
  border-radius: 10px;
  overflow: hidden;
}

.contas-caixa summary {
  padding: 13px 16px;
  background: #f5f8fb;
  color: #173f59;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.conteudo-contas-caixa {
  padding: 14px;
}

.acoes-contas-caixa {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

#recarregarContas {
  padding: 7px 12px;
  border: 1px solid #cbd8e3;
  border-radius: 7px;
  background: #fff;
  color: #29475d;
  font-size: 12px;
  cursor: pointer;
}

#recarregarContas:hover:not(:disabled) {
  background: #eef4f8;
}

#seletorContas {
  margin: 0;
  padding: 0;
  border: 0;
}

#seletorContas legend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
}

#listaContas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 8px;
}

.opcao-conta {
  align-items: center;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid #dce6ec;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  transition: background 0.15s, border-color 0.15s;
}

.opcao-conta:has(input:checked) {
  border-color: #2d739c;
  background: #eaf3f9;
}

.opcao-conta:focus-within {
  outline: 2px solid #2d739c;
  outline-offset: 2px;
}

.mensagem-caixa,
#estadoContas {
  margin: 12px 0 0;
  font-size: 13px;
}

#estadoDiarioFluxo:empty,
#estadoContas:empty {
  display: none;
}

.painel-tabela-caixa {
  padding: 20px;
}

.painel-tabela-caixa > h2 {
  margin: 0 0 16px;
  font-size: 18px;
}

#resultadoDiarioFluxo h3 {
  margin: 18px 0 10px;
  color: #29475d;
  font-size: 14px;
}

.tabela-fluxo-container {
  margin: 0 0 20px;
  border: 1px solid #dce6ec;
  border-radius: 9px;
  overflow-x: auto;
}

.tabela-fluxo {
  font-size: 13px;
}

.tabela-fluxo th,
.tabela-fluxo td {
  padding: 11px 14px;
}

.tabela-fluxo th {
  font-weight: 600;
}

.tabela-fluxo tbody tr:hover {
  background: #eaf3f9;
}

@media (max-width: 650px) {
  .barra-filtros-caixa {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .botao-consultar-caixa {
    grid-column: 1 / -1;
    justify-self: stretch;
    width: 100%;
  }

  .opcoes-caixa {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .opcao-caixa {
    font-size: 12px;
  }

  .filtros-caixa,
  .painel-tabela-caixa {
    padding: 14px;
  }
}

@media (max-width: 400px) {
  #listaContas,
  .opcoes-caixa {
    grid-template-columns: 1fr;
  }
}
    
  </style>
</head>
<body>
  <main>
    <header class="painel">
      <a
        class="voltar"
        href="/dashboards"
        aria-label="Voltar para Dashboards"
      >←</a>
      <h1>Fluxo de Caixa</h1>
      
    </header>
<section class="painel filtros-caixa">
  <div class="barra-filtros-caixa">
    <div class="campo-caixa">
      <label for="fluxoInicio">Data inicial</label>
      <input id="fluxoInicio" type="date" required>
    </div>

    <div class="campo-caixa">
      <label for="fluxoFim">Data final</label>
      <input id="fluxoFim" type="date" required>
    </div>

    <button
      id="consultarDiarioFluxo"
      class="botao-consultar-caixa"
      type="button"
    >
      Consultar
    </button>
  </div>

  <div class="opcoes-caixa">
    <label class="opcao-caixa indisponivel">
      <input id="fluxoProvisoes" type="checkbox" disabled>
      Provisões
    </label>

    <label class="opcao-caixa indisponivel">
      <input id="fluxoBaixados" type="checkbox" checked disabled>
      Títulos baixados
    </label>

    <label class="opcao-caixa indisponivel">
      <input id="fluxoCarencia" type="checkbox" checked disabled>
      Carência
    </label>

    <label class="opcao-caixa">
      <input id="fluxoConciliado" type="checkbox">
      Saldo inicial conciliado
    </label>
  </div>

  <details class="contas-caixa" open>
    <summary>Contas e caixas</summary>

    <div class="conteudo-contas-caixa">
      <div class="acoes-contas-caixa">
        <button id="recarregarContas" type="button">
          Atualizar contas
        </button>
      </div>

      <p id="estadoContas" role="status" aria-live="polite">
        Carregando contas...
      </p>

      <fieldset id="seletorContas" disabled>
        <legend>Selecionar contas</legend>
        <div id="listaContas"></div>
      </fieldset>
    </div>
  </details>

  <p
    id="estadoDiarioFluxo"
    class="mensagem-caixa"
    role="status"
    aria-live="polite"
  ></p>
</section>

<section class="painel painel-tabela-caixa">
  <h2>Movimentação bancária</h2>
  <div id="resultadoDiarioFluxo"></div>
</section>
  </main>

    <script>
  var contasDisponiveis = [];
  var contasSelecionadas = new Set();
  var carregandoContas = false;

    function configurarPeriodoFluxo() {
    var partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    function parte(tipo) {
      return partes.find(function(item) {
        return item.type === tipo;
      }).value;
    }

    var ano = parte('year');
    var mes = parte('month');
    var dia = parte('day');

    document.getElementById('fluxoInicio').value =
      ano + '-' + mes + '-01';

    document.getElementById('fluxoFim').value =
      ano + '-' + mes + '-' + dia;
  }

  configurarPeriodoFluxo();

  function montarListaContas() {
    var lista = document.getElementById('listaContas');
    lista.replaceChildren();

    contasDisponiveis.forEach(function(conta) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      var texto = document.createElement('span');

      label.className = 'opcao-conta';
      input.type = 'checkbox';
      input.value = conta.id;
      input.checked = contasSelecionadas.has(conta.id);

      texto.textContent = conta.id + ' — ' + conta.descricao;

      input.addEventListener('change', function() {
        if (input.checked) {
          contasSelecionadas.add(conta.id);
        } else {
          contasSelecionadas.delete(conta.id);
        }
      });

      label.append(input, texto);
      lista.appendChild(label);
    });
  }

  async function carregarContas() {
    if (carregandoContas) return;

    carregandoContas = true;

    var estado = document.getElementById('estadoContas');
    var seletor = document.getElementById('seletorContas');
    var botao = document.getElementById('recarregarContas');

    seletor.disabled = true;
    botao.disabled = true;
    estado.textContent = 'Carregando contas...';

    try {
      var resposta = await fetch('/api/fluxo-caixa/contas', {
        credentials: 'same-origin',
        cache: 'no-store'
      });

      var dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Não foi possível consultar as contas.'
        );
      }

      if (!Array.isArray(dados.contas)) {
        throw new Error('A lista de contas recebida é inválida.');
      }

      var ids = new Set();

      var novasContas = dados.contas.map(function(conta) {
        if (
          !conta ||
          typeof conta.id !== 'string' ||
          !conta.id ||
          typeof conta.descricao !== 'string' ||
          ids.has(conta.id)
        ) {
          throw new Error('A lista de contas recebida é inválida.');
        }

        ids.add(conta.id);

        return {
          id: conta.id,
          descricao: conta.descricao
        };
      });

      contasDisponiveis = novasContas;

      contasSelecionadas = new Set(
        Array.from(contasSelecionadas).filter(function(id) {
          return ids.has(id);
        })
      );

      montarListaContas();

      seletor.disabled = contasDisponiveis.length === 0;
      estado.textContent = contasDisponiveis.length
      ? ''
      : 'Nenhuma conta disponível.';
    } catch (erro) {
      contasDisponiveis = [];
      contasSelecionadas.clear();
      montarListaContas();

      estado.textContent = erro.message ||
        'Falha ao carregar as contas. Tente atualizar a lista.';
    } finally {
      carregandoContas = false;
      botao.disabled = false;
    }
  }

  document.getElementById('recarregarContas')
    .addEventListener('click', carregarContas);

  carregarContas();

function parametrosSaldosFluxo() {
  var inicio = document.getElementById('fluxoInicio');
  var fim = document.getElementById('fluxoFim');

  if (!inicio.reportValidity() || !fim.reportValidity()) {
    return null;
  }

  if (inicio.value > fim.value) {
    throw new Error(
      'A data inicial não pode ser posterior à data final.'
    );
  }

  if (carregandoContas) {
    throw new Error('Aguarde o carregamento das contas.');
  }

  if (contasSelecionadas.size === 0) {
    throw new Error('Selecione pelo menos uma conta.');
  }

  var parametros = new URLSearchParams();

  parametros.set('inicio', inicio.value);
  parametros.set('fim', fim.value);
  parametros.set(
    'contas',
    Array.from(contasSelecionadas).sort().join(',')
  );
  parametros.set(
    'conciliado',
    document.getElementById('fluxoConciliado').checked ? '1' : '0'
  );

  return parametros;
}

  var consultandoDiarioFluxo = false;
var revisaoDiarioFluxo = 0;

function invalidarDiarioFluxo() {
  revisaoDiarioFluxo += 1;

  document.getElementById('resultadoDiarioFluxo')
    .replaceChildren();

document.getElementById('estadoDiarioFluxo').textContent = '';
}

[
  'fluxoInicio',
  'fluxoFim',
  'fluxoConciliado'
].forEach(function (id) {
  document.getElementById(id)
    .addEventListener('input', invalidarDiarioFluxo);
});

document.getElementById('listaContas')
  .addEventListener('change', invalidarDiarioFluxo);

document.getElementById('recarregarContas')
  .addEventListener('click', invalidarDiarioFluxo);

async function buscarJsonDiarioFluxo(caminho, parametros) {
  var resposta = await fetch(caminho + '?' + parametros, {
    credentials: 'same-origin',
    cache: 'no-store'
  });

  var dados;

  try {
    dados = await resposta.json();
  } catch {
    throw new Error('O servidor retornou uma resposta inesperada.');
  }

  if (!resposta.ok || dados.sucesso !== true) {
    throw new Error(
      dados.error || 'Não foi possível consultar a movimentação.'
    );
  }

  if (dados.unidadeValores !== 'centavos') {
    throw new Error('Formato de valores inesperado.');
  }

  return dados;
}

document.getElementById('consultarDiarioFluxo')
  .addEventListener('click', async function () {
    if (consultandoDiarioFluxo) return;

    var botao = document.getElementById('consultarDiarioFluxo');
    var estado = document.getElementById('estadoDiarioFluxo');
    var resultado = document.getElementById('resultadoDiarioFluxo');
    var revisaoConsulta = revisaoDiarioFluxo;

    resultado.replaceChildren();
    estado.textContent = '';

    try {
      var parametros = parametrosSaldosFluxo();

      if (!parametros) return;

      var consulta = parametros.toString();

      consultandoDiarioFluxo = true;
      botao.disabled = true;
      estado.textContent = 'Consultando saldos e movimentos...';

      var respostas = await Promise.all([
        buscarJsonDiarioFluxo(
          '/api/fluxo-caixa/saldo-inicial',
          consulta
        ),
        buscarJsonDiarioFluxo(
          '/api/fluxo-caixa/movimentos-diarios',
          consulta
        )
      ]);

      if (revisaoConsulta !== revisaoDiarioFluxo) {
        estado.textContent =
          'Os filtros mudaram durante a consulta. Consulte novamente.';
        return;
      }

      var saldos = respostas[0];
      var diario = respostas[1];

      if (
        !Array.isArray(saldos.contas) ||
        !Array.isArray(diario.movimentos) ||
        saldos.inicio !== parametros.get('inicio') ||
        diario.inicio !== parametros.get('inicio') ||
        diario.fim !== parametros.get('fim') ||
        saldos.apenasSaldoInicialConciliado !==
          (parametros.get('conciliado') === '1')
      ) {
        throw new Error('Resposta incompatível com os filtros enviados.');
      }

      var idsEsperados = new Set(
        parametros.get('contas').split(',')
      );
      var idsRecebidos = new Set();
      var chavesMovimentos = new Set();

      saldos.contas.forEach(function (conta) {
        if (
          !idsEsperados.has(conta.id) ||
          idsRecebidos.has(conta.id) ||
          !Number.isSafeInteger(conta.saldoInicialCentavos)
        ) {
          throw new Error('Resposta de saldos inválida.');
        }

        idsRecebidos.add(conta.id);
      });

      if (idsRecebidos.size !== idsEsperados.size) {
        throw new Error('Faltam contas na resposta de saldos.');
      }

      diario.movimentos.forEach(function (movimento) {
        var chave = movimento.contaId + ':' + movimento.data;

        if (
          !idsEsperados.has(movimento.contaId) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(movimento.data) ||
          movimento.data < diario.inicio ||
          movimento.data > diario.fim ||
          !Number.isSafeInteger(movimento.entradasCentavos) ||
          !Number.isSafeInteger(movimento.saidasCentavos) ||
          !Number.isSafeInteger(movimento.diferencaCentavos) ||
          movimento.entradasCentavos - movimento.saidasCentavos !==
            movimento.diferencaCentavos ||
          chavesMovimentos.has(chave)
        ) {
          throw new Error('Resposta de movimentos inválida.');
        }

        chavesMovimentos.add(chave);
      });

      var moeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      function dinheiro(centavos) {
        return moeda.format(centavos / 100);
      }

      function somar(a, b) {
        var valor = a + b;

        if (!Number.isSafeInteger(valor)) {
          throw new Error('Valor acumulado fora do limite permitido.');
        }

        return valor;
      }

      function inserirLinha(destino, valores, classe) {
        var linha = document.createElement('tr');

        if (classe) linha.className = classe;

        valores.forEach(function (valor) {
          var celula = document.createElement('td');
          celula.textContent = valor;
          linha.appendChild(celula);
        });

        destino.appendChild(linha);
      }

      var fragmento = document.createDocumentFragment();

      saldos.contas.forEach(function (conta) {
        var titulo = document.createElement('h3');
        titulo.textContent = conta.id + ' — ' + conta.descricao;
        fragmento.appendChild(titulo);

        var container = document.createElement('div');
        container.className = 'tabela-fluxo-container';

        var tabela = document.createElement('table');
        tabela.className = 'tabela-fluxo';
        tabela.setAttribute(
          'aria-label',
          'Movimentação diária da conta ' + conta.descricao
        );

        var cabecalho = tabela.createTHead().insertRow();

        [
          'Data',
          'Entradas',
          'Saídas',
          'Diferença diária',
          saldos.apenasSaldoInicialConciliado
          ? 'Saldo acumulado (inicial conciliado)'
          : 'Saldo acumulado'
        ].forEach(function (nome) {
          var celula = document.createElement('th');
          celula.scope = 'col';
          celula.textContent = nome;
          cabecalho.appendChild(celula);
        });

        var corpo = tabela.createTBody();
        var acumulado = conta.saldoInicialCentavos;
        var entradas = 0;
        var saidas = 0;

        inserirLinha(corpo, [
          'Saldo inicial',
          '—',
          '—',
          '—',
          dinheiro(acumulado)
        ], 'linha-saldo');

        var movimentosConta = diario.movimentos
          .filter(function (movimento) {
            return movimento.contaId === conta.id;
          })
          .sort(function (a, b) {
            return a.data.localeCompare(b.data);
          });

        movimentosConta.forEach(function (movimento) {
          entradas = somar(entradas, movimento.entradasCentavos);
          saidas = somar(saidas, movimento.saidasCentavos);
          acumulado = somar(acumulado, movimento.diferencaCentavos);

          inserirLinha(corpo, [
            movimento.data.split('-').reverse().join('/'),
            dinheiro(movimento.entradasCentavos),
            dinheiro(movimento.saidasCentavos),
            dinheiro(movimento.diferencaCentavos),
            dinheiro(acumulado)
          ]);
        });

        inserirLinha(tabela.createTFoot(), [
          'Total do período / saldo final calculado',
          dinheiro(entradas),
          dinheiro(saidas),
          dinheiro(somar(entradas, -saidas)),
          dinheiro(acumulado)
        ], 'linha-saldo');

        container.appendChild(tabela);
        fragmento.appendChild(container);

        if (movimentosConta.length === 0) {
          var aviso = document.createElement('p');
          aviso.textContent =
            'Nenhum movimento bancário encontrado para esta conta no período.';
          fragmento.appendChild(aviso);
        }
      });

      resultado.replaceChildren(fragmento);
      
      estado.textContent = '';
    } catch (erro) {
      if (revisaoConsulta === revisaoDiarioFluxo) {
        resultado.replaceChildren();
        estado.textContent = erro.message ||
          'Não foi possível consultar a movimentação.';
      }
    } finally {
      consultandoDiarioFluxo = false;
      botao.disabled = false;
    }
  });
  
</script>
  
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
