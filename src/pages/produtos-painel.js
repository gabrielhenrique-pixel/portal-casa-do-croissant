export function produtosPainelPage({ podeEditar = false } = {}) {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cadastro de produtos | Casa do Croissant</title>

  <style>
    * { box-sizing:border-box; }

    body {
      margin:0;
      background:#eaf1f6;
      color:#163a5a;
      font-family:Arial,sans-serif;
    }

    main {
      max-width:1550px;
      margin:auto;
      padding:12px 16px 30px;
    }

    .cabecalho {
      display:flex;
      align-items:center;
      gap:18px;
      padding:20px 26px;
      background:white;
      border-radius:20px;
      box-shadow:0 8px 22px #17305212;
    }

    nav {
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
      background:white;
      box-shadow:0 5px 16px #17305216;
      color:#163a5a;
      text-decoration:none;
      font-size:24px;
    }

    h1 {
      margin:0;
      font-size:28px;
    }

    .subtitulo {
      margin:7px 0 0;
      font-size:13px;
      color:#607a91;
    }

    .barra {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:14px;
      padding:16px;
      margin-top:14px;
      background:white;
      border-radius:14px;
    }

    label {
      display:grid;
      gap:6px;
      font-size:11px;
      font-weight:bold;
    }

    .pesquisa {
      flex:1;
      min-width:220px;
    }

    input,
    select {
      min-height:36px;
      border:1px solid #bdcfe0;
      border-radius:6px;
      padding:7px 9px;
      color:#163a5a;
      background:white;
      font:inherit;
      font-size:13px;
    }

    button {
      min-height:36px;
      padding:9px 13px;
      border:0;
      border-radius:7px;
      background:#163a5a;
      color:white;
      font:inherit;
      font-size:12px;
      cursor:pointer;
    }

    button:hover {
      background:#23547a;
    }

    button:disabled {
      opacity:.5;
      cursor:not-allowed;
    }

    input:disabled,
    select:disabled {
      background:#f1f5f8;
    }

    .ajuda {
      font-size:12px;
      color:#607a91;
      margin:10px 4px;
      line-height:1.5;
    }

    #estado {
      min-height:18px;
      margin:12px 4px;
      font-size:13px;
    }

    #estado.erro {
      color:#b42318;
    }

    #estado.sucesso {
      color:#087f45;
    }

    .painel {
      background:white;
      border-radius:16px;
      overflow:hidden;
    }

    h2 {
      background:#163a5a;
      color:white;
      margin:0;
      padding:15px 18px;
      font-size:16px;
    }

    .tabela-area {
      overflow:auto;
    }

    table {
      width:100%;
      border-collapse:collapse;
      table-layout:fixed;
    }

    th,
    td {
      padding:9px 7px;
      border-bottom:1px solid #e0eaf1;
      text-align:left;
      font-size:12px;
      overflow-wrap:anywhere;
    }

    th {
      background:#edf4f8;
      font-size:10px;
      text-transform:uppercase;
    }

    tbody tr:nth-child(even) {
      background:#f7fbfe;
    }

    td input[type=number],
    td select {
      width:100%;
      min-width:0;
      font-size:12px;
    }

    td input[type=checkbox] {
      width:17px;
      height:17px;
      min-height:0;
      cursor:pointer;
    }

    .centro {
      text-align:center;
    }

    .situacao {
      font-size:11px;
      color:#607a91;
    }

    .pendente {
      color:#a65b00;
    }

    .salvar {
      background:#168454;
      padding:8px;
      width:100%;
    }

    [hidden] {
      display:none !important;
    }

    #contagem {
      padding:12px 16px;
      margin:0;
      font-size:12px;
    }

    @media(max-width:850px) {
      main {
        padding:8px;
      }

      .cabecalho {
        padding:16px;
        gap:12px;
      }

      h1 {
        font-size:21px;
      }

      .nav-icone {
        width:38px;
        height:38px;
      }

      table {
        min-width:980px;
      }
    }
  </style>
</head>

