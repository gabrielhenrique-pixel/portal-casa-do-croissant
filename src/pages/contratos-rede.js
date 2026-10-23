export function contratosRedePage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Contratos por rede</title>

  <style>
    * { box-sizing:border-box; }

    body {
      margin:0;
      font-family:Arial,sans-serif;
      background:#f3f7f5;
      color:#102e49;
    }

    main {
      max-width:1600px;
      margin:auto;
      padding:8px;
    }

    .topo {
      display:flex;
      align-items:center;
      gap:16px;
      padding:18px 24px;
      border-radius:18px;
      background:#fff;
      box-shadow:0 6px 20px #17305214;
    }

    .navegacao {
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
      color:#102e49;
      text-decoration:none;
      font-size:25px;
      box-shadow:0 5px 15px #1730521c;
    }

    h1 {
      margin:0;
      font-size:28px;
    }

    #filtros {
      display:flex;
      flex-wrap:wrap;
      align-items:flex-end;
      gap:16px;
      padding:20px 24px;
      margin-top:16px;
      background:#fff;
      border-radius:16px;
    }

    .campo {
      min-width:0;
    }

    label {
      display:block;
      margin-bottom:7px;
      font-size:12px;
      font-weight:700;
    }

    input {
      width:180px;
      min-width:0;
      height:42px;
      padding:8px 12px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      background:#fff;
      color:#102e49;
      font:inherit;
    }

    button {
      height:42px;
      padding:0 20px;
      border:0;
      border-radius:8px;
      background:#102e49;
      color:#fff;
      font-weight:700;
      cursor:pointer;
    }

    button:disabled {
      opacity:.6;
      cursor:wait;
    }

    #estado {
      margin:16px 4px 12px;
      color:#63716e;
      font-size:14px;
    }

    #estado.erro {
      color:#c62828;
    }

    .tabela-area {
      max-height:70vh;
      overflow:auto;
      border:1px solid #c7d8e5;
      border-radius:5px;
      background:#fff;
    }

    table {
      width:100%;
      min-width:1000px;
      border-collapse:separate;
      border-spacing:0;
      font-size:13px;
    }

    th, td {
      padding:8px;
      border-right:1px solid #d7d2c5;
      border-bottom:1px solid #d7d2c5;
      text-align:right;
      white-space:nowrap;
    }

    th {
      position:sticky;
      top:0;
      z-index:3;
      background:#1f4e78;
      color:white;
      font-size:12px;
    }

    th:first-child,
    td:first-child {
      position:sticky;
      left:0;
      min-width:190px;
      text-align:left;
    }

    th:first-child {
      z-index:5;
    }

    tbody td:first-child {
      z-index:1;
      background:#d9eaf5;
      color:#202a30;
      font-weight:700;
    }

    tbody tr:hover td {
      background:#f7faf8;
    }

    tbody tr:hover td:first-child {
      background:#c9e0f1;
    }

    tfoot td {
      position:sticky;
      bottom:0;
      z-index:2;
      background:#dcebf6;
      border-top:2px solid #1f4e78;
      font-weight:700;
    }

    tfoot td:first-child {
      z-index:4;
    }

    td.negativo {
      color:#c62828;
    }

    @media(max-width:650px) {
      .topo {
        padding:16px;
        gap:12px;
      }

      h1 { font-size:20px; }

      .nav-icone {
        width:40px;
        height:40px;
      }

      #filtros {
        display:grid;
        grid-template-columns:minmax(0,1fr);
        padding:16px;
      }

      .campo, input, button {
        width:100%;
        min-width:0;
        max-width:100%;
      }

      input {
        font-size:16px;
        appearance:none;
        -webkit-appearance:none;
      }
    }
  </style>
</head>

