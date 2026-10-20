import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { Script } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { listarDre } from '../src/dre-service.js';
import { filtrosDreCaixa, montarResultadoCaixa, listarDreCaixa, listarAuditoriaDreCaixa } from '../src/dre-caixa/service.js';
import { montarSqlCaixa } from '../src/dre-caixa/providers/sankhya.js';
import { criarProviderDreCaixa } from '../src/dre-caixa/providers/index.js';
import { drePage } from '../src/pages/dre.js';
import { dreInicioPage } from '../src/pages/dre-inicio.js';
import worker from '../src/index.js';

const env = { SANKHYA_CLIENT_ID: 'test', SANKHYA_CLIENT_SECRET: 'test', SANKHYA_X_TOKEN: 'test' };
const request = (query = '') => new Request('https://portal.test/api/dre/caixa?' + query);
const filtros = filtrosDreCaixa(request('inicio=2026-01-01&fim=2026-10-20'));
const provider = { id: 'sankhya', nome: 'Sankhya' };
const data = valor => Date.parse(valor + 'T00:00:00Z') / 86400000;

// Executa as expressões de rateio e as janelas SQL de verdade em SQLite.
// Somente as funções Oracle de datas/NVL são compatibilizadas; não substitui homologação Oracle.
function bancoFinanceiro() {
  const db = new DatabaseSync(':memory:');
  db.function('NVL', (valor, padrao) => valor ?? padrao);
  db.function('TO_DATE', (valor, _formato) => data(valor));
  db.function('TRUNC', valor => Math.floor(valor));
  db.function('TO_CHAR', (valor, formato) => {
    const iso = new Date(valor * 86400000).toISOString();
    return formato === 'YYYY-MM' ? iso.slice(0, 7) : iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
  });
  db.exec(`CREATE TABLE TGFFIN (NUFIN INTEGER, DHBAIXA REAL, CODPARC INTEGER, VLRBAIXA REAL,
    RECDESP INTEGER, CODEMP INTEGER, CODNAT INTEGER, VLRDESDOB REAL, PROVISAO TEXT);
    CREATE TABLE VGFFINRAT (NUFIN INTEGER, CODEMP INTEGER, CODNAT INTEGER, VLRDESDOB REAL);
    CREATE TABLE TGFNAT (CODNAT INTEGER, DESCRNAT TEXT);
    CREATE TABLE TGFPAR (CODPARC INTEGER, NOMEPARC TEXT);
    INSERT INTO TGFNAT VALUES (1010000,'Vendas'),(3010100,'Custo'),(7777777,'Sem classificação');
    INSERT INTO TGFPAR VALUES (1,'Parceiro teste');`);
  function titulo({ id, dia = '2026-02-01', valor = 100, sinal = 1, natureza = 1010000, empresa = 1, provisao = 'N', bruto = valor }) {
    db.prepare('INSERT INTO TGFFIN VALUES (?,?,?,?,?,?,?,?,?)').run(id, dia ? data(dia) : null, 1, valor, sinal, empresa, natureza, bruto, provisao);
  }
  function rateio(id, empresa, natureza, peso) { db.prepare('INSERT INTO VGFFINRAT VALUES (?,?,?,?)').run(id, empresa, natureza, peso); }
  function consultar(sql) {
    return db.prepare(sql.replace(/\bSYSDATE\b/g, String(data('2026-10-20')))).all().map(row => Object.values(row));
  }
  return { titulo, rateio, consultar, close: () => db.close() };
}

test('valida datas reais, ordem, empresa, natureza e limite anual', () => {
  for (const query of [
    'inicio=2026-02-30', 'fim=2025-02-29', 'inicio=abc',
    'inicio=2026-03-01&fim=2026-01-01', 'empresa=1%20OR%201=1',
    'inicio=2025-01-01&fim=2026-01-01'
  ]) assert.throws(() => filtrosDreCaixa(request(query)), { status: 400 });
  assert.throws(() => filtrosDreCaixa(request('natureza=1%27'), true), { status: 400 });
  const bissexto = filtrosDreCaixa(request('inicio=2024-02-29&fim=2024-02-29'));
  assert.equal(bissexto.inicioAnterior, '2023-02-28');
  assert.equal(bissexto.fimAnterior, '2023-02-28');
  const padrao = filtrosDreCaixa(request(), false, new Date('2026-10-21T01:00:00Z'));
  assert.equal(padrao.fim, '2026-10-20');
  assert.equal(padrao.inicio, '2026-01-01');
  assert.throws(() => filtrosDreCaixa(request('inicio=2026-10-01&fim=2026-10-21'), false, new Date('2026-10-20T15:00:00Z')), {status:400});
});

