export function investimentosListaPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Investimentos | Casa do Croissant</title>

  <style>
   :root{
  --navy:#102e49;
  --blue:#1f4e78;
  --bg:#edf4fa;
  --text:#142b3d;
  --line:#cfdce8;
  --green:#0a6237;
  --red:#b42318;
}

*{box-sizing:border-box}

body{
  margin:0;
  min-height:100vh;
  font-family:Arial,sans-serif;
  color:var(--text);
  background:var(--bg);
}

main{
  max-width:1540px;
  margin:auto;
  padding:4px 0 18px;
}

.topo{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  padding:18px 30px;
  border-radius:0 0 16px 16px;
  background:#fff;
  box-shadow:0 5px 18px #1231;
}

.titulo{
  display:flex;
  align-items:center;
  gap:10px;
}

.voltar,
.inicio{
  display:grid;
  place-items:center;
  width:48px;
  height:48px;
  border-radius:50%;
  background:#fff;
  color:var(--navy);
  box-shadow:0 4px 12px #1232;
  text-decoration:none;
  font-size:23px;
}

h1{
  margin:0 0 0 8px;
  font-size:29px;
  color:var(--navy);
  text-transform:uppercase;
}

.novo{
  display:inline-block;
  padding:12px 16px;
  border-radius:7px;
  background:var(--navy);
  color:#fff;
  font-size:14px;
  font-weight:700;
  text-decoration:none;
  white-space:nowrap;
}

.novo:hover{background:var(--blue)}

.excluir{
  padding:8px 11px;
  border:0;
  border-radius:6px;
  background:var(--red);
  color:#fff;
  cursor:pointer;
  font:inherit;
  font-size:12px;
  font-weight:700;
}

.excluir:hover{background:#8f1c13}
.excluir:disabled{opacity:.65;cursor:wait}

.mensagem{
  display:none;
  margin:12px 8px;
  padding:12px 14px;
  border-radius:7px;
  background:#fdecec;
  color:var(--red);
  font-size:14px;
}

.mensagem.visivel{display:block}

.tabela-area{
  margin:12px 8px;
  overflow-x:auto;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
  box-shadow:0 3px 11px #1231;
}

table{
  width:100%;
  min-width:1100px;
  border-collapse:collapse;
}

th,
td{
  padding:11px 10px;
  border-bottom:1px solid #dce5ed;
  text-align:left;
  font-size:13px;
}

th{
  background:var(--blue);
  color:#fff;
  font-size:12px;
  white-space:nowrap;
}

tbody tr:nth-child(even){background:#f8fbfe}
tbody tr:hover{background:#e8f3fb}

td.valor{
  color:var(--navy);
  font-weight:700;
  white-space:nowrap;
}

.tipo-previsto{color:#936c00;font-weight:700}
.tipo-real{color:var(--green);font-weight:700}

.vazio{
  display:none;
  padding:34px;
  color:#64748b;
  text-align:center;
}

.vazio.visivel{display:block}

@media(max-width:700px){
  main{padding-top:0}

  .topo{
    padding:14px;
    align-items:flex-start;
    flex-wrap:wrap;
  }

  h1{font-size:21px}

  .novo{
    width:100%;
    text-align:center;
  }

  .tabela-area,
  .mensagem{
    margin-left:6px;
    margin-right:6px;
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
      aria-label="Voltar"
    >←</a>

    <a class="inicio" href="/" aria-label="Página inicial">⌂</a>

    <h1>Investimentos</h1>
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
            <th>Ações</th>
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
            '<td>' + esc(item.status) + '</td>' +
            '<td>' +
            '<button ' +
            'class="excluir" ' +
            'type="button" ' +
            'data-id="' + esc(item.id) + '">' +
            'Excluir' +
         '</button>' +
       '</td>';

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

      document.getElementById('linhas').addEventListener(
  'click',
  async function(evento) {
    var botao = evento.target.closest('.excluir');

    if (!botao) {
      return;
    }

    var id = botao.getAttribute('data-id');

    if (!window.confirm(
      'Excluir este investimento? Esta ação não pode ser desfeita.'
    )) {
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Excluindo...';

    try {
      var resposta = await fetch(
        '/api/investimentos/' + encodeURIComponent(id),
        { method:'DELETE' }
      );

      var dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Não foi possível excluir o investimento.'
        );
      }

      await carregar();
    } catch (erro) {
      mostrarErro(erro.message);
      botao.disabled = false;
      botao.textContent = 'Excluir';
    }
  }
);

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
