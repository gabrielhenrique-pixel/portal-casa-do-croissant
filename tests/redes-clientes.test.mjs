import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { REDES_RENTABILIDADE, garantirCadastroClientesRentabilidade, atualizarClientesRentabilidadeEmLote } from '../src/clientes-rentabilidade.js';
import { listarMargemRedeSankhya } from '../src/margem-rede-service.js';

async function cenario(t) {
  const banco = new DatabaseSync(':memory:');
  t.after(() => banco.close());
  const statement = (sql, args = []) => ({
    bind(...values) { return statement(sql, values); },
    async run() { return banco.prepare(sql).run(...args); },
    async all() { return {results:banco.prepare(sql).all(...args)}; },
    async first() { return banco.prepare(sql).get(...args) || null; }
  });
  const env = {
    DB: {prepare:sql=>statement(sql),batch:statements=>Promise.all(statements.map(s=>s.run()))},
    SANKHYA_CLIENT_ID:'simulado',SANKHYA_CLIENT_SECRET:'simulado',SANKHYA_X_TOKEN:'simulado'
  };
  await garantirCadastroClientesRentabilidade(env);
  const inserir = banco.prepare(`INSERT INTO rentabilidade_clientes
    (codigo_parceiro,cliente,rede,percentual_contrato,percentual_promotoria,percentual_comissao,created_at,updated_at,updated_by)
    VALUES (?,?,?,?,?,?,'2026-01-01','2026-01-01','Teste')`);
  inserir.run('1','Cliente de teste ST','SEM REDE',.03,.02,.01);
  inserir.run('2','Cliente de teste Condor','CONDOR',.04,.05,.02);
  return {env,banco};
}

test('ST MARCHE está disponível uma única vez para vincular clientes', () => {
  assert.equal(REDES_RENTABILIDADE.filter(rede=>rede==='ST MARCHE').length,1);
  assert.equal(new Set(REDES_RENTABILIDADE).size,REDES_RENTABILIDADE.length);
  assert(REDES_RENTABILIDADE.includes('SEM REDE'));
});

test('vínculo com ST MARCHE é aceito sem mudar percentuais nem outros clientes', async t => {
  const {env,banco}=await cenario(t);
  const anterior=banco.prepare('SELECT * FROM rentabilidade_clientes WHERE codigo_parceiro = ?').get('2');
  const result=await atualizarClientesRentabilidadeEmLote(env,['1'],{rede:' ST MARCHE '},'Teste');
  assert.equal(result.status,200);
  const cliente=banco.prepare('SELECT * FROM rentabilidade_clientes WHERE codigo_parceiro = ?').get('1');
  assert.equal(cliente.rede,'ST MARCHE');
  assert.equal(cliente.percentual_contrato,.03);
  assert.equal(cliente.percentual_promotoria,.02);
  assert.equal(cliente.percentual_comissao,.01);
  assert.deepEqual(banco.prepare('SELECT * FROM rentabilidade_clientes WHERE codigo_parceiro = ?').get('2'),anterior);
});

for (const comVendas of [false,true]) test(`Margem por rede inclui ST MARCHE ${comVendas?'com os valores vinculados':'mesmo sem movimento'}`, async t => {
  const {env}=await cenario(t);
  await atualizarClientesRentabilidadeEmLote(env,['1'],{rede:'ST MARCHE'},'Teste');
  const vendas=[
    ['2026-10-01',1,1,'Cliente de teste ST',11,'Produto simulado',2,1000,0],
    ['2026-10-02',2,1,'Cliente de teste ST',11,'Produto simulado',1,200,0],
    ['2026-10-03',3,2,'Cliente de teste Condor',11,'Produto simulado',1,500,0]
  ];
  // Intercepta todas as chamadas: nenhuma conexão real com o Sankhya ou produção.
  t.mock.method(globalThis,'fetch',async (url,options)=>{
    if(url==='https://api.sankhya.com.br/authenticate')return Response.json({access_token:'simulado'});
    assert(String(url).startsWith('https://api.sankhya.com.br/gateway/'));
    const sql=JSON.parse(options.body).requestBody.sql;
    return Response.json({status:'1',responseBody:{rows:comVendas&&sql.includes('AS VLR_LIQUIDO')?vendas:[]}});
  });
  const response=await listarMargemRedeSankhya(new Request('https://portal.test/api/rentabilidade/margem-rede?inicio=2026-10-01&fim=2026-10-20'),env,{username:'Teste'});
  assert.equal(response.status,200);
  const dados=await response.json();
  assert.deepEqual(dados.redes.map(r=>r.rede),REDES_RENTABILIDADE.filter(rede=>rede!=='SEM REDE'));
  const rede=dados.redes.find(r=>r.rede==='ST MARCHE');
  assert.equal(rede.totalClientes,1);
  assert.equal(rede.faturamentoBruto,comVendas?1200:0);
  assert.equal(rede.clientesPositivados,comVendas?1:0);
  assert(Math.abs(rede.resultadoFinal-(comVendas?984:0))<1e-8);
  assert.equal(dados.redes.find(r=>r.rede==='CONDOR').faturamentoBruto,comVendas?500:0);
  assert.deepEqual(dados.alertas.vendasSemCadastro,[]);
});