test('SQL caixa usa baixa real, não competência/notas, e elimina abertos, provisões, transferências neutras e baixas futuras', () => {
  const banco = bancoFinanceiro();
  try {
    banco.titulo({ id: 1, valor: 100 });
    banco.titulo({ id: 2, valor: 400, dia: null });
    banco.titulo({ id: 3, valor: 400, provisao: 'S' });
    banco.titulo({ id: 4, valor: 400, sinal: 0 });
    banco.titulo({ id: 5, valor: 400, dia: '2026-10-21' });
    banco.titulo({ id: 6, valor: 0 });
    const rows = banco.consultar(montarSqlCaixa(filtros));
    assert.equal(rows.length, 1);
    assert.equal(rows[0][3], 10000);
    assert.doesNotMatch(montarSqlCaixa(filtros), /TGFCAB|TGFITE|DTNEG|VLRDESC|VLRJURO/);
  } finally { banco.close(); }
});

test('rateio não duplica baixas, mantém centavos, sinais, natureza e empresa; filtro vem após divisão', () => {
  const banco = bancoFinanceiro();
  try {
    banco.titulo({ id: 1, valor: 10, bruto: 3, sinal: -1 });
    banco.rateio(1, 1, 1010000, 1);
    banco.rateio(1, 1, 3010100, 1);
    banco.rateio(1, 2, 7777777, 1);
    const rows = banco.consultar(montarSqlCaixa(filtros));
    assert.deepEqual(rows.map(row => row[3]).sort((a,b) => a-b), [-334,-333,-333]);
    assert.equal(rows.reduce((soma, row) => soma + row[3], 0), -1000);
    const empresa1 = banco.consultar(montarSqlCaixa({ ...filtros, empresa: '1' }));
    assert.equal(empresa1.reduce((soma, row) => soma + row[3], 0), -667);
    const auditoria = banco.consultar(montarSqlCaixa({ ...filtros, natureza: '1010000' }, true));
    assert.equal(auditoria[0][4], -334);
    assert.equal(auditoria[0][1], '01/02/2026');
  } finally { banco.close(); }
});

test('mesma natureza em vários centros é somada antes da distribuição e valor da baixa não é o valor bruto', () => {
  const banco = bancoFinanceiro();
  try {
    banco.titulo({ id: 1, valor: 90, bruto: 100 });
    banco.rateio(1, 1, 1010000, 40);
    banco.rateio(1, 1, 1010000, 60);
    assert.equal(banco.consultar(montarSqlCaixa(filtros))[0][3], 9000);
  } finally { banco.close(); }
});

test('rateio sem base é sinalizado e não convertido em zero silenciosamente', () => {
  const banco = bancoFinanceiro();
  try {
    banco.titulo({ id: 1, valor: 10, bruto: 0 });
    const rows = banco.consultar(montarSqlCaixa(filtros));
    assert.equal(rows[0][4], 1);
  } finally { banco.close(); }
});

test('recorte de comparação respeita dias inicial/final do ano anterior', () => {
  const banco = bancoFinanceiro();
  try {
    for (const [id, dia] of [[1,'2025-02-01'],[2,'2025-02-15'],[3,'2025-02-28'],[4,'2026-02-15']]) banco.titulo({ id, dia });
    const recorte = filtrosDreCaixa(request('inicio=2026-02-10&fim=2026-02-20'));
    const rows = banco.consultar(montarSqlCaixa(recorte));
    assert.equal(rows.length, 2);
    assert.equal(rows.reduce((soma, row) => soma + row[3], 0), 20000);
  } finally { banco.close(); }
});

