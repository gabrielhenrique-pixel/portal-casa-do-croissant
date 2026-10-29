export function comissoesVendedoresPage() {
  return new Response(String.raw`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vendedores / Comissões</title>

  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: #f0f4f5;
      color: #10314b;
      font: 14px Arial, sans-serif;
    }

    main {
      max-width: 1280px;
      margin: auto;
      padding: 24px;
    }

    header, section {
      background: white;
      border: 1px solid #dde5e9;
      border-radius: 14px;
      padding: 24px;
    }

    header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
    }

    header a {
      color: #10314b;
      text-decoration: none;
    }

    h1 { margin: 0; font-size: 26px; }
    h2 { margin-top: 0; font-size: 19px; }
    p { line-height: 1.5; }
    .muted { color: #667987; }

    .layout {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }

    .fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 7px;
      font-size: 13px;
    }

    input, select, button {
      font: inherit;
      padding: 11px;
      border: 1px solid #bdccd6;
      border-radius: 7px;
    }

    input, select {
      width: 100%;
      min-width: 0;
      color: #10314b;
      background: white;
    }

    input[readonly] { background: #f0f4f7; }

    button {
      background: #10314b;
      color: white;
      cursor: pointer;
    }

    button:disabled {
      opacity: .55;
      cursor: default;
    }

    .secondary {
      background: white;
      color: #10314b;
    }

    .seller-list {
      display: grid;
      gap: 9px;
      margin-top: 18px;
    }

    .seller-list button {
      text-align: left;
      overflow-wrap: anywhere;
    }

    .exception {
      border: 1px solid #dde5e9;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 12px;
      background: #f9fbfc;
    }

    .exception-fields {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .exception-rates {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      align-items: end;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }

    .exceptions-heading { margin-top: 28px; }

    #status {
      min-height: 24px;
      white-space: pre-wrap;
    }

    #status.error { color: #b42318; }
    [hidden] { display: none !important; }

    @media (max-width: 850px) {
      .layout, .fields, .exception-fields, .exception-rates {
        grid-template-columns: 1fr;
      }

      main { padding: 12px; }
      header, section { padding: 16px; }
      h1 { font-size: 22px; }
    }
  </style>
</head>

<body>
<main>
  <header>
    <a href="/" aria-label="Voltar à página inicial">← Início</a>
    <div>
      <h1>Vendedores / Comissões</h1>
      <p class="muted">Cadastro e regras de comissão</p>
    </div>
  </header>

  <p id="status" role="status" aria-live="polite"></p>

  <div class="layout">
    <section>
      <h2>Vendedores cadastrados</h2>
      <button id="new" type="button" disabled>Novo vendedor</button>
      <div id="list" class="seller-list"></div>
    </section>

    <section>
      <p id="empty">
        Selecione um vendedor ou clique em Novo vendedor.
      </p>

      <form id="form" hidden>
        <h2 id="title">Novo vendedor</h2>

        <div class="fields">
          <label>
            Usuário vinculado
            <select id="user" required></select>
          </label>

          <label>
            Código do vendedor no Sankhya
            <input id="code" readonly>
          </label>

          <label>
            Nome do vendedor
            <input id="name" maxlength="120" required>
          </label>

          <label>
            Situação
            <select id="active">
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </label>

          <label>
            Comissão padrão de venda (%)
            <input
              id="sale"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
            >
          </label>

          <label>
            Comissão padrão de devolução (%)
            <input
              id="return"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
            >
          </label>
        </div>

        <h2 class="exceptions-heading">Exceções por rede ou cliente</h2>

        <p class="muted">
          A exceção do cliente tem prioridade sobre a da rede.
          Sem exceção, será utilizada a comissão padrão.
          Zero significa comissão de 0%.
        </p>

        <div id="exceptions"></div>

        <button id="add" class="secondary" type="button">
          Adicionar exceção
        </button>

        <div class="actions">
          <button id="save" type="submit">Salvar cadastro</button>
          <button id="cancel" class="secondary" type="button">
            Cancelar
          </button>
        </div>

        <p id="revision" class="muted"></p>
      </form>

      <p class="muted">
        Nesta etapa, o cadastro ainda não gera comissões ou pagamentos
        e não altera os cálculos da rentabilidade.
      </p>
    </section>
  </div>
</main>

<script>
  const $ = id => document.getElementById(id);

  let model = null;
  let selected = null;
  let busy = false;

  function showStatus(message, error = false) {
    $('status').textContent = message;
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

      const contentType = response.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        throw new Error(
          'A resposta do portal não foi reconhecida. ' +
          'Confira sua sessão e recarregue a página.'
        );
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

  function addOption(select, value, text) {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = text;
    select.append(option);
  }

  function canEdit() {
    if (!model) return false;

    return selected
      ? model.permissoes.update
      : model.permissoes.create;
  }

  function updateControls() {
    const editable = canEdit() && !busy;

    $('form').querySelectorAll('input, select, button').forEach(node => {
      node.disabled = !editable;
    });

    $('user').disabled = Boolean(selected) || !editable;
    $('cancel').disabled = busy;
    $('new').disabled = busy || !model?.permissoes.create;
  }

  function userChanged(fillName = true) {
    const user = model.usuarios.find(
      item => String(item.id) === $('user').value
    );

    $('code').value = user
      ? user.codigo_vendedor
      : selected?.codigo_origem || '';

    if (fillName && user) {
      $('name').value = user.nome || user.username;
    }
  }

  function addException(data = {
    tipo: 'rede',
    alvo: '',
    venda: '',
    devolucao: ''
  }) {
    const row = document.createElement('div');
    row.className = 'exception';

    const destinationFields = document.createElement('div');
    destinationFields.className = 'exception-fields';

    const rateFields = document.createElement('div');
    rateFields.className = 'exception-rates';

    row.append(destinationFields, rateFields);

    function field(container, title, control) {
      const label = document.createElement('label');
      label.textContent = title;
      label.append(control);
      container.append(label);
      return control;
    }

    const type = field(
      destinationFields,
      'Tipo de exceção',
      document.createElement('select')
    );

    addOption(type, 'rede', 'Rede');
    addOption(type, 'cliente', 'Cliente');
    type.value = data.tipo;

    const target = field(
      destinationFields,
      'Aplicar para',
      document.createElement('select')
    );

    target.required = true;

    function fillTargets() {
      target.replaceChildren();
      addOption(target, '', 'Selecione');

      if (type.value === 'rede') {
        model.redes.forEach(rede => {
          addOption(target, rede, rede);
        });
      } else {
        model.clientes.forEach(cliente => {
          addOption(
            target,
            cliente.codigo,
            cliente.nome + ' — ' + cliente.codigo
          );
        });
      }
    }

    fillTargets();
    target.value = data.alvo;
    type.addEventListener('change', fillTargets);

    function rateField(title, value) {
      const input = field(
        rateFields,
        title,
        document.createElement('input')
      );

      input.type = 'number';
      input.min = '0';
      input.max = '100';
      input.step = '0.01';
      input.required = true;
      input.value = value;

      return input;
    }

    const sale = rateField('Comissão de venda (%)', data.venda);
    const refund = rateField('Comissão de devolução (%)', data.devolucao);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary';
    remove.textContent = 'Remover';

    remove.addEventListener('click', () => {
      if (!busy && canEdit()) row.remove();
    });

    rateFields.append(remove);

    row.read = () => ({
      tipo: type.value,
      alvo: target.value,
      venda: sale.value,
      devolucao: refund.value
    });

    $('exceptions').append(row);
  }

  function edit(record) {
    selected = record;
    $('form').hidden = false;
    $('empty').hidden = true;
    $('title').textContent = record ? 'Editar vendedor' : 'Novo vendedor';

    $('user').replaceChildren();
    addOption($('user'), '', 'Selecione um usuário');

    model.usuarios.forEach(user => {
      addOption(
        $('user'),
        user.id,
        (user.nome || user.username) + ' — ' + user.codigo_vendedor
      );
    });

    // Preserva a identificação de um vínculo antigo que não esteja
    // mais disponível na lista. O servidor verificará antes de salvar.
    if (
      record &&
      !model.usuarios.some(user => String(user.id) === String(record.user_id))
    ) {
      addOption(
        $('user'),
        record.user_id,
        'Usuário vinculado indisponível — revisar vínculo'
      );
    }

    const data = record?.dados;

    $('user').value = record ? String(record.user_id) : '';
    $('name').value = data?.nome || '';
    $('active').value = data?.ativo === false ? '0' : '1';
    $('sale').value = data ? data.venda / 100 : '';
    $('return').value = data ? data.devolucao / 100 : '';

    $('exceptions').replaceChildren();

    (data?.excecoes || []).forEach(exception => {
      addException({
        ...exception,
        venda: exception.venda / 100,
        devolucao: exception.devolucao / 100
      });
    });

    $('revision').textContent = record
      ? 'Revisão ' + record.revisao +
        ' · Alterado por ' + record.atualizado_por +
        ' · ' + new Date(record.atualizado_em).toLocaleString('pt-BR')
      : '';

    userChanged(false);
    updateControls();
  }

  async function load() {
    model = await api();
    $('list').replaceChildren();

    model.vendedores.forEach(record => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';

      button.textContent =
        record.dados.nome +
        (record.dados.ativo ? '' : ' (inativo)');

      button.addEventListener('click', () => {
        if (!busy) {
          showStatus('');
          edit(record);
        }
      });

      $('list').append(button);
    });

    if (!model.vendedores.length) {
      $('list').textContent = 'Nenhum vendedor cadastrado.';
    }

    updateControls();
  }

  $('user').addEventListener('change', () => userChanged());

  $('new').addEventListener('click', () => {
    if (!busy && model?.permissoes.create) {
      showStatus('');
      edit(null);
    }
  });

  $('add').addEventListener('click', () => {
    if (!busy && canEdit()) {
      addException();
      updateControls();
    }
  });

  $('cancel').addEventListener('click', () => {
    if (busy) return;

    selected = null;
    $('form').hidden = true;
    $('empty').hidden = false;
    showStatus('');
  });

  $('form').addEventListener('submit', async event => {
    event.preventDefault();

    if (busy || !canEdit()) return;

    const payload = {
      id: selected?.id,
      revisao: selected?.revisao,
      userId: $('user').value,
      nome: $('name').value,
      ativo: $('active').value === '1',
      venda: $('sale').value,
      devolucao: $('return').value,
      excecoes: [...$('exceptions').children].map(row => row.read())
    };

    busy = true;
    updateControls();
    showStatus('Salvando cadastro...');

    let saved = null;

    try {
      saved = await api({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await load();

      const record = model.vendedores.find(item => item.id === saved.id);

      if (!record) {
        throw new Error('O cadastro salvo não apareceu na atualização.');
      }

      edit(record);
      showStatus('Cadastro salvo com sucesso.');
    } catch (error) {
      let message = error.message;

      if (saved) {
        message =
          'O cadastro foi salvo, mas a tela não conseguiu atualizar. ' +
          'Recarregue a página para conferir.';
      } else if (
        error.name === 'AbortError' ||
        error instanceof TypeError
      ) {
        message =
          'Não foi possível confirmar a gravação. ' +
          'Recarregue a página e confira o cadastro antes de tentar novamente.';
      }

      showStatus(message, true);

      // Evita reenviar um cadastro após uma gravação sem confirmação.
      if (saved || error.name === 'AbortError' || error instanceof TypeError) {
        $('form').hidden = true;
        $('empty').hidden = false;
        $('empty').textContent = 'Recarregue a página para continuar.';
        return;
      }
    } finally {
      busy = false;
      updateControls();
    }
  });

  showStatus('Carregando vendedores...');

  load()
    .then(() => showStatus(''))
    .catch(error => {
      showStatus(
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
