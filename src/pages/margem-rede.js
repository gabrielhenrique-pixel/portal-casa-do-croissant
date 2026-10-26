export function margemRedePage() {
  return new Response(String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Margem_Rede | Casa do Croissant</title>
  <style>
    :root {
      --faixa:#17130f;
      --titulo:#e7d8bd;
      --azul:#1f4e78;
      --azul-claro:#d9eaf7;
      --fundo:#f4f7f5;
      --borda:#d9d2c3;
      --texto:#182e25;
      --vermelho:#c00000;
      --amarelo:#bf9000;
      --verde:#548235;
    }

    * { box-sizing:border-box; }

    body {
      min-width:0;
      margin:0;
      background:var(--fundo);
      color:var(--texto);
      font-family:Arial, sans-serif;
    }

    main {
      max-width:1560px;
      margin:0 auto;
      padding:24px 18px 36px;
    }

    .faixa-titulo {
      padding:18px 22px;
      background:var(--faixa);
      border-radius:10px 10px 0 0;
    }

    h1 {
      margin:0;
      color:var(--titulo);
      font-size:25px;
      letter-spacing:.2px;
    }

    .nota {
      margin:0;
      padding:10px 22px;
      border:1px solid var(--borda);
      border-top:0;
      background:#f4efe6;
      color:#707070;
      font-size:13px;
      font-style:italic;
    }

    .controles {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:14px;
      margin:18px 0 0;
      padding:16px;
      border:1px solid #d6e1da;
      border-radius:10px;
      background:#fff;
    }

    .campo {
      display:grid;
      gap:6px;
      min-width:162px;
    }

    label {
      font-size:12px;
      font-weight:700;
    }

    input[type="date"] {
      min-height:38px;
      border:1px solid #9db8aa;
      border-radius:6px;
      padding:7px 9px;
      color:#1b3429;
      font:inherit;
    }

    button {
      min-height:38px;
      border:0;
      border-radius:6px;
      padding:8px 16px;
      background:#0d6a3c;
      color:#fff;
      font:inherit;
      font-weight:700;
      cursor:pointer;
    }

    button:hover:not(:disabled) { background:#09542f; }
    button:disabled { opacity:.7; cursor:wait; }

    .estado {
      min-height:20px;
      margin:15px 0 9px;
      color:#596960;
      font-size:14px;
    }

    .estado.erro {
      padding:12px 14px;
      border:1px solid #f2b8b5;
      border-radius:8px;
      background:#fde9e7;
      color:#b42318;
    }

    .alertas {
      display:none;
      margin:0 0 10px;
      padding:11px 13px;
      border:1px solid #efc675;
      border-radius:8px;
      background:#fff8e6;
      color:#755500;
      font-size:13px;
    }

    .alerta-botao {
  display: block;
  min-height: 0;
  margin: 0 0 6px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #755500;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
}

.alerta-botao:hover {
  background: transparent;
  color: #102e49;
}

.modal-sem-cadastro {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: none;
  place-items: center;
  padding: 18px;
  background: rgba(16, 46, 73, .45);
}

.modal-sem-cadastro.visivel {
  display: grid;
}

.modal-sem-cadastro-caixa {
  width: min(680px, 100%);
  max-height: 78vh;
  overflow: auto;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(0, 0, 0, .28);
}

.modal-sem-cadastro-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #d6e1da;
  color: #102e49;
  font-size: 18px;
  font-weight: 700;
}

.modal-fechar {
  min-height: 32px;
  padding: 4px 10px;
  border: 0;
  border-radius: 6px;
  background: #102e49;
  color: #fff;
  cursor: pointer;
}

.lista-sem-cadastro {
  margin: 0;
  padding: 10px 20px 18px;
  list-style: none;
}

.lista-sem-cadastro li {
  padding: 10px 0;
  border-bottom: 1px solid #e3e9e5;
  color: #263e55;
  font-size: 13px;
}

.lista-sem-cadastro li:last-child {
  border-bottom: 0;
}

.lista-sem-cadastro strong {
  color: #102e49;
}

    .alertas.visivel { display:block; }

    .tabela-area {
      max-width:100%;
      max-height:70vh;
      overflow:auto;
      border:1px solid var(--borda);
      border-radius:8px;
      background:#fff;
      box-shadow:0 3px 12px rgba(18,47,35,.06);
    }

    table {
      width:max-content;
      min-width:2180px;
      border-collapse:separate;
      border-spacing:0;
      font-size:13px;
    }

    th {
      position:sticky;
      top:0;
      z-index:3;
      min-height:30px;
      border:1px solid var(--borda);
      padding:7px 8px;
      background:var(--azul);
      color:#fff;
      font-size:11px;
      font-weight:700;
      line-height:1.15;
      text-align:center;
      white-space:normal;
      box-shadow:0 2px 5px rgba(22,58,90,.16);
    }

    td {
      border:1px solid var(--borda);
      padding:7px 9px;
      color:#171717;
      text-align:right;
      vertical-align:middle;
      white-space:nowrap;
    }

    td.rede {
      background:var(--azul-claro);
      text-align:left;
      font-weight:700;
    }

    th:first-child,
    td:first-child {
      position:sticky;
      left:0;
      width:220px;
      min-width:220px;
      max-width:220px;
      text-align:left;
      box-shadow:2px 0 0 #c7d8e5;
    }

    th:first-child {
      z-index:5;
      background:var(--azul);
    }

    th:nth-child(2),
td:nth-child(2) {
  position:sticky;
  left:220px;
  width:155px;
  min-width:155px;
  max-width:155px;
  box-shadow:2px 0 0 #c7d8e5;
}

th:nth-child(2) {
  z-index:4;
  background:var(--azul);
}

tbody td:nth-child(2) {
  z-index:1;
  background:#fff;
}

tbody tr:hover td:nth-child(2) {
  background:#f7faf8;
}

    tbody td:first-child {
      z-index:1;
    }

    tbody tr.linha-total td {
      position:sticky;
      bottom:0;
      z-index:2;
      border-top:2px solid var(--azul);
      background:#dcebf6;
      color:#102e49;
      font-weight:700;
    }

    /* Área branca fixa abaixo da coluna Rede. */
    tbody tr.linha-total td:first-child {
      position:sticky;
      bottom:0;
      left:0;
      z-index:4;
      width:220px;
      min-width:220px;
      max-width:220px;
      border-right:1px solid var(--borda);
      background:#fff;
      color:transparent;
      box-shadow:2px 0 0 #c7d8e5;
    }

    tbody tr.linha-total td:nth-child(2) {
      position:sticky;
      bottom:0;
      left:220px;
      z-index:3;
      background:#dcebf6;
      box-shadow:2px 0 0 #c7d8e5;
    }

    tbody tr.linha-total td.negativo {
      color:var(--vermelho);
    }

    td.devolucao, td.negativo { color:var(--vermelho); }
    td.margem-critica { background:#f4cccc; color:var(--vermelho); font-weight:700; }
    td.margem-alerta { background:#fff2cc; color:var(--amarelo); font-weight:700; }
    td.margem-boa { background:#e2f0d9; color:var(--verde); font-weight:700; }
    td.vazio { color:#66746d; }
    tbody tr:hover td:not(.rede) { background:#f7faf8; }
    tbody tr:hover td.rede { background:#c9e0f1; }
    tbody tr:hover td.margem-critica { background:#f0bbbb; }
    tbody tr:hover td.margem-alerta { background:#ffebac; }
    tbody tr:hover td.margem-boa { background:#d6ebc9; }

    
/* Destaque da Receita após Deduções */
th.coluna-receita-ajustada {
  background:#116149;
  color:#fff;
}

tbody td.coluna-receita-ajustada {
  background:#e3f5ec;
  color:#12513b;
  font-weight:700;
}

tbody tr:hover td.coluna-receita-ajustada {
  background:#c9e9d8;
}

tbody tr.linha-total td.coluna-receita-ajustada {
  background:#b4e0c7;
  color:#0e4933;
}

tbody tr.linha-total td.coluna-receita-ajustada.negativo {
  color:var(--vermelho);
}


    .sem-dados td {
      padding:26px;
      color:#5d6f65;
      text-align:center;
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
  transition:transform .15s, background .15s;
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

.exportar-excel {
  flex-shrink:0;
  min-height:40px;
  padding:8px 15px;
  border:1px solid #0d6a3c;
  border-radius:7px;
  background:#0d6a3c;
  color:#fff;
  font-size:13px;
  white-space:nowrap;
}

.exportar-excel:disabled {
  cursor:not-allowed;
}

.controles {
  display:flex;
  align-items:end;
  flex-wrap:wrap;
  gap:18px;
  margin-top:15px;
  padding:14px 34px;
  border:0;
  border-radius:15px;
  background:rgba(255,255,255,.84);
  box-shadow:0 6px 18px #17305214;
}

.campo {
  display:grid;
  gap:5px;
  min-width:175px;
  color:#17375f;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
}

.campo span {
  font-size:11px;
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

    @media (max-width:720px) {
      main { padding:12px 10px 24px; }
      .faixa-titulo { padding:16px; }
      .nota { padding:10px 16px; }
      .topo { flex-wrap:wrap; padding:16px; }
      .marca { min-width:0; }
      .marca span { font-size:23px; }
      .exportar-excel { width:auto; }
      .controles { align-items:stretch; }
      .campo { flex:1 1 135px; }
      button { width:100%; }
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
    <span>MARGEM POR REDE</span>
  </div>
  <button id="exportarExcel" class="exportar-excel" type="button" disabled>Exportar Excel</button>
</header>

<form class="controles" id="formFiltros">
  <label class="campo" for="inicio">
    <span>Data inicial</span>
    <input id="inicio" type="date" required>
  </label>

  <label class="campo" for="fim">
    <span>Data final</span>
    <input id="fim" type="date" required>
  </label>

  <button
    id="aplicarMargem"
    type="submit"
    style="height:39px;padding:0 22px;border:0;border-radius:8px;background:#102e49;color:#fff;font-weight:700;cursor:pointer"
  >Aplicar</button>
</form>

    <p class="estado" id="estado" aria-live="polite">Carregando dados...</p>
    <div class="alertas" id="alertas" role="status"></div>

    <section class="tabela-area" aria-label="Tabela de margem por rede">
      <table>
        <thead>
          <tr>
            <th>Rede</th>
            <th>Fat Bruto</th>
            <th>Receita Líquida</th>
            <th>Devoluções</th>
            <th>Impostos</th>
            <th class="coluna-receita-ajustada">Receita após Deduções</th>
            <th>CMV Unit.</th>
            <th>CMV Total</th>
            <th>Promotoria (%)</th>
            <th>Custo Promotoria</th>
            <th>Contrato (%)</th>
            <th>Custo Contrato</th>
            <th>Comissão (%)</th>
            <th>Custo Comissão</th>
            <th>Investimentos</th>
            <th>Frete</th>
            <th>Resultado Final</th>
            <th>Margem %</th>
            <th>Participação</th>
            <th>Clientes Positivados</th>
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
      var consultaAtual = 0;
      var estado = document.getElementById('estado');
      var alertas = document.getElementById('alertas');
      var linhasTabela = document.getElementById('linhasTabela');
      var botaoExportarExcel = document.getElementById('exportarExcel');
      var dadosAtuais = null;

      function dataParaInput(data) {
        return [
          data.getFullYear(),
          String(data.getMonth() + 1).padStart(2, '0'),
          String(data.getDate()).padStart(2, '0')
        ].join('-');
      }

      function definirPeriodoInicial() {
        var hoje = new Date();
        var mesAnterior = new Date(hoje);
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        inicio.value = dataParaInput(mesAnterior);
        fim.value = dataParaInput(hoje);
      }

      function moeda(valor) {
        var numero = Number(valor || 0);
        if (Math.abs(numero) < 0.00000001) return '—';
        return numero.toLocaleString('pt-BR', {
          style:'currency', currency:'BRL', minimumFractionDigits:2,
          maximumFractionDigits:2
        });
      }

      function percentual(valor) {
        if (valor === null || valor === undefined || valor === '') return '—';
        return Number(valor).toLocaleString('pt-BR', {
          style:'percent', minimumFractionDigits:1, maximumFractionDigits:1
        });
      }

      function inteiro(valor) {
        var numero = Number(valor || 0);
        return numero === 0 ? '—' : numero.toLocaleString('pt-BR');
      }

      function negativo(valor) {
        return Number(valor || 0) < 0 ? 'negativo' : '';
      }

      function classeMargem(valor) {
        if (valor === null || valor === undefined) return 'vazio';
        if (Number(valor) < 0.15) return 'margem-critica';
        if (Number(valor) < 0.20) return 'margem-alerta';
        return 'margem-boa';
      }

      function celula(classe, texto) {
        var td = document.createElement('td');
        td.className = classe || '';
        td.textContent = texto;
        return td;
      }

      function preencherTabela(redes) {
        linhasTabela.innerHTML = '';

        if (!Array.isArray(redes) || redes.length === 0) {
          var semDados = document.createElement('tr');
          semDados.className = 'sem-dados';
          var coluna = celula('', 'Nenhuma rede encontrada no período.');
          coluna.colSpan = 20;
          semDados.appendChild(coluna);
          linhasTabela.appendChild(semDados);
          return;
        }

        redes.forEach(function(rede) {
          var linha = document.createElement('tr');
          linha.appendChild(celula('rede', rede.rede || ''));
          linha.appendChild(celula(negativo(rede.faturamentoBruto), moeda(rede.faturamentoBruto)));
          linha.appendChild(celula(negativo(rede.receitaLiquida), moeda(rede.receitaLiquida)));
          linha.appendChild(celula('devolucao', moeda(rede.devolucoes))); 
          linha.appendChild(celula(negativo(rede.impostos), moeda(rede.impostos)));
          
var ajustada = receitaAposDeducoes(rede);

linha.appendChild(celula(
  'coluna-receita-ajustada ' + negativo(ajustada),
  moeda(ajustada)
));

          linha.appendChild(celula(negativo(rede.cmvUnitario), moeda(rede.cmvUnitario)));
          linha.appendChild(celula(negativo(rede.cmvTotal), moeda(rede.cmvTotal)));
          linha.appendChild(celula('', percentual(rede.percentualPromotoria)));
          linha.appendChild(celula(negativo(rede.custoPromotoria), moeda(rede.custoPromotoria)));
          linha.appendChild(celula('', percentual(rede.percentualContrato)));
          linha.appendChild(celula(negativo(rede.custoContrato), moeda(rede.custoContrato)));
          linha.appendChild(celula('', percentual(rede.percentualComissao)));
          linha.appendChild(celula(negativo(rede.custoComissao), moeda(rede.custoComissao)));
          linha.appendChild(celula(negativo(rede.investimentos), moeda(rede.investimentos)));
          linha.appendChild(celula(negativo(rede.frete), moeda(rede.frete)));
          linha.appendChild(celula(negativo(rede.resultadoFinal), moeda(rede.resultadoFinal)));
          linha.appendChild(celula(classeMargem(rede.margem), percentual(rede.margem)));
          linha.appendChild(celula(negativo(rede.participacao), percentual(rede.participacao)));
          linha.appendChild(celula('', inteiro(rede.clientesPositivados)));
          linhasTabela.appendChild(linha);
               });

        adicionarLinhaTotalMargem(redes);
      }

      function numeroTotalMargem(valor) {
  var numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}


function receitaAposDeducoes(rede) {
  return numeroTotalMargem(rede.receitaLiquida)
    - numeroTotalMargem(rede.devolucoes)
    - numeroTotalMargem(rede.impostos);
}


function adicionarLinhaTotalMargem(redes) {
  var total = redes.reduce(function(acumulado, rede) {
    acumulado.quantidade += numeroTotalMargem(rede.quantidade);
    acumulado.faturamentoBruto += numeroTotalMargem(rede.faturamentoBruto);
    acumulado.devolucoes += numeroTotalMargem(rede.devolucoes);
    acumulado.receitaLiquida += numeroTotalMargem(rede.receitaLiquida);
    acumulado.impostos += numeroTotalMargem(rede.impostos);
    acumulado.cmvTotal += numeroTotalMargem(rede.cmvTotal);
    acumulado.custoPromotoria += numeroTotalMargem(rede.custoPromotoria);
    acumulado.custoContrato += numeroTotalMargem(rede.custoContrato);
    acumulado.custoComissao += numeroTotalMargem(rede.custoComissao);
    acumulado.investimentos += numeroTotalMargem(rede.investimentos);
    acumulado.frete += numeroTotalMargem(rede.frete);
    acumulado.resultadoFinal += numeroTotalMargem(rede.resultadoFinal);
    acumulado.participacao += numeroTotalMargem(rede.participacao);
    acumulado.clientesPositivados += numeroTotalMargem(rede.clientesPositivados);
    return acumulado;
  }, {
    quantidade: 0,
    faturamentoBruto: 0,
    devolucoes: 0,
    receitaLiquida: 0,
    impostos: 0,
    cmvTotal: 0,
    custoPromotoria: 0,
    custoContrato: 0,
    custoComissao: 0,
    investimentos: 0,
    frete: 0,
    resultadoFinal: 0,
    participacao: 0,
    clientesPositivados: 0
  });

  var percentualPromotoria = total.faturamentoBruto
    ? total.custoPromotoria / total.faturamentoBruto
    : null;

  var percentualContrato = total.faturamentoBruto
    ? total.custoContrato / total.faturamentoBruto
    : null;

  var percentualComissao = total.faturamentoBruto
    ? total.custoComissao / total.faturamentoBruto
    : null;

  var margem = total.receitaLiquida
    ? total.resultadoFinal / Math.abs(total.receitaLiquida)
    : null;

  var linha = document.createElement('tr');
  linha.className = 'linha-total';

  linha.appendChild(celula('rodape-rede-vazio', ''));
  linha.appendChild(celula(negativo(total.faturamentoBruto), moeda(total.faturamentoBruto)));
  linha.appendChild(celula(negativo(total.receitaLiquida), moeda(total.receitaLiquida)));
  linha.appendChild(celula('devolucao', moeda(total.devolucoes)));  
  linha.appendChild(celula(negativo(total.impostos), moeda(total.impostos)));
  
var ajustadaTotal = receitaAposDeducoes(total);

linha.appendChild(celula(
  'coluna-receita-ajustada ' + negativo(ajustadaTotal),
  moeda(ajustadaTotal)
));

  linha.appendChild(celula('total-vazio', ''));
  linha.appendChild(celula(negativo(total.cmvTotal), moeda(total.cmvTotal)));
  linha.appendChild(celula('total-vazio', ''));
  linha.appendChild(celula(negativo(total.custoPromotoria), moeda(total.custoPromotoria)));
  linha.appendChild(celula('total-vazio', ''));
  linha.appendChild(celula(negativo(total.custoContrato), moeda(total.custoContrato)));
  linha.appendChild(celula('total-vazio', ''));
  linha.appendChild(celula(negativo(total.custoComissao), moeda(total.custoComissao)));
  linha.appendChild(celula(negativo(total.investimentos), moeda(total.investimentos)));
  linha.appendChild(celula(negativo(total.frete), moeda(total.frete)));
  linha.appendChild(celula(negativo(total.resultadoFinal), moeda(total.resultadoFinal)));
  linha.appendChild(celula(classeMargem(margem), percentual(margem)));
  linha.appendChild(celula('', percentual(total.participacao)));
  linha.appendChild(celula('', inteiro(total.clientesPositivados)));

  linhasTabela.appendChild(linha);
}

      function colunaXlsxMargem(indice) {
        var resultado = '';
        var numero = indice + 1;
        while (numero > 0) {
          var resto = (numero - 1) % 26;
          resultado = String.fromCharCode(65 + resto) + resultado;
          numero = Math.floor((numero - 1) / 26);
        }
        return resultado;
      }

      function escaparXmlXlsxMargem(valor) {
        return String(valor === null || valor === undefined ? '' : valor)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      }

      function numeroXlsxMargem(valor) {
        var numero = Number(valor);
        return Number.isFinite(numero) ? numero : 0;
      }

      function celulaXlsxMargem(referencia, valor, tipo, destaque) {
        var estilo = tipo === 'moeda' ? 4 :
          tipo === 'percentual' ? 5 :
          tipo === 'inteiro' ? 6 : 0;
          if (destaque) estilo = 7;

        if (tipo === 'texto') {
          return '<c r="' + referencia + '" s="' + estilo + '" t="inlineStr"><is><t>' +
            escaparXmlXlsxMargem(valor) + '</t></is></c>';
        }

        if (valor === null || valor === undefined || valor === '') {
          return '<c r="' + referencia + '" s="' + estilo + '"/>';
        }

        return '<c r="' + referencia + '" s="' + estilo + '"><v>' +
          numeroXlsxMargem(valor) + '</v></c>';
      }

      function crc32XlsxMargem(bytes) {
        var tabela = crc32XlsxMargem.tabela;
        if (!tabela) {
          tabela = new Uint32Array(256);
          for (var indice = 0; indice < 256; indice++) {
            var codigo = indice;
            for (var bit = 0; bit < 8; bit++) {
              codigo = (codigo & 1) ? (0xedb88320 ^ (codigo >>> 1)) : (codigo >>> 1);
            }
            tabela[indice] = codigo >>> 0;
          }
          crc32XlsxMargem.tabela = tabela;
        }

        var crc = 0xffffffff;
        for (var posicao = 0; posicao < bytes.length; posicao++) {
          crc = tabela[(crc ^ bytes[posicao]) & 0xff] ^ (crc >>> 8);
        }
        return (crc ^ 0xffffffff) >>> 0;
      }

      function concatenarBytesXlsxMargem(partes) {
        var tamanho = partes.reduce(function(total, parte) {
          return total + parte.length;
        }, 0);
        var resultado = new Uint8Array(tamanho);
        var inicio = 0;
        partes.forEach(function(parte) {
          resultado.set(parte, inicio);
          inicio += parte.length;
        });
        return resultado;
      }

      function criarZipXlsxMargem(arquivos) {
        var codificador = new TextEncoder();
        var partes = [];
        var diretorio = [];
        var deslocamento = 0;

        arquivos.forEach(function(arquivo) {
          var nome = codificador.encode(arquivo.nome);
          var conteudo = codificador.encode(arquivo.conteudo);
          var crc = crc32XlsxMargem(conteudo);
          var cabecalho = new Uint8Array(30 + nome.length);
          var view = new DataView(cabecalho.buffer);
          view.setUint32(0, 0x04034b50, true);
          view.setUint16(4, 20, true);
          view.setUint16(6, 0, true);
          view.setUint16(8, 0, true);
          view.setUint32(14, crc, true);
          view.setUint32(18, conteudo.length, true);
          view.setUint32(22, conteudo.length, true);
          view.setUint16(26, nome.length, true);
          cabecalho.set(nome, 30);
          partes.push(cabecalho, conteudo);

          diretorio.push({ nome:nome, crc:crc, tamanho:conteudo.length, deslocamento:deslocamento });
          deslocamento += cabecalho.length + conteudo.length;
        });

        var inicioDiretorio = deslocamento;
        diretorio.forEach(function(arquivo) {
          var cabecalho = new Uint8Array(46 + arquivo.nome.length);
          var view = new DataView(cabecalho.buffer);
          view.setUint32(0, 0x02014b50, true);
          view.setUint16(4, 20, true);
          view.setUint16(6, 20, true);
          view.setUint16(8, 0, true);
          view.setUint16(10, 0, true);
          view.setUint32(16, arquivo.crc, true);
          view.setUint32(20, arquivo.tamanho, true);
          view.setUint32(24, arquivo.tamanho, true);
          view.setUint16(28, arquivo.nome.length, true);
          view.setUint32(42, arquivo.deslocamento, true);
          cabecalho.set(arquivo.nome, 46);
          partes.push(cabecalho);
          deslocamento += cabecalho.length;
        });

        var finalZip = new Uint8Array(22);
        var viewFinal = new DataView(finalZip.buffer);
        viewFinal.setUint32(0, 0x06054b50, true);
        viewFinal.setUint16(8, diretorio.length, true);
        viewFinal.setUint16(10, diretorio.length, true);
        viewFinal.setUint32(12, deslocamento - inicioDiretorio, true);
        viewFinal.setUint32(16, inicioDiretorio, true);
        partes.push(finalZip);

        return concatenarBytesXlsxMargem(partes);
      }

      function estilosXlsxMargem() {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
          '<numFmts count="3">' +
          '<numFmt numFmtId="164" formatCode="&quot;R$&quot; #,##0.00;[Red]-&quot;R$&quot; #,##0.00"/>' +
          '<numFmt numFmtId="165" formatCode="0.0%;[Red]-0.0%"/>' +
          '<numFmt numFmtId="166" formatCode="#,##0"/>' +
          '</numFmts>' +
          '<fonts count="3">' +
          '<font><sz val="10"/><name val="Arial"/></font>' +
          '<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
          '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
          '</fonts>' +
          '<fills count="6">' +
          '<fill><patternFill patternType="none"/></fill>' +
          '<fill><patternFill patternType="gray125"/></fill>' +
          '<fill><patternFill patternType="solid"><fgColor rgb="FF102E49"/><bgColor indexed="64"/></patternFill></fill>' +
          '<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>' +
          '<fill><patternFill patternType="solid"><fgColor rgb="FFE3F5EC"/><bgColor indexed="64"/></patternFill></fill>' +
          '<fill><patternFill patternType="solid"><fgColor rgb="FF116149"/><bgColor indexed="64"/></patternFill></fill>' +
          '</fills>' +
          '<borders count="2">' +
          '<border><left/><right/><top/><bottom/><diagonal/></border>' +
          '<border><left style="thin"><color rgb="FFD9D2C3"/></left><right style="thin"><color rgb="FFD9D2C3"/></right><top style="thin"><color rgb="FFD9D2C3"/></top><bottom style="thin"><color rgb="FFD9D2C3"/></bottom><diagonal/></border>' +
          '</borders>' +
          '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
          '<cellXfs count="9">' +
          '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
          '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
          '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
          '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
          '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>' +
          '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>' +
          '<xf numFmtId="166" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>' +
          '<xf numFmtId="164" fontId="0" fillId="4" borderId="1" applyFill="1" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>' +
          '<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFill="1" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +

          
          '</cellXfs></styleSheet>';
      }

      function criarPlanilhaXlsxMargem(redes) {
        var colunas = [
          { titulo:'Rede', campo:'rede', tipo:'texto', largura:26 },
          { titulo:'Faturamento bruto', campo:'faturamentoBruto', tipo:'moeda', largura:18 },
          { titulo:'Receita líquida', campo:'receitaLiquida', tipo:'moeda', largura:18 },
          { titulo:'Devoluções', campo:'devolucoes', tipo:'moeda', largura:17 },   
          { titulo:'Impostos', campo:'impostos', tipo:'moeda', largura:16 },
          { titulo:'Receita após deduções', campo:'receitaAposDeducoes', tipo:'moeda', largura:22 },
          { titulo:'CMV unitário', campo:'cmvUnitario', tipo:'moeda', largura:16 },
          { titulo:'CMV total', campo:'cmvTotal', tipo:'moeda', largura:16 },
          { titulo:'Promotoria (%)', campo:'percentualPromotoria', tipo:'percentual', largura:15 },
          { titulo:'Custo promotoria', campo:'custoPromotoria', tipo:'moeda', largura:19 },
          { titulo:'Contrato (%)', campo:'percentualContrato', tipo:'percentual', largura:15 },
          { titulo:'Custo contrato', campo:'custoContrato', tipo:'moeda', largura:18 },
          { titulo:'Comissão (%)', campo:'percentualComissao', tipo:'percentual', largura:15 },
          { titulo:'Custo comissão', campo:'custoComissao', tipo:'moeda', largura:18 },
          { titulo:'Investimentos', campo:'investimentos', tipo:'moeda', largura:18 },
          { titulo:'Frete', campo:'frete', tipo:'moeda', largura:16 },
          { titulo:'Resultado final', campo:'resultadoFinal', tipo:'moeda', largura:18 },
          { titulo:'Margem (%)', campo:'margem', tipo:'percentual', largura:14 },
          { titulo:'Participação (%)', campo:'participacao', tipo:'percentual', largura:17 },
          { titulo:'Clientes positivados', campo:'clientesPositivados', tipo:'inteiro', largura:20 }
        ];
        var ultimaColuna = colunaXlsxMargem(colunas.length - 1);
        var linhas = [];
        var titulo = 'MARGEM POR REDE';
        var periodo = 'Período: ' + inicio.value.split('-').reverse().join('/') + ' a ' + fim.value.split('-').reverse().join('/');

        linhas.push('<row r="1" ht="25" customHeight="1">' +
          '<c r="A1" s="1" t="inlineStr"><is><t>' + titulo + '</t></is></c></row>');
        linhas.push('<row r="2" ht="18" customHeight="1">' +
          '<c r="A2" s="2" t="inlineStr"><is><t>' + escaparXmlXlsxMargem(periodo) + '</t></is></c></row>');
        linhas.push('<row r="4" ht="30" customHeight="1">' + colunas.map(function(coluna, indice) {
          
return '<c r="' + colunaXlsxMargem(indice) + '4" s="' +
  (coluna.campo === 'receitaAposDeducoes' ? 8 : 3) +
  '" t="inlineStr"><is><t>' +

            escaparXmlXlsxMargem(coluna.titulo) + '</t></is></c>';
        }).join('') + '</row>');

        redes.forEach(function(rede, indiceLinha) {
          var numeroLinha = indiceLinha + 5;
          linhas.push('<row r="' + numeroLinha + '">' + colunas.map(function(coluna, indiceColuna) {
            
return celulaXlsxMargem(
  colunaXlsxMargem(indiceColuna) + numeroLinha,
  coluna.campo === 'receitaAposDeducoes'
    ? receitaAposDeducoes(rede)
    : rede[coluna.campo],
  coluna.tipo,
  coluna.campo === 'receitaAposDeducoes'
);

          }).join('') + '</row>');
        });

        var larguras = colunas.map(function(coluna, indice) {
          var numero = indice + 1;
          return '<col min="' + numero + '" max="' + numero + '" width="' + coluna.largura + '" customWidth="1"/>';
        }).join('');
        var planilha = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
          '<dimension ref="A1:' + ultimaColuna + Math.max(4, redes.length + 4) + '"/>' +
          '<sheetViews><sheetView workbookViewId="0"/></sheetViews>' +
          '<cols>' + larguras + '</cols>' +
          '<sheetData>' + linhas.join('') + '</sheetData>' +
          '<mergeCells count="2"><mergeCell ref="A1:' + ultimaColuna + '1"/><mergeCell ref="A2:' + ultimaColuna + '2"/></mergeCells>' +
          '</worksheet>';

        return criarZipXlsxMargem([
          { nome:'[Content_Types].xml', conteudo:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
          { nome:'_rels/.rels', conteudo:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
          { nome:'xl/workbook.xml', conteudo:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Margem por Rede" sheetId="1" r:id="rId1"/></sheets></workbook>' },
          { nome:'xl/_rels/workbook.xml.rels', conteudo:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
          { nome:'xl/styles.xml', conteudo:estilosXlsxMargem() },
          { nome:'xl/worksheets/sheet1.xml', conteudo:planilha }
        ]);
      }

      function exportarExcelMargem() {
        if (!dadosAtuais || !Array.isArray(dadosAtuais.redes) || !dadosAtuais.redes.length) return;

        var arquivo = criarPlanilhaXlsxMargem(dadosAtuais.redes);
        var blob = new Blob([arquivo], {
          type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'MARGEM_POR_REDE_' + inicio.value + '_a_' + fim.value + '.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function() {
          URL.revokeObjectURL(link.href);
        }, 0);
      }

      function abrirModalSemCadastro(titulo, itens) {
  var modal = document.getElementById('modalSemCadastro');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalSemCadastro';
    modal.className = 'modal-sem-cadastro';

    modal.addEventListener('click', function(evento) {
      if (evento.target === modal) {
        modal.className = 'modal-sem-cadastro';
      }
    });

    document.body.appendChild(modal);
  }

  modal.replaceChildren();

  var caixa = document.createElement('div');
  caixa.className = 'modal-sem-cadastro-caixa';

  var topo = document.createElement('div');
  topo.className = 'modal-sem-cadastro-topo';

  var tituloModal = document.createElement('span');
  tituloModal.textContent = titulo;

  var fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'modal-fechar';
  fechar.textContent = 'Fechar';

  fechar.addEventListener('click', function() {
    modal.className = 'modal-sem-cadastro';
  });

  topo.appendChild(tituloModal);
  topo.appendChild(fechar);

  var lista = document.createElement('ul');
  lista.className = 'lista-sem-cadastro';

  itens.forEach(function(item) {
    var linha = document.createElement('li');
    var valor = Number(item.valor || 0);

    linha.innerHTML =
      '<strong>Código ' + (item.codigoParceiro || '—') + '</strong><br>' +
      (item.parceiro || 'Parceiro sem nome') +
      (valor
        ? '<br>Valor: ' + valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        : '');

    lista.appendChild(linha);
  });

  caixa.appendChild(topo);
  caixa.appendChild(lista);
  modal.appendChild(caixa);
  modal.className = 'modal-sem-cadastro visivel';
}

function mostrarAlertas(dados) {
  var grupos = [
    ['vendasSemCadastro', 'venda(s)', 'Vendas sem rede válida'],
    ['devolucoesSemCadastro', 'devolução(ões)', 'Devoluções sem rede válida'],
    ['fretesSemCadastro', 'frete(s)', 'Fretes sem rede válida'],
    ['investimentosForaDoModelo', 'investimento(s)', 'Investimentos sem rede válida']
  ];

  alertas.replaceChildren();
  var encontrouAlerta = false;

  grupos.forEach(function(grupo) {
    var itens = dados && dados[grupo[0]];

    if (!Array.isArray(itens) || !itens.length) return;

    encontrouAlerta = true;

    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'alerta-botao';
    botao.textContent =
      itens.length + ' ' + grupo[1] +
      ' sem rede válida no Cadastro_Clientes — ver clientes';

    botao.addEventListener('click', function() {
      abrirModalSemCadastro(grupo[2], itens);
    });

    alertas.appendChild(botao);
  });

  alertas.className = encontrouAlerta ? 'alertas visivel' : 'alertas';
}

      function mostrarEstado(texto, erro) {
        estado.textContent = texto;
        estado.className = erro ? 'estado erro' : 'estado';
      }

      async function carregar() {
        var numeroConsulta = ++consultaAtual;
        if (!inicio.value || !fim.value) return;

        dadosAtuais = null;
        botaoExportarExcel.disabled = true;

        if (fim.value < inicio.value) {
          mostrarEstado('A data final não pode ser anterior à data inicial.', true);
          return;
        }

        mostrarEstado('Carregando Margem_Rede...', false);
        alertas.className = 'alertas';

        try {
          var parametros = new URLSearchParams({
            inicio: inicio.value,
            fim: fim.value
          });
          var resposta = await fetch(
            '/api/rentabilidade/margem-rede?' + parametros.toString(),
            { credentials:'same-origin' }
          );
          var dados = await resposta.json();
          if (numeroConsulta !== consultaAtual) return;

          if (!resposta.ok) {
            throw new Error(dados.error || 'Não foi possível calcular a Margem_Rede.');
          }

          dadosAtuais = dados;
          botaoExportarExcel.disabled = !Array.isArray(dados.redes) || dados.redes.length === 0;
          preencherTabela(dados.redes);
          mostrarAlertas(dados.alertas);
          mostrarEstado('Período consultado: ' + inicio.value.split('-').reverse().join('/') +
            ' a ' + fim.value.split('-').reverse().join('/'), false);
               } catch (erro) {
          if (numeroConsulta !== consultaAtual) return;
          dadosAtuais = null;
          botaoExportarExcel.disabled = true;
          preencherTabela([]);
          mostrarEstado(
            erro.message || 'Não foi possível calcular a Margem_Rede.',
            true
          );
                } finally {
              } 
      }

      form.addEventListener('submit', async function(evento) {
  evento.preventDefault();

  var botao = document.getElementById('aplicarMargem');

  if (botao.disabled) return;

  if (!inicio.value || !fim.value || inicio.value > fim.value) {
    mostrarEstado('Informe um período válido.', true);
    return;
  }

  botao.disabled = true;
  botao.textContent = 'Carregando...';
  inicio.disabled = true;
  fim.disabled = true;

  try {
    await carregar();
  } finally {
    botao.disabled = false;
    botao.textContent = 'Aplicar';
    inicio.disabled = false;
    fim.disabled = false;
  }
});
      botaoExportarExcel.addEventListener('click', exportarExcelMargem);
      definirPeriodoInicial();
      carregar();
    })();
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
