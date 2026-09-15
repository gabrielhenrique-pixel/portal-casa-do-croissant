export function investimentosListaPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Investimentos | Casa do Croissant</title>

  <style>
    :root {
      --verde-escuro:#123d2d;
      --verde:#1b744d;
      --fundo:#f6f8f7;
      --texto:#183128;
      --azul:#17476d;
      --linha:#dce8e1;
    }

    * {
      box-sizing:border-box;
    }

    body {
      margin:0;
      min-height:100vh;
      font-family:Arial,sans-serif;
      color:var(--texto);
      background:var(--fundo);
    }

    main {
      max-width:1320px;
      margin:auto;
      padding:38px;
    }

    .topo {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:18px;
      margin-bottom:26px;
    }

    .titulo {
      display:flex;
      align-items:center;
      gap:16px;
    }

    .voltar {
      display:grid;
      width:48px;
      height:48px;
      place-items:center;
      flex:0 0 48px;
      border-radius:50%;
      background:#0d4b2b;
      color:#fff;
      text-decoration:none;
      font-size:26px;
      font-weight:700;
    }

    .voltar:hover {
      background:#25724d;
    }

    h1 {
      margin:0;
      font-size:27px;
    }

    .subtitulo {
      margin:5px 0 0;
      color:#66746d;
    }

    .novo {
      display:inline-block;
      padding:12px 16px;
      border-radius:7px;
      background:var(--verde);
      color:#fff;
      font-size:14px;
      font-weight:700;
      text-decoration:none;
      white-space:nowrap;
    }

    .novo:hover {
      background:#125d3b;
    }

    .mensagem {
      display:none;
      margin:0 0 16px;
      padding:12px 14px;
      border-radius:7px;
      background:#fdecec;
      color:#b42318;
      font-size:14px;
    }

    .mensagem.visivel {
      display:block;
    }

    .tabela-area {
      overflow-x:auto;
      border:1px solid var(--linha);
      border-radius:12px;
      background:#fff;
    }

    table {
      width:100%;
      min-width:1100px;
      border-collapse:collapse;
    }

    th,
    td {
      padding:12px;
      border-bottom:1px solid #e5ece8;
      text-align:left;
      font-size:14px;
    }

    th {
      background:#eef6f1;
      color:#123d2d;
    }

    td.valor {
      color:var(--azul);
      font-weight:700;
      white-space:nowrap;
    }

    .tipo-previsto {
      color:#936c00;
      font-weight:700;
    }

    .tipo-real {
      color:#12623e;
      font-weight:700;
    }

    .vazio {
      display:none;
      padding:34px;
      color:#66746d;
      text-align:center;
    }

    .vazio.visivel {
      display:block;
    }

    @media (max-width:700px) {
      main {
        padding:24px 16px;
      }

      .topo {
        align-items:flex-start;
        flex-direction:column;
      }

      h1 {
        font-size:22px;
      }

      .novo {
        width:100%;
        text-align:center;
      }
    }
  </style>
</head>

<body>
  <main>
    <div class="topo">
      <div class="titulo">
        <a
          class="voltar"
          href="/"
          onclick="if (window.history.length > 1) { window.history.back(); return false; }"
          aria-label="Voltar ao portal"
        >↩</a>

        <div>
          <h1>Investimentos</h1>
          <p class="subtitulo">
            Histórico de investimentos previstos e realizados.
          </p>
        </div>
      </div>

      <a class="novo" href="/investimentos/novo">
        + Novo investimento
      </a>
    </div>

    <div id="mensagem" class="mensagem"></div>

    <section class="tabela-area">
      <table>
        <thead>
          <tr>
            <th>Data inicial</th>
            <th>Data final</th>
            <th>Rede</th>
            <th>Tipo</th>
            <th>Tipo do valor</th>
            <th>Valor previsto</th>
            <th>Valor real</th>
            <th>Responsável</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody id="linhas"></tbody>
      </table>

      <div id="vazio" class="vazio">
        Nenhum investimento lançado.
      </div>
    </section>
  </main>

  <script>
    (function() {
      var moeda = new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
      });

      function esc(valor) {
        var area = document.createElement('div');
        area.textContent = String(valor || '');
        return area.innerHTML;
      }

      function dataBr(data) {
        var partes = String(data || '').split('-');

        if (partes.length !== 3) {
          return '—';
        }

        return partes[2] + '/' + partes[1] + '/' + partes[0];
      }

      function valorOuTraco(valor) {
        var numero = Number(valor);

        return Number.isFinite(numero) && numero > 0
          ? moeda.format(numero)
          : '—';
      }

      function mostrarErro(texto) {
        var mensagem = document.getElementById('mensagem');
        mensagem.textContent = texto;
        mensagem.classList.add('visivel');
      }

      function renderizar(investimentos) {
        var corpo = document.getElementById('linhas');
        var vazio = document.getElementById('vazio');

        corpo.innerHTML = '';

        if (!investimentos.length) {
          vazio.classList.add('visivel');
          return;
        }

        vazio.classList.remove('visivel');

        investimentos.forEach(function(item) {
          var tipoValor = String(item.tipo_valor || '').toUpperCase();
          var classeTipo = tipoValor === 'REAL'
            ? 'tipo-real'
            : 'tipo-previsto';

          var textoTipo = tipoValor === 'REAL'
            ? 'Real'
            : 'Previsão';

          var linha = document.createElement('tr');

          linha.innerHTML =
            '<td>' + dataBr(item.data_inicio) + '</td>' +
            '<td>' + dataBr(item.data_fim) + '</td>' +
            '<td>' + esc(item.rede) + '</td>' +
            '<td>' + esc(item.tipo) + '</td>' +
            '<td class="' + classeTipo + '">' +
              textoTipo +
            '</td>' +
            '<td class="valor">' +
              valorOuTraco(item.valor_previsto) +
            '</td>' +
            '<td class="valor">' +
              valorOuTraco(item.valor_real) +
            '</td>' +
            '<td>' + esc(item.responsavel) + '</td>' +
            '<td>' + esc(item.status) + '</td>';

          corpo.appendChild(linha);
        });
      }

      async function carregar() {
        try {
          var resposta = await fetch('/api/investimentos');
          var dados = await resposta.json();

          if (!resposta.ok) {
            throw new Error(
              dados.error || 'Não foi possível carregar os investimentos.'
            );
          }

          renderizar(
            Array.isArray(dados.investimentos)
              ? dados.investimentos
              : []
          );
        } catch (erro) {
          mostrarErro(erro.message);
        }
      }

      carregar();
    })();
  </script>
</body>
</html>`, {
    headers: {
      'content-type':'text/html; charset=UTF-8',
      'x-content-type-options':'nosniff',
      'referrer-policy':'same-origin'
    }
  });
}
