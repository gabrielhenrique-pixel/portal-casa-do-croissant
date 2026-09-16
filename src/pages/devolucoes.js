export function devolucoesPage() {
  return new Response(String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    * { box-sizing: border-box; }

    :root {
      --verde: #0d4b2b;
      --verde-claro: #2f8a4e;
      --fundo: #f7faf8;
      --vermelho: #df3434;
      --texto: #173425;
      --borda: #dce7e0;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      color: var(--texto);
      background: var(--fundo);
    }

    main {
      max-width: 1700px;
      margin: 0 auto;
      padding: 26px 20px 34px;
    }

    .cabecalho {
      display:flex;
      align-items:center;
      gap:16px;
      margin-bottom:15px;
      padding:18px 34px;
      border-radius:18px;
      background:rgba(255,255,255,.92);
      box-shadow:0 8px 22px rgba(23,48,82,.11);
    }

    .navegacao-topo {
      display:flex;
      gap:8px;
      flex-shrink:0;
    }

    .nav-icone {
      display:grid;
      width:48px;
      height:48px;
      place-items:center;
      border-radius:50%;
      background:#fff;
      box-shadow:0 5px 15px rgba(23,48,82,.11);
      color:#102e49;
      font-size:25px;
      font-weight:700;
      text-decoration:none;
      transition:transform .15s,background .15s;
    }

    .nav-icone:hover {
      background:#edf3f9;
      transform:translateY(-2px);
    }

    .titulo-area {
      flex:1;
    }

    .filtros {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:18px;
      margin-bottom:20px;
      padding:14px 34px;
      border-radius:15px;
      background:rgba(255,255,255,.84);
      box-shadow:0 6px 18px rgba(23,48,82,.08);
    }

    .filtro,
    .card,
    .painel {
      border: 1px solid var(--borda);
      border-radius: 14px;
      background: white;
      box-shadow: 0 4px 13px rgba(22, 58, 38, .08);
    }

    .filtro {
      position:relative;
      flex:1 1 175px;
      padding:0;
      border:0;
      border-radius:0;
      background:transparent;
      box-shadow:none;
    }

    .filtro label {
      display:block;
      margin-bottom:5px;
      color:#17375f;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    }

    .filtro input,
    .filtro select {
      width:100%;
      height:39px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      outline:0;
      padding:0 10px;
      color:#142f57;
      background:#fff;
      font-size:14px;
    }

    .periodo-inputs {
      display:flex;
      align-items:center;
      gap:7px;
      height:39px;
      padding:0 10px;
      border:1px solid #c6d4e4;
      border-radius:7px;
      background:#fff;
    }

    .periodo-inputs input {
      min-width:0;
      height:auto;
      padding:0;
      border:0;
      border-radius:0;
    }

    .indicadores {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .card {
      min-height: 146px;
      padding: 15px;
      text-align: center;
    }

    .card-titulo {
      min-height: 30px;
      color: #1c241f;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .card-conteudo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 11px 0 13px;
    }

    .card-icone {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--vermelho);
      color: white;
      font-size: 27px;
    }

    .card-icone.verde {
      background: var(--verde);
    }

    .card-valor {
      color: var(--vermelho);
      font-size: 24px;
      font-weight: bold;
    }

    .card-valor.verde {
      color: var(--verde);
    }

    .card-rodape {
      min-height: 18px;
      color: #66736b;
      font-size: 12px;
    }

    .maior-parceiro {
      min-height: 52px;
      color: var(--verde);
      font-size: 16px;
      font-weight: bold;
      line-height: 1.35;
    }

    .graficos {
      display: grid;
      grid-template-columns: 1.05fr 1.25fr 1.25fr 1.25fr;
      gap: 14px;
      margin-bottom: 20px;
    }

    .painel {
      overflow: hidden;
      padding: 16px;
    }

    .painel h2 {
      margin: 0 0 14px;
      color: #1c241f;
      font-size: 13px;
      text-align: center;
      text-transform: uppercase;
    }

    .painel-impacto {
      min-height: 300px;
    }

    .impacto-conteudo {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 240px;
      text-align: center;
    }

    .impacto-indisponivel {
      color: #6b786f;
      font-size: 15px;
      line-height: 1.5;
    }

    .impacto-indisponivel strong {
      display: block;
      margin-bottom: 8px;
      color: var(--verde);
      font-size: 19px;
    }

    .grafico-barras {
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 12px;
  height: 300px;
  padding: 10px 4px 0;
}

    .barra-coluna {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: end;
      min-width: 0;
      height: 100%;
    }

    .barra-valor {
      margin-bottom: 6px;
      color: #273c31;
      font-size: 11px;
      font-weight: bold;
      white-space: nowrap;
    }

    .barra {
      width: min(48px, 80%);
      min-height: 4px;
      border-radius: 5px 5px 0 0;
      background: linear-gradient(#dc3030, #f69c9c);
    }

    .barra-label {
  display: -webkit-box;
  height: 108px;
  min-height: 108px;
  margin-top: 7px;
  overflow: hidden;
  color: #445047;
  font-size: 10px;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 9;
}

    .barras-horizontais {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 8px;
    }

    .barra-horizontal-linha {
      display: grid;
      grid-template-columns: 125px 1fr 54px;
      align-items: center;
      gap: 8px;
    }

    .barra-horizontal-nome {
      overflow: hidden;
      font-size: 11px;
      line-height: 1.2;
      text-overflow: ellipsis;
    }

    .barra-horizontal-fundo {
      height: 23px;
      overflow: hidden;
      border-radius: 3px;
      background: #f6dddd;
    }

    .barra-horizontal {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #ee8d8d, #d92929);
    }

    .barra-horizontal-valor {
      color: #2e3e34;
      font-size: 11px;
      font-weight: bold;
    }

    .grafico-linha {
      width: 100%;
      height: 240px;
    }

    .linha-vazia,
    .mensagem-erro {
      padding: 35px 10px;
      color: #6b786f;
      font-size: 14px;
      text-align: center;
    }

    .inferior {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

    .tabela-area {
      padding: 0;
    }

    .tabela-titulo {
      padding: 15px 16px 8px;
      color: var(--verde);
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .tabela-scroll {
      overflow-x: auto;
      padding: 0 12px 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th {
      padding: 8px 10px;
      color: white;
      background: var(--verde);
      text-align: left;
    }

    td {
      padding: 9px 10px;
      border-bottom: 1px solid #e5ede8;
      color: #34443b;
    }

    tr:nth-child(even) td {
      background: #f4f7f5;
    }

    .status {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 20px;
      background: #ffe2e2;
      color: #d82c2c;
      font-weight: bold;
    }

    .tabela-rodape {
      padding: 4px 16px 15px;
      color: #65736a;
      font-size: 12px;
      text-align: right;
    }

    .insights {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .insight {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 14px 3px;
      border-bottom: 1px solid #dfe8e2;
      color: #536158;
      font-size: 13px;
      line-height: 1.4;
    }

    .insight:last-child {
      border-bottom: 0;
    }

    .insight-icone {
      min-width: 36px;
      color: var(--verde);
      font-size: 26px;
      text-align: center;
    }

    .carregando {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f8f7;
  opacity: 1;
  transition: opacity .25s ease;
}

.carregando.esconder {
  opacity: 0;
  pointer-events: none;
}

.carregando-caixa {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #123d2d;
  font-size: 14px;
}

.anel-carregamento {
  width: 42px;
  height: 42px;
  border: 5px solid #cfe4d8;
  border-top-color: #25724d;
  border-radius: 50%;
  animation: girar-carregamento .8s linear infinite;
}

@keyframes girar-carregamento {
  to {
    transform: rotate(360deg);
  }
}

    @media (max-width: 1250px) {
      .filtros { grid-template-columns: repeat(3, 1fr); }
      .indicadores { grid-template-columns: repeat(3, 1fr); }
      .graficos { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 760px) {
      main { padding: 18px 12px; }
      .cabecalho {
        gap:12px;
        padding:16px;
      }
      .nav-icone {
        width:42px;
        height:42px;
        font-size:22px;
      }
      h1 { font-size:23px; }
      .filtros { padding:14px; }
      .filtro { flex-basis:100%; }
      .atualizado { display: none; }
      .filtros,
      .indicadores,
      .graficos,
      .inferior { grid-template-columns: 1fr; }
    }

.card-conteudo {
  min-width: 0;
}

.card-icone {
  flex-shrink: 0;
}

.card-icone svg,
.atualizado-icone svg {
  width: 26px;
  height: 26px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
}

.card-icone svg text {
  fill: currentColor;
  stroke: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}

.card-valor {
  min-width: 0;
  font-size: clamp(17px, 1.8vw, 24px);
  white-space: nowrap;
}

.maior-parceiro {
  min-width: 0;
  overflow-wrap: anywhere;
}

.grafico-impacto {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: conic-gradient(#2f8a4e 0deg 360deg);
}

.grafico-impacto-centro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: white;
}

.grafico-impacto-centro strong {
  color: #d93434;
  font-size: 28px;
}

.grafico-impacto-centro span {
  margin-top: 4px;
  color: #33443a;
  font-size: 14px;
  font-weight: bold;
}

.impacto-legenda {
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #304137;
  font-size: 14px;
}

.impacto-legenda div {
  display: grid;
  grid-template-columns: 15px 1fr;
  gap: 8px;
  align-items: center;
}

.impacto-legenda strong {
  grid-column: 2;
  color: #173f2a;
  font-size: 16px;
}

.ponto {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.ponto.faturamento {
  background: #2f8a4e;
}

.ponto.devolucao {
  background: #df3434;
}

.card-total {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 118px;
  padding: 14px 16px;
}

.card-total .card-titulo {
  min-height: auto;
  font-size: 11px;
}

.card-total-principal {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
  padding-left: 56px;
}

.icone-total {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  border-radius: 50%;
  background: #df3434;
  color: white;
  font-size: 25px;
  font-weight: bold;
}

.valor-total {
  color: #df3434;
  font-size: 21px;
  font-weight: bold;
  white-space: nowrap;
}

.card-comparativo {
  color: #66736b;
  font-size: 11px;
}

.card-comparativo span {
  margin-left: 5px;
  color: #df3434;
  font-weight: bold;
}

.card-quantidade {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 118px;
  padding: 14px 16px;
}

.card-quantidade .card-titulo {
  min-height: auto;
  font-size: 11px;
}

.card-quantidade-principal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  margin: 8px 0;
}

.icone-quantidade {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  border-radius: 50%;
  background: #df3434;
}

.icone-quantidade svg {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: white;
  stroke-width: 2;
}

.valor-quantidade {
  color: #df3434;
  font-size: 22px;
  font-weight: bold;
  white-space: nowrap;
}

.card-total-principal,
.card-quantidade-principal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  margin: 8px 0;
}

.card-total-principal .icone-total,
.card-quantidade-principal .icone-quantidade {
  position: absolute;
  top: 0;
  left: 0;
}

.card-ocorrencias {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 118px;
  padding: 14px 16px;
}

.card-ocorrencias .card-titulo {
  min-height: auto;
  font-size: 11px;
}

.card-ocorrencias-principal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  margin: 8px 0;
}

.icone-ocorrencias {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background: #df3434;
}

.icone-ocorrencias svg {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: white;
  stroke-width: 2;
}

.valor-ocorrencias {
  color: #df3434;
  font-size: 22px;
  font-weight: bold;
}

.card-ticket {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 118px;
  padding: 14px 16px;
}

.card-ticket .card-titulo {
  min-height: auto;
  font-size: 11px;
}

.card-ticket-principal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  margin: 8px 0;
}

.icone-ticket {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background: #0d4b2b;
}

.icone-ticket svg {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: white;
  stroke-width: 2;
}

.valor-ticket {
  color: #0d4b2b;
  font-size: 22px;
  font-weight: bold;
  white-space: nowrap;
}

.card-parceiro {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 118px;
  padding: 14px 16px;
}

.card-parceiro .card-titulo {
  min-height: auto;
  font-size: 11px;
}

.card-parceiro-principal {
  display: grid;
  grid-template-columns: 43px 1fr;
  align-items: center;
  gap: 12px;
  margin: 8px 0 4px;
}

.icone-parceiro {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background: #0d4b2b;
}

.icone-parceiro svg {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: white;
  stroke-width: 2;
}

.nome-parceiro {
  color: #0d4b2b;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.25;
  text-align: left;
  text-transform: uppercase;
}

.valor-parceiro {
  padding-left: 0;
  color: #0d4b2b;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.card-impacto {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  padding: 15px 10px;
}

.card-impacto h2 {
  margin: 0;
  font-size: 13px;
  text-align: center;
  text-transform: uppercase;
}

.card-impacto-corpo {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  padding-top: 8px;
}

.legenda-impacto {
  order: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;
  width: 100%;
  margin-top: auto;
  padding-top: 12px;
}

.item-legenda {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 7px;
  align-items: start;
  color: #263a2f;
  font-size: 13px;
  line-height: 1.25;
}

.item-legenda > span {
  width: 9px;
  height: 9px;
  margin-top: 4px;
  border-radius: 50%;
}

.item-legenda.faturamento > span {
  background: #2f8a4e;
}

.item-legenda.devolucoes > span {
  background: #df3434;
}

.item-legenda b {
  display: block;
  font-weight: 600;
}

.item-legenda strong {
  display: block;
  margin-top: 3px;
  color: #1b3526;
  font-size: 14px;
}

.donut-impacto {
  order: 1;
  width: 220px;
  height: 220px;
  max-width: 100%;
  flex: 0 0 220px;
}

.painel-evolucao {
  min-height: 300px;
  padding: 16px 12px;
}

.painel-evolucao h2 {
  margin-bottom: 4px;
}

#graficoEvolucao {
  min-height: 245px;
}

.painel-evolucao .grafico-linha {
  display: block;
  width: 100%;
  height: 245px;
}

.tabela-rodape {
  position: relative;
  min-height: 20px;
  padding: 7px 16px 15px;
  text-align: center;
}

.botao-ver-todas {
  position: absolute;
  right: 16px;
  top: 7px;
  border: 0;
  background: transparent;
  color: #176239;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.botao-ver-todas:hover {
  color: #0b4225;
  text-decoration: underline;
}

  </style>
</head>

<body>
  <div id="carregando" class="carregando">
  <div class="carregando-caixa">
    <div class="anel-carregamento"></div>
    <strong>Carregando devoluções...</strong>
  </div>
</div>

  <main>
    <header class="cabecalho">
      <nav class="navegacao-topo" aria-label="Navegação">
        <a class="nav-icone" href="/dashboards" aria-label="Voltar aos dashboards">←</a>
        <a class="nav-icone" href="/" aria-label="Voltar à página inicial">⌂</a>
      </nav>
      <div class="titulo-area"><h1>PAINEL DE DEVOLUÇÕES</h1></div>
    </header>

    <section class="filtros">
      <div class="filtro">
        <label>Período</label>
        <div class="periodo-inputs">
          <input id="filtroInicio" type="date" onchange="carregarDevolucoes()">
          <span>até</span>
          <input id="filtroFim" type="date" onchange="carregarDevolucoes()">
        </div>
      </div>

      <div class="filtro">
        <label>Parceiro</label>
        <select id="filtroParceiro" onchange="aplicarFiltros()">
          <option value="">Todos</option>
        </select>
      </div>

      <div class="filtro">
        <label>Código do Parceiro</label>
        <select id="filtroCodigo" onchange="aplicarFiltros()">
          <option value="">Todos</option>
        </select>
      </div>

      <div class="filtro">
        <label>Produto</label>
        <select id="filtroProduto" onchange="aplicarFiltros()">
          <option value="">Todos</option>
        </select>
      </div>

      <div class="filtro">
        <label>Região / Loja</label>
        <select id="filtroRegiao" disabled title="Será conectado quando definirmos o campo de região no Sankhya.">
          <option>Todas</option>
        </select>
      </div>
    </section>

    <section class="indicadores">
      <article class="card card-total">
  <div class="card-titulo">Valor total devolvido</div>

  <div class="card-total-principal">
    <span class="icone-total">$</span>
    <span id="cardValorTotal" class="valor-total">R$ 0,00</span>
  </div>

  <div class="card-comparativo">
    vs. período anterior
    <span id="variacaoValorTotal">—</span>
  </div>
</article>

      <article class="card card-quantidade">
  <div class="card-titulo">Qtd. de itens devolvidos</div>

  <div class="card-quantidade-principal">
    <span class="icone-quantidade">
      <svg viewBox="0 0 24 24">
        <path d="M4 8l8-4 8 4-8 4z"></path>
        <path d="M4 8v8l8 4 8-4V8"></path>
        <path d="M12 12v8"></path>
      </svg>
    </span>

    <span id="cardQuantidade" class="valor-quantidade">0</span>
  </div>

  <div class="card-comparativo">
    vs. período anterior
    <span id="variacaoQuantidade">—</span>
  </div>
</article>

      <article class="card card-ocorrencias">
  <div class="card-titulo">Nº de ocorrências</div>

  <div class="card-ocorrencias-principal">
    <span class="icone-ocorrencias">
      <svg viewBox="0 0 24 24">
        <rect x="5" y="4" width="14" height="17" rx="2"></rect>
        <path d="M9 4v-2h6v2"></path>
        <path d="M9 10h6M9 14h6M9 18h4"></path>
      </svg>
    </span>

    <span id="cardOcorrencias" class="valor-ocorrencias">0</span>
  </div>

  <div class="card-comparativo">
    vs. período anterior
    <span id="variacaoOcorrencias">—</span>
  </div>
</article>

      <article class="card card-ticket">
  <div class="card-titulo">Ticket médio da devolução</div>

  <div class="card-ticket-principal">
    <span class="icone-ticket">
      <svg viewBox="0 0 24 24">
        <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"></path>
        <path d="M12 8v8"></path>
      </svg>
    </span>

    <span id="cardTicketMedio" class="valor-ticket">R$ 0,00</span>
  </div>

  <div class="card-comparativo">
    vs. período anterior
    <span id="variacaoTicket">—</span>
  </div>
</article>

      <article class="card card-parceiro">
  <div class="card-titulo">Parceiro com maior devolução</div>

  <div class="card-parceiro-principal">
    <span class="icone-parceiro">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path>
      </svg>
    </span>

    <div id="cardMaiorParceiro" class="nome-parceiro">—</div>
  </div>

  <div id="cardMaiorParceiroValor" class="valor-parceiro">R$ 0,00</div>
</article>

    </section>

    <section class="graficos">
      
      <article class="painel painel-impacto card-impacto">
  <h2>Impacto no faturamento</h2>

  <div class="card-impacto-corpo">
    <div class="legenda-impacto">
      <div class="item-legenda faturamento">
        <span></span>
        <div>
          <b>Faturamento</b>
          <strong id="valorFaturamento">R$ 0,00</strong>
        </div>
      </div>

      <div class="item-legenda devolucoes">
        <span></span>
        <div>
          <b>Devoluções</b>
          <strong id="valorDevolucoesImpacto">R$ 0,00</strong>
        </div>
      </div>
    </div>

    <svg class="donut-impacto" viewBox="0 0 210 210">
      <circle
        cx="105"
        cy="105"
        r="72"
        fill="none"
        stroke="#2f8a4e"
        stroke-width="34">
      </circle>

      <circle
        id="arcoImpacto"
        cx="105"
        cy="105"
        r="72"
        fill="none"
        stroke="#df3434"
        stroke-width="34"
        pathLength="100"
        stroke-dasharray="0 100"
        transform="rotate(-90 105 105)">
      </circle>

      <text
        id="percentualImpacto"
        x="105"
        y="99"
        text-anchor="middle"
        fill="#df3434"
        font-family="Arial"
        font-size="27"
        font-weight="bold">0,00%</text>

      <text
        x="105"
        y="124"
        text-anchor="middle"
        fill="#173425"
        font-family="Arial"
        font-size="16"
        font-weight="bold">Impacto</text>
    </svg>
  </div>
</article>

      <article class="painel">
  <h2>Top 5 parceiros com maior devolução</h2>
  <div id="graficoParceiros" class="grafico-barras"></div>
</article>

      <article class="painel">
        <h2>Top produtos com mais devolução</h2>
        <div id="graficoProdutos" class="barras-horizontais"></div>
      </article>

      <article class="painel painel-evolucao">
  <h2>Evolução das devoluções no período</h2>
  <div id="graficoEvolucao"></div>
</article>
    </section>

    <section class="inferior">
      <article class="painel tabela-area">
        <div class="tabela-titulo">Últimas devoluções registradas</div>

        <div class="tabela-scroll">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Parceiro</th>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="linhasTabela"></tbody>
          </table>
        </div>

        <div id="tabelaRodape" class="tabela-rodape"></div>
      </article>

    </section>
  </main>

  <script>
    var devolucoes = [];
    var devolucoesFiltradas = [];
    var faturamentoPeriodo = 0;
    var tabelaCompleta = false;

    aplicarIconesVetoriais();
    configurarPeriodoInicial();
    carregarDevolucoes();

function aplicarIconesVetoriais() {
  var icones = [
    '<span style="color:#ffffff;font-size:20px;font-weight:bold">R$</span>',

    '<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2">' +
      '<path d="M4 8l8-4 8 4-8 4z"></path>' +
      '<path d="M4 8v8l8 4 8-4V8"></path>' +
      '<path d="M12 12v8"></path>' +
    '</svg>',

    '<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2">' +
      '<rect x="5" y="4" width="14" height="17" rx="2"></rect>' +
      '<path d="M9 4v-2h6v2"></path>' +
      '<path d="M9 10h6M9 14h6M9 18h4"></path>' +
    '</svg>',

    '<span style="color:#ffffff;font-size:20px;font-weight:bold">R$</span>',

    '<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2">' +
      '<circle cx="12" cy="8" r="4"></circle>' +
      '<path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path>' +
    '</svg>'
  ];

  document.querySelectorAll('.card-icone').forEach(function(elemento, indice) {
    elemento.style.flex = '0 0 52px';
    elemento.style.width = '52px';
    elemento.style.height = '52px';
    elemento.innerHTML = icones[indice] || '';
  });

  var iconeAtualizacao = document.querySelector('.atualizado-icone');

  if (iconeAtualizacao) {
    iconeAtualizacao.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0d4b2b" stroke-width="2.2">' +
        '<rect x="4" y="5" width="16" height="15" rx="2"></rect>' +
        '<path d="M8 3v4M16 3v4M4 10h16"></path>' +
        '<path d="M8 14h3M13 14h3"></path>' +
      '</svg>';
  }
}

    function configurarPeriodoInicial() {
      var hoje = new Date();
      var inicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 1,
        hoje.getDate()
      );

      document.getElementById('filtroInicio').value = dataParaInput(inicio);
      document.getElementById('filtroFim').value = dataParaInput(hoje);
    }

    function carregarDevolucoes() {
      mostrarCarregando(true);

      var inicio = document.getElementById('filtroInicio').value;
      var fim = document.getElementById('filtroFim').value;

      fetch('/api/devolucoes?inicio=' + encodeURIComponent(inicio) +
        '&fim=' + encodeURIComponent(fim))
        .then(function(resposta) {
          return resposta.json().catch(function() { return {}; })
            .then(function(dados) {
              if (!resposta.ok) {
                throw new Error(dados.error || 'Não foi possível carregar as devoluções do Sankhya.');
              }
              return dados;
            });
        })
        .then(function(dados) {
          devolucoes = dados.items || [];
          faturamentoPeriodo = Number(dados.faturamento || 0);
          preencherFiltros();
          aplicarFiltros();
          atualizarData();
        })
        .catch(function(erro) {
          mostrarErro(erro.message || 'Não foi possível carregar as devoluções do Sankhya.');
        })
        .finally(function() {
          mostrarCarregando(false);
        });
    }

    function preencherFiltros() {
      preencherSelect(
        'filtroParceiro',
        devolucoes.map(function(item) {
          return item.parceiro;
        })
      );

      preencherSelect(
        'filtroCodigo',
        devolucoes.map(function(item) {
          return item.codigoParceiro;
        })
      );

      preencherSelect(
        'filtroProduto',
        devolucoes.map(function(item) {
          return item.produto;
        })
      );
    }

    function preencherSelect(id, valores) {
      var select = document.getElementById(id);
      var selecionado = select.value;

      var unicos = valores
        .filter(function(valor) {
          return valor;
        })
        .filter(function(valor, indice, lista) {
          return lista.indexOf(valor) === indice;
        })
        .sort();

      select.innerHTML = '<option value="">Todos</option>';

      unicos.forEach(function(valor) {
        var opcao = document.createElement('option');
        opcao.value = valor;
        opcao.textContent = valor;
        select.appendChild(opcao);
      });

      select.value = selecionado;
    }

    function atualizarImpactoNoFaturamento() {
  var valorDevolvido = devolucoesFiltradas.reduce(function(total, item) {
    return total + Number(item.valorTotal || 0);
  }, 0);

  var percentual = faturamentoPeriodo > 0
    ? (valorDevolvido / faturamentoPeriodo) * 100
    : 0;

  var percentualGrafico = Math.min(percentual, 100);
  var graus = percentualGrafico * 3.6;

  document.getElementById('percentualImpacto').textContent =
    percentual.toFixed(2).replace('.', ',') + '%';

  document.getElementById('valorFaturamento').textContent =
    formatarMoeda(faturamentoPeriodo);

  document.getElementById('valorDevolucoesImpacto').textContent =
    formatarMoeda(valorDevolvido);

  document.getElementById('arcoImpacto').setAttribute(
  'stroke-dasharray',
  percentualGrafico + ' ' + (100 - percentualGrafico)
);
}

    function aplicarFiltros() {
      tabelaCompleta = false;

      var parceiro = document.getElementById('filtroParceiro').value;
      var codigo = document.getElementById('filtroCodigo').value;
      var produto = document.getElementById('filtroProduto').value;

      devolucoesFiltradas = devolucoes.filter(function(item) {
        return (!parceiro || item.parceiro === parceiro) &&
          (!codigo || item.codigoParceiro === codigo) &&
          (!produto || item.produto === produto);
      });

      atualizarPainel();
    }

    function atualizarPainel() {
      atualizarIndicadores();
      atualizarImpactoNoFaturamento();
      montarGraficoParceiros();
      montarGraficoProdutos();
      montarGraficoEvolucao();
      montarTabela();
    }

    function atualizarIndicadores() {
      var valorTotal = devolucoesFiltradas.reduce(function(total, item) {
        return total + Number(item.valorTotal || 0);
      }, 0);

      var quantidade = devolucoesFiltradas.reduce(function(total, item) {
        return total + Number(item.quantidade || 0);
      }, 0);

      var notas = {};

      devolucoesFiltradas.forEach(function(item) {
        if (item.numeroNota) {
          notas[item.numeroNota] = true;
        }
      });

      var ocorrencias = Object.keys(notas).length;
      var ticket = ocorrencias ? valorTotal / ocorrencias : 0;
      var parceiros = somarPorCampo('parceiro');
      var maior = parceiros[0];

      document.getElementById('cardValorTotal').textContent =
        formatarMoeda(valorTotal);

      document.getElementById('cardQuantidade').textContent =
        formatarNumero(quantidade);

      document.getElementById('cardOcorrencias').textContent =
        formatarNumero(ocorrencias);

      document.getElementById('cardTicketMedio').textContent =
        formatarMoeda(ticket);

      document.getElementById('cardMaiorParceiro').textContent =
        maior ? maior.nome : '—';

      document.getElementById('cardMaiorParceiroValor').textContent =
       maior
    ? formatarMoeda(maior.valor) + ' (' +
      ((maior.valor / valorTotal) * 100).toFixed(1).replace('.', ',') + '%)'
    : 'R$ 0,00';
    }

    function somarPorCampo(campo) {
      var totais = {};

      devolucoesFiltradas.forEach(function(item) {
        var nome = item[campo] || 'Não informado';

        if (!totais[nome]) {
          totais[nome] = 0;
        }

        totais[nome] += Number(item.valorTotal || 0);
      });

      return Object.keys(totais)
        .map(function(nome) {
          return {
            nome: nome,
            valor: totais[nome]
          };
        })
        .sort(function(a, b) {
          return b.valor - a.valor;
        });
    }

    function montarGraficoParceiros() {
      var area = document.getElementById('graficoParceiros');
      var dados = somarPorCampo('parceiro').slice(0, 5);

      if (!dados.length) {
        area.innerHTML = '<div class="linha-vazia">Nenhuma devolução encontrada.</div>';
        return;
      }

      var maior = dados[0].valor;

      area.innerHTML = dados.map(function(item) {
        var altura = Math.max(5, (item.valor / maior) * 135);

        return (
          '<div class="barra-coluna">' +
            '<div class="barra-valor">' + formatarMoedaCurta(item.valor) + '</div>' +
            '<div class="barra" style="height:' + altura + 'px"></div>' +
            '<div class="barra-label">' + escaparHtml(item.nome) + '</div>' +
          '</div>'
        );
      }).join('');
    }

    function montarGraficoProdutos() {
      var area = document.getElementById('graficoProdutos');
      var dados = somarPorCampo('produto').slice(0, 5);

      if (!dados.length) {
        area.innerHTML = '<div class="linha-vazia">Nenhuma devolução encontrada.</div>';
        return;
      }

      var maior = dados[0].valor;

      area.innerHTML = dados.map(function(item) {
        var largura = Math.max(3, (item.valor / maior) * 100);

        return (
          '<div class="barra-horizontal-linha">' +
            '<div class="barra-horizontal-nome">' + escaparHtml(item.nome) + '</div>' +
            '<div class="barra-horizontal-fundo">' +
              '<div class="barra-horizontal" style="width:' + largura + '%"></div>' +
            '</div>' +
            '<div class="barra-horizontal-valor">' + formatarMoedaCurta(item.valor) + '</div>' +
          '</div>'
        );
      }).join('');
    }

    function montarGraficoEvolucao() {
  var area = document.getElementById('graficoEvolucao');
  var totais = {};

  devolucoesFiltradas.forEach(function(item) {
    if (!totais[item.data]) {
      totais[item.data] = 0;
    }

    totais[item.data] += Number(item.valorTotal || 0);
  });

  var dados = Object.keys(totais)
    .sort()
    .map(function(data) {
      return {
        data: data,
        valor: totais[data]
      };
    });

  if (!dados.length) {
    area.innerHTML = '<div class="linha-vazia">Nenhuma devolução encontrada.</div>';
    return;
  }

  var limite = 5;

  if (dados.length > limite) {
    var passo = Math.ceil(dados.length / limite);

    dados = dados.filter(function(item, indice) {
      return indice % passo === 0 || indice === dados.length - 1;
    });
  }

  var maiorValor = Math.max.apply(null, dados.map(function(item) {
    return item.valor;
  }));

  var limiteY = Math.ceil(maiorValor / 10000) * 10000;

  if (limiteY < 10000) {
    limiteY = 10000;
  }

  var largura = 400;
  var altura = 245;
  var esquerda = 42;
  var direita = 14;
  var topo = 32;
  var base = 207;
  var larguraUtil = largura - esquerda - direita;
  var alturaUtil = base - topo;

  function valorMil(valor) {
    var mil = valor / 1000;

    if (mil >= 10) {
      return Math.round(mil) + ' mil';
    }

    return mil.toFixed(1).replace('.', ',') + ' mil';
  }

  var pontos = dados.map(function(item, indice) {
    var x = esquerda + (
      dados.length === 1
        ? larguraUtil / 2
        : indice * (larguraUtil / (dados.length - 1))
    );

    var y = base - ((item.valor / limiteY) * alturaUtil);

    return {
      x: x,
      y: y,
      item: item
    };
  });

  var linha = pontos.map(function(ponto) {
    return ponto.x + ',' + ponto.y;
  }).join(' ');

  var areaPreenchida =
    'M ' + pontos[0].x + ' ' + base +
    ' L ' + linha.replace(/,/g, ' ') +
    ' L ' + pontos[pontos.length - 1].x + ' ' + base +
    ' Z';

  var grades = '';
  var rotulosEixo = '';

  for (var i = 0; i <= 4; i++) {
    var valorEixo = limiteY - (limiteY * i / 4);
    var yEixo = topo + (alturaUtil * i / 4);

    grades +=
      '<line x1="' + esquerda + '" y1="' + yEixo +
      '" x2="' + (largura - direita) + '" y2="' + yEixo +
      '" stroke="#edf1ee" stroke-width="1"></line>';

    rotulosEixo +=
      '<text x="' + (esquerda - 7) + '" y="' + (yEixo + 4) +
      '" text-anchor="end" font-size="10" fill="#36453d">' +
      (valorEixo === 0 ? '0' : valorMil(valorEixo)) +
      '</text>';
  }

  var rotulosDatas = pontos.map(function(ponto) {
    return (
      '<text x="' + ponto.x + '" y="228" text-anchor="middle" ' +
      'font-size="10" fill="#36453d">' +
      formatarData(ponto.item.data).substring(0, 5) +
      '</text>'
    );
  }).join('');

  var valores = pontos.map(function(ponto) {
    var yTexto = Math.max(topo + 12, ponto.y - 11);

    return (
      '<text x="' + ponto.x + '" y="' + yTexto +
      '" text-anchor="middle" font-size="10" font-weight="bold" ' +
      'fill="#26362e">' + valorMil(ponto.item.valor) + '</text>'
    );
  }).join('');

  var circulos = pontos.map(function(ponto) {
    return (
      '<circle cx="' + ponto.x + '" cy="' + ponto.y +
      '" r="4.5" fill="#dc3333"></circle>'
    );
  }).join('');

  area.innerHTML =
    '<svg class="grafico-linha" viewBox="0 0 400 245" preserveAspectRatio="none">' +
      '<defs>' +
        '<linearGradient id="preenchimentoEvolucao" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#df3434" stop-opacity="0.35"></stop>' +
          '<stop offset="100%" stop-color="#df3434" stop-opacity="0.02"></stop>' +
        '</linearGradient>' +
      '</defs>' +
      '<text x="4" y="17" font-size="10" fill="#26362e">R$ (Mil)</text>' +
      grades +
      rotulosEixo +
      '<path d="' + areaPreenchida + '" fill="url(#preenchimentoEvolucao)"></path>' +
      '<polyline points="' + linha +
        '" fill="none" stroke="#dc3333" stroke-width="3"></polyline>' +
      circulos +
      valores +
      rotulosDatas +
    '</svg>';
}

    function montarTabela() {
  var corpo = document.getElementById('linhasTabela');
  var rodape = document.getElementById('tabelaRodape');
  var total = devolucoesFiltradas.length;

  var itens = tabelaCompleta
    ? devolucoesFiltradas
    : devolucoesFiltradas.slice(0, 5);

  if (!itens.length) {
    corpo.innerHTML =
      '<tr><td colspan="6" style="text-align:center">Nenhuma devolução encontrada.</td></tr>';

    rodape.innerHTML = '';
    return;
  }

  corpo.innerHTML = itens.map(function(item) {
    return (
      '<tr>' +
        '<td>' + formatarData(item.data) + '</td>' +
        '<td>' + escaparHtml(item.parceiro) + '</td>' +
        '<td>' + escaparHtml(item.produto) + '</td>' +
        '<td>' + formatarNumero(item.quantidade) + '</td>' +
        '<td>' + formatarMoeda(item.valorTotal) + '</td>' +
        '<td><span class="status">Devolvido</span></td>' +
      '</tr>'
    );
  }).join('');

  var texto = tabelaCompleta
    ? 'Exibindo todas as ' + total + ' devoluções'
    : 'Exibindo 1 a ' + itens.length + ' de ' + total + ' registros';

  var botao = total > 5
    ? '<button class="botao-ver-todas" onclick="alternarTodasDevolucoes()">' +
        (tabelaCompleta ? 'Mostrar menos ↑' : 'Ver todas →') +
      '</button>'
    : '';

  rodape.innerHTML =
    '<span>' + texto + '</span>' +
    botao;
}

function alternarTodasDevolucoes() {
  tabelaCompleta = !tabelaCompleta;
  montarTabela();
}

    function montarInsights() {
      var area = document.getElementById('listaInsights');
      var parceiros = somarPorCampo('parceiro');
      var produtos = somarPorCampo('produto');

      if (!devolucoesFiltradas.length) {
        area.innerHTML =
          '<div class="insight"><span class="insight-icone">●</span>Nenhum dado para gerar insights.</div>';
        return;
      }

      var valorTotal = devolucoesFiltradas.reduce(function(total, item) {
        return total + Number(item.valorTotal || 0);
      }, 0);

      var topParceiros = parceiros.slice(0, 3);
      var concentracao = topParceiros.reduce(function(total, item) {
        return total + item.valor;
      }, 0);

      var percentual = valorTotal
        ? (concentracao / valorTotal) * 100
        : 0;

      area.innerHTML =
        '<div class="insight">' +
          '<span class="insight-icone">♟</span>' +
          '<span>Os três maiores parceiros concentram ' +
          '<strong>' + percentual.toFixed(1).replace('.', ',') + '%</strong> ' +
          'do valor devolvido.</span>' +
        '</div>' +
        '<div class="insight">' +
          '<span class="insight-icone">◒</span>' +
          '<span><strong>' +
          escaparHtml(produtos[0] ? produtos[0].nome : '—') +
          '</strong> é o produto com maior impacto financeiro.</span>' +
        '</div>' +
        '<div class="insight">' +
          '<span class="insight-icone">◆</span>' +
          '<span><strong>' +
          escaparHtml(parceiros[0] ? parceiros[0].nome : '—') +
          '</strong> é o parceiro com maior volume devolvido.</span>' +
        '</div>' +
        '<div class="insight">' +
          '<span class="insight-icone">↗</span>' +
          '<span>Foram encontrados <strong>' +
          formatarNumero(devolucoesFiltradas.length) +
          '</strong> itens de devolução no período.</span>' +
        '</div>';
    }

    function mostrarErro(mensagem) {
      document.getElementById('graficoParceiros').innerHTML =
        '<div class="mensagem-erro">' + escaparHtml(mensagem) + '</div>';

      document.getElementById('graficoProdutos').innerHTML = '';
      document.getElementById('graficoEvolucao').innerHTML = '';
    }

    var tempoFecharCarregamento;

function mostrarCarregando(mostrar) {
  var tela = document.getElementById('carregando');

  if (mostrar) {
    clearTimeout(tempoFecharCarregamento);
    tela.style.display = 'flex';
    tela.classList.remove('esconder');
    return;
  }

  tela.classList.add('esconder');

  tempoFecharCarregamento = setTimeout(function() {
    tela.style.display = 'none';
  }, 250);
}

    function atualizarData() {
      document.getElementById('dataAtualizacao').textContent =
        new Date().toLocaleString('pt-BR');
    }

    function voltarInicio() {
      window.location.href = '/';
    }

    function dataParaInput(data) {
      var ano = data.getFullYear();
      var mes = String(data.getMonth() + 1).padStart(2, '0');
      var dia = String(data.getDate()).padStart(2, '0');

      return ano + '-' + mes + '-' + dia;
    }

    function formatarData(data) {
      if (!data) {
        return '—';
      }

      var partes = data.split('-');

      return partes.length === 3
        ? partes[2] + '/' + partes[1] + '/' + partes[0]
        : data;
    }

    function formatarMoeda(valor) {
      return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    function formatarMoedaCurta(valor) {
      if (valor >= 1000) {
        return 'R$ ' + (valor / 1000).toFixed(1).replace('.', ',') + ' mil';
      }

      return formatarMoeda(valor);
    }

    function formatarNumero(valor) {
      return Number(valor || 0).toLocaleString('pt-BR', {
        maximumFractionDigits: 2
      });
    }

    function escaparHtml(texto) {
      return String(texto || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  
  </script>
</body>
</html>
`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}