test('modelo comum calcula subtotais, comparativos e A.V. por mês/total em centavos exatos e expõe pendências', () => {
  const dados = montarResultadoCaixa([
    {mes:'2026-01',categoria:'1010000',descricao:'Vendas',grupo:1,centavos:10001},
    {mes:'2026-02',categoria:'1010000',descricao:'Vendas',grupo:1,centavos:20002},
    {mes:'2025-01',categoria:'1010000',descricao:'Vendas',grupo:1,centavos:5000},
    {mes:'2026-01',categoria:'3010100',descricao:'Custos',grupo:4,centavos:-5001},
    {mes:'2026-01',categoria:'7777777',descricao:'Pendente',grupo:null,centavos:-300}
  ], filtros, provider);
  assert.equal(dados.subtotais.receitaBruta.total.resultado, 300.03);
  assert.equal(dados.subtotais.resultadoOperacional.total.resultado, 250.02);
  assert.equal(dados.subtotais.receitaBruta.indicadores['2026-01'].anoAnterior, 50);
  assert.equal(dados.subtotais.receitaBruta.indicadores['2026-01'].av, 100);
  assert.equal(dados.subtotais.custosProducao.total.av, 5001 / 30003 * 100);
  assert.equal(dados.subtotais.custosProducao.indicadores['2026-03'].av, null);
  assert.equal(dados.naoClassificados['2026-01'], -3);
  assert.deepEqual(dados.pendenciasClassificacao, [{codigo:'7777777',nome:'Pendente',valor:-3,valorAnterior:0}]);
  assert.throws(() => montarResultadoCaixa([{mes:'2026-01',categoria:'1',grupo:1,centavos:NaN}], filtros, provider));
});

test('origem não aceita Omie sem implementação nem faz fallback silencioso', async () => {
  await assert.rejects(criarProviderDreCaixa({ DRE_CAIXA_PROVIDER: 'omie' }), { status: 503 });
  await assert.rejects(criarProviderDreCaixa({ DRE_CAIXA_PROVIDER: 'outro' }), { status: 503 });
  await assert.rejects(criarProviderDreCaixa({}), { status: 503 });
});

test('categorias são identificadores do adaptador e pendências anteriores também são informadas', () => {
  const dados = montarResultadoCaixa([
    {mes:'2026-01',categoria:'001',descricao:'Categoria canônica',grupo:1,centavos:100},
    {mes:'2025-01',categoria:'sem-mapa',descricao:'Pendente anterior',grupo:null,centavos:200}
  ], filtros, {id:'adaptador-teste',nome:'Teste'});
  assert.equal(dados.subtotais.receitaBruta.total.resultado, 1);
  assert.equal(dados.grupos[0].detalhes[0].codigo, '001');
  assert.equal(dados.pendenciasClassificacao[0].valorAnterior, 2);
  assert.equal(dados.pendenciasClassificacao[0].valor, 0);
  assert.equal(dados.origem, 'adaptador-teste');
  assert.match(montarSqlCaixa(filtros,false,0), /^WITH RATEIOS/);
  assert.doesNotMatch(montarSqlCaixa(filtros,false,0), /\(\s*WITH /);
});

test('integração somente leitura pagina, cruza auditoria e total e falha em truncamento/rateio inválido', async () => {
  const banco = bancoFinanceiro();
  const originalFetch = globalThis.fetch;
  let consultas = 0;
  try {
    banco.titulo({ id: 1, valor: 123.45 });
    banco.titulo({ id: 2, valor: 54.32 });
    globalThis.fetch = async (url, init) => {
      if (String(url).endsWith('/authenticate')) return Response.json({ access_token: 'token-test' });
      const sql = JSON.parse(init.body).requestBody.sql;
      assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|MERGE|DROP)\b/i);
      consultas++;
      const rows = banco.consultar(sql);
      return Response.json({status:'1', responseBody:{rows: rows.slice(0,1)}});
    };
    const relatorio = await listarDreCaixa(request('inicio=2026-01-01&fim=2026-10-20'), env);
    const auditoria = await listarAuditoriaDreCaixa(request('inicio=2026-01-01&fim=2026-10-20&natureza=1010000'), env);
    assert.equal(relatorio.subtotais.receitaBruta.total.resultado, 177.77);
    assert.equal(Math.round(auditoria.lancamentos.reduce((n,l) => n+l.valor,0)*100), 17777);
    assert.equal(auditoria.lancamentos.length, 2);
    assert.ok(consultas >= 3, 'auditoria respeita limite do gateway, mesmo inferior a 500');
    banco.titulo({ id:3, valor:10, bruto:0 });
    await assert.rejects(listarDreCaixa(request('inicio=2026-01-01&fim=2026-10-20'), env), /rateio inválido/);
    let chamadas = 0;
    globalThis.fetch = async (url, init) => {
      if (String(url).endsWith('/authenticate')) return Response.json({ access_token: 'token-test' });
      const rows = banco.consultar(JSON.parse(init.body).requestBody.sql);
      return Response.json({status:'1', responseBody:{rows: ++chamadas === 1 ? rows.slice(0,1) : []}});
    };
    await assert.rejects(listarAuditoriaDreCaixa(request('inicio=2026-01-01&fim=2026-10-20&natureza=1010000'), env), /incompleta/);
  } finally { globalThis.fetch = originalFetch; banco.close(); }
});

