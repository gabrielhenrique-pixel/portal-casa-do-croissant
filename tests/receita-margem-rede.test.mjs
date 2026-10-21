import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { execFileSync } from 'node:child_process';
import { garantirCadastroClientesRentabilidade } from '../src/clientes-rentabilidade.js';
import { garantirCadastroProdutos } from '../src/produtos-painel-service.js';
import { listarMargemRedeSankhya } from '../src/margem-rede-service.js';
import { listarRentabilidadeSkuSankhya } from '../src/rentabilidade-sku-service.js';

// Versão publicada antes da mudança de posição dos impostos.
const fonteAnterior = execFileSync('git', [
  'show', '8bb3518427dc387a500e91a4d3888b4aa3104363:src/margem-rede-service.js'
], { encoding: 'utf8' }).replace(/from '(\.\/[^']+)'/g, (_, caminho) =>
  'from ' + JSON.stringify(new URL('../src/' + caminho.slice(2), import.meta.url).href));
const anterior = await import('data:text/javascript;base64,' + Buffer.from(fonteAnterior).toString('base64'));
const request = () => new Request('https://portal.test/api/rentabilidade/margem-rede?inicio=2026-10-01&fim=2026-10-21');
const sessao = { username: 'Teste' };
const aproximado = (atual, esperado) => assert(Math.abs(atual - esperado) < 1e-8, `${atual} != ${esperado}`);

async function cenario(t, devolucao) {
  const banco = new DatabaseSync(':memory:');
  t.after(() => banco.close());
  const statement = (sql, args = []) => ({
    bind(...values) { return statement(sql, values); },
    async run() { return banco.prepare(sql).run(...args); },
    async all() { return { results: banco.prepare(sql).all(...args) }; }
  });
  const env = {
    DB: { prepare: sql => statement(sql), batch: statements => Promise.all(statements.map(s => s.run())) },
    SANKHYA_CLIENT_ID: 'simulado', SANKHYA_CLIENT_SECRET: 'simulado', SANKHYA_X_TOKEN: 'simulado'
  };
  await garantirCadastroClientesRentabilidade(env);
  await garantirCadastroProdutos(env);
  banco.exec(`INSERT INTO rentabilidade_clientes VALUES
    ('1','Cliente teste A','ST MARCHE',.10,.03,.025,'2026-01-01','2026-01-01','Teste'),
    ('2','Cliente teste B','ST MARCHE',.04,.02,.01,'2026-01-01','2026-01-01','Teste'),
    ('3','Cliente teste C','CONDOR',.04,.05,.02,'2026-01-01','2026-01-01','Teste');
    INSERT INTO produtos_painel_config
      (codigo_produto,cmv,atualizado_em,atualizado_por)
      VALUES ('11',5,'2026-01-01','Teste'),('12',7,'2026-01-01','Teste');`);
  const vendas = [
    ['2026-10-01',101,1,'Cliente teste A',11,'Produto teste 1',10,1000,60],
    ['2026-10-02',102,1,'Cliente teste A',12,'Produto teste 2',2,250,20],
    ['2026-10-03',103,2,'Cliente teste B',11,'Produto teste 1',3,300,0],
    ['2026-10-04',104,3,'Cliente teste C',12,'Produto teste 2',4,600,0]
  ];
  const sqls = [];
  // Todas as chamadas são interceptadas: sem credenciais nem acesso a produção/ERP.
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url === 'https://api.sankhya.com.br/authenticate') {
      return Response.json({ access_token: 'simulado' });
    }
    assert(String(url).startsWith('https://api.sankhya.com.br/gateway/'));
    const sql = JSON.parse(options.body).requestBody.sql;
    sqls.push(sql);
    assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|MERGE|DROP)\b/i);
    const rows = sql.includes('AS VLR_LIQUIDO') ? vendas :
      sql.includes('TOTAL_PACOTES_VILMAR') ? [['VILMAR',1,0,'2026-10-01','Cliente teste A',0,101,0,0,null,null,null,0,12.60]] :
      devolucao ? [['2026-10-05',201,1,'Cliente teste A','Produto teste 1',1,devolucao,devolucao]] : [];
    return Response.json({ status: '1', responseBody: { rows } });
  });
  // Cria a tabela de investimentos exclusivamente no banco em memória do teste.
  await listarMargemRedeSankhya(request(), env, sessao);
  banco.exec(`INSERT INTO rentabilidade_investimentos
    (id,data_inicio,data_fim,rede,tipo,tipo_valor,valor_previsto,valor_real,responsavel,status,created_by,created_at)
    VALUES ('teste','2026-10-01','2026-10-21','ST MARCHE','TESTE','REAL',0,200,'Teste','Teste','Teste','2026-10-01');`);
  sqls.length = 0;
  return { env, banco, sqls };
}

