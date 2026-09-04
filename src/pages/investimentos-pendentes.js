export function investimentosPendentesPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Investimentos pendentes | Casa do Croissant</title>
  <style>
    :root { --verde-escuro:#123d2d; --verde:#1b744d; --fundo:#f6f8f7; --texto:#183128; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; display:flex; font-family:Arial,sans-serif; color:var(--texto); background:var(--fundo); }
    aside { width:250px; min-height:100vh; flex-shrink:0; padding:28px 16px; background:var(--verde-escuro); color:#fff; }
    .marca { padding:4px 12px 28px; font-size:20px; font-weight:700; }
    .marca small { display:block; margin-top:6px; color:#b7d7c6; font-size:12px; font-weight:400; }
    .nav { display:block; width:100%; margin:4px 0; padding:13px 12px; border:0; border-radius:8px; background:transparent; color:#d7e9df; text-align:left; text-decoration:none; font-size:14px; }
    .nav:hover, .nav.ativo { background:#256e50; color:#fff; }
    .nav.sair { margin-top:24px; border-top:1px solid rgba(255,255,255,.18); border-radius:0; padding-top:19px; }
    main { flex:1; padding:38px; }
    .topo { display:flex; align-items:center; gap:16px; margin-bottom:26px; }
    .voltar { display:grid; width:48px; height:48px; place-items:center; flex:0 0 48px; border-radius:50%; background:#0d4b2b; color:#fff; text-decoration:none; font-size:26px; font-weight:700; }
    .voltar:hover { background:#25724d; }
    h1 { margin:0; font-size:27px; }
    .subtitulo { margin:5px 0 0; color:#66746d; }
    .tabela-area { overflow-x:auto; border:1px solid #dce8e1; border-radius:12px; background:#fff; }
    table { width:100%; min-width:1000px; border-collapse:collapse; }
    th, td { padding:12px; border-bottom:1px solid #e5ece8; text-align:left; font-size:14px; }
    th { background:#eef6f1; color:#123d2d; }
    .vazio { padding:34px; color:#66746d; text-align:center; }
    .aviso { max-width:1000px; margin-top:16px; padding:12px 14px; border-radius:7px; background:#e8f1eb; color:#12623e; font-size:14px; }
    @media (max-width:800px) {
      body { display:block; }
      aside { width:100%; min-height:auto; padding:16px; }
      .marca { padding-bottom:12px; }
      .menu { display:flex; overflow:auto; gap:4px; }
      .nav { width:auto; margin:0; white-space:nowrap; }
      .nav.sair { margin-top:0; border-top:0; padding-top:13px; }
      main { padding:24px 16px; }
    }
  </style>
</head>
<body>
  <aside>
    <div class="marca">Casa do Croissant<small>Portal interno</small></div>
    <nav class="menu">
      <a class="nav" href="/" onclick="if (window.history.length > 1) { window.history.back(); return false; }">Página inicial</a>
      <a class="nav" href="/investimentos">Investimentos</a>
      <a class="nav ativo" href="/investimentos-pendentes">Investimentos pendentes</a>
      <a class="nav" href="/">Painel de devoluções</a>
      <a class="nav" href="/">Usuários cadastrados</a>
      <a class="nav" href="/">Histórico de ações</a>
      <a class="nav" href="/">Acessos</a>
      <a class="nav sair" href="/" onclick="if (window.history.length > 1) { window.history.back(); return false; }">Voltar ao portal</a>
    </nav>
  </aside>

  <main>
    <div class="topo">
      <a class="voltar" href="/" onclick="if (window.history.length > 1) { window.history.back(); return false; }" aria-label="Voltar ao portal">↩</a>
      <div>
        <h1>Investimentos pendentes</h1>
        <p class="subtitulo">Investimentos previstos que ainda aguardam o valor real.</p>
      </div>
    </div>

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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div class="vazio">Nenhum investimento pendente.</div>
    </section>

    <div class="aviso">
      A consulta e a correção do valor real serão conectadas à planilha de investimentos na próxima etapa.
    </div>
  </main>
</body>
</html>`, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin"
    }
  });
}