test('extração do modelo não altera resposta nem SQL da competência existente', async () => {
  // Baseline anterior à extração, fixo para não comparar a implementação consigo mesma.
  const source = execFileSync('git', ['show', '368a8a87b22d04fd6a7efb736e720e8eea72efbd:src/dre-service.js'], { encoding: 'utf8' });
  const config = new URL('../src/dre-config.js', import.meta.url).href;
  const original = await import('data:text/javascript;base64,' + Buffer.from(source.replace("'./dre-config.js'", JSON.stringify(config))).toString('base64'));
  const consulta = new Request('https://portal.test/api/dre?inicio=2026-01-01&fim=2026-02-28&empresa=1');
  const originalFetch = globalThis.fetch;
  const sqls = [];
  try {
    globalThis.fetch = async (url, init) => {
      if (String(url).endsWith('/authenticate')) return Response.json({ access_token:'token' });
      sqls.push(JSON.parse(init.body).requestBody.sql);
      return Response.json({status:'1',responseBody:{rows:[['2025-01',1010000,'Vendas',500],['2026-01',1010000,'Vendas',1000],['2026-01',9999,'Sem grupo',50],['2026-02',3010100,'Custo',-100]]}});
    };
    assert.deepEqual(await listarDre(consulta, env), await original.listarDre(consulta, env));
    assert.equal(sqls[0], sqls[1]);
  } finally { globalThis.fetch = originalFetch; }
});

test('páginas têm links corretos, scripts válidos, modo e endpoints independentes', async () => {
  const inicio = await dreInicioPage().text();
  assert.match(inicio, /href="\/dre\/competencia"/);
  assert.match(inicio, /href="\/dre\/caixa"/);
  assert.match(inicio, /class="card competencia"/);
  assert.match(inicio, /class="card caixa"/);
  assert.doesNotMatch(inicio, /<p[\s>]|<aside[\s>]|class="(?:marca|criterio|integracao|abrir)"/);
  assert.doesNotMatch(inicio, /Fonte atual:|Sankhya|Omie|Escolha como|Abrir DRE/);
  for (const regime of ['caixa', 'competencia']) {
    const html = await drePage({ regime }).text();
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    assert.doesNotThrow(() => new Script(script));
    assert.match(html, /href="\/dre"/);
    assert.ok(script.includes("const DRE_API = '" + (regime === 'caixa' ? '/api/dre/caixa' : '/api/dre') + "'"));
  }
});

test('todas as novas rotas preservam autenticação e permissão DRE', async () => {
  for (const rota of ['/dre','/dre/caixa','/dre/competencia','/api/dre/caixa','/api/dre/caixa/auditoria']) {
    const resposta = await worker.fetch(new Request('https://portal.test' + rota), {});
    assert.equal(resposta.status, rota.startsWith('/api/') ? 403 : 302);
  }
  const consultas = [];
  const banco = {
    prepare(sql) {
      consultas.push(sql);
      return {
        bind() { return this; },
        async first() { return /FROM sessions/.test(sql) ? {user_id:1,role:'Administrador'} : null; },
        async all() { return {results:[]}; },
        async run() { throw new Error('Não deve gravar em consultas DRE'); }
      };
    }
  };
  const r = await worker.fetch(new Request('https://portal.test/dre', {headers:{cookie:'portal_session=teste'}}), {DB:banco});
  assert.equal(r.status, 200);
  assert.match(await r.text(), /DRE Caixa/);
  const erro = await worker.fetch(new Request('https://portal.test/api/dre/caixa?inicio=invalida', {headers:{cookie:'portal_session=teste'}}), {DB:banco});
  assert.equal(erro.status, 400);
  assert.ok(!consultas.some(sql => /\b(INSERT|UPDATE|DELETE)\b/.test(sql)));
});
