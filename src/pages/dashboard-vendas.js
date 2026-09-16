export function dashboardVendasPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Painel monitoramento de vendas</title>

  <style>
    :root {
      --azul:#102e49;
      --fundo:#edf3f9;
      --verde:#00ad4f;
      --texto:#17355f;
      --cinza:#a7a7a7;
      --borda:#d3dce8;
    }

    * {
      box-sizing:border-box;
    }

    body {
      margin:0;
      min-height:100vh;
      background:linear-gradient(135deg,#edf3f9,#dfe9f4);
      color:var(--texto);
      font-family:Arial,sans-serif;
    }

    main {
      max-width:1550px;
      margin:auto;
      padding:10px 12px 34px;
    }

    .cabecalho {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:24px;
      padding:18px 34px;
      border-radius:18px;
      background:rgba(255,255,255,.92);
      box-shadow:0 8px 22px #1730521c;
    }

    h1 {
      margin:0;
      font-size:30px;
    }

    .cabecalho small {
      color:#6680a5;
      font-size:11px;
      font-weight:700;
      letter-spacing:4px;
    }

    .filtros {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:18px;
      margin-top:15px;
      padding:14px 34px;
      border-radius:15px;
      background:rgba(255,255,255,.84);
      box-shadow:0 6px 18px #17305214;
    }

    label {
      display:grid;
      gap:5px;
      color:#17375f;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    }

    input,
    select {
      height:39px;
      min-width:175px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      padding:0 10px;
      color:#142f57;
      background:#fff;
      font:inherit;
      font-size:14px;
    }

    select {
      min-width:245px;
    }

    button {
      min-height:39px;
      border:0;
      border-radius:8px;
      padding:10px 18px;
      background:var(--azul);
      color:#fff;
      font:inherit;
      font-size:13px;
      font-weight:700;
      cursor:pointer;
    }

    button:hover {
      background:#1b4b7b;
    }

    button:disabled {
      cursor:wait;
      opacity:.7;
    }

    .voltar {
      margin-left:auto;
      color:var(--azul);
      font-size:13px;
      font-weight:700;
      text-decoration:none;
    }

    .estado {
      min-height:18px;
      margin:10px 2px 0;
      color:#5c6d82;
      font-size:13px;
    }

    .estado.erro {
      color:#b42331;
    }

    .grade-principal {
      display:grid;
      grid-template-columns:minmax(410px,.7fr) minmax(560px,1.3fr);
      gap:14px;
      margin-top:14px;
    }

    .painel {
      padding:18px;
      border-radius:18px;
      background:rgba(255,255,255,.94);
      box-shadow:0 8px 22px #1730521c;
    }

    .painel h2 {
      margin:0 0 12px;
      font-size:20px;
    }

    table {
      width:100%;
      border-collapse:collapse;
    }

    th,
    td {
      padding:9px 10px;
      border-bottom:1px solid #dce6f0;
      font-size:13px;
      text-align:right;
    }

    th {
      color:#26436c;
      background:#edf3fa;
      font-size:12px;
      text-align:center;
    }

    th:first-child,
    td:first-child {
      text-align:left;
    }

    .sem-meta {
      color:#7d8998;
      font-style:italic;
    }

    .gauge-total {
      display:grid;
      place-items:center;
      min-height:250px;
    }

    .gauge {
      position:relative;
      width:410px;
      max-width:100%;
      height:215px;
    }

    .gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .ponteiro {
      position:absolute;
      bottom:34px;
      left:calc(50% - 3px);
      width:6px;
      height:108px;
      border-radius:6px;
      background:#112b55;
      transform-origin:50% 100%;
    }

    .pino {
      position:absolute;
      bottom:27px;
      left:calc(50% - 8px);
      width:16px;
      height:16px;
      border-radius:50%;
      background:#112b55;
    }

    .gauge strong {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      font-size:34px;
      text-align:center;
    }

    .gauge span {
      position:absolute;
      right:0;
      bottom:-21px;
      left:0;
      color:#58729a;
      font-size:15px;
      text-align:center;
    }

    .totais {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1px;
      margin:5px 36px 0;
      background:#d7e1ed;
    }

    .total {
      padding:12px;
      background:#fff;
      text-align:center;
    }

    .total span {
      display:block;
      color:#5a7091;
      font-size:13px;
    }

    .total strong {
      display:block;
      margin-top:5px;
      font-size:21px;
    }

    .secao-grupos {
      margin-top:16px;
    }

    .cards-grupos {
      display:grid;
      grid-template-columns:repeat(3,minmax(250px,1fr));
      gap:14px;
    }

    .grupo-card {
      min-height:215px;
      padding:14px;
      border-radius:32px;
      background:#fff;
      box-shadow:0 2px 3px #0005;
      text-align:center;
    }

    .grupo-card h3 {
      margin:0;
      color:#42526c;
      font-size:16px;
    }

    .grupo-gauge {
      position:relative;
      width:190px;
      height:128px;
      margin:10px auto 0;
    }

    .grupo-gauge svg {
      width:100%;
      height:100%;
      overflow:visible;
    }

    .grupo-ponteiro {
      position:absolute;
      bottom:28px;
      left:calc(50% - 2px);
      width:4px;
      height:64px;
      border-radius:4px;
      background:#111;
      transform-origin:50% 100%;
    }

    .grupo-gauge b {
      position:absolute;
      right:0;
      bottom:0;
      left:0;
      color:#23588d;
      font-size:19px;
      text-align:center;
    }

    .acoes-metas {
      display:flex;
      justify-content:center;
      margin-top:20px;
    }

    .botao-metas {
      min-width:190px;
      background:#117445;
    }

    .botao-metas:hover {
      background:#0d6039;
    }

    .modal {
      position:fixed;
      z-index:10;
      inset:0;
      display:none;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#102e4988;
    }

    .modal.aberto {
      display:flex;
    }

    .janela-metas {
      width:min(100%,680px);
      max-height:90vh;
      overflow:auto;
      padding:24px;
      border-radius:18px;
      background:#fff;
      box-shadow:0 18px 50px #0005;
    }

    .janela-metas h2 {
      margin:0;
      color:#102e49;
    }

    .janela-metas p {
      margin:7px 0 18px;
      color:#617697;
      font-size:14px;
    }

    .meta-total {
      display:grid;
      grid-template-columns:1fr 180px;
      align-items:center;
      gap:12px;
      margin-bottom:14px;
      padding:14px;
      border-radius:10px;
      background:#e9f2fb;
      color:#102e49;
      font-weight:700;
    }

    .meta-total input {
      min-width:0;
      border:0;
      background:#fff;
      text-align:right;
      font-weight:700;
    }

    .lista-metas {
      display:grid;
      gap:8px;
    }

    .linha-meta {
      display:grid;
      grid-template-columns:1fr 180px;
      align-items:center;
      gap:12px;
      padding:10px 0;
      border-bottom:1px solid #e2e9f1;
    }

    .linha-meta strong {
      font-size:14px;
    }

    .linha-meta input {
      min-width:0;
      text-align:right;
    }

    .acoes-modal {
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:20px;
    }

    .cancelar {
      border:1px solid #b8c8d8;
      background:#fff;
      color:#17355f;
    }

    .vazio {
      grid-column:1/-1;
      padding:32px;
      border-radius:16px;
      color:#697a91;
      background:rgba(255,255,255,.92);
      text-align:center;
    }

    @media (max-width:1000px) {
      .grade-principal {
        grid-template-columns:1fr;
      }

      .cards-grupos {
        grid-template-columns:repeat(2,minmax(240px,1fr));
      }
    }

    @media (max-width:650px) {
      main {
        padding:10px;
      }

      .cabecalho {
        align-items:flex-start;
        flex-direction:column;
        padding:18px;
      }

      h1 {
        font-size:23px;
      }

      .filtros {
        padding:14px;
      }

      label,
      input,
      select {
        width:100%;
      }

      .voltar {
        margin:2px 0 0;
      }

      .cards-grupos {
        grid-template-columns:1fr;
      }

      .totais {
        margin:5px 0;
      }

      .meta-total,
      .linha-meta {
        grid-template-columns:1fr;
      }
    }
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <h1>PAINEL MONITORAMENTO DE VENDAS</h1>
    </header>

    <form id="filtros" class="filtros">
      <label>
        Data inicial
        <input id="inicio" type="date" required>
      </label>

      <label>
        Data final
        <input id="fim" type="date" required>
      </label>

      <label>
        Vendedor
        <select id="vendedor">
          <option value="">Todos</option>
        </select>
      </label>

      <button id="atualizar" type="submit">
        ATUALIZAR DADOS
      </button>

      <a class="voltar" href="/">Página inicial</a>
    </form>

    <p id="estado" class="estado">Carregando dados...</p>

    <section class="grade-principal">
      <article class="painel">
        <h2>Vendedores</h2>

        <table>
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Total vendas</th>
              <th>Meta atingida</th>
            </tr>
          </thead>

          <tbody id="linhas"></tbody>
        </table>
      </article>

      <article class="painel">
        <h2>Faturamento total</h2>

        <div class="gauge-total">
          <div class="gauge">
            <svg viewBox="0 0 410 230" aria-hidden="true">
              <path
                d="M 52 170 A 153 153 0 0 1 358 170"
                fill="none"
                stroke="#e5ebf2"
                stroke-width="32"
              />
              <path
                d="M 52 170 A 153 153 0 0 1 156 34"
                fill="none"
                stroke="#eb5560"
                stroke-width="32"
              />
              <path
                d="M 156 34 A 153 153 0 0 1 254 34"
                fill="none"
                stroke="#f4b22f"
                stroke-width="32"
              />
              <path
                d="M 254 34 A 153 153 0 0 1 358 170"
                fill="none"
                stroke="#5dcc7b"
                stroke-width="32"
              />
            </svg>

            <i id="ponteiroTotal" class="ponteiro"></i>
            <i class="pino"></i>
            <strong id="pctTotal">—</strong>
            <span>Meta atingida</span>
          </div>
        </div>

        <div class="totais">
          <div class="total">
            <span>Faturamento realizado</span>
            <strong id="faturamentoTotal">—</strong>
          </div>

          <div class="total">
            <span>Meta total</span>
            <strong id="metaTotal">—</strong>
          </div>
        </div>
      </article>
    </section>

    <section class="secao-grupos">
      <div id="cardsGrupos" class="cards-grupos"></div>

      <div class="acoes-metas">
        <button id="abrirMetas" class="botao-metas" type="button">
          ATUALIZAR METAS
        </button>
      </div>
    </section>
  </main>

  <div id="modalMetas" class="modal">
    <section class="janela-metas">
      <h2>Atualizar metas de vendedores</h2>
      <p>Defina a meta total da empresa e as metas individuais dos vendedores.</p>

      <div class="meta-total">
        <span>Meta total</span>
        <input id="metaTotalEdicao" type="text" inputmode="decimal">
      </div>

      <div id="listaMetas" class="lista-metas"></div>

      <div class="acoes-modal">
        <button id="cancelarMetas" class="cancelar" type="button">
          Cancelar
        </button>

        <button id="salvarMetas" type="button">
          Salvar metas
        </button>
      </div>
    </section>
  </div>

  <script>
    (function () {
      var $ = function (id) {
        return document.getElementById(id);
      };

      var dadosAtuais = null;

      var GRUPOS = [
        'Croissant TO GO',
        'Biscoitos',
        'Amêndoas',
        'Pão croissant 10un',
        'Pão Croissant 125g',
        'Pão Croissant 250g'
      ];

      var META_POR_GRUPO = 200000;

      var moeda = new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
      });

      var percentual = new Intl.NumberFormat('pt-BR', {
        style:'percent',
        minimumFractionDigits:0,
        maximumFractionDigits:1
      });

      function numero(valor) {
        valor = Number(valor);
        return Number.isFinite(valor) ? valor : 0;
      }

      function numeroMeta(valor) {
        var texto = String(valor || '')
          .trim()
          .replace(/\s/g, '');

        if (texto.includes(',')) {
          texto = texto.replace(/\./g, '').replace(',', '.');
        }

        return Number(texto);
      }

      function dataIso(data) {
        return data.getFullYear() + '-' +
          String(data.getMonth() + 1).padStart(2, '0') + '-' +
          String(data.getDate()).padStart(2, '0');
      }

      function escapar(valor) {
        var elemento = document.createElement('div');
        elemento.textContent = String(valor || '');
        return elemento.innerHTML;
      }

      function corMeta(valor) {
        if (valor == null) {
          return '#60738e';
        }

        if (valor < .5) {
          return '#e93d49';
        }

        if (valor < .8) {
          return '#df9400';
        }

        return '#15954f';
      }

      function angulo(valor) {
        valor = Math.max(0, Math.min(numero(valor), 1));
        return -90 + valor * 180;
      }

      function preencherFiltro(vendedores) {
        var select = $('vendedor');
        var anterior = select.value;

        select.innerHTML =
          '<option value="">Todos</option>' +
          vendedores.map(function (vendedor) {
            return (
              '<option value="' +
                escapar(vendedor.codigoVendedor) +
                '">' +
                escapar(vendedor.vendedor) +
              '</option>'
            );
          }).join('');

        var existe = Array.from(select.options).some(
          function (opcao) {
            return opcao.value === anterior;
          }
        );

        if (existe) {
          select.value = anterior;
        }
      }

      function velocimetroGrupo(grupo) {
        var participacao = grupo.participacao;
        var progresso = Math.max(
          0,
          Math.min(numero(participacao), 1)
        ) * 245;

        return (
          '<div class="grupo-gauge">' +
            '<svg viewBox="0 0 190 130" aria-hidden="true">' +
              '<path d="M 20 105 A 75 75 0 0 1 170 105" ' +
                'fill="none" stroke="#a7a7a7" stroke-width="25"/>' +
              '<path d="M 20 105 A 75 75 0 0 1 170 105" ' +
                'fill="none" stroke="#00ad4f" stroke-width="25" ' +
                'stroke-dasharray="' +
                  progresso.toFixed(1) +
                  ' 245"/>' +
            '</svg>' +
            '<i class="grupo-ponteiro" style="transform:rotate(' +
              angulo(participacao) +
              'deg)"></i>' +
            '<b>' +
              percentual.format(participacao) +
            '</b>' +
          '</div>'
        );
      }

      function montarGrupos(produtos) {
        var porNome = new Map();

        produtos.forEach(function (produto) {
          porNome.set(
            String(produto.produto || ''),
            numero(produto.faturamento)
          );
        });

        return GRUPOS.map(function (nome) {
          var faturamento = porNome.get(nome) || 0;

          return {
            nome:nome,
            faturamento:faturamento,
            participacao:META_POR_GRUPO > 0
              ? faturamento / META_POR_GRUPO
              : 0
          };
        });
      }

      function render(dados) {
        dadosAtuais = dados;

        var vendedores = dados.vendedores || [];
        var opcoesVendedores = dados.opcoesVendedores || vendedores;
        var produtos = dados.produtos || [];
        var grupos = montarGrupos(produtos);

        preencherFiltro(opcoesVendedores);

        $('linhas').innerHTML =
          vendedores.map(function (vendedor) {
            var metaAtingida = vendedor.percentualMeta == null
              ? '<span class="sem-meta">Sem meta</span>'
              : percentual.format(vendedor.percentualMeta);

            return (
              '<tr>' +
                '<td><strong>' +
                  escapar(vendedor.vendedor) +
                '</strong></td>' +
                '<td>' +
                  moeda.format(numero(vendedor.faturamento)) +
                '</td>' +
                '<td style="color:' +
                  corMeta(vendedor.percentualMeta) +
                  '">' +
                  metaAtingida +
                '</td>' +
              '</tr>'
            );
          }).join('') ||
          '<tr><td colspan="3" class="sem-meta">' +
            'Nenhuma venda encontrada no período.' +
          '</td></tr>';

        $('faturamentoTotal').textContent = moeda.format(
          numero(dados.totalFaturamento)
        );

        $('metaTotal').textContent = dados.totalMeta
          ? moeda.format(numero(dados.totalMeta))
          : 'Defina as metas';

        $('pctTotal').textContent = dados.percentualMeta == null
          ? '—'
          : percentual.format(dados.percentualMeta);

        $('pctTotal').style.color = corMeta(
          dados.percentualMeta
        );

        $('ponteiroTotal').style.transform =
          'rotate(' + angulo(dados.percentualMeta) + 'deg)';

        $('cardsGrupos').innerHTML =
          grupos.map(function (grupo) {
            return (
              '<article class="grupo-card">' +
                '<h3>' +
                  escapar(grupo.nome) +
                '</h3>' +
                velocimetroGrupo(grupo) +
              '</article>'
            );
          }).join('');

        $('estado').textContent = '';
        $('estado').className = 'estado';
      }

      function abrirMetas() {
        if (!dadosAtuais) {
          return;
        }

        var vendedores = dadosAtuais.opcoesVendedores ||
          dadosAtuais.vendedores ||
          [];

        $('listaMetas').innerHTML =
          vendedores.map(function (vendedor) {
            return (
              '<label class="linha-meta">' +
                '<strong>' +
                  escapar(vendedor.vendedor) +
                '</strong>' +
                '<input class="input-meta-vendedor" ' +
                  'type="text" ' +
                  'inputmode="decimal" ' +
                  'data-codigo="' +
                    escapar(vendedor.codigoVendedor) +
                  '" ' +
                  'data-vendedor="' +
                    escapar(vendedor.vendedor) +
                  '" ' +
                  'value="' +
                    numero(vendedor.meta) +
                  '">' +
              '</label>'
            );
          }).join('') ||
          '<div class="vazio">Nenhum vendedor encontrado.</div>';

        $('metaTotalEdicao').value = numero(
  dadosAtuais.totalMeta
);

        $('modalMetas').classList.add('aberto');
      }

      function fecharMetas() {
        $('modalMetas').classList.remove('aberto');
      }

      async function salvarMetas() {
        var botao = $('salvarMetas');

        var entradas = Array.from(
          document.querySelectorAll('.input-meta-vendedor')
        );

        var metas = entradas.map(function (input) {
          return {
            codigoVendedor:input.dataset.codigo,
            vendedor:input.dataset.vendedor,
            meta:numeroMeta(input.value)
          };
        });

        var metaEmpresa = numeroMeta(
  $('metaTotalEdicao').value
);

if (!Number.isFinite(metaEmpresa) || metaEmpresa < 0) {
  $('estado').textContent =
    'Informe uma meta total válida.';
  $('estado').className = 'estado erro';
  return;
}

        var invalida = metas.some(function (meta) {
          return !Number.isFinite(meta.meta) || meta.meta < 0;
        });

        if (invalida) {
          $('estado').textContent =
            'Existem metas com valor inválido.';
          $('estado').className = 'estado erro';
          return;
        }

        botao.disabled = true;
        botao.textContent = 'Salvando...';

        try {
        var respostaMetaEmpresa = await fetch(
  '/api/vendas/meta-empresa',
  {
    method:'PUT',
    headers:{
      'content-type':'application/json'
    },
    body:JSON.stringify({
      meta:metaEmpresa
    })
  }
);

var dadosMetaEmpresa =
  await respostaMetaEmpresa.json();

if (!respostaMetaEmpresa.ok) {
  throw Error(
    dadosMetaEmpresa.error ||
    'Não foi possível salvar a meta total.'
  );
}
          for (var indice = 0; indice < metas.length; indice++) {
            var resposta = await fetch(
              '/api/vendas/metas',
              {
                method:'PUT',
                headers:{
                  'content-type':'application/json'
                },
                body:JSON.stringify(metas[indice])
              }
            );

            var dados = await resposta.json();

            if (!resposta.ok) {
              throw Error(
                dados.error ||
                'Não foi possível salvar as metas.'
              );
            }
          }

          fecharMetas();
          await carregar();
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
          botao.textContent = 'Salvar metas';
        }
      }

      async function carregar() {
        var botao = $('atualizar');

        botao.disabled = true;
        $('estado').textContent =
          'Consultando vendas e metas...';

        $('estado').className = 'estado';

        try {
          var url =
            '/api/vendas/monitoramento?inicio=' +
            encodeURIComponent($('inicio').value) +
            '&fim=' +
            encodeURIComponent($('fim').value) +
            '&vendedor=' +
            encodeURIComponent($('vendedor').value);

          var resposta = await fetch(url);
          var dados = await resposta.json();

          if (!resposta.ok) {
            throw Error(
              dados.error ||
              'Não foi possível carregar o monitoramento.'
            );
          }

          render(dados);
        } catch (erro) {
          $('estado').textContent = erro.message;
          $('estado').className = 'estado erro';
        } finally {
          botao.disabled = false;
        }
      }

      $('filtros').addEventListener(
        'submit',
        function (evento) {
          evento.preventDefault();
          carregar();
        }
      );

      $('abrirMetas').addEventListener('click', abrirMetas);
      $('cancelarMetas').addEventListener('click', fecharMetas);
      $('salvarMetas').addEventListener('click', salvarMetas);
      $('modalMetas').addEventListener(
        'click',
        function (evento) {
          if (evento.target === $('modalMetas')) {
            fecharMetas();
          }
        }
      );

      var hoje = new Date();

      $('inicio').value = dataIso(
        new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          1
        )
      );

      $('fim').value = dataIso(hoje);

      carregar();
    })();
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff'
    }
  });
}
