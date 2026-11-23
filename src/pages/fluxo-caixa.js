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

            <section class="painel" aria-labelledby="tituloFiltros">
      <h2 id="tituloFiltros">Período e opções</h2>

      <div class="periodo-fluxo">
        <label>
          Data inicial
          <input id="fluxoInicio" type="date" required>
        </label>

        <label>
          Data final
          <input id="fluxoFim" type="date" required>
        </label>
      </div>

      <div class="opcoes-fluxo">
        <label>
          <input id="fluxoProvisoes" type="checkbox">
          Incluir provisões
        </label>

        <label>
          <input id="fluxoBaixados" type="checkbox" checked>
          Considerar títulos baixados
        </label>

        <label>
          <input id="fluxoCarencia" type="checkbox" checked>
          Considerar carência (Float)
        </label>

        <label>
          <input id="fluxoConciliado" type="checkbox">
          Apenas saldo inicial conciliado
        </label>
      </div>

      <p class="observacao">
        A carência será aplicada às receitas pendentes.
        Sábados e domingos serão ajustados para segunda-feira,
        sem considerar feriados.
      </p>

      <p class="observacao">
        A opção de conciliação se refere ao saldo inicial,
        como no SQL do relatório original.
        Ela não significa que todos os lançamentos do período
        estejam conciliados.
      </p>

      <p class="aviso">
        Os filtros estão em preparação.
        Alterar estas opções ainda não executa a consulta financeira.
      </p>
    </section>


        <section class="painel" aria-labelledby="tituloContas">
      <h2 id="tituloContas">Contas e caixas</h2>

      <p class="observacao">
        Selecione as contas que deseja consultar.
        Nesta etapa, a seleção ainda não calcula saldos.
      </p>

      <p id="estadoContas" role="status" aria-live="polite">
        Carregando contas...
      </p>

      <fieldset id="seletorContas" disabled>
        <legend>Contas disponíveis</legend>
        <div id="listaContas"></div>
      </fieldset>

      <p id="resumoContas" class="observacao"></p>

      <p class="aviso">
        Contas de cartão também aparecem nesta lista.
        Seus saldos não serão tratados automaticamente como
        dinheiro disponível.
      </p>

      <button id="recarregarContas" type="button">
        Atualizar lista de contas
      </button>

      <button id="validarFiltrosFluxo" type="button">
  Validar filtros
</button>

<p
  id="resultadoValidacaoFluxo"
  class="observacao"
  role="status"
  aria-live="polite"
></p>
      
    </section>

    <section class="painel" aria-labelledby="tituloDisponibilidade">
      <h2 id="tituloDisponibilidade">Módulo em preparação</h2>

      <p class="aviso">
        A consulta financeira ainda não está disponível.
        Nenhum saldo ou lançamento está sendo apresentado nesta etapa.
      </p>

      <p>
        Aqui serão exibidos o saldo inicial, as entradas, as saídas
        e o saldo acumulado por dia, conforme o período e as contas
        selecionadas.
      </p>

      <p class="observacao">
        A opção de carência ajustará sábados e domingos,
        sem considerar feriados.
      </p>
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

  function atualizarResumoContas() {
    document.getElementById('resumoContas').textContent =
      contasSelecionadas.size + ' conta(s) selecionada(s).';
  }

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

        atualizarResumoContas();
      });

      label.append(input, texto);
      lista.appendChild(label);
    });

    atualizarResumoContas();
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
      estado.textContent =
        contasDisponiveis.length + ' conta(s) carregada(s).';
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

  var validandoFiltrosFluxo = false;

document.getElementById('validarFiltrosFluxo')
  .addEventListener('click', async function () {
    if (validandoFiltrosFluxo) return;

    var botao = document.getElementById('validarFiltrosFluxo');
    var resultado = document.getElementById('resultadoValidacaoFluxo');
    var inicio = document.getElementById('fluxoInicio');
    var fim = document.getElementById('fluxoFim');

    resultado.textContent = '';

    if (!inicio.reportValidity() || !fim.reportValidity()) {
      return;
    }

    if (inicio.value > fim.value) {
      resultado.textContent =
        'A data inicial não pode ser posterior à data final.';
      return;
    }

    if (carregandoContas) {
      resultado.textContent =
        'Aguarde o carregamento das contas.';
      return;
    }

    if (contasSelecionadas.size === 0) {
      resultado.textContent =
        'Selecione pelo menos uma conta.';
      return;
    }

    var parametros = new URLSearchParams();

    parametros.set('inicio', inicio.value);
    parametros.set('fim', fim.value);
    parametros.set(
      'contas',
      Array.from(contasSelecionadas).join(',')
    );

    [
      ['provisoes', 'fluxoProvisoes'],
      ['baixados', 'fluxoBaixados'],
      ['carencia', 'fluxoCarencia'],
      ['conciliado', 'fluxoConciliado']
    ].forEach(function (opcao) {
      parametros.set(
        opcao[0],
        document.getElementById(opcao[1]).checked ? '1' : '0'
      );
    });

    validandoFiltrosFluxo = true;
    botao.disabled = true;
    resultado.textContent = 'Validando filtros...';

    try {
      var resposta = await fetch(
        '/api/fluxo-caixa/validar?' + parametros.toString(),
        {
          credentials: 'same-origin',
          cache: 'no-store'
        }
      );

      var dados;

      try {
        dados = await resposta.json();
      } catch {
        throw new Error(
          'O servidor retornou uma resposta inesperada. Atualize a página e tente novamente.'
        );
      }

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Não foi possível validar os filtros.'
        );
      }

      if (
        dados.sucesso !== true ||
        !dados.filtros ||
        !Array.isArray(dados.contas)
      ) {
        throw new Error('Resposta de validação inválida.');
      }

      var nomes = dados.contas.map(function (conta) {
        return conta.id + ' — ' + conta.descricao;
      }).join('; ');

      function formatarDataValidada(data) {
        return data.split('-').reverse().join('/');
      }

      resultado.textContent =
        'Filtros validados para ' +
        formatarDataValidada(dados.filtros.inicio) +
        ' a ' +
        formatarDataValidada(dados.filtros.fim) +
        '. Contas: ' + nomes +
        '. Nenhum saldo foi calculado. ' +
        'Se alterar os filtros, valide novamente.';
    } catch (erro) {
      resultado.textContent = erro.message ||
        'Não foi possível validar os filtros.';
    } finally {
      validandoFiltrosFluxo = false;
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
