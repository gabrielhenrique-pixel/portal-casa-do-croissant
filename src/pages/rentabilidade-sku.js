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
    <header class="cabecalho">
      <div>
        <h1>Rentabilidade SKU</h1>
        <p class="subtitulo">Cálculo de rentabilidade por item de venda.</p>
      </div>

      <form class="filtros" id="formFiltros">
        <label class="campo">
          <span>Data inicial</span>
          <input id="inicio" name="inicio" type="date" required>
        </label>
        <label class="campo">
          <span>Data final</span>
          <input id="fim" name="fim" type="date" required>
        </label>
        <button id="botaoAtualizar" type="submit">Atualizar dados</button>
      </form>
    </header>

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

      function renderizarTabela(itens) {
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
