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
      :root { --verde-escuro:#123d2d; --verde:#1b744d; --fundo:#f6f8f7; --texto:#183128; --borda:#c9d8d0; }
      * { box-sizing:border-box; } body { margin:0; min-height:100vh; display:flex; font-family:Arial,sans-serif; color:var(--texto); background:var(--fundo); }
      aside { width:250px; min-height:100vh; flex-shrink:0; padding:28px 16px; background:var(--verde-escuro); color:#fff; }
      .marca { padding:4px 12px 28px; font-size:20px; font-weight:700; }.marca small { display:block; margin-top:6px; color:#b7d7c6; font-size:12px; font-weight:400; }
      .nav { display:block; width:100%; margin:4px 0; padding:13px 12px; border:0; border-radius:8px; background:transparent; color:#d7e9df; text-align:left; text-decoration:none; font-size:14px; cursor:pointer; }.nav:hover,.nav.ativo { background:#256e50; color:#fff; }.nav.sair { margin-top:24px; border-top:1px solid rgba(255,255,255,.18); border-radius:0; padding-top:19px; }
      main { flex:1; padding:38px; }.topo { display:flex; align-items:center; gap:16px; margin-bottom:26px; }.voltar { display:grid; width:48px; height:48px; place-items:center; flex:0 0 48px; border-radius:50%; background:#0d4b2b; color:#fff; text-decoration:none; font-size:26px; font-weight:700; }.voltar:hover { background:#25724d; } h1 { margin:0; font-size:27px; }.subtitulo { margin:5px 0 0; color:#66746d; }
      .cartao { max-width:950px; padding:26px; border:1px solid #dce8e1; border-radius:12px; background:#fff; }.grade { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }.campo { display:flex; flex-direction:column; gap:7px; min-width:0; } label { font-size:13px; font-weight:700; }.obrigatorio { color:#bd3d31; } input,select { width:100%; height:42px; padding:0 12px; border:1px solid var(--borda); border-radius:7px; background:#fff; font:inherit; outline:none; } input:focus,select:focus { border-color:var(--verde); box-shadow:0 0 0 3px rgba(27,116,77,.12); }.valor { display:flex; align-items:center; height:42px; overflow:hidden; border:1px solid var(--borda); border-radius:7px; }.valor span { padding-left:12px; color:#66746d; font-weight:700; }.valor input { border:0; box-shadow:none; }
      .rodape { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-top:28px; padding-top:20px; border-top:1px solid #e4ece7; color:#66746d; font-size:13px; }.salvar { padding:11px 18px; border:0; border-radius:7px; background:var(--verde); color:#fff; font-weight:700; cursor:pointer; }.salvar:hover { background:#35ad69; }.mensagem { display:none; max-width:950px; margin-top:16px; padding:12px 14px; border-radius:7px; background:#e8f1eb; color:#12623e; font-size:14px; }.mensagem.visivel { display:block; }
      @media (max-width:800px) { body { display:block; } aside { width:100%; min-height:auto; padding:16px; }.marca { padding-bottom:12px; }.menu { display:flex; overflow:auto; gap:4px; }.nav { width:auto; margin:0; white-space:nowrap; }.nav.sair { margin-top:0; border-top:0; padding-top:13px; } main { padding:24px 16px; }.grade { grid-template-columns:1fr; }.rodape { align-items:stretch; flex-direction:column; }.salvar { width:100%; } }
    </style>
  </head>
  <body>
    <main>
      <div class="topo"><a class="voltar" href="/" onclick="if (window.history.length > 1) { window.history.back(); return false; }" aria-label="Voltar ao portal">↩</a><div><h1>Registro de investimento</h1><p class="subtitulo">Registre os investimentos comerciais realizados para cada rede.</p></div></div>
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
