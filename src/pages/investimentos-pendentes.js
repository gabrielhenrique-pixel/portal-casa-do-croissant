export function investimentosPendentesPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Investimentos pendentes | Casa do Croissant</title>

  <style>
    :root {
      --verde-escuro:#123d2d;
      --verde:#1b744d;
      --fundo:#f6f8f7;
      --texto:#183128;
      --vermelho:#b42318;
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
      max-width:1300px;
      margin:auto;
      padding:38px;
    }

    .topo {
      display:flex;
      align-items:center;
      gap:16px;
      margin-bottom:26px;
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

    .mensagem {
      display:none;
      margin:0 0 16px;
      padding:12px 14px;
      border-radius:7px;
      font-size:14px;
    }

    .mensagem.erro {
      display:block;
      background:#fdecec;
      color:var(--vermelho);
    }

    .tabela-area {
      overflow-x:auto;
      border:1px solid #dce8e1;
      border-radius:12px;
      background:#fff;
    }

    table {
      width:100%;
      min-width:1060px;
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
      color:#17476d;
      font-weight:700;
      white-space:nowrap;
    }

    .acao {
      display:flex;
      align-items:center;
      gap:8px;
    }

    .acao input {
      width:120px;
      padding:8px;
      border:1px solid #9ebbae;
      border-radius:6px;
      color:#183128;
      font:inherit;
    }

    .confirmar {
      padding:9px 12px;
      border:0;
      border-radius:6px;
      background:var(--verde);
      color:#fff;
      cursor:pointer;
      font:inherit;
      font-size:13px;
      font-weight:700;
    }

    .confirmar:hover {
      background:#125d3b;
    }

    .confirmar:disabled {
      opacity:.65;
      cursor:wait;
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

      h1 {
        font-size:22px;
      }
    }
  </style>
</head>

<body>
  <main>
    <div class="topo">
      <a
        class="voltar"
        href="/"
        onclick="if (window.history.length > 1) { window.history.back(); return false; }"
        aria-label="Voltar ao portal"
      >↩</a>

      <div>
        <h1>Investimentos pendentes</h1>
        <p class="subtitulo">
          Previsões que aguardam a confirmação do valor real.
        </p>
      </div>
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
            <th>Valor previsto</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Informar valor real</th>
          </tr>
        </thead>

        <tbody id="linhas"></tbody>
      </table>

      <div id="vazio" class="vazio">
        Nenhum investimento pendente.
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

      function mostrarErro(texto) {
        var mensagem = document.getElementById('mensagem');
        mensagem.textContent = texto;
        mensagem.className = 'mensagem erro';
      }

      function limparErro() {
        var mensagem = document.getElementById('mensagem');
        mensagem.textContent = '';
        mensagem.className = 'mensagem';
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
          var linha = document.createElement('tr');

          linha.innerHTML =
            '<td>' + dataBr(item.data_inicio) + '</td>' +
            '<td>' + dataBr(item.data_fim) + '</td>' +
            '<td>' + esc(item.rede) + '</td>' +
            '<td>' + esc(item.tipo) + '</td>' +
            '<td class="valor">' +
              moeda.format(Number(item.valor_previsto || 0)) +
            '</td>' +
            '<td>' + esc(item.responsavel) + '</td>' +
            '<td>' + esc(item.status) + '</td>' +
            '<td>' +
              '<div class="acao">' +
                '<input ' +
                  'id="valor-' + esc(item.id) + '" ' +
                  'type="text" ' +
                  'inputmode="decimal" ' +
                  'placeholder="0,00">' +
                '<button ' +
                  'class="confirmar" ' +
                  'type="button" ' +
                  'data-id="' + esc(item.id) + '">' +
                  'Confirmar' +
                '</button>' +
              '</div>' +
            '</td>';

          corpo.appendChild(linha);
        });
      }

      async function carregarPendentes() {
        limparErro();

        try {
          var resposta = await fetch('/api/investimentos/pendentes');
          var dados = await resposta.json();

          if (!resposta.ok) {
            throw new Error(
              dados.error || 'Não foi possível carregar os investimentos pendentes.'
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

      document.getElementById('linhas').addEventListener(
        'click',
        async function(evento) {
          var botao = evento.target.closest('.confirmar');

          if (!botao) {
            return;
          }

          var id = botao.getAttribute('data-id');
          var campo = document.getElementById('valor-' + id);
          var valorReal = campo.value.trim();

          if (!valorReal) {
            mostrarErro('Informe o valor real antes de confirmar.');
            campo.focus();
            return;
          }

          botao.disabled = true;
          botao.textContent = 'Salvando...';
          limparErro();

          try {
            var resposta = await fetch(
              '/api/investimentos/' +
                encodeURIComponent(id) +
                '/valor-real',
              {
                method:'PUT',
                headers:{
                  'content-type':'application/json'
                },
                body:JSON.stringify({
                  valorReal:valorReal
                })
              }
            );

            var dados = await resposta.json();

            if (!resposta.ok) {
              throw new Error(
                dados.error || 'Não foi possível salvar o valor real.'
              );
            }

            await carregarPendentes();
          } catch (erro) {
            mostrarErro(erro.message);
            botao.disabled = false;
            botao.textContent = 'Confirmar';
          }
        }
      );

      carregarPendentes();
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
