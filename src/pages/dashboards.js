export function dashboardsPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboards | Casa do Croissant</title>
  <style>
    :root { --verde:#0f5b3c; --azul:#12558d; --vermelho:#b83e30; --fundo:#f3f7f5; --texto:#123d2d; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; font-family:Arial,sans-serif; color:var(--texto); background:linear-gradient(135deg,#edf5f0,#f7f9f8); }
    main { width:min(1180px,calc(100% - 40px)); margin:0 auto; padding:34px 0 48px; }
    .topo { display:flex; align-items:center; gap:18px; margin-bottom:34px; }
    .voltar { display:grid; place-items:center; width:48px; height:48px; flex:0 0 48px; border-radius:50%; background:#fff; color:var(--texto); text-decoration:none; font-size:28px; font-weight:700; box-shadow:0 5px 16px rgba(15,69,47,.14); }
    .voltar:hover { background:var(--verde); color:#fff; }
    h1 { margin:0; font-size:32px; color:#123d2d; }
    .grade { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
    .card { min-height:330px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; border-radius:22px; color:#fff; text-decoration:none; box-shadow:0 12px 28px rgba(13,60,42,.18); transition:transform .18s ease,box-shadow .18s ease; }
    .card:hover { transform:translateY(-7px); box-shadow:0 20px 34px rgba(13,60,42,.25); }
    .icone { display:grid; place-items:center; width:76px; height:76px; border-radius:20px; background:rgba(255,255,255,.18); font-size:31px; font-weight:800; }
    .card strong { max-width:260px; padding:0 18px; text-align:center; font-size:25px; line-height:1.18; }
    .rentabilidade { background:linear-gradient(135deg,#0b4d35,#27a66c); }
    .vendas { background:linear-gradient(135deg,#113f70,#2384c4); }
    .devolucoes { background:linear-gradient(135deg,#952d2b,#dd6048); }
    .bsc { background:linear-gradient(135deg,#0d5e3d,#22a366); }
    @media (max-width:820px) { .grade { grid-template-columns:1fr; }.card { min-height:220px; } }
    @media (max-width:520px) { main { width:min(100% - 28px,1180px); padding-top:22px; }.topo { margin-bottom:24px; } h1 { font-size:27px; } }
  </style>
</head>
<body>
  <main>
    <header class="topo">
      <a class="voltar" href="/" aria-label="Voltar à página inicial">←</a>
      <h1>Dashboards</h1>
    </header>
    <section class="grade" aria-label="Escolha um dashboard">
      <a class="card rentabilidade" href="/dashboard-rentabilidade">
        <span class="icone">R$</span>
        <strong>Rentabilidade</strong>
      </a>
      <a class="card vendas" href="/dashboard-vendas">
        <span class="icone">↗</span>
        <strong>Monitoramento de vendas</strong>
      </a>
      <a class="card devolucoes" href="/devolucoes">
        <span class="icone">↶</span>
        <strong>Painel de devoluções</strong>
      </a>
      <a class="card bsc" href="/dashboard-bsc">
  <span class="icone">▦</span>
  <strong>BSC Comercial</strong>
</a>
    </section>
  </main>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
