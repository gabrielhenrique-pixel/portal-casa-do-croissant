export function comissoesFechamentoPage() {
  return new Response(String.raw`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fechamento de Comissões</title>

<style>
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #f5f7f6;
    color: #102e49;
    font: 14px Arial, sans-serif;
  }

  main {
    max-width: 1440px;
    margin: auto;
    padding: 6px 8px 38px;
  }

  .topo {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 34px;
    border-radius: 18px;
    background: white;
    box-shadow: 0 8px 22px #1730521c;
  }

  .navegacao {
    display: flex;
    gap: 8px;
  }

  .nav-icone {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: white;
    color: #102e49;
    font: 700 25px Arial, sans-serif;
    text-decoration: none;
    box-shadow: 0 5px 15px #1730521c;
    cursor: pointer;
  }

  h1 {
    margin: 0;
    font-size: 28px;
  }

  .filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 16px;
    padding: 18px 26px;
    border-radius: 14px;
    background: white;
  }

  label {
    display: grid;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
  }

  input {
    height: 40px;
    padding: 8px 12px;
    border: 1px solid #c6d4e4;
    border-radius: 7px;
    color: #102e49;
    background: white;
    font: 14px Arial, sans-serif;
  }

  #pesquisa { width: 300px; }

  #status {
    margin: 12px 4px;
    min-height: 20px;
  }

  #status.erro { color: #b42318; }

  #aviso {
    margin: 12px 0;
    padding: 12px 16px;
    border: 1px solid #ead7a0;
    border-radius: 8px;
    background: #fff8e8;
    color: #785a1c;
  }

  .tabela {
    overflow: auto;
    max-height: 650px;
    border: 1px solid #d5dfe8;
    border-radius: 10px;
    background: white;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e1e7ed;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: #102e49;
    color: white;
  }

  tbody tr:nth-child(even) { background: #f5f8fa; }
  tbody tr:hover { background: #edf5fc; }

  .numero { text-align: right; }
  .negativo { color: #b42318; }

  .situacao {
    display: inline-block;
    padding: 6px 9px;
    border-radius: 6px;
    background: #edf2f7;
    color: #40536a;
    font-weight: 700;
  }

  .situacao.EM_ABERTO {
    background: #e7f1fc;
    color: #1769aa;
  }

  .situacao.FECHADO {
    background: #e5f6eb;
    color: #138545;
  }

  .situacao.PENDENTE {
    background: #fff4d8;
    color: #805a13;
  }

  [hidden] { display: none !important; }

  @media(max-width:650px) {
    .topo { padding: 16px 12px; gap: 12px; }
    h1 { font-size: 18px; }
    .nav-icone { width: 40px; height: 40px; }
    .filtros { padding: 16px; }
    #pesquisa { width: 100%; }
  }

  .botao-fechar {
    border: 0;
    border-radius: 7px;
    padding: 9px 14px;
    color: white;
    background: #138545;
    font-weight: 700;
    cursor: pointer;
  }

  .botao-fechar:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
  
</style>
</head>

<body>
<main>
  <header class="topo">
    <nav class="navegacao">
      <button id="voltar" class="nav-icone" type="button"
        title="Voltar" aria-label="Voltar">←</button>
      <a class="nav-icone" href="/" title="Página inicial"
        aria-label="Página inicial">⌂</a>
    </nav>

    <h1>FECHAMENTO DE COMISSÕES</h1>
  </header>

  <div class="filtros">
    <label>
      MÊS DA BAIXA
      <input id="mes" type="month" min="2026-10" max="2100-12">
    </label>

    <label>
      VENDEDOR
      <input id="pesquisa" type="search"
        placeholder="Pesquisar código ou nome">
    </label>
  </div>

  <p id="status" role="status" aria-live="polite"></p>
  <div id="aviso" role="status" hidden></div>

  <div class="tabela">
    <table aria-label="Fechamentos de comissões por vendedor">
      <thead>
        <tr>
          <th>Código</th>
          <th>Vendedor</th>
          <th class="numero">Movimentos</th>
          <th class="numero">Comissão das vendas</th>
          <th class="numero">Perda por devoluções</th>
          <th class="numero">Comissão líquida</th>
          <th>Situação</th>
          <th>Observação</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody id="linhas"></tbody>
    </table>
  </div>
</main>

<script>
  const $ = id => document.getElementById(id);
  const dinheiro = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const situacoes = {
    EM_ABERTO: 'Em aberto',
    FECHADO: 'Fechado',
    PENDENTE: 'Pendente',
    FORA_DA_ETAPA: 'Fora desta etapa',
    SEM_COMISSAO: 'Sem comissão'
  };

  let linhas = [];
  let ocupado = false;
  let podeFechar = false;
  let bloqueado = false;

  function moeda(valor) {
    return valor === null || valor === undefined
      ? '—'
      : dinheiro.format(Number(valor));
  }

  function mensagem(texto, erro = false) {
    $('status').textContent = texto;
    $('status').className = erro ? 'erro' : '';
  }

  function desenhar() {
    const pesquisa = $('pesquisa').value.trim().toLocaleLowerCase('pt-BR');

    const filtradas = linhas.filter(item =>
      (item.codigo + ' ' + item.vendedor)
        .toLocaleLowerCase('pt-BR')
        .includes(pesquisa)
    );

    const fragmento = document.createDocumentFragment();

    for (const item of filtradas) {
      const tr = document.createElement('tr');

      const valores = [
        item.codigo,
        item.vendedor,
        item.movimentos,
        moeda(item.comissaoVendas),
        moeda(item.perdaDevolucoes),
        moeda(item.comissaoLiquida),
        situacoes[item.situacao] || item.situacao,
        item.fechadoEm
          ? 'Fechado em ' + new Date(item.fechadoEm).toLocaleString(
              'pt-BR',
              { timeZone: 'America/Sao_Paulo' }
            )
          : item.motivo
      ];

      valores.forEach((valor, indice) => {
        const td = document.createElement('td');

        if (indice === 6) {
          const selo = document.createElement('span');
          selo.className = 'situacao ' + item.situacao;
          selo.textContent = valor;
          td.append(selo);
        } else {
          td.textContent = valor ?? '';
        }

        if (indice >= 2 && indice <= 5) {
          td.classList.add('numero');
        }

        if (
          indice === 5 &&
          item.comissaoLiquida !== null &&
          Number(item.comissaoLiquida) < 0
        ) {
          td.classList.add('negativo');
        }

        tr.append(td);
      });

            const tdAcao = document.createElement('td');

      if (podeFechar && item.situacao === 'EM_ABERTO') {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'botao-fechar';
        botao.textContent = 'Fechar';
        botao.title = 'Conferir e fechar comissão deste vendedor';
        botao.disabled = ocupado || bloqueado;

        botao.addEventListener('click', () => confirmarFechamento(item));

        tdAcao.append(botao);
      } else {
        tdAcao.textContent = '—';
      }

      tr.append(tdAcao);

      fragmento.append(tr);
    }

    if (!filtradas.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 8;
      td.colSpan = 9;
      td.textContent = 'Nenhum vendedor encontrado.';
      tr.append(td);
      fragmento.append(tr);
    }

    $('linhas').replaceChildren(fragmento);
  }

  async function carregar() {
    if (ocupado) return;

    if (!$('mes').value || !$('mes').checkValidity()) {
      $('mes').reportValidity();
      return;
    }

    ocupado = true;
    $('mes').disabled = true;
    linhas = [];
    $('linhas').replaceChildren();
    $('aviso').hidden = true;

    mensagem('Consultando comissões...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const parametros = new URLSearchParams({
        mes: $('mes').value
      });

      const resposta = await fetch(
        '/api/comissoes/fechamentos?' + parametros.toString(),
        {
          credentials: 'same-origin',
          signal: controller.signal
        }
      );

      if (!(resposta.headers.get('content-type') || '')
        .includes('application/json')) {
        throw new Error('Resposta inesperada. Confira sua sessão.');
      }

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível consultar.');
      }

      linhas = dados.linhas;
      podeFechar = Boolean(dados.permissoes?.fechar);
      desenhar();

      $('aviso').textContent = dados.aviso || '';
      $('aviso').hidden = !dados.aviso;
      mensagem('');
    } catch (erro) {
      mensagem(
        erro.name === 'AbortError'
          ? 'A consulta demorou demais. Atualize a página.'
          : erro.message,
        true
      );
    } finally {
      clearTimeout(timer);
      ocupado = false;
      $('mes').disabled = false;
    }
  }

    async function enviarAcao(dados) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(
        '/api/comissoes/fechamentos/acao',
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados),
          signal: controller.signal
        }
      );

      if (
        !(response.headers.get('content-type') || '')
          .includes('application/json')
      ) {
        throw new Error('Resposta inesperada. Confira sua sessão.');
      }

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || 'Não foi possível continuar.');
      }

      return resultado;
    } finally {
      clearTimeout(timer);
    }
  }

  async function confirmarFechamento(item) {
    if (ocupado || bloqueado || !podeFechar) return;

    ocupado = true;
    $('mes').disabled = true;
    desenhar();
    mensagem('Conferindo os valores antes do fechamento...');

    const mes = $('mes').value;

    try {
      const conferencia = await enviarAcao({
        acao: 'preparar',
        mes,
        vendedor: item.codigo
      });

      const valorExato = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });

      const confirmar = window.confirm(
        'FECHAR COMISSÃO\n\n' +
        'Vendedor: ' + conferencia.nome + '\n' +
        'Mês: ' + mes + '\n' +
        'Movimentos: ' + conferencia.resumo.movimentos + '\n\n' +
        'Comissão das vendas: ' +
          moeda(conferencia.resumo.comissaoVendas) + '\n' +
        'Perda por devoluções: ' +
          moeda(conferencia.resumo.perdaDevolucoes) + '\n' +
        'Comissão líquida: ' +
          moeda(conferencia.resumo.comissaoLiquida) + '\n' +
        'Valor preservado: ' +
          valorExato.format(Number(conferencia.resumo.comissaoLiquida)) +
          '\n\n' +
        'Última importação: ' +
          new Date(conferencia.dadosImportadosEm).toLocaleString(
            'pt-BR',
            { timeZone: 'America/Sao_Paulo' }
          ) +
          '\n\n' +
        'Os valores serão guardados para este mês.\n' +
        'Esta ação não registra pagamento.\n' +
        'A reabertura ainda não está disponível nesta etapa.\n\n' +
        'Deseja confirmar?'
      );

      if (!confirmar) {
        mensagem('');
        return;
      }

      mensagem('Gravando fechamento...');

      await enviarAcao({
        acao: 'confirmar',
        mes,
        vendedor: item.codigo,
        assinatura: conferencia.assinatura,
        operacaoId: crypto.randomUUID()
      });

      bloqueado = true;
      mensagem('Fechamento registrado. Atualizando a tela...');
      location.reload();
    } catch (erro) {
      bloqueado = true;

      mensagem(
        (
          erro.name === 'AbortError'
            ? 'A solicitação demorou demais.'
            : erro.message
        ) +
        ' Atualize a página para conferir a situação antes de tentar novamente.',
        true
      );
    } finally {
      ocupado = false;
      $('mes').disabled = bloqueado;
      desenhar();
    }
  }

  $('voltar').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.href = '/';
  });

  $('mes').value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit'
  }).format(new Date());

  $('mes').addEventListener('change', carregar);
  $('pesquisa').addEventListener('input', desenhar);

  carregar();
</script>
</body>
</html>
  `, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
