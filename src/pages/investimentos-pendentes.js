export function investimentosPendentesPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Investimentos pendentes | Casa do Croissant</title>

  <style>
  :root {
    --navy:#102e49;
    --blue:#1f4e78;
    --bg:#f5f7f6;
    --ink:#142b3d;
    --border:#d5e0e8;
    --muted:#63716e;
    --red:#b42318;
  }

  * { box-sizing:border-box; }

  body {
    margin:0;
    min-height:100vh;
    background:var(--bg);
    color:var(--ink);
    font-family:Arial,sans-serif;
  }

  main {
    max-width:1440px;
    margin:auto;
    padding:8px 8px 38px;
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
    flex-shrink:0;
    gap:8px;
  }

  .nav-icone {
    display:grid;
    width:48px;
    height:48px;
    place-items:center;
    border-radius:50%;
    background:#fff;
    color:var(--navy);
    font-size:25px;
    font-weight:700;
    text-decoration:none;
    box-shadow:0 5px 15px #1730521c;
    transition:transform .15s,background .15s;
  }

  .nav-icone:hover {
    background:#edf3f9;
    transform:translateY(-2px);
  }

  .marca h1 {
    margin:0;
    color:var(--navy);
    font-size:30px;
  }

  .subtitulo {
    margin:5px 0 0;
    color:var(--muted);
    font-size:16px;
  }

  .mensagem {
    display:none;
    margin:16px 0 0;
    padding:12px 14px;
    border-radius:8px;
    font-size:14px;
  }

  .mensagem.erro {
    display:block;
    border:1px solid #f3c9c5;
    background:#fdecec;
    color:var(--red);
  }

  .tabela-area {
    margin-top:16px;
    overflow-x:auto;
    border:1px solid var(--border);
    border-radius:16px;
    background:#fff;
    box-shadow:0 6px 18px #17305214;
  }

  table {
    width:100%;
    min-width:1060px;
    border-collapse:collapse;
  }

  th,
  td {
    padding:13px 12px;
    border-bottom:1px solid #e2e9ee;
    text-align:left;
    font-size:13px;
  }

  th {
    background:var(--navy);
    color:#fff;
    font-size:11px;
    text-transform:uppercase;
  }

  tbody tr:hover { background:#f5f9fc; }

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
    height:38px;
    padding:0 10px;
    border:1px solid #c6d4e4;
    border-radius:7px;
    color:var(--ink);
    font:inherit;
    outline:none;
  }

  .acao input:focus {
    border-color:var(--blue);
    box-shadow:0 0 0 3px #1f4e7820;
  }

  .confirmar {
    padding:10px 12px;
    border:0;
    border-radius:7px;
    background:var(--navy);
    color:#fff;
    cursor:pointer;
    font:inherit;
    font-size:13px;
    font-weight:700;
  }

  .confirmar:hover { background:var(--blue); }

  .confirmar:disabled {
    opacity:.65;
    cursor:wait;
  }

  .vazio {
    display:none;
    padding:34px;
    color:var(--muted);
    text-align:center;
  }

  .vazio.visivel { display:block; }

  @media (max-width:700px) {
    main { padding:4px 6px 28px; }

    .topo {
      gap:12px;
      padding:16px;
    }

    .nav-icone {
      width:42px;
      height:42px;
      font-size:22px;
    }

    .marca h1 { font-size:23px; }

    .subtitulo { font-size:14px; }

    .tabela-area { border-radius:14px; }
  }
</style>
</head>

<body>
  <main>
    <div class="topo">
  <div class="navegacao-topo">
    <a
      class="nav-icone"
      href="/"
      onclick="if (window.history.length > 1) { window.history.back(); return false; }"
      aria-label="Voltar"
    >←</a>

    <a class="nav-icone" href="/" aria-label="Página inicial">⌂</a>
  </div>

  <div class="marca">
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