<body data-pode-editar="${podeEditar ? 'true' : 'false'}">
<main>
  <header class="cabecalho">
    <nav aria-label="Navegação">
      <a class="nav-icone" href="/" aria-label="Voltar">←</a>
      <a class="nav-icone" href="/" aria-label="Página inicial">⌂</a>
    </nav>

    <div>
      <h1>CADASTRO DE PRODUTOS</h1>
      <p class="subtitulo">
        Sankhya: Venda (fabricação própria)
      </p>
    </div>
  </header>

  <div class="barra">
    <label class="pesquisa">
      PESQUISAR CÓDIGO OU PRODUTO
      <input
        id="pesquisa"
        type="search"
        placeholder="Pesquisar produto"
      >
    </label>

    <label>
      SITUAÇÃO
      <select id="filtroSituacao">
        <option value="">Todas</option>
        <option>Pendente de configuração</option>
        <option>Habilitado</option>
        <option>Fora do painel</option>
        <option>Revisar unidade de venda</option>
        <option>Inativo no Sankhya</option>
      </select>
    </label>

    <button id="sincronizar" type="button" disabled>
      Atualizar do Sankhya
    </button>

        <button
      id="editarProdutos"
      type="button"
      title="Editar produtos"
      aria-label="Editar produtos"
      hidden
    >
      ✎ Editar
    </button>

    <button
      id="salvarTodos"
      type="button"
      hidden
      disabled
    >
      Salvar alterações
    </button>
  </div>

  <div id="barraGrupo" class="barra" hidden>
    <label>
      NOVO GRUPO DE PRODUTO
      <input
        id="novoGrupo"
        maxlength="80"
        placeholder="Nome do novo grupo"
      >
    </label>

    <button id="adicionarGrupo" type="button">
      Adicionar grupo à lista
    </button>

  </div>

  <p id="estado" role="status" aria-live="polite">
    Carregando produtos...
  </p>

  <section class="painel">
    <h2>PRODUTOS — VENDA (FABRICAÇÃO PRÓPRIA)</h2>

    <div class="tabela-area">
      <table>
        <colgroup>
          <col style="width:6%">
          <col style="width:26%">
          <col style="width:7%">
          <col style="width:9%">
          <col style="width:11%">
          <col style="width:17%">
          <col style="width:6%">
          <col style="width:12%">
        </colgroup>

        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Unidade ERP</th>
            <th>Pacotes por caixa</th>
            <th>CMV (R$)</th>
            <th>Grupo de produtos</th>
            <th class="centro">Usar no painel</th>
            <th>Situação</th>
          </tr>
        </thead>

        <tbody id="linhas"></tbody>
      </table>
    </div>

    <p id="contagem">Carregando...</p>
  </section>

</main>

