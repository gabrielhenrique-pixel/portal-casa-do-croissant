export function comissoesVendedoresPage() {
  return new Response(String.raw`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vendedores / Comissões</title>

<style>
  :root {
    --navy: #102e49;
    --blue: #1769aa;
    --green: #168447;
    --border: #d5dfe8;
    --background: #f5f7f6;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--background);
    color: var(--navy);
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
    background: rgba(255,255,255,.92);
    box-shadow: 0 8px 22px #1730521c;
  }

  .navegacao-topo {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .nav-icone {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: white;
    box-shadow: 0 5px 15px #1730521c;
    color: var(--navy);
    font-size: 25px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }

  .nav-icone:hover { background: #edf3f9; }

  h1 {
    margin: 0;
    font-size: 30px;
    color: var(--navy);
  }

  .barra {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
    padding: 14px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 6px 18px #17305214;
  }

  button, input, select { font: inherit; }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 7px;
    padding: 10px 16px;
  }

  button:disabled {
    opacity: .5;
    cursor: default;
  }

  .novo {
    width: 42px;
    height: 42px;
    padding: 0;
    background: var(--green);
    color: white;
    font-size: 30px;
    line-height: 1;
  }

  .editar {
    height: 42px;
    background: var(--blue);
    color: white;
    font-weight: 700;
  }

  .pesquisa {
    flex: 1;
    max-width: 450px;
    min-width: 180px;
    height: 42px;
    padding: 0 12px;
    border: 1px solid #c6d4e4;
    border-radius: 7px;
    color: var(--navy);
  }

  .contador {
    margin-left: auto;
    color: #647789;
    font-size: 12px;
  }

  #status {
    margin: 9px 4px;
    min-height: 18px;
    font-size: 13px;
    white-space: pre-wrap;
  }

  #status.error { color: #b42318; }

  .lista {
    max-height: 350px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: white;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th, td {
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid #e4e9ee;
    text-align: left;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: #edf2f7;
    color: #17375f;
    font-weight: 700;
    z-index: 1;
  }

  tbody tr:nth-child(even) { background: #f4f6f8; }
  tbody tr[data-id] { cursor: pointer; }
  tbody tr[data-id]:hover { background: #eef6fc; }
  tbody tr.selecionado { background: #dceefd; }

  tbody tr.selecionado td:first-child {
    box-shadow: inset 3px 0 var(--blue);
  }

  .numero { text-align: right; }
  .situacao { font-weight: 700; }
  .ativo { color: #168447; }
  .inativo { color: #8a5260; }

  .detalhes {
    margin-top: 18px;
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .resumo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .resumo strong { font-size: 16px; }

  .modo {
    color: #647789;
    font-size: 12px;
  }

  .guias {
    display: flex;
    gap: 4px;
    padding: 12px 18px 0;
    border-bottom: 1px solid var(--border);
    background: #fafbfc;
  }

  .guia {
    border: 1px solid var(--border);
    border-bottom: 0;
    border-radius: 6px 6px 0 0;
    background: #edf1f5;
    color: #52677b;
    padding: 12px 20px;
  }

  .guia[aria-selected="true"] {
    background: white;
    color: var(--navy);
    box-shadow: inset 0 3px var(--green);
    font-weight: 700;
  }

  .painel { padding: 24px 20px; }

  .campos {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  label {
    display: grid;
    gap: 7px;
    font-size: 13px;
    color: #435a70;
  }

  label input, label select {
    width: 100%;
    min-width: 0;
    height: 40px;
    border: 1px solid #c6d4e4;
    border-radius: 6px;
    padding: 8px 10px;
    color: var(--navy);
    background: white;
  }

  input:disabled, select:disabled, input[readonly] {
    background: #f3f6f8;
    color: #52677b;
    opacity: 1;
  }

  .ajuda {
    margin: 0 0 18px;
    color: #647789;
    font-size: 13px;
    line-height: 1.5;
  }

  .excecao {
    display: grid;
    grid-template-columns: 120px minmax(180px, 2fr) 1fr 1fr auto;
    gap: 12px;
    align-items: end;
    padding: 16px 0;
    border-bottom: 1px solid #e5ebf0;
  }

  .secundario {
    background: white;
    color: var(--navy);
    border: 1px solid #c6d4e4;
  }

  .remover {
    height: 40px;
    background: #fff3f2;
    color: #a52d26;
    border: 1px solid #efcfcc;
  }

  #add { margin-top: 16px; }

  .rodape {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    background: #fafbfc;
  }

  .salvar {
    background: var(--green);
    color: white;
    font-weight: 700;
  }

  #revision {
    margin: 0 0 0 auto;
    color: #647789;
    font-size: 12px;
  }

  .aviso {
    margin: 14px 4px;
    color: #647789;
    font-size: 12px;
    line-height: 1.5;
  }

  [hidden] { display: none !important; }

  :focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    .campos { grid-template-columns: 1fr 1fr; }
    .excecao { grid-template-columns: 1fr 1fr; }
    h1 { font-size: 23px; }
    .topo { padding: 18px; }
  }

  @media (max-width: 560px) {
    .campos, .excecao { grid-template-columns: 1fr; }
    .topo { gap: 12px; padding: 16px 12px; }
    .nav-icone { width: 40px; height: 40px; }
    h1 { font-size: 19px; }
    .contador { width: 100%; margin-left: 0; }
    .guia { padding: 12px; }
    #revision { width: 100%; margin-left: 0; }
  }
</style>
</head>

<body>
<main>
  <header class="topo">
    <nav class="navegacao-topo" aria-label="Navegação">
      <button id="back" class="nav-icone" type="button"
        title="Voltar" aria-label="Voltar">←</button>
      <a id="home" class="nav-icone" href="/"
        title="Página inicial" aria-label="Página inicial">⌂</a>
    </nav>
    <h1>VENDEDORES / COMISSÕES</h1>
  </header>

  <div id="list-toolbar" class="barra">
    <button id="new" class="novo" type="button"
      title="Cadastrar vendedor" aria-label="Cadastrar vendedor" disabled>+</button>

    <button id="edit" class="editar" type="button" disabled>
      Editar
    </button>

    <input id="search" class="pesquisa" type="search"
      placeholder="Pesquisar código, vendedor ou usuário..."
      aria-label="Pesquisar vendedores">

    <span id="count" class="contador"></span>
  </div>

  <p id="status" role="status" aria-live="polite"></p>

  <div id="list-container" class="lista">
    <table aria-label="Vendedores cadastrados">
      <thead>
        <tr>
          <th>Código</th>
          <th>Vendedor</th>
          <th>Usuário vinculado</th>
          <th>Ativo</th>
          <th class="numero">Comissão venda (%)</th>
          <th class="numero">Comissão devolução (%)</th>
          <th class="numero">Exceções</th>
        </tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
  </div>

  <form id="form" class="detalhes" hidden novalidate>
    <div class="resumo">
      <strong id="title"></strong>
      <span id="mode" class="modo"></span>
    </div>

    <div class="guias" role="tablist" aria-label="Dados do vendedor">
      <button id="tab-general" class="guia" type="button"
        role="tab" aria-selected="true" aria-controls="general">
        Geral
      </button>
      <button id="tab-groups" class="guia" type="button"
        role="tab" aria-selected="false" aria-controls="groups" tabindex="-1">
        Comissão por grupo
      </button>
    </div>

    <section id="general" class="painel"
      role="tabpanel" aria-labelledby="tab-general">
      <div class="campos">
        <label>
          Código do vendedor no Sankhya
          <input id="code" readonly>
        </label>

        <label>
          Nome / Apelido
          <input id="name" maxlength="120" required>
        </label>

        <label>
          Ativo
          <select id="active">
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </select>
        </label>

        <label>
          Usuário vinculado
          <select id="user" required></select>
        </label>

        <label>
          Comissão de venda (%)
          <input id="sale" type="number" min="0" max="100"
            step="0.01" required>
        </label>

        <label>
          Comissão de devolução (%)
          <input id="refund" type="number" min="0" max="100"
            step="0.01" required>
        </label>
      </div>
    </section>

    <section id="groups" class="painel" hidden
      role="tabpanel" aria-labelledby="tab-groups">
      <p class="ajuda">
        Cadastre uma comissão diferente por rede ou cliente.
        A regra do cliente tem prioridade sobre a da rede.
        Sem exceção, vale o percentual da guia Geral.
      </p>

      <div id="exceptions"></div>
      <p id="no-exceptions" class="ajuda">
        Nenhuma exceção cadastrada. Serão utilizados os percentuais padrão.
      </p>

      <button id="add" class="secundario" type="button">
        + Adicionar exceção
      </button>
    </section>

    <footer class="rodape">
      <button id="save" class="salvar" type="submit">Salvar</button>
      <button id="cancel" class="secundario" type="button">Cancelar</button>
      <p id="revision"></p>
    </footer>
  </form>

  <p class="aviso">
    Este cadastro ainda não gera pagamentos nem altera os cálculos da rentabilidade.
  </p>
</main>

<script>
  const $ = id => document.getElementById(id);

  let model = null;
  let selected = null;
  let editing = false;
  let busy = false;
  let dirty = false;
  let reloadRequired = false;

  function message(text, error = false) {
    $('status').textContent = text;
    $('status').className = error ? 'error' : '';
  }

  async function api(options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/comissoes/cadastro', {
        ...options,
        signal: controller.signal,
        credentials: 'same-origin'
      });

      if (!(response.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('Resposta inesperada. Confira sua sessão e recarregue a página.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível concluir a operação.');
      }

      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function option(select, value, text) {
    const node = document.createElement('option');
    node.value = String(value);
    node.textContent = text;
    select.append(node);
  }

  function userName(id) {
    const user = model.usuarios.find(item => String(item.id) === String(id));
    return user ? (user.nome || user.username) : 'Vínculo indisponível';
  }

  function rate(value) {
    return (Number(value) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function tab(name) {
    ['general', 'groups'].forEach(key => {
      const active = key === name;
      $(key).hidden = !active;
      $('tab-' + key).setAttribute('aria-selected', String(active));
      $('tab-' + key).tabIndex = active ? 0 : -1;
    });
  }

  function allowed() {
    return Boolean(selected
      ? model?.permissoes.update
      : model?.permissoes.create);
  }

    function showScreen(editMode) {
    $('list-toolbar').hidden = editMode;
    $('list-container').hidden = editMode;
    $('form').hidden = !editMode;
  }

  function returnToList(record = selected) {
    selected = record;
    editing = false;
    dirty = false;

    showScreen(false);
    renderList();
    controls();

    const selectedRow = [...$('rows').querySelectorAll('tr[data-id]')]
      .find(row => row.dataset.id === selected?.id);

    if (selectedRow) {
      selectedRow.focus({ preventScroll: true });
      selectedRow.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }

  function controls() {
    const locked = busy || reloadRequired;
    const writable = editing && allowed() && !locked;

    $('new').disabled = locked || editing || !model?.permissoes.create;
    $('edit').disabled = locked || editing || !selected || !model?.permissoes.update;
    $('search').disabled = locked || editing;

    $('form').querySelectorAll('input, select').forEach(node => {
      node.disabled = !writable;
    });

    $('user').disabled = Boolean(selected) || !writable;
    $('add').hidden = !editing;
    $('add').disabled = !writable;

    document.querySelectorAll('.remover').forEach(button => {
      button.hidden = !editing;
      button.disabled = !writable;
    });

    $('save').hidden = !editing;
    $('save').disabled = !writable;
    $('cancel').hidden = !editing;
    $('cancel').disabled = locked;
    $('back').disabled = locked;

    $('mode').textContent = editing
      ? (selected ? 'Editando cadastro' : 'Novo cadastro')
      : 'Consulta • clique em Editar para alterar';
  }

  function renderList() {
    const term = $('search').value.trim().toLocaleLowerCase('pt-BR');

    const records = model.vendedores
      .filter(record => {
        const text = [
          record.codigo_origem,
          record.dados.nome,
          userName(record.user_id)
        ].join(' ').toLocaleLowerCase('pt-BR');

        return text.includes(term);
      })
      .sort((a, b) => a.dados.nome.localeCompare(b.dados.nome, 'pt-BR'));

    $('rows').replaceChildren();

    records.forEach(record => {
      const row = document.createElement('tr');
      row.dataset.id = record.id;
      row.tabIndex = 0;
      row.classList.toggle('selecionado', selected?.id === record.id);
      row.setAttribute('aria-label', 'Selecionar ' + record.dados.nome);

      const values = [
        record.codigo_origem,
        record.dados.nome,
        userName(record.user_id),
        record.dados.ativo ? 'Sim' : 'Não',
        rate(record.dados.venda),
        rate(record.dados.devolucao),
        record.dados.excecoes.length
      ];

      values.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        if (index >= 4) cell.className = 'numero';
        if (index === 3) {
          cell.className = 'situacao ' + (record.dados.ativo ? 'ativo' : 'inativo');
        }
        row.append(cell);
      });

            function select() {
        if (busy || reloadRequired || editing) return;

        selected = record;
        message('');

        $('rows').querySelectorAll('tr[data-id]').forEach(item => {
          item.classList.toggle(
            'selecionado',
            item.dataset.id === record.id
          );
        });

        controls();
      }

      row.addEventListener('click', select);
      row.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      });

      $('rows').append(row);
    });

    if (!records.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 7;
      cell.textContent = model.vendedores.length
        ? 'Nenhum vendedor encontrado para esta pesquisa.'
        : 'Nenhum vendedor cadastrado. Clique em + para cadastrar.';
      row.append(cell);
      $('rows').append(row);
    }

    $('count').textContent =
      records.length + ' de ' + model.vendedores.length + ' vendedor(es)';
  }

  function exceptionEmpty() {
    $('no-exceptions').hidden = $('exceptions').children.length > 0;
  }

  function addException(data = {
    tipo: 'rede', alvo: '', venda: '', devolucao: ''
  }) {
    const row = document.createElement('div');
    row.className = 'excecao';

    function field(title, tag) {
      const label = document.createElement('label');
      label.textContent = title;
      const node = document.createElement(tag);
      label.append(node);
      row.append(label);
      return node;
    }

    const type = field('Tipo', 'select');
    option(type, 'rede', 'Rede');
    option(type, 'cliente', 'Cliente');
    type.value = data.tipo;

    const target = field('Rede / Cliente', 'select');
    target.required = true;

    function targets() {
      target.replaceChildren();
      option(target, '', 'Selecione');

      if (type.value === 'rede') {
        model.redes.forEach(name => option(target, name, name));
      } else {
        model.clientes.forEach(client => {
          option(target, client.codigo, client.nome + ' — ' + client.codigo);
        });
      }
    }

    targets();

    if (
      data.alvo &&
      ![...target.options].some(item => item.value === String(data.alvo))
    ) {
      option(target, data.alvo, data.alvo + ' — cadastro indisponível');
    }

    target.value = data.alvo;
    type.addEventListener('change', targets);

    function percent(title, value) {
      const input = field(title, 'input');
      input.type = 'number';
      input.min = '0';
      input.max = '100';
      input.step = '0.01';
      input.required = true;
      input.value = value;
      return input;
    }

    const sale = percent('Comissão venda (%)', data.venda);
    const refund = percent('Comissão devolução (%)', data.devolucao);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remover';
    remove.textContent = 'Remover';
    remove.addEventListener('click', () => {
      if (!editing || busy || reloadRequired) return;
      row.remove();
      dirty = true;
      exceptionEmpty();
    });

    row.append(remove);
    row.read = () => ({
      tipo: type.value,
      alvo: target.value,
      venda: sale.value,
      devolucao: refund.value
    });

    $('exceptions').append(row);
    exceptionEmpty();
  }

  function userChanged(fillName) {
    const user = model.usuarios.find(
      item => String(item.id) === $('user').value
    );

    $('code').value = user?.codigo_vendedor || selected?.codigo_origem || '';

    if (fillName && user) {
      $('name').value = user.nome || user.username;
    }
  }

  function openRecord(record, editMode) {
    selected = record;
    editing = editMode;
    dirty = false;

        showScreen(editMode);
    $('title').textContent = record
      ? record.codigo_origem + ' — ' + record.dados.nome
      : 'Novo vendedor';

    $('user').replaceChildren();
    option($('user'), '', 'Selecione um usuário');

    model.usuarios.forEach(user => {
      option(
        $('user'),
        user.id,
        (user.nome || user.username) + ' — ' + user.codigo_vendedor
      );
    });

    if (
      record &&
      !model.usuarios.some(user => String(user.id) === String(record.user_id))
    ) {
      option($('user'), record.user_id, 'Vínculo indisponível — revisar');
    }

    const data = record?.dados;
    $('user').value = record ? String(record.user_id) : '';
    $('name').value = data?.nome || '';
    $('active').value = data?.ativo === false ? '0' : '1';
    $('sale').value = data ? data.venda / 100 : '';
    $('refund').value = data ? data.devolucao / 100 : '';

    $('exceptions').replaceChildren();
    (data?.excecoes || []).forEach(item => {
      addException({
        ...item,
        venda: item.venda / 100,
        devolucao: item.devolucao / 100
      });
    });

    exceptionEmpty();
    userChanged(false);

    $('revision').textContent = record
      ? 'Revisão ' + record.revisao +
        ' • ' + record.atualizado_por +
        ' • ' + new Date(record.atualizado_em).toLocaleString('pt-BR')
      : '';

    tab('general');
    renderList();
    controls();
  }

  function mayLeave() {
    if (busy) return false;
    return !dirty || confirm('Descartar as alterações não salvas?');
  }

    $('back').addEventListener('click', () => {
    if (busy || reloadRequired || !mayLeave()) return;

    if (editing) {
      message('');
      returnToList();
      return;
    }

    dirty = false;

    if (history.length > 1) {
      history.back();
    } else {
      location.href = '/';
    }
  });

  $('home').addEventListener('click', event => {
    if (!mayLeave()) event.preventDefault();
    else dirty = false;
  });

  window.addEventListener('beforeunload', event => {
    if (!dirty && !busy) return;
    event.preventDefault();
    event.returnValue = '';
  });

  ['general', 'groups'].forEach(name => {
    $('tab-' + name).addEventListener('click', () => tab(name));

    $('tab-' + name).addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 'general'
        : event.key === 'End' ? 'groups'
        : name === 'general' ? 'groups' : 'general';
      tab(next);
      $('tab-' + next).focus();
    });
  });

  $('search').addEventListener('input', renderList);

  $('new').addEventListener('click', () => {
    if (!model?.permissoes.create || editing || busy || reloadRequired) return;
    message('');
    openRecord(null, true);
    $('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('edit').addEventListener('click', () => {
    if (!selected || !model?.permissoes.update || busy || reloadRequired) return;
    message('');
    openRecord(selected, true);
    $('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('user').addEventListener('change', () => userChanged(true));

  $('form').addEventListener('input', () => {
    if (editing) dirty = true;
  });

  $('form').addEventListener('change', () => {
    if (editing) dirty = true;
  });

  $('add').addEventListener('click', () => {
    if (!editing || !allowed() || busy || reloadRequired) return;
    addException();
    dirty = true;
    controls();
  });

    $('cancel').addEventListener('click', () => {
    if (busy || reloadRequired || !mayLeave()) return;

    message('');
    returnToList();
  });

  $('form').addEventListener('submit', async event => {
    event.preventDefault();

    if (!editing || !allowed() || busy || reloadRequired) return;

    const invalid = [...$('form').querySelectorAll('input, select')]
      .find(input => !input.disabled && !input.checkValidity());

    if (invalid) {
      tab(invalid.closest('#groups') ? 'groups' : 'general');
      invalid.reportValidity();
      return;
    }

    const payload = {
      id: selected?.id,
      revisao: selected?.revisao,
      userId: $('user').value,
      nome: $('name').value,
      ativo: $('active').value === '1',
      venda: $('sale').value,
      devolucao: $('refund').value,
      excecoes: [...$('exceptions').children].map(row => row.read())
    };

    busy = true;
    controls();
    message('Salvando cadastro...');

    try {
      const saved = await api({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      dirty = false;
      const fresh = await api();
      const record = fresh.vendedores.find(item => item.id === saved.id);

      if (!record) throw new Error('Não foi possível atualizar o cadastro salvo.');

            model = fresh;
      $('search').value = '';

      returnToList(record);
      message('Cadastro salvo com sucesso.');
    } catch (error) {
      reloadRequired = true;
      dirty = false;
      message(
        (error.name === 'AbortError'
          ? 'Tempo de espera excedido.'
          : error.message) +
        ' Recarregue a página e confira o cadastro antes de tentar novamente.',
        true
      );
    } finally {
      busy = false;
      controls();
    }
  });

  message('Carregando vendedores...');

  api().then(data => {
    model = data;
    renderList();
    controls();
    message('');
  }).catch(error => {
    message(
      error.name === 'AbortError'
        ? 'A consulta demorou demais. Recarregue a página.'
        : error.message,
      true
    );
  });
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
