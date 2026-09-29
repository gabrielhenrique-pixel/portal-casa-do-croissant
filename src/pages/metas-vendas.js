export function metasVendasPage({ podeEditar = false } = {}) {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Metas de vendas | Casa do Croissant</title>

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
      margin: auto;
      padding: 12px 16px 36px;
    }

    .cabecalho {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 20px 26px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 22px #17305212;
      margin-bottom: 16px;
    }

    .navegacao-topo {
      display: flex;
      gap: 8px;
    }

    .nav-icone {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 5px 16px #17305216;
      color: #163a5a;
      text-decoration: none;
      font-size: 24px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    .subtitulo {
      margin: 8px 0 0;
      color: #607a91;
      font-size: 13px;
    }

    .painel {
      margin-bottom: 18px;
      border-radius: 14px;
      background: #fff;
      overflow: hidden;
      box-shadow: 0 6px 18px #17305212;
    }

    h2 {
      margin: 0;
      padding: 15px 20px;
      background: #163a5a;
      color: #fff;
      font-size: 16px;
    }

    .faixa {
      display: flex;
      align-items: flex-end;
      gap: 20px;
      flex-wrap: wrap;
      padding: 20px;
    }

    label {
      display: grid;
      gap: 7px;
      font-size: 12px;
      font-weight: bold;
    }

    input,
    select {
      min-height: 40px;
      padding: 9px 11px;
      border: 1px solid #bdcfe0;
      border-radius: 7px;
      font: inherit;
      background: #fff;
      color: #163a5a;
    }

    input[type=number] {
      width: 190px;
      text-align: right;
    }

    select {
      width: 330px;
      max-width: 100%;
    }

    .ajuda {
      margin: 0;
      color: #607a91;
      font-size: 13px;
      line-height: 1.5;
      flex: 1;
      min-width: 230px;
    }

    button {
      padding: 11px 16px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      font-weight: bold;
      background: #163a5a;
      color: #fff;
      cursor: pointer;
    }

    button:hover {
      filter: brightness(1.12);
    }

    button:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    input:disabled {
      background: #f3f6f9;
    }

    .verde {
      background: #168454;
    }

    .tabela-area {
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 10px 16px;
      border-bottom: 1px solid #e0eaf1;
      font-size: 13px;
      text-align: left;
    }

    th {
      background: #edf4f8;
      font-size: 11px;
      text-transform: uppercase;
    }

    tbody tr:nth-child(even) {
      background: #f8fbfd;
    }

    th:last-child,
    td:last-child {
      text-align: right;
    }

    td input[type=number] {
      width: 145px;
      min-height: 34px;
      padding: 6px 10px;
    }

    tfoot td {
      background: #163a5a;
      color: #fff;
      font-weight: bold;
    }

    .rodape {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: space-between;
    }

    .rodape span {
      font-size: 13px;
      color: #607a91;
    }

    #estado {
      min-height: 20px;
      margin: 12px 4px;
      font-size: 13px;
    }

    #estado.erro {
      color: #b42318;
    }

    #estado.sucesso {
      color: #087f45;
    }

    .aviso {
      padding: 0 20px 16px;
      margin: 0;
      font-size: 12px;
      color: #607a91;
    }

    @media (max-width: 650px) {
      main {
        padding: 8px;
      }

      .cabecalho {
        padding: 16px;
        gap: 12px;
      }

      h1 {
        font-size: 20px;
      }

      .nav-icone {
        width: 38px;
        height: 38px;
      }

      .faixa {
        align-items: stretch;
        gap: 14px;
      }

      .faixa label,
      select {
        width: 100%;
      }

      th,
      td {
        padding: 9px;
      }

      td input[type=number] {
        width: 100px;
      }
    }
  </style>
</head>