<script>
(function () {
  var $ = function (id) {
    return document.getElementById(id);
  };

  var permissaoPagina =
    document.body.dataset.podeEditar === 'true';

  var podeEditar = false;
  var ocupado = false;
  var grupos = [];
  var linhas = new Map();
  var alterados = new Set();
  var editando = false;

  function aviso(texto, classe) {
    $('estado').textContent = texto;
    $('estado').className = classe || '';
  }

  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

    function controles() {
    $('sincronizar').disabled = ocupado || editando;

    $('editarProdutos').hidden =
      !podeEditar || editando;

    $('editarProdutos').disabled =
      ocupado || !podeEditar;

    $('salvarTodos').hidden =
      !podeEditar || !editando;

    $('salvarTodos').disabled =
      ocupado ||
      !editando ||
      alterados.size === 0;

    $('barraGrupo').hidden =
      !podeEditar || !editando;

    $('adicionarGrupo').disabled =
      ocupado || !podeEditar || !editando;

    $('novoGrupo').disabled =
      ocupado || !podeEditar || !editando;

    linhas.forEach(function(linha) {
      linha.pacotes.disabled =
        ocupado || !podeEditar || !editando;

      linha.cmv.disabled =
        ocupado || !podeEditar || !editando;

      linha.grupo.disabled =
        ocupado || !podeEditar || !editando;

      linha.usar.disabled =
        ocupado ||
        !podeEditar ||
        !editando ||
        !linha.produto.ativoSankhya;
    });
  }

  function preencherGrupos(select, selecionado) {
    select.replaceChildren(
      new Option('Selecione...', '')
    );

    grupos.forEach(function (grupo) {
      select.add(new Option(grupo, grupo));
    });

    select.value = selecionado || '';
  }

  function filtrar() {
    var termo = normalizar($('pesquisa').value);
    var situacao = $('filtroSituacao').value;
    var exibidos = 0;

    linhas.forEach(function (linha) {
      var produto = linha.produto;

      var visivel =
        normalizar(
          produto.codigoProduto + ' ' + produto.produto
        ).includes(termo) &&
        (!situacao || produto.situacao === situacao);

      linha.tr.hidden = !visivel;

      if (visivel) {
        exibidos++;
      }
    });

    $('contagem').textContent =
      exibidos + ' de ' + linhas.size +
      ' produtos • ' + alterados.size +
      ' com alterações não salvas';
  }

  function marcar(linha) {
    alterados.add(linha.produto.codigoProduto);
    linha.situacao.textContent = 'Alterações não salvas';
    linha.situacao.className = 'situacao pendente';

    controles();
    filtrar();
  }

  function preencherLinha(linha, produto) {
    linha.produto = produto;

    linha.pacotes.value = produto.pacotesPorCaixa == null
      ? ''
      : produto.pacotesPorCaixa;

    linha.cmv.value = produto.cmv == null
      ? ''
      : produto.cmv;

    preencherGrupos(linha.grupo, produto.grupo);

    linha.usar.checked = !!produto.habilitado;
    linha.situacao.textContent = produto.situacao;
    linha.situacao.className = 'situacao';
  }

  function montar(produtos) {
    linhas.clear();
    $('linhas').replaceChildren();

    produtos.forEach(function (produto) {
      var tr = document.createElement('tr');

      function celula(texto) {
        var td = document.createElement('td');

        if (texto != null) {
          td.textContent = texto;
        }

        tr.appendChild(td);
        return td;
      }

      celula(produto.codigoProduto);
      celula(produto.produto);
      celula(produto.unidadeSankhya);

      var pacotes = document.createElement('input');
      pacotes.type = 'number';
      pacotes.min = '1';
      pacotes.max = '1000000';
      pacotes.step = '1';

      pacotes.setAttribute(
        'aria-label',
        'Pacotes por caixa de ' + produto.produto
      );

      celula().appendChild(pacotes);

      var cmv = document.createElement('input');
      cmv.type = 'number';
      cmv.min = '0';
      cmv.max = '1000000000';
      cmv.step = '0.01';

      cmv.setAttribute(
        'aria-label',
        'CMV de ' + produto.produto
      );

      celula().appendChild(cmv);

      var grupo = document.createElement('select');

      grupo.setAttribute(
        'aria-label',
        'Grupo de ' + produto.produto
      );

      celula().appendChild(grupo);

      var usar = document.createElement('input');
      usar.type = 'checkbox';

      usar.setAttribute(
        'aria-label',
        'Usar no painel: ' + produto.produto
      );

      var tdUsar = celula();
      tdUsar.className = 'centro';
      tdUsar.appendChild(usar);

      var situacao = celula();

      var linha = {
        tr: tr,
        produto: produto,
        pacotes: pacotes,
        cmv: cmv,
        grupo: grupo,
        usar: usar,
            situacao: situacao
      };

      preencherLinha(linha, produto);

      pacotes.addEventListener('input', function () {
        marcar(linha);
      });

      cmv.addEventListener('input', function () {
        marcar(linha);
      });

      grupo.addEventListener('change', function () {
        marcar(linha);
      });

      usar.addEventListener('change', function () {
        marcar(linha);
      });

      linhas.set(produto.codigoProduto, linha);
      $('linhas').appendChild(tr);
    });

    filtrar();
  }

    async function requisicao(caminho, opcoes) {
    if (typeof caminho !== 'string') {
      opcoes = caminho;
      caminho = '/api/produtos-painel';
    }

    var resposta = await fetch(
      caminho,
      opcoes
    );

    var dados;

    try {
      dados = await resposta.json();
    } catch (_) {
      throw Error(
        'Resposta inválida do portal. Verifique sua sessão e tente novamente.'
      );
    }

    if (!resposta.ok) {
      throw Error(
        dados.error || 'Não foi possível concluir a operação.'
      );
    }

    return dados;
  }

  async function carregar() {
    if (ocupado) return;

    if (
      alterados.size &&
      !confirm(
        'Descartar as alterações não salvas e atualizar do Sankhya?'
      )
    ) {
      return;
    }

    ocupado = true;
    controles();

    aviso(
      'Consultando produtos de fabricação própria no Sankhya...'
    );

    try {
      var dados = await requisicao({
        cache: 'no-store'
      });

      podeEditar = permissaoPagina && !!dados.podeEditar;
      grupos = dados.grupos || [];

            alterados.clear();
      editando = false;
      montar(dados.produtos || []);

      aviso(
        podeEditar
          ? 'Produtos carregados.'
          : 'Somente consulta. É necessário o acesso Alterar em Produtos para editar.'
      );
    } catch (erro) {
      aviso(erro.message, 'erro');
    } finally {
      ocupado = false;
      controles();
    }
  }

  async function salvarLinha(linha) {
    if (ocupado || !podeEditar) return;

    if (!linha.pacotes.checkValidity() || !linha.cmv.checkValidity()) {
      (linha.pacotes.validity.valid ? linha.cmv : linha.pacotes)
        .reportValidity();
      return;
    }

    var pacotes = linha.pacotes.value === ''
      ? null
      : Number(linha.pacotes.value);

    var cmv = linha.cmv.value === ''
      ? null
      : Number(linha.cmv.value);

    if (
      linha.usar.checked &&
      (!pacotes || !linha.grupo.value)
    ) {
      aviso(
        'Preencha pacotes por caixa e grupo antes de habilitar o produto.',
        'erro'
      );
      return;
    }

    ocupado = true;
    controles();

    aviso('Salvando ' + linha.produto.produto + '...');

    try {
      var dados = await requisicao({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigoProduto: linha.produto.codigoProduto,
          pacotesPorCaixa: pacotes,
          cmv: cmv,
          grupo: linha.grupo.value,
          habilitado: linha.usar.checked
        })
      });

      var nomeGrupo = dados.produto.grupo;

      if (nomeGrupo && !grupos.includes(nomeGrupo)) {
        grupos.push(nomeGrupo);

        grupos.sort(function (a, b) {
          return a.localeCompare(b, 'pt-BR');
        });

        linhas.forEach(function (item) {
          preencherGrupos(item.grupo, item.grupo.value);
        });
      }

      alterados.delete(linha.produto.codigoProduto);
      preencherLinha(linha, dados.produto);
      filtrar();

      aviso(
        'Configuração salva: ' + dados.produto.produto + '.',
        'sucesso'
      );
    } catch (erro) {
      aviso(erro.message, 'erro');
    } finally {
      ocupado = false;
      controles();
    }
  }

    $('adicionarGrupo').addEventListener(
    'click',
    async function () {
      if (!podeEditar || ocupado || !editando) return;

      var nome = $('novoGrupo').value
        .trim()
        .replace(/\s+/g, ' ');

      if (!nome) {
        aviso('Digite o nome do grupo.', 'erro');
        return;
      }

      var existe = grupos.some(function(grupo) {
        return grupo.toLocaleLowerCase('pt-BR') ===
          nome.toLocaleLowerCase('pt-BR');
      });

      if (existe) {
        aviso('Esse grupo já está cadastrado.', 'erro');
        return;
      }

      ocupado = true;
      controles();

      aviso('Criando grupo global...');

      try {
        var dados = await requisicao(
          '/api/grupos-produtos',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
          }
        );

        var grupoCriado = String(
          dados.grupo || ''
        ).trim();

        if (!grupoCriado) {
          throw Error(
            'O Portal não retornou o grupo criado.'
          );
        }

        grupos.push(grupoCriado);

        grupos.sort(function(a, b) {
          return a.localeCompare(b, 'pt-BR');
        });

        linhas.forEach(function(linha) {
          preencherGrupos(
            linha.grupo,
            linha.grupo.value
          );
        });

        $('novoGrupo').value = '';

        aviso(
          'Grupo global criado. Agora ele pode ser usado em qualquer produto.',
          'sucesso'
        );
      } catch (erro) {
        aviso(erro.message, 'erro');
      } finally {
        ocupado = false;
        controles();
      }
    }
  );
  $('pesquisa').addEventListener('input', filtrar);
  $('filtroSituacao').addEventListener('change', filtrar);
  $('sincronizar').addEventListener('click', carregar);

  window.addEventListener('beforeunload', function (evento) {
    if (alterados.size || ocupado) {
      evento.preventDefault();
      evento.returnValue = '';
    }
  });

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
