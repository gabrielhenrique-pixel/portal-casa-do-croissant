const REDES = [
  'FESTVAL', 'CONDOR', 'OUTROS', 'COOP', 'MUFFATO', 'CIRCUITO', 'OBA',
  'ZAMPROGNA', 'STRAPASSON', 'BELLA VILLA', 'HIPER SELECT', 'JACOMAR',
  'ITALO', 'TOZETTO', 'TELEMACO', 'KOCH', 'ANGELONI', 'ALIMAX', 'ARCHER',
  'ASSAÍ', 'BAVARESCO', 'BOZACOLA', 'TUSSO', 'GEPETTO', 'GIASSI',
  'HIPPO NO PONTO', 'REDE MAX', 'SUPER GOLFF', 'VERONA', 'IMPERATRIZ'
];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

export function investimentosPage(username, redesPermitidas = REDES) {
  const redes = redesPermitidas.map((rede) => `<option value="${escapeHtml(rede)}"></option>`).join('');
  return new Response(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Investimentos | Casa do Croissant</title>
    <style>
  :root {
    --navy:#102e49;
    --blue:#1f4e78;
    --bg:#f5f7f6;
    --ink:#142b3d;
    --border:#d5e0e8;
    --muted:#63716e;
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

  .cartao {
    max-width:1120px;
    margin-top:16px;
    padding:28px 34px;
    border:1px solid var(--border);
    border-radius:16px;
    background:rgba(255,255,255,.94);
    box-shadow:0 6px 18px #17305214;
  }

  .grade {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:20px;
  }

  .campo {
    display:flex;
    min-width:0;
    flex-direction:column;
    gap:7px;
  }

  label {
    color:#17375f;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
  }

  .obrigatorio { color:#c83737; }

  input,
  select {
    width:100%;
    height:42px;
    padding:0 12px;
    border:1px solid #c6d4e4;
    border-radius:8px;
    outline:none;
    background:#fff;
    color:var(--ink);
    font:inherit;
  }

  input:focus,
  select:focus {
    border-color:var(--blue);
    box-shadow:0 0 0 3px #1f4e7820;
  }

  .valor {
    display:flex;
    align-items:center;
    height:42px;
    overflow:hidden;
    border:1px solid #c6d4e4;
    border-radius:8px;
    background:#fff;
  }

  .valor span {
    padding-left:12px;
    color:#365a7d;
    font-weight:700;
  }

  .valor input {
    border:0;
    box-shadow:none;
  }

  .rodape {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
    margin-top:28px;
    padding-top:20px;
    border-top:1px solid #e0e7ec;
    color:var(--muted);
    font-size:13px;
  }

  .salvar {
    padding:12px 20px;
    border:0;
    border-radius:8px;
    background:var(--navy);
    color:#fff;
    font:inherit;
    font-weight:700;
    cursor:pointer;
  }

  .salvar:hover { background:#1f4e78; }

  .salvar:disabled {
    cursor:wait;
    opacity:.7;
  }

  .mensagem {
    display:none;
    max-width:1120px;
    margin-top:14px;
    padding:12px 14px;
    border:1px solid #cde1d4;
    border-radius:8px;
    background:#edf8f1;
    color:#17643f;
    font-size:14px;
  }

  .mensagem.visivel { display:block; }

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

    .cartao {
      padding:20px 16px;
      border-radius:14px;
    }

    .grade { grid-template-columns:1fr; }

    .rodape {
      align-items:stretch;
      flex-direction:column;
    }

    .salvar { width:100%; }
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
    <h1>Registro de investimento</h1>
    <p class="subtitulo">Registre os investimentos comerciais realizados para cada rede.</p>
  </div>
</div>
      <section class="cartao">
        <form id="formulario">
          <div class="grade">
            <div class="campo"><label for="inicio">Data inicial <span class="obrigatorio">*</span></label><input id="inicio" type="date" required></div>
            <div class="campo"><label for="fim">Data final <span class="obrigatorio">*</span></label><input id="fim" type="date" required></div>
            <div class="campo"><label for="rede">Rede <span class="obrigatorio">*</span></label><input id="rede" list="redes" placeholder="Digite o nome da rede" required><datalist id="redes">${redes}</datalist></div>
            <div class="campo"><label for="tipo">Tipo de investimento <span class="obrigatorio">*</span></label><select id="tipo" required><option value="">Selecione uma opção</option><option>BONIFICAÇÃO</option><option>DEGUSTAÇÃO</option><option>SELL OUT</option><option>ACORDO COMERCIAL</option><option>REBAIXA/ QUEBRA</option><option>ENDOMARKETING</option><option>OUTROS</option></select></div>
            <div class="campo"><label for="tipoValor">Tipo do valor <span class="obrigatorio">*</span></label><select id="tipoValor" required><option value="">Selecione uma opção</option><option value="PREVISAO">Previsão</option><option value="REAL">Real</option></select></div>
            <div class="campo"><label for="valor">Valor <span class="obrigatorio">*</span></label><div class="valor"><span>R$</span><input id="valor" inputmode="decimal" placeholder="0,00" required></div></div>
            <div class="campo"><label for="responsavel">Responsável <span class="obrigatorio">*</span></label><input id="responsavel" value="${escapeHtml(username)}" required></div>
            <div class="campo"><label for="status">Status <span class="obrigatorio">*</span></label><select id="status" required><option value="">Selecione um status</option><option>OK</option><option>Parcial</option><option>PAGO</option><option>pendente</option><option>Em aberto</option></select></div>
          </div>
          <div class="rodape"><span><span class="obrigatorio">*</span> Campos obrigatórios</span><button class="salvar" type="submit">Salvar registro</button></div>
        </form>
      </section>
      <div id="mensagem" class="mensagem" role="status"></div>
    </main>
    <script>
      const form = document.getElementById('formulario'); const mensagem = document.getElementById('mensagem'); const valor = document.getElementById('valor');
      function numero(texto) { const valorLimpo = String(texto || '').replace('R$', '').trim(); return valorLimpo.includes(',') ? Number(valorLimpo.replace(/\\./g, '').replace(',', '.')) : Number(valorLimpo); }
      valor.addEventListener('blur', () => { const atual = numero(valor.value); if (Number.isFinite(atual) && atual > 0) valor.value = atual.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}); });
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const inicio = document.getElementById('inicio').value;
        const fim = document.getElementById('fim').value;
        const valorNumerico = numero(valor.value);
        if (fim < inicio) {
          mensagem.textContent = 'A data final não pode ser anterior à data inicial.';
          mensagem.classList.add('visivel');
          return;
        }
        if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
          mensagem.textContent = 'Informe um valor válido.';
          mensagem.classList.add('visivel');
          return;
        }
        const botao = form.querySelector('button[type="submit"]');
        if (botao.disabled) return;
        botao.disabled = true;
        botao.textContent = 'Salvando...';
        mensagem.textContent = '';
        mensagem.classList.remove('visivel');
        try {
          const resposta = await fetch('/api/investimentos', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              inicio,
              fim,
              rede: document.getElementById('rede').value,
              tipo: document.getElementById('tipo').value,
              tipoValor: document.getElementById('tipoValor').value,
              valor: valorNumerico,
              responsavel: document.getElementById('responsavel').value,
              status: document.getElementById('status').value
            })
          });
          const dados = await resposta.json();
          if (!resposta.ok) {
            throw new Error(dados.error || 'Não foi possível salvar o investimento.');
          }
          form.reset();
          mensagem.textContent = dados.mensagem || 'Investimento registrado com sucesso.';
        } catch (erro) {
          mensagem.textContent = erro.message || 'Não foi possível salvar o investimento.';
        } finally {
          mensagem.classList.add('visivel');
          botao.disabled = false;
          botao.textContent = 'Salvar registro';
        }
      });
    </script>
  </body>
</html>`, { headers: { 'content-type': 'text/html; charset=UTF-8', 'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin' } });
}
