export function comissoesDemonstrativoPage() {
  return new Response(String.raw`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Demonstrativo de Comissões</title>

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
    flex-shrink: 0;
  }

  .nav-icone {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: white;
    color: #102e49;
    font: 700 25px Arial, sans-serif;
    text-decoration: none;
    box-shadow: 0 5px 15px #1730521c;
    cursor: pointer;
  }

  h1 { margin: 0; font-size: 28px; }

  .filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: end;
    margin-top: 16px;
    padding: 18px 26px;
    border-radius: 14px;
    background: white;
    box-shadow: 0 6px 18px #17305214;
  }

  label {
    display: grid;
    gap: 7px;
    color: #17375f;
    font-size: 12px;
    font-weight: 700;
  }

  input, select {
    height: 40px;
    border: 1px solid #c6d4e4;
    border-radius: 7px;
    padding: 8px 12px;
    color: #102e49;
    background: white;
    font: 14px Arial, sans-serif;
  }

  #vendedor { min-width: 250px; }

  .selo {
    margin-left: auto;
    align-self: center;
    padding: 8px 12px;
    border-radius: 7px;
    background: #fff4d8;
    color: #805a13;
    font-weight: 700;
    font-size: 12px;
  }

  #status {
    min-height: 20px;
    margin: 12px 4px;
    white-space: pre-wrap;
  }

  #status.error { color: #b42318; }

  .cards {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }

  .card {
    padding: 20px 16px;
    border: 1px solid #d5dfe8;
    border-radius: 13px;
    background: white;
    box-shadow: 0 3px 8px #1730520c;
  }

  .card span {
    display: block;
    min-height: 32px;
    color: #526b80;
    font-size: 11px;
    text-transform: uppercase;
    line-height: 1.4;
  }

  .card strong {
    display: block;
    margin-top: 10px;
    font-size: 23px;
    overflow-wrap: anywhere;
  }

  .card.red strong { color: #b42318; }

  .card.total {
    background: #102e49;
    border-color: #102e49;
  }

  .card.total span,
  .card.total strong { color: white; }

  .informacoes {
    margin: 16px 4px;
    color: #607486;
    font-size: 12px;
    line-height: 1.6;
  }

  #aviso {
    margin: 12px 0;
    padding: 12px 16px;
    border: 1px solid #ead7a0;
    border-radius: 8px;
    background: #fff8e8;
    color: #785a1c;
    line-height: 1.5;
  }

  .tabela {
    overflow: auto;
    max-height: 650px;
    border: 1px solid #d5dfe8;
    border-radius: 10px;
    background: white;
    margin-top: 16px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th, td {
    padding: 11px 12px;
    text-align: left;
    border-bottom: 1px solid #e1e7ed;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: white;
    background: #102e49;
  }

  tbody tr:nth-child(even) { background: #f5f8fa; }
  tbody tr:hover { background: #edf5fc; }
  .numero { text-align: right; }
  .negativo { color: #b42318; }

  [hidden] { display: none !important; }

  @media(max-width:1050px) {
    .cards { grid-template-columns: repeat(3, 1fr); }
    h1 { font-size: 23px; }
  }

  @media(max-width:650px) {
    .cards { grid-template-columns: 1fr 1fr; }
    .card.total { grid-column: 1 / -1; }
    .card strong { font-size: 20px; }
    .topo { padding: 16px 12px; gap: 12px; }
    h1 { font-size: 18px; }
    .nav-icone { width: 40px; height: 40px; }
    .filtros { padding: 16px; }
    #vendedor { min-width: 0; width: 100%; }
    #campo-vendedor { width: 100%; }
    .selo { margin-left: 0; }
  }
</style>
</head>

<body>
<main>
  <header class="topo">
    <nav class="navegacao">
      <button id="back" class="nav-icone" type="button"
        title="Voltar" aria-label="Voltar">←</button>
      <a class="nav-icone" href="/"
        title="Página inicial" aria-label="Página inicial">⌂</a>
    </nav>
    <h1>DEMONSTRATIVO DE COMISSÕES</h1>
  </header>

  <div class="filtros">
    <label>
      MÊS DA BAIXA
      <input id="mes" type="month" min="2026-10" max="2100-12">
    </label>

    <label id="campo-vendedor" hidden>
      VENDEDOR
      <select id="vendedor"></select>
    </label>

    <span class="selo">PRÉVIA — NÃO FECHADO</span>
  </div>

  <p id="status" role="status" aria-live="polite"></p>

  <div class="cards">
    <div class="card">
      <span>Vendas — notas com baixa</span>
      <strong id="vendas">—</strong>
    </div>

    <div class="card red">
      <span>Devoluções — notas com baixa</span>
      <strong id="devolucoes">—</strong>
    </div>

    <div class="card">
      <span>Comissão das vendas</span>
      <strong id="comissao">—</strong>
    </div>

    <div class="card red">
      <span>Perda de comissão por devoluções</span>
      <strong id="perda">—</strong>
    </div>

    <div class="card total">
      <span>Comissão líquida</span>
      <strong id="liquida">—</strong>
    </div>
  </div>

  <div class="informacoes" hidden>
    <div id="atualizacao"></div>
    <div id="contagem"></div>
    <div>
      Período pela data da baixa. Vendas e devoluções mostram o valor
      integral das notas com baixa no mês, sem repetir a mesma nota.
      As comissões incluem somente os movimentos calculados.
    </div>
    <div>
      Comissões por movimento são exibidas com quatro casas decimais;
      os cards mostram os totais com duas.
    </div>
  </div>

  <div id="aviso" role="status" hidden></div>

  <div class="tabela">
    <table aria-label="Detalhamento de comissões">
      <thead>
        <tr>
          <th>Baixa</th>
          <th>Nota</th>
          <th>Financeiro</th>
          <th>Vendedor</th>
          <th>Cliente</th>
          <th>Movimento</th>
          <th class="numero">Valor da nota</th>
          <th class="numero">Base comissão</th>
          <th class="numero">%</th>
          <th class="numero">Comissão</th>
          <th>Regra</th>
          <th>Situação</th>
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

  const quatroCasas = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });

  const percentual = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const situacoes = {
    CALCULADO_PREVIA: 'Calculado — prévia',
    SEM_COMISSAO: 'Sem comissão',
    FORA_DESTA_ETAPA: 'Fora desta etapa',
    SEM_CADASTRO: 'Sem cadastro',
    CADASTRO_INATIVO: 'Cadastro inativo',
    CONFERIR_DADOS: 'Conferir dados',
    CONFERIR_PARCELAMENTO: 'Conferir parcelamento',
    CONFERIR_CADASTRO: 'Conferir cadastro',
    CONFERIR_REDE: 'Conferir rede',
    CONFERIR_BASE: 'Conferir base',
    CONFERIR_BAIXA: 'Conferir baixa'
  };

  let ocupado = false;

  function moeda(valor) {
    return valor === null || valor === undefined
      ? '—'
      : dinheiro.format(Number(valor));
  }

  function dataCurta(valor) {
    return valor ? valor.split('-').reverse().join('/') : '—';
  }

  function dataHora(valor) {
    return valor
      ? new Date(valor).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo'
        })
      : '—';
  }

  function mensagem(texto, erro = false) {
    $('status').textContent = texto;
    $('status').className = erro ? 'error' : '';
  }

  function limparResultado() {
    ['vendas', 'devolucoes', 'comissao', 'perda', 'liquida']
      .forEach(id => $(id).textContent = '—');

    $('linhas').replaceChildren();
    $('atualizacao').textContent = '';
    $('contagem').textContent = '';
    $('aviso').hidden = true;
  }

  function opcao(valor, texto) {
    const item = document.createElement('option');
    item.value = valor;
    item.textContent = texto;
    $('vendedor').append(item);
  }

  function desenhar(dados) {
    const resumo = dados.resumo;

    $('vendas').textContent = moeda(resumo.vendas);
    $('devolucoes').textContent = moeda(resumo.devolucoes);
    $('comissao').textContent = moeda(resumo.comissaoVendas);
    $('perda').textContent = moeda(resumo.perdaDevolucoes);
    $('liquida').textContent = moeda(resumo.comissaoLiquida);

    $('vendedor').replaceChildren();

    if (dados.podeVerTodos) {
      opcao('', 'Todos os vendedores');
    }

    dados.vendedores.forEach(vendedor => {
      opcao(vendedor.codigo, vendedor.codigo + ' — ' + vendedor.nome);
    });

    if (
      dados.vendedorSelecionado &&
      ![...$('vendedor').options].some(
        item => item.value === dados.vendedorSelecionado
      )
    ) {
      opcao(dados.vendedorSelecionado, 'Sem movimentos no período');
    }

    $('vendedor').value = dados.vendedorSelecionado || '';
    $('campo-vendedor').hidden = false;
    $('vendedor').disabled = !dados.podeVerTodos;

    $('atualizacao').textContent =
      'Dados importados em ' + dataHora(dados.dadosImportadosEm) +
      ' | Prévia consultada em ' + dataHora(dados.calculadoEm);

    $('contagem').textContent =
      resumo.movimentos + ' movimentos | ' +
      resumo.calculados + ' calculados | ' +
      resumo.semComissao + ' sem comissão';

    const avisos = [];

    if (resumo.pendentes) {
      avisos.push(
        resumo.pendentes +
        ' movimento(s) pendente(s), não incluído(s) na comissão.'
      );
    }

    if (resumo.foraDaEtapa) {
      avisos.push(
        resumo.foraDaEtapa +
        ' movimento(s) fora desta etapa, não incluído(s) na comissão.'
      );
    }

    $('aviso').textContent = avisos.join(' ');
    $('aviso').hidden = avisos.length === 0;

    const fragmento = document.createDocumentFragment();

    dados.linhas.forEach(linha => {
      const tr = document.createElement('tr');

      const regra = linha.regraAplicada === 'padrao'
        ? 'Padrão'
        : linha.regraAplicada === 'sem_comissao'
          ? 'Sem comissão'
          : linha.regraAplicada || '—';

      const valores = [
        dataCurta(linha.dataBaixa),
        linha.numeroNota,
        linha.financeiroId,
        linha.vendedorNome,
        linha.clienteNome,
        linha.tipo === 'venda' ? 'Venda' : 'Devolução',
        moeda(linha.valorNota),
        moeda(linha.baseCalculo),
        linha.percentual === null || linha.percentual === undefined
          ? '—'
          : percentual.format(linha.percentual) + '%',
        linha.comissao === null || linha.comissao === undefined
          ? '—'
          : quatroCasas.format(Number(linha.comissao)),
        regra,
        situacoes[linha.status] || linha.status
      ];

      valores.forEach((valor, indice) => {
        const td = document.createElement('td');
        td.textContent = valor;

        if (indice >= 6 && indice <= 9) {
          td.classList.add('numero');
        }

        if (indice === 9 && Number(linha.comissao) < 0) {
          td.classList.add('negativo');
        }

        if (indice === 11 && linha.motivo) {
          td.title = linha.motivo;
        }

        tr.append(td);
      });

      fragmento.append(tr);
    });

    if (!dados.linhas.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 12;
      td.textContent = 'Nenhum movimento encontrado para este filtro.';
      tr.append(td);
      fragmento.append(tr);
    }

    $('linhas').replaceChildren(fragmento);
  }

  async function carregar() {
    if (ocupado) return;

    const mes = $('mes').value;

    if (!mes || !$('mes').checkValidity()) {
      $('mes').reportValidity();
      return;
    }

    ocupado = true;

    const vendedor = $('vendedor').value;
    $('mes').disabled = true;
    $('vendedor').disabled = true;

    limparResultado();
    mensagem('Carregando demonstrativo...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    let permiteSelecionar = false;

    try {
      const parametros = new URLSearchParams({ mes });

      if (vendedor) parametros.set('vendedor', vendedor);

      const response = await fetch(
        '/api/comissoes/demonstrativo?' + parametros.toString(),
        {
          credentials: 'same-origin',
          signal: controller.signal
        }
      );

      if (!(response.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('Resposta inesperada. Confira se sua sessão está ativa.');
      }

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.error || 'Não foi possível carregar o demonstrativo.');
      }

      permiteSelecionar = dados.podeVerTodos;
      desenhar(dados);
      mensagem('');
    } catch (erro) {
      mensagem(
        erro.name === 'AbortError'
          ? 'A consulta demorou demais. Atualize a página para tentar novamente.'
          : erro.message,
        true
      );
    } finally {
      clearTimeout(timer);
      ocupado = false;
      $('mes').disabled = false;
      $('vendedor').disabled = !permiteSelecionar;
    }
  }

  $('back').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.href = '/';
  });

  $('mes').value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit'
  }).format(new Date());

  $('mes').addEventListener('change', carregar);
  $('vendedor').addEventListener('change', carregar);

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
