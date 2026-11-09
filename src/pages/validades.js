export function validadesPage() {
  return new Response(String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Controle de validades</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: #f4f6f6;
      color: #102f49;
      font-family: Arial, sans-serif;
    }

    main {
      max-width: 1000px;
      margin: auto;
      padding: 20px;
    }

    header, section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 18px;
    }

    header {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    header a {
      color: #102f49;
      text-decoration: none;
    }

    h1 { font-size: 24px; margin: 0; }
    h2 { font-size: 20px; margin-top: 0; }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 10px;
    }

    textarea {
      width: 100%;
      min-height: 230px;
      padding: 14px;
      border: 1px solid #bccddd;
      border-radius: 8px;
      font: 16px/1.5 Arial, sans-serif;
      resize: vertical;
    }

    button {
      margin-top: 14px;
      background: #1769aa;
      color: white;
      border: 0;
      border-radius: 8px;
      padding: 13px 20px;
      font-size: 16px;
      cursor: pointer;
    }

    button:disabled { opacity: .6; cursor: wait; }
    p { line-height: 1.5; }
    .aviso { color: #775300; }

    dl {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
    }

    dt { font-weight: bold; }
    dd { margin: 0; overflow-wrap: anywhere; }
    li { margin-bottom: 8px; overflow-wrap: anywhere; }

    @media (max-width: 600px) {
      main { padding: 10px; }
      header, section { padding: 18px; }
      h1 { font-size: 20px; }
      dl { grid-template-columns: 1fr; gap: 6px; }
      dd { margin-bottom: 12px; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <a href="/" aria-label="Voltar ao portal">← Portal</a>
      <h1>CONTROLE DE VALIDADES</h1>
    </header>

    <section>
      <form id="formulario">
        <label for="mensagem">Mensagem recebida</label>
        <textarea
          id="mensagem"
          maxlength="10000"
          required
          placeholder="VALIDADE
Loja: Festval Agua Verde
Produto: Croissant
Quantidade: 18 un
Vencimento: 22/11/2026"
        ></textarea>

        <p>Uma loja, um produto e uma validade por mensagem.</p>

        <button id="conferir" type="submit">
          Conferir mensagem
        </button>
      </form>

      <p id="status" role="status" aria-live="polite"></p>
    </section>

    <section id="resultado" hidden>
      <h2 id="titulo-resultado"></h2>
      <div id="conteudo-resultado"></div>
      <p class="aviso">
        Esta etapa apenas confere a mensagem.
        Nenhum registro foi salvo e nenhum aviso foi enviado.
      </p>
    </section>
  </main>

  <script>
    const formulario = document.getElementById('formulario');
    const mensagem = document.getElementById('mensagem');
    const botao = document.getElementById('conferir');
    const status = document.getElementById('status');
    const resultado = document.getElementById('resultado');
    const titulo = document.getElementById('titulo-resultado');
    const conteudo = document.getElementById('conteudo-resultado');

    formulario.addEventListener('submit', async function(evento) {
      evento.preventDefault();

      const texto = mensagem.value.trim();

      if (!texto) {
        status.textContent = 'Cole uma mensagem para conferir.';
        return;
      }

      botao.disabled = true;
      mensagem.disabled = true;
      resultado.hidden = true;
      conteudo.replaceChildren();
      status.textContent = 'Conferindo mensagem...';

      const controlador = new AbortController();
      const limite = setTimeout(function() {
        controlador.abort();
      }, 20000);

      try {
        const resposta = await fetch('/api/validades/interpretar', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ mensagem: texto }),
          signal: controlador.signal
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.error || 'Não foi possível conferir.');
        }

        if (dados.status === 'VALIDO') {
          titulo.textContent = 'Mensagem válida';

          const lista = document.createElement('dl');

          const campos = [
            ['Loja', dados.dados.lojaNome],
            ['Produto', dados.dados.produtoNome],
            ['Quantidade', dados.dados.quantidade + ' un'],
            ['Vencimento', dados.dados.vencimento.split('-').reverse().join('/')]
          ];

          for (const [nome, valor] of campos) {
            const termo = document.createElement('dt');
            const descricao = document.createElement('dd');

            termo.textContent = nome;
            descricao.textContent = String(valor);

            lista.append(termo, descricao);
          }

          conteudo.append(lista);
        } else {
          titulo.textContent = dados.status === 'IGNORAR'
            ? 'Mensagem fora do padrão'
            : 'Mensagem precisa de revisão';

          const lista = document.createElement('ul');

          for (const motivo of dados.motivos || []) {
            const item = document.createElement('li');
            item.textContent = motivo;
            lista.append(item);
          }

          conteudo.append(lista);
        }

        resultado.hidden = false;
        status.textContent = 'Conferência concluída.';
      } catch (erro) {
        status.textContent = erro.name === 'AbortError'
          ? 'A consulta demorou demais. Tente novamente.'
          : erro instanceof SyntaxError
            ? 'Resposta inesperada. Atualize a página e confira seu login.'
            : erro.message || 'Falha na consulta. Tente novamente.';
      } finally {
        clearTimeout(limite);
        botao.disabled = false;
        mensagem.disabled = false;
      }
    });

    mensagem.addEventListener('input', function() {
      resultado.hidden = true;
      status.textContent = '';
    });
  </script>
</body>
</html>`, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}