<body data-pode-editar="${podeEditar ? 'true' : 'false'}">
<main>
  <header class="cabecalho">
    <nav class="navegacao-topo" aria-label="Navegação">
      <a
        id="voltar"
        class="nav-icone"
        href="/dashboard-vendas"
        aria-label="Voltar ao monitoramento"
      >←</a>

      <a
        class="nav-icone"
        href="/"
        aria-label="Página inicial"
      >⌂</a>
    </nav>

    <div>
      <h1>METAS DE VENDAS</h1>
      <p class="subtitulo">
        Metas financeiras e metas por vendedor e produto em caixas
      </p>
    </div>
  </header>

  <p id="estado" role="status" aria-live="polite">
    Carregando metas...
  </p>

  <section class="painel">
    <h2>META FINANCEIRA TOTAL DA EMPRESA</h2>

    <div class="faixa">
      <label>
        Meta total (R$)
        <input
          id="metaEmpresa"
          type="number"
          min="0"
          max="999999999.99"
          step="0.01"
          disabled
        >
      </label>

      <p class="ajuda">
        Usada no velocímetro maior quando o filtro de vendedor
        está em “Todos”.
      </p>

      <button id="salvarEmpresa" type="button" disabled>
        Salvar meta total
      </button>
    </div>
  </section>

  <section class="painel">
    <h2>METAS DO VENDEDOR</h2>

    <div class="faixa">
      <label>
        Vendedor
        <select id="vendedorMeta" disabled>
          <option value="">Selecione um vendedor</option>
        </select>
      </label>

      <label>
        Meta financeira do vendedor (R$)
        <input
          id="metaDinheiro"
          type="number"
          min="0"
          max="999999999.99"
          step="0.01"
          disabled
        >
      </label>

      <p class="ajuda">
        A meta financeira alimenta o ranking e o velocímetro
        maior ao selecionar este vendedor.
      </p>
    </div>

    <div class="tabela-area">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Grupo do velocímetro</th>
            <th>Meta em caixas</th>
          </tr>
        </thead>

        <tbody id="metasProdutos">
          <tr>
            <td colspan="4">Selecione um vendedor.</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td colspan="3">TOTAL DE CAIXAS DO VENDEDOR</td>
            <td id="totalCaixas">—</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="rodape">
      <span id="situacao">
        Selecione um vendedor para consultar suas metas.
      </span>

      <button
        id="salvarVendedor"
        class="verde"
        type="button"
        disabled
      >
        Salvar metas do vendedor
      </button>
    </div>

    <p class="aviso">
      Cada velocímetro menor soma as caixas vendidas e as metas
      dos produtos de seu grupo. “Todos” soma as metas em caixas
      de todos os vendedores. Meta zero é exibida como “Sem meta”.
    </p>
  </section>

  <p class="aviso">
    Metas vigentes: permanecem válidas até nova alteração,
    como as metas financeiras atuais do portal.
  </p>
</main>