for (const [devolucao, sinal] of [[0, 'positiva'], [1550, 'zero'], [1600, 'negativa']]) {
  test(`receita ${sinal}: retira somente ST e devoluções, descontando imposto uma vez no resultado`, async t => {
    const { env, sqls } = await cenario(t, devolucao);
    const resposta = await listarMargemRedeSankhya(request(), env, sessao);
    assert.equal(resposta.status, 200);
    const atual = await resposta.json();
    const consultasAtuais = sqls.splice(0);
    const respostaAnterior = await anterior.listarMargemRedeSankhya(request(), env, sessao);
    assert.equal(respostaAnterior.status, 200);
    const antigo = await respostaAnterior.json();
    assert.deepEqual(sqls, consultasAtuais, 'não altera seleção de vendas, devoluções ou rateio de frete');

    const rede = atual.redes.find(r => r.rede === 'ST MARCHE');
    aproximado(rede.faturamentoBruto, 1630);
    aproximado(rede.receitaLiquida, 1550 - devolucao);
    aproximado(rede.impostos, 195.60);
    aproximado(rede.cmvTotal, 79);
    aproximado(rede.custoPromotoria, 45.90);
    aproximado(rede.custoContrato, 145);
    aproximado(rede.custoComissao, 36.25);
    aproximado(rede.investimentos, 200);
    aproximado(rede.frete, 12.60);
    aproximado(rede.resultadoFinal, rede.receitaLiquida - rede.impostos - 79 - 45.90 - 145 - 36.25 - 200 - 12.60);

    const totalReceita = atual.redes.reduce((s, r) => s + r.receitaLiquida, 0);
    for (const linha of atual.redes) {
      const previa = antigo.redes.find(r => r.rede === linha.rede);
      aproximado(linha.receitaLiquida, previa.receitaLiquida + previa.impostos);
      aproximado(linha.resultadoFinal, previa.resultadoFinal);
      assert.equal(Math.round(linha.resultadoFinal * 100), Math.round(previa.resultadoFinal * 100));
      const retirarDerivados = ({ receitaLiquida, resultadoFinal, margem, participacao, ...resto }) => resto;
      assert.deepEqual(retirarDerivados(linha), retirarDerivados(previa));
      assert.equal(linha.margem, linha.receitaLiquida === 0 ? null : linha.resultadoFinal / Math.abs(linha.receitaLiquida));
      assert.equal(linha.participacao, totalReceita === 0 ? null : linha.receitaLiquida / totalReceita);
    }
    assert.deepEqual(atual.alertas, antigo.alertas);
    assert.equal(atual.faturamentoGeral, antigo.faturamentoGeral);
    assert.equal(atual.devolucoesGeral, antigo.devolucoesGeral);
  });
}

test('a mudança de Margem por Rede não altera a Receita Líquida nem o resultado por SKU', async t => {
  const { env, banco } = await cenario(t, 1600);
  const cmvAnterior = banco.prepare('SELECT * FROM produtos_painel_config').all();
  const clientesAnteriores = banco.prepare('SELECT * FROM rentabilidade_clientes').all();
  const response = await listarRentabilidadeSkuSankhya(request(), env, sessao);
  assert.equal(response.status, 200);
  const { items } = await response.json();
  assert.equal(items.length, 4);
  const primeiro = items[0];
  assert.equal(primeiro.faturamento, 1060);
  aproximado(primeiro.impostos, 127.20);
  aproximado(primeiro.receitaLiquida, 872.80);
  aproximado(primeiro.resultado, 658.50);
  assert.deepEqual(banco.prepare('SELECT * FROM produtos_painel_config').all(), cmvAnterior);
  assert.deepEqual(banco.prepare('SELECT * FROM rentabilidade_clientes').all(), clientesAnteriores);
});
