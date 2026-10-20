export function dreInicioPage() {
  return new Response(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DRE | Casa do Croissant</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eaf1f6;color:#163a5a;font-family:Arial,sans-serif}
main{max-width:1120px;margin:0 auto;padding:32px 20px 60px}
header{display:flex;align-items:center;gap:18px;margin-bottom:32px}
.voltar{display:grid;place-items:center;width:48px;height:48px;flex-shrink:0;background:white;border-radius:50%;text-decoration:none;color:#163a5a;font-size:25px}
h1{margin:0;font-size:30px}header p{margin:8px 0 0;color:#607a91;line-height:1.5}
.marca{color:#24674f;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:12px 0 28px}
.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.card{display:flex;flex-direction:column;align-items:flex-start;gap:18px;padding:30px;border:1px solid #d5e3e4;border-radius:20px;background:white;color:inherit;text-decoration:none;box-shadow:0 8px 22px #1730520c;transition:transform .15s,border-color .15s}
.card:hover{transform:translateY(-3px);border-color:#276d53}.card:focus-visible,.voltar:focus-visible{outline:3px solid #276d53;outline-offset:4px}
.icone{display:grid;place-items:center;width:56px;height:56px;border-radius:16px;background:#e7f2ed;color:#24674f}
.icone svg{width:29px;height:29px}h2{margin:0;font-size:25px}.card p{margin:0;color:#607a91;line-height:1.6}.criterio{border-top:1px solid #e3ecee;padding-top:18px;width:100%;font-size:13px;line-height:1.6;color:#425e70}.abrir{margin-top:auto;padding-top:12px;font-weight:bold;color:#24674f}
.integracao{padding:20px 24px;background:#f7fafb;border:1px solid #d5e3e4;border-radius:14px;margin-top:26px;color:#607a91;font-size:13px;line-height:1.6}.integracao strong{color:#24674f}
@media(max-width:680px){main{padding:22px 16px}.cards{grid-template-columns:1fr;gap:16px}.card{padding:24px}h1{font-size:26px}}
@media(prefers-reduced-motion:reduce){.card{transition:none}}
</style></head><body><main>
<div class="marca">Casa do Croissant · Portal interno</div>
<header><a class="voltar" href="/" aria-label="Voltar ao portal">←</a><div><h1>DRE</h1><p>Escolha como deseja analisar o resultado da empresa.</p></div></header>
<section class="cards" aria-label="Regimes de apuração">
<a class="card" href="/dre/competencia">
<span class="icone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h3m3 0h3m-9 3h3"/></svg></span>
<h2>DRE Competência</h2><p>Resultados pelo período de geração das receitas e despesas, independentemente da baixa.</p>
<div class="criterio">Mantém os critérios e a classificação do DRE atual.<br>Fonte atual: Sankhya.</div><span class="abrir">Abrir DRE Competência →</span></a>
<a class="card" href="/dre/caixa">
<span class="icone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 9h20m-6 5h3"/><circle cx="8" cy="14" r="2"/></svg></span>
<h2>DRE Caixa</h2><p>Recebimentos e pagamentos pela data da baixa, para acompanhar o resultado realizado.</p>
<div class="criterio">Não inclui títulos em aberto nem provisões.<br>Fonte atual: Sankhya.</div><span class="abrir">Abrir DRE Caixa →</span></a>
</section>
<aside class="integracao"><strong>Integração atual: Sankhya.</strong> A estrutura do DRE Caixa está separada da origem dos dados para receber a integração com o Omie no futuro. O Omie ainda não está ativo neste relatório.</aside>
</main></body></html>`, { headers: { 'content-type': 'text/html; charset=UTF-8' } });
}