<script>
(function() {
  var $ = function(id) {
    return document.getElementById(id);
  };

  var dados = null;
  var vendedorAtual = '';
  var alterouEmpresa = false;
  var alterouVendedor = false;
  var salvando = false;

  var podeEditar =
    document.body.dataset.podeEditar === 'true';

  var quantidade = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2
  });

  var origem = new URLSearchParams(location.search);
  var retorno = new URLSearchParams();

  ['inicio', 'fim', 'vendedor'].forEach(function(campo) {
    if (origem.has(campo)) {
      retorno.set(campo, origem.get(campo));
    }
  });

  $('voltar').href =
    '/dashboard-vendas' +
    (retorno.size ? '?' + retorno.toString() : '');

  function aviso(texto, classe) {
    $('estado').textContent = texto;
    $('estado').className = classe || '';
  }

  function controles() {
    $('vendedorMeta').disabled = !dados || salvando;

    $('metaEmpresa').disabled =
      !dados || !podeEditar || salvando;

    $('salvarEmpresa').disabled =
      !dados || !podeEditar || salvando;

    $('metaDinheiro').disabled =
      !vendedorAtual || !podeEditar || salvando;

    $('salvarVendedor').disabled =
      !vendedorAtual || !podeEditar || salvando;

    document.querySelectorAll('[data-produto]').forEach(
      function(input) {
        input.disabled = !podeEditar || salvando;
      }
    );
  }

  function totalizar() {
    var total = Array.from(
      document.querySelectorAll('[data-produto]')
    ).reduce(function(soma, input) {
      return soma + (Number(input.value) || 0);
    }, 0);

    $('totalCaixas').textContent = quantidade.format(total);
  }

  function montarVendedor(codigo) {
    vendedorAtual = codigo;
    alterouVendedor = false;

    var vendedor = dados.vendedores.find(function(v) {
      return v.codigoVendedor === codigo;
    });

    $('metasProdutos').replaceChildren();
    $('metaDinheiro').value = vendedor ? vendedor.meta : '';

    if (!vendedor) {
      $('metasProdutos').innerHTML =
        '<tr><td colspan="4">Selecione um vendedor.</td></tr>';

      $('totalCaixas').textContent = '—';

      $('situacao').textContent =
        'Selecione um vendedor para consultar suas metas.';

      controles();
      return;
    }

    dados.produtos.forEach(function(produto) {
      var meta = dados.metasCaixas.find(function(m) {
        return (
          String(m.codigoVendedor) === codigo &&
          String(m.codigoProduto) === produto.codigoProduto
        );
      });

      var tr = document.createElement('tr');

      [
        produto.codigoProduto,
        produto.produto,
        produto.grupo
      ].forEach(function(texto) {
        var td = document.createElement('td');
        td.textContent = texto;
        tr.appendChild(td);
      });

      var td = document.createElement('td');
      var input = document.createElement('input');

      input.type = 'number';
      input.min = '0';
      input.max = '999999999.99';
      input.step = '0.01';

      input.dataset.produto = produto.codigoProduto;
      input.value = meta ? meta.metaCaixas : 0;

      input.setAttribute(
        'aria-label',
        'Meta em caixas de ' + produto.produto
      );

      td.appendChild(input);
      tr.appendChild(td);
      $('metasProdutos').appendChild(tr);
    });

    $('situacao').textContent = podeEditar
      ? 'Edite e salve as metas deste vendedor.'
      : 'Consulta de metas — sem permissão para alterar.';

    totalizar();
    controles();
  }

  function lerNumero(input) {
    if (
      input.value === '' ||
      !input.checkValidity() ||
      !Number.isFinite(Number(input.value))
    ) {
      input.reportValidity();
      input.focus();

      throw Error(
        'Informe metas válidas, maiores ou iguais a zero.'
      );
    }

    return Number(input.value);
  }

  async function gravar(corpo) {
    var resposta = await fetch('/api/vendas/metas-painel', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(corpo)
    });

    var resultado = await resposta.json();

    if (!resposta.ok) {
      throw Error(
        resultado.error || 'Não foi possível salvar as metas.'
      );
    }
  }

  $('vendedorMeta').addEventListener('change', function() {
    if (
      alterouVendedor &&
      !confirm(
        'Descartar as alterações não salvas deste vendedor?'
      )
    ) {
      this.value = vendedorAtual;
      return;
    }

    montarVendedor(this.value);
  });

  $('metaEmpresa').addEventListener('input', function() {
    alterouEmpresa = true;
  });

  $('metaDinheiro').addEventListener('input', function() {
    alterouVendedor = true;
  });

  $('metasProdutos').addEventListener('input', function() {
    alterouVendedor = true;
    totalizar();

    $('situacao').textContent = 'Há alterações não salvas.';
  });

  $('salvarEmpresa').addEventListener('click', async function() {
    if (!podeEditar || salvando) return;

    try {
      var meta = lerNumero($('metaEmpresa'));

      salvando = true;
      controles();
      aviso('Salvando meta total...');

      await gravar({
        metaEmpresa: meta
      });

      dados.metaEmpresa = meta;
      alterouEmpresa = false;

      aviso('Meta total da empresa salva.', 'sucesso');
    } catch (erro) {
      aviso(erro.message, 'erro');
    } finally {
      salvando = false;
      controles();
    }
  });

  $('salvarVendedor').addEventListener('click', async function() {
    if (!podeEditar || !vendedorAtual || salvando) return;

    try {
      var vendedor = dados.vendedores.find(function(v) {
        return v.codigoVendedor === vendedorAtual;
      });

      var meta = lerNumero($('metaDinheiro'));

      var caixas = Array.from(
        document.querySelectorAll('[data-produto]')
      ).map(function(input) {
        return {
          codigoProduto: input.dataset.produto,
          metaCaixas: lerNumero(input)
        };
      });

      salvando = true;
      controles();
      aviso('Salvando metas do vendedor...');

      await gravar({
        vendedor: {
          codigoVendedor: vendedorAtual,
          vendedor: vendedor.vendedor,
          meta: meta
        },
        metasCaixas: caixas
      });

      vendedor.meta = meta;

      dados.metasCaixas = dados.metasCaixas
        .filter(function(m) {
          return String(m.codigoVendedor) !== vendedorAtual;
        })
        .concat(
          caixas.map(function(m) {
            return Object.assign(
              { codigoVendedor: vendedorAtual },
              m
            );
          })
        );

      alterouVendedor = false;
      $('situacao').textContent = 'Metas salvas.';

      aviso(
        'Metas de ' + vendedor.vendedor + ' salvas.',
        'sucesso'
      );
    } catch (erro) {
      aviso(erro.message, 'erro');
    } finally {
      salvando = false;
      controles();
    }
  });

  window.addEventListener('beforeunload', function(evento) {
    if (alterouEmpresa || alterouVendedor || salvando) {
      evento.preventDefault();
      evento.returnValue = '';
    }
  });

  async function carregar() {
    try {
      var resposta = await fetch('/api/vendas/metas-painel', {
        cache: 'no-store'
      });

      var resultado = await resposta.json();

      if (!resposta.ok) {
        throw Error(
          resultado.error || 'Não foi possível carregar as metas.'
        );
      }

      dados = resultado;
      podeEditar = podeEditar && !!dados.podeEditar;

      $('metaEmpresa').value = dados.metaEmpresa;

      dados.vendedores.forEach(function(v) {
        $('vendedorMeta').add(
          new Option(
            v.vendedor + ' — cód. ' + v.codigoVendedor,
            v.codigoVendedor
          )
        );
      });

      var escolhido = origem.get('vendedor') || '';

      if (
        !dados.vendedores.some(function(v) {
          return v.codigoVendedor === escolhido;
        })
      ) {
        escolhido = '';
      }

      $('vendedorMeta').value = escolhido;
      montarVendedor(escolhido);

      aviso(
        podeEditar
          ? 'Metas carregadas.'
          : 'Somente consulta. Para editar, é necessário o acesso Alterar em Monitoramento de vendas.'
      );
    } catch (erro) {
      aviso(erro.message, 'erro');
    }
  }

  carregar();
})();
</script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'cache-control': 'no-store'
    }
  });
}
