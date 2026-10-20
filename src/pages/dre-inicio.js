export function dreInicioPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DRE | Casa do Croissant</title>
<style>
:root{--verde:#0f5b3c;--texto:#123d2d}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;font-family:Arial,sans-serif;color:var(--texto);background:linear-gradient(135deg,#edf5f0,#f7f9f8)}
main{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:34px 0 48px}
header{display:flex;align-items:center;gap:18px;margin-bottom:34px}
.voltar{display:grid;place-items:center;width:48px;height:48px;flex:0 0 48px;border-radius:50%;background:#fff;color:var(--texto);text-decoration:none;font-size:28px;font-weight:700;box-shadow:0 5px 16px rgba(15,69,47,.14)}
.voltar:hover{background:var(--verde);color:#fff}
h1{margin:0;font-size:32px}
.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.card{min-height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;border-radius:22px;color:#fff;text-decoration:none;box-shadow:0 12px 28px rgba(13,60,42,.18);transition:transform .18s ease,box-shadow .18s ease}
.card:hover{transform:translateY(-7px);box-shadow:0 20px 34px rgba(13,60,42,.25)}
.card:focus-visible,.voltar:focus-visible{outline:3px solid #123d2d;outline-offset:4px}
.competencia{background:linear-gradient(135deg,#0b4d35,#27a66c)}
.caixa{background:linear-gradient(135deg,#113f70,#2384c4)}
.icone{display:grid;place-items:center;width:76px;height:76px;border-radius:20px;background:rgba(255,255,255,.18)}
.icone svg{width:32px;height:32px}
h2{margin:0;max-width:260px;padding:0 18px;text-align:center;font-size:25px;line-height:1.18}
@media(max-width:820px){.cards{gap:14px}.card{min-height:190px;gap:14px;border-radius:18px}.icone{width:58px;height:58px;border-radius:16px}.icone svg{width:27px;height:27px}h2{padding:0 10px;font-size:20px}}
@media(max-width:520px){main{width:min(100% - 24px,1180px);padding:22px 0 30px}header{gap:12px;margin-bottom:22px}.voltar{width:42px;height:42px;flex-basis:42px;font-size:23px}h1{font-size:25px}.cards{gap:10px}.card{min-height:164px;gap:10px;border-radius:16px;box-shadow:0 8px 20px rgba(13,60,42,.16)}.icone{width:48px;height:48px;border-radius:14px}.icone svg{width:24px;height:24px}h2{padding:0 8px;font-size:17px;line-height:1.14}}
@media(max-width:350px){.cards{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.card{transition:none}}
</style></head><body><main>
<header><a class="voltar" href="/" aria-label="Voltar ao portal">←</a><h1>DRE</h1></header>
<section class="cards" aria-label="Regimes de apuração">
<a class="card competencia" href="/dre/competencia">
<span class="icone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h3m3 0h3m-9 3h3"/></svg></span>
<h2>DRE Competência</h2></a>
<a class="card caixa" href="/dre/caixa">
<span class="icone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 9h20m-6 5h3"/><circle cx="8" cy="14" r="2"/></svg></span>
<h2>DRE Caixa</h2></a>
</section>
</main></body></html>`, { headers: { 'content-type': 'text/html; charset=UTF-8' } });
}
