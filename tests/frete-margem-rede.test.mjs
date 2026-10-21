import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { listarMargemRedeSankhya } from '../src/margem-rede-service.js';

async function calculoFrete(t) {
  let sqlFrete;
  const statement = {
    bind() { return this; },
    async run() {},
    async all() { return { results: [] }; }
  };
  // Não acessa o banco do portal nem o Sankhya: todas as chamadas são simuladas.
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url === 'https://api.sankhya.com.br/authenticate') {
      return Response.json({ access_token: 'simulado' });
    }
    assert(String(url).startsWith('https://api.sankhya.com.br/gateway/'));
    const sql = JSON.parse(options.body).requestBody.sql;
    assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|MERGE|DROP)\b/i);
    if (sql.includes('TOTAL_PACOTES_VILMAR')) sqlFrete = sql;
    return Response.json({ status: '1', responseBody: { rows: [] } });
  });
  const response = await listarMargemRedeSankhya(new Request(
    'https://portal.test/api/rentabilidade/margem-rede?inicio=2026-10-01&fim=2026-10-21'
  ), {
    DB: { prepare: () => statement, batch: statements => Promise.all(statements.map(s => s.run())) },
    SANKHYA_CLIENT_ID: 'simulado', SANKHYA_CLIENT_SECRET: 'simulado', SANKHYA_X_TOKEN: 'simulado'
  }, { username: 'Teste' });
  assert.equal(response.status, 200);
  assert(sqlFrete);

  // Executa a expressão SQL realmente enviada ao ERP, sem reimplementar a fórmula.
  // SQLite cobre CASE, SUM e ROUND; apenas NVL precisa de compatibilidade.
  const tv = sqlFrete.match(/LEFT JOIN \(\n(\s*SELECT\s+ITE3\.NUNOTA,[\s\S]*?)\n\) TV/)[1];
  const frete = sqlFrete.match(/    CASE\n[\s\S]*?    END AS FRETE_PROPORCIONAL_NOTA,/)[0].replace(/,$/, '');
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.function('NVL', (valor, padrao) => valor ?? padrao);
  db.exec(`CREATE TABLE TGFITE (NUNOTA INTEGER, CODPROD INTEGER, CODVOL TEXT, QTDNEG REAL, CONTROLE TEXT);
    CREATE TABLE TGFVOA (CODPROD INTEGER, CODVOL TEXT, DIVIDEMULTIPLICA TEXT, QUANTIDADE REAL, CONTROLE TEXT);`);
  function calcular(produto, quantidade, fator, unidade = 'CX', operacao = 'M', entregador = 'VILMAR', valorReal = 0) {
    db.exec('DELETE FROM TGFITE; DELETE FROM TGFVOA;');
    db.prepare('INSERT INTO TGFITE VALUES (1,?,?,?,NULL)').run(produto, unidade, quantidade);
    if (fator !== null) {
      db.prepare("INSERT INTO TGFVOA VALUES (?,?,?,?, ' ')").run(produto, unidade, operacao, fator);
    }
    return db.prepare(`WITH TV AS (${tv}), ENTR AS (SELECT ? AS NOMEENTR),
      FN AS (SELECT ? AS FRETE_PROPORCIONAL_NOTA)
      SELECT ${frete} FROM TV CROSS JOIN ENTR CROSS JOIN FN`).get(entregador, valorReal).FRETE_PROPORCIONAL_NOTA;
  }
  return { calcular, sqlFrete };
}

test('Vilmar: Amêndoas e Croissant 125 g usam 14 pacotes; caixa de 10 usa 10', async t => {
  const { calcular } = await calculoFrete(t);
  for (const [produto, fator] of [[917, 14], [809, 14], [291, 10]]) {
    assert.equal(calcular(produto, fator, fator), fator * 0.60);
    assert.equal(calcular(produto, 2, null), 2 * fator * 0.60);
    assert.equal(calcular(produto, 1, 2, 'CX', 'D'), 2 * fator * 0.60);
  }
});

test('Vilmar: preserva PA/UN e todos os demais fatores de embalagem', async t => {
  const { calcular } = await calculoFrete(t);
  for (const produto of [917, 809, 291]) {
    for (const unidade of ['PA', 'UN']) assert.equal(calcular(produto, 20, 14, unidade), 12);
  }
  for (const [produto, fator] of [[43, 15], [42, 15], [44, 15], [155, 25], [156, 25],
    [931, 28], [930, 28], [928, 28], [929, 28], [999, 1]]) {
    assert.equal(calcular(produto, 2, null), 2 * fator * 0.60);
  }
});

test('corrige a contagem duplicada de 14 pacotes e a contagem incompleta da caixa de 10', async t => {
  const { calcular } = await calculoFrete(t);
  const casos = [
    // Produto, pacotes ERP, fator correto, frete anterior.
    [917, 28, 14, 33.60],
    [809, 42, 14, 50.40],
    [291, 30, 10, 1.80]
  ];
  const reducaoCentavos = casos.reduce((total, [produto, pacotes, fator, anterior]) =>
    total + Math.round(anterior * 100) - Math.round(calcular(produto, pacotes, fator) * 100), 0);
  assert.equal(reducaoCentavos, 2580);
});

test('Andrei e CT-e continuam usando o frete real, sem aplicar R$ 0,60 por pacote', async t => {
  const { calcular, sqlFrete } = await calculoFrete(t);
  for (const entregador of ['ANDREI', 'CTE']) {
    for (const produto of [917, 809, 291]) {
      assert.equal(calcular(produto, 100, 14, 'CX', 'M', entregador, 123.45), 123.45);
      assert.equal(calcular(produto, 100, 14, 'CX', 'M', entregador, null), 0);
    }
  }
  assert.match(sqlFrete, /CTE\.VLRFRETE\s+\* TN2\.TOTAL_PACOTES_NOTA\s+\/ NULLIF\(TC\.PACOTES_TOTAIS_CTE, 0\)/);
  assert.match(sqlFrete, /CAB2\.DTNEG >= ADD_MONTHS\(TRUNC\(SYSDATE, 'MM'\), -2\)/);
  assert.match(sqlFrete, /TPO2\.DESCROPER = 'VENDA NF-E'/);
  assert.match(sqlFrete, /WHERE CAB\.DTNEG >= TO_DATE\('2026-10-01', 'YYYY-MM-DD'\)/);
  assert.match(sqlFrete, /AND CAB\.DTNEG < TO_DATE\('2026-10-21', 'YYYY-MM-DD'\) \+ 1/);
  assert.doesNotMatch(sqlFrete, /DTPREVENT/);
});