<body>
  <main>
    <header class="topo">
      <nav class="navegacao">
        <a
          id="voltar"
          class="nav-icone"
          href="/dashboard-rentabilidade"
          aria-label="Voltar à Rentabilidade Comercial"
        >←</a>
        <a class="nav-icone" href="/" aria-label="Página inicial">⌂</a>
      </nav>

      <h1>CONTRATOS POR REDE</h1>
    </header>

    <form id="filtros">
      <div class="campo">
        <label for="inicio">DATA INICIAL</label>
        <input id="inicio" type="date" required>
      </div>

      <div class="campo">
        <label for="fim">DATA FINAL</label>
        <input id="fim" type="date" required>
      </div>

      <button id="atualizar" type="submit">ATUALIZAR DADOS</button>
    </form>

    <p id="estado" role="status"></p>

    <section class="tabela-area">
      <table aria-label="Contratos por rede">
        <thead>
          <tr>
            <th>Rede</th>
            <th>Receita líquida</th>
            <th>Contrato (%)</th>
            <th>Custo do contrato</th>
            <th>Resultado</th>
          </tr>
        </thead>

        <tbody id="linhas"></tbody>
        <tfoot id="totais"></tfoot>
      </table>
    </section>
  </main>

  <script>
  (function () {
    var $ = function (id) {
      return document.getElementById(id);
    };

    var moeda = new Intl.NumberFormat('pt-BR', {
      style:'currency',
      currency:'BRL'
    });

    var percentual = new Intl.NumberFormat('pt-BR', {
      style:'percent',
      minimumFractionDigits:2,
      maximumFractionDigits:2
    });

    var controle = null;

    function numero(valor) {
      var convertido = Number(valor);

      if (!Number.isFinite(convertido)) {
        throw new Error('O relatório retornou um valor inválido.');
      }

      return convertido;
    }

    function porcentagem(valor) {
      return valor == null ? '—' : percentual.format(valor);
    }

    function celula(linha, texto, valor) {
      var td = document.createElement('td');
      td.textContent = texto;

      if (typeof valor === 'number' && valor < 0) {
        td.className = 'negativo';
      }

      linha.appendChild(td);
    }

    function criarLinha(nome, receita, contratoPct, custo) {
      var resultado = receita - custo;
      var linha = document.createElement('tr');

      celula(linha, nome);
      celula(linha, moeda.format(receita), receita);
      celula(
  linha,
  nome === 'TOTAL' ? '' : porcentagem(contratoPct),
  contratoPct
);
      celula(linha, moeda.format(custo), custo);
      celula(linha, moeda.format(resultado), resultado);

      return linha;
    }

    function render(redes) {
      var fragmento = document.createDocumentFragment();
      var receitaTotal = 0;
      var brutoTotal = 0;
      var contratoTotal = 0;

      redes.forEach(function (rede) {
        var receita = numero(rede.receitaLiquida);
        var bruto = numero(rede.faturamentoBruto);
        var custo = numero(rede.custoContrato);

        var contratoPct = rede.percentualContrato == null
          ? null
          : numero(rede.percentualContrato);

        receitaTotal += receita;
        brutoTotal += bruto;
        contratoTotal += custo;

        fragmento.appendChild(criarLinha(
          rede.rede,
          receita,
          contratoPct,
          custo
        ));
      });

      $('linhas').replaceChildren(fragmento);

      $('totais').replaceChildren(criarLinha(
        'TOTAL',
        receitaTotal,
        brutoTotal === 0 ? null : contratoTotal / brutoTotal,
        contratoTotal
      ));
    }

    function dataBR(valor) {
      return valor.split('-').reverse().join('/');
    }

    async function carregar() {
      if (controle) controle.abort();

      var atual = new AbortController();
      controle = atual;

      var inicio = $('inicio').value;
      var fim = $('fim').value;

      $('linhas').replaceChildren();
      $('totais').replaceChildren();
      $('estado').className = '';
      $('atualizar').disabled = false;

      if (!inicio || !fim || inicio > fim) {
        $('estado').textContent = 'Informe um período válido.';
        $('estado').className = 'erro';
        return;
      }

      $('atualizar').disabled = true;
      $('estado').textContent = 'Carregando contratos...';

      try {
        var parametros = new URLSearchParams({
          inicio:inicio,
          fim:fim
        });

        var resposta = await fetch(
          '/api/rentabilidade/margem-rede?' + parametros.toString(),
          {
            credentials:'same-origin',
            cache:'no-store',
            signal:atual.signal
          }
        );

        var dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.error || 'Não foi possível carregar os contratos.'
          );
        }

        if (!Array.isArray(dados.redes)) {
          throw new Error('O relatório não retornou as redes.');
        }

        if (atual.signal.aborted) return;

        render(dados.redes);

        $('estado').textContent =
          'Período consultado: ' +
          dataBR(dados.inicio) + ' a ' + dataBR(dados.fim);

        history.replaceState(
          null,
          '',
          location.pathname + '?' + parametros.toString()
        );
      } catch (erro) {
        if (atual.signal.aborted) return;

        $('estado').textContent = erro.message;
        $('estado').className = 'erro';
      } finally {
        if (controle === atual) {
          $('atualizar').disabled = false;
        }
      }
    }

    var partes = new Intl.DateTimeFormat('en-US', {
      timeZone:'America/Sao_Paulo',
      year:'numeric',
      month:'2-digit',
      day:'2-digit'
    }).formatToParts(new Date());

    var campos = {};

    partes.forEach(function (parte) {
      campos[parte.type] = parte.value;
    });

    var hoje = campos.year + '-' + campos.month + '-' + campos.day;
    var parametros = new URLSearchParams(location.search);

    $('inicio').value =
      parametros.get('inicio') || hoje.slice(0, 7) + '-01';

    $('fim').value = parametros.get('fim') || hoje;

    $('filtros').addEventListener('submit', function (evento) {
      evento.preventDefault();
      carregar();
    });

    carregar();
  })();
  </script>
</body>
</html>`, {
    headers: {
      'content-type':'text/html; charset=UTF-8',
      'cache-control':'no-store',
      'x-content-type-options':'nosniff'
    }
  });
}
