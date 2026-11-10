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

     th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dce5ec;
      vertical-align: top;
    }

    th {
      background: #102f49;
      color: white;
      white-space: nowrap;
    }

    td {
      overflow-wrap: anywhere;
    }

    .validade-vencida {
      color: #b91c1c;
      font-weight: bold;
    }

    .validade-proxima {
      color: #855600;
      font-weight: bold;
    }

    #pagina-lista {
      display: inline-block;
      margin: 0 12px;
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
            <button id="salvar" type="button" hidden>
        Salvar mensagem
      </button>
            <p id="aviso-salvamento" class="aviso">
        Conferir não salva. Para registrar, clique em Salvar mensagem.
        Nenhum aviso de WhatsApp será enviado nesta etapa.
      </p>
    </section>

    <section>
      <h2>Validades em acompanhamento</h2>

      <button id="atualizar-lista" type="button">
        Atualizar lista
      </button>

      <p id="status-lista" role="status" aria-live="polite"></p>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Loja</th>
              <th>Produto</th>
              <th>Saldo</th>
              <th>Vencimento</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody id="linhas-validades"></tbody>
        </table>
      </div>

      <div>
        <button id="pagina-anterior" type="button" disabled>
          Anterior
        </button>

        <span id="pagina-lista">Página 1</span>

        <button id="pagina-proxima" type="button" disabled>
          Próxima
        </button>
      </div>
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
    const salvar = document.getElementById('salvar');
    const avisoSalvamento = document.getElementById('aviso-salvamento');

    let tentativa = null;
    let salvando = false;

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
      salvar.hidden = true;
      avisoSalvamento.textContent =
        'Conferir não salva. Nenhum aviso de WhatsApp é enviado nesta etapa.';
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
                    if (!tentativa || tentativa.mensagem !== texto) {
            tentativa = {
              mensagem: texto,
              chaveRequisicao: crypto.randomUUID(),
              salvo: false
            };
          }

          salvar.hidden = tentativa.salvo;
          salvar.disabled = false;
          salvar.textContent = 'Salvar mensagem';

          avisoSalvamento.textContent = tentativa.salvo
            ? 'Esta mensagem já foi salva nesta tentativa.'
            : 'Mensagem conferida, mas ainda não salva. Clique em Salvar mensagem para registrar.';

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

       salvar.addEventListener('click', async function() {
      if (!tentativa || tentativa.salvo || salvando) return;

      if (mensagem.value.trim() !== tentativa.mensagem) {
        status.textContent = 'A mensagem mudou. Confira novamente antes de salvar.';
        salvar.hidden = true;
        return;
      }

      salvando = true;
      salvar.disabled = true;
      botao.disabled = true;
      mensagem.disabled = true;

      status.textContent = 'Salvando mensagem...';
      avisoSalvamento.textContent = 'Aguarde a confirmação do salvamento.';

      const controlador = new AbortController();
      const limite = setTimeout(function() {
        controlador.abort();
      }, 20000);

      try {
        const resposta = await fetch('/api/validades/salvar', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mensagem: tentativa.mensagem,
            chaveRequisicao: tentativa.chaveRequisicao
          }),
          signal: controlador.signal
        });

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso !== true || !dados.id) {
          throw new Error(
            dados.error || 'O servidor não confirmou o salvamento.'
          );
        }

        tentativa.salvo = true;
        salvar.hidden = true;

        status.textContent = dados.jaExistia
          ? 'Salvamento confirmado. A tentativa já havia sido registrada.'
          : 'Mensagem salva com sucesso.';

        avisoSalvamento.textContent =
          'Registro: ' + dados.id +
          '. Mensagem e histórico salvos. Nenhum aviso de WhatsApp foi enviado.';

        mensagem.disabled = false;
        botao.disabled = false;
      } catch (erro) {
        const detalhe = erro.name === 'AbortError'
          ? 'O tempo de espera terminou.'
          : erro instanceof SyntaxError
            ? 'O servidor retornou uma resposta inesperada.'
            : erro.message || 'Falha de comunicação.';

        status.textContent = detalhe;

        avisoSalvamento.textContent =
          'O salvamento não foi confirmado. Clique em Tentar salvar novamente. ' +
          'A mesma chave será reutilizada para evitar duplicação. ' +
          'Não recarregue a página enquanto esta tentativa estiver pendente.';

        salvar.textContent = 'Tentar salvar novamente';
        salvar.disabled = false;

        // Mantém a mensagem bloqueada até confirmar esta tentativa.
        mensagem.disabled = true;
        botao.disabled = true;
      } finally {
        clearTimeout(limite);
        salvando = false;
      }
    });

        const linhasValidades = document.getElementById('linhas-validades');
    const statusLista = document.getElementById('status-lista');
    const atualizarLista = document.getElementById('atualizar-lista');
    const paginaAnterior = document.getElementById('pagina-anterior');
    const paginaProxima = document.getElementById('pagina-proxima');
    const paginaLista = document.getElementById('pagina-lista');

    let paginaAtual = 1;
    let temProxima = false;
    let carregandoLista = false;

    function dataBrasileira(valor) {
      return String(valor).split('-').reverse().join('/');
    }

    async function carregarValidades(pagina = 1) {
      if (carregandoLista) return;

      carregandoLista = true;
      atualizarLista.disabled = true;
      paginaAnterior.disabled = true;
      paginaProxima.disabled = true;

      statusLista.textContent = 'Carregando registros...';
      linhasValidades.replaceChildren();

      const controladorLista = new AbortController();
      const limiteLista = setTimeout(function() {
        controladorLista.abort();
      }, 20000);

      try {
        const resposta = await fetch(
          '/api/validades/listar?pagina=' + pagina,
          {
            credentials: 'same-origin',
            cache: 'no-store',
            signal: controladorLista.signal
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.error || 'Não foi possível carregar os registros.'
          );
        }

        if (!Array.isArray(dados.registros)) {
          throw new Error('O servidor retornou uma lista inválida.');
        }

        const nomesFaixas = {
          VENCIDO: 'Vencido',
          VENCE_HOJE: 'Vence hoje',
          PROXIMOS_5_DIAS: 'Vence nos próximos 5 dias',
          NO_PRAZO: 'Vence em mais de 5 dias'
        };

        const fragmento = document.createDocumentFragment();

        for (const registro of dados.registros) {
          const linha = document.createElement('tr');

          const valores = [
            registro.lojaNome,
            registro.produtoNome,
            registro.quantidadeRestante + ' un',
            dataBrasileira(registro.vencimento),
            nomesFaixas[registro.faixa] || 'Verificar'
          ];

          valores.forEach(function(valor, indice) {
            const celula = document.createElement('td');
            celula.textContent = String(valor);

            if (indice === 4) {
              if (registro.faixa === 'VENCIDO') {
                celula.className = 'validade-vencida';
              } else if (
                registro.faixa === 'VENCE_HOJE' ||
                registro.faixa === 'PROXIMOS_5_DIAS'
              ) {
                celula.className = 'validade-proxima';
              }
            }

            linha.append(celula);
          });

          fragmento.append(linha);
        }

        if (dados.registros.length === 0) {
          const linha = document.createElement('tr');
          const celula = document.createElement('td');

          celula.colSpan = 5;
          celula.textContent = 'Nenhum registro ativo nesta página.';

          linha.append(celula);
          fragmento.append(linha);
        }

        linhasValidades.replaceChildren(fragmento);

        paginaAtual = dados.pagina;
        temProxima = dados.temProximaPagina === true;
        paginaLista.textContent = 'Página ' + paginaAtual;

        statusLista.textContent =
          dados.registros.length + ' registro(s) nesta página. ' +
          'Referência: ' + dataBrasileira(dados.hoje) +
          ' — próximos vencimentos até ' +
          dataBrasileira(dados.limiteAviso) + '.';
      } catch (erro) {
        temProxima = false;

        statusLista.textContent = erro.name === 'AbortError'
          ? 'A consulta demorou demais. Clique em Atualizar lista.'
          : erro instanceof SyntaxError
            ? 'Resposta inesperada. Confira seu login e atualize a lista.'
            : erro.message || 'Não foi possível carregar os registros.';
      } finally {
        clearTimeout(limiteLista);
        carregandoLista = false;
        atualizarLista.disabled = false;
        paginaAnterior.disabled = paginaAtual <= 1;
        paginaProxima.disabled = !temProxima;
      }
    }

    atualizarLista.addEventListener('click', function() {
      carregarValidades(1);
    });

    paginaAnterior.addEventListener('click', function() {
      if (paginaAtual > 1) {
        carregarValidades(paginaAtual - 1);
      }
    });

    paginaProxima.addEventListener('click', function() {
      if (temProxima) {
        carregarValidades(paginaAtual + 1);
      }
    });

    carregarValidades();
    
  </script>
</body>
</html>`, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}
