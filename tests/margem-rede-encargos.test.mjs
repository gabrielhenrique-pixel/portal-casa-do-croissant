import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { garantirCadastroClientesRentabilidade } from '../src/clientes-rentabilidade.js';
import { listarCmvProdutosConfigurados } from '../src/produtos-painel-service.js';
import { listarMargemRedeSankhya } from '../src/margem-rede-service.js';

const aproximado = (atual, esperado) => assert(Math.abs(atual-esperado)<1e-8, `${atual} != ${esperado}`);
const venda = (codigo, valor, st=0, quantidade=1) => ['2026-10-01',1,codigo,`Cliente ${codigo}`,11,'Produto de teste',quantidade,valor,st];
const devolucao = (codigo, valor) => ['2026-10-02',2,codigo,`Cliente ${codigo}`,'Produto de teste',1,valor,valor];
const frete = (codigo, valor) => ['CTE',codigo,1,'2026-10-01',`Cliente ${codigo}`,1,1,1,0,'',1,1,valor,valor,valor];

async function consultar(t, {clientes, vendas=[], devolucoes=[], fretes=[]}) {
  const banco = new DatabaseSync(':memory:');
  t.after(()=>banco.close());
  const statement = (sql, args=[]) => ({
    bind(...values) { return statement(sql,values); },
    async run() { return banco.prepare(sql).run(...args); },
    async all() { return {results:banco.prepare(sql).all(...args)}; },
    async first() { return banco.prepare(sql).get(...args)||null; }
  });
  const env = { DB:{prepare:sql=>statement(sql),batch:ss=>Promise.all(ss.map(s=>s.run()))},
    SANKHYA_CLIENT_ID:'teste',SANKHYA_CLIENT_SECRET:'teste',SANKHYA_X_TOKEN:'teste' };
  await garantirCadastroClientesRentabilidade(env);
  await listarCmvProdutosConfigurados(env);
  banco.prepare('INSERT INTO produtos_painel_config (codigo_produto,cmv,atualizado_em,atualizado_por) VALUES (?,?,?,?)').run('11',5,'2026-01-01','Teste');
  const inserir=banco.prepare(`INSERT INTO rentabilidade_clientes
    (codigo_parceiro,cliente,rede,percentual_contrato,percentual_promotoria,percentual_comissao,created_at,updated_at)
    VALUES (?,?,?,?,?,?,'2026-01-01','2026-01-01')`);
  for(const c of clientes) inserir.run(c.codigo,`Cliente ${c.codigo}`,c.rede||'ANGELONI SC',c.contrato??.10,c.promo??.06,c.comissao??.025);
  const cadastroAntes=banco.prepare('SELECT * FROM rentabilidade_clientes ORDER BY codigo_parceiro').all();
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    if(url==='https://api.sankhya.com.br/authenticate') return Response.json({access_token:'simulado'});
    assert(String(url).startsWith('https://api.sankhya.com.br/gateway/'));
    const sql=JSON.parse(options.body).requestBody.sql;
    const rows=sql.includes('AS VLR_LIQUIDO')?vendas:
      sql.includes('AS VALOR_LIQUIDO')?devolucoes:
      sql.includes('AS FRETE_PROPORCIONAL_NOTA')?fretes:null;
    assert.notEqual(rows,null,'Consulta inesperada: nenhum acesso real é permitido');
    return Response.json({status:'1',responseBody:{rows}});
  });
  const response=await listarMargemRedeSankhya(new Request('https://portal.test/api/rentabilidade/margem-rede?inicio=2026-10-01&fim=2026-10-20'),env,{username:'Teste'});
  assert.equal(response.status,200);
  assert.deepEqual(banco.prepare('SELECT * FROM rentabilidade_clientes ORDER BY codigo_parceiro').all(),cadastroAntes,'A consulta não pode alterar o cadastro');
  return response.json();
}

test('ANGELONI SC: promotoria e comissão sobre bruto menos devoluções, sem deduzir impostos da base',async t=>{
  const dados=await consultar(t,{clientes:[{codigo:'1'}],vendas:[venda('1',10000,0,10)],devolucoes:[devolucao('1',2000)],fretes:[frete('1',100)]});
  const r=dados.redes.find(r=>r.rede==='ANGELONI SC');
  aproximado(r.faturamentoBruto,10000);
  aproximado(r.devolucoes,2000);
  aproximado(r.basePromotoriaComissao,8000);
  aproximado(r.custoPromotoria,480);
  aproximado(r.custoComissao,200);
  aproximado(r.percentualPromotoria,.06);
  aproximado(r.percentualComissao,.025);
  aproximado(r.custoContrato,1000);
  aproximado(r.percentualContrato,.10);
  aproximado(r.impostos,1200);
  aproximado(r.receitaLiquida,6800);
  aproximado(r.cmvTotal,50);
  aproximado(r.frete,100);
  aproximado(r.resultadoFinal,4970);
  aproximado(r.margem,4970/6800);
  assert.equal(r.clientesPositivados,1);
  assert.deepEqual(dados.alertas.devolucoesSemCadastro,[]);
});

test('abatimentos respeitam o percentual de cada cliente, inclusive devolução sem venda no recorte',async t=>{
  const dados=await consultar(t,{clientes:[
    {codigo:'1',promo:.10,comissao:.02},{codigo:'2',promo:.20,comissao:.03},{codigo:'3',promo:.30,comissao:.04}
  ],vendas:[venda('1',1000),venda('2',1000)],devolucoes:[devolucao('1',600),devolucao('2',100),devolucao('3',50)]});
  const r=dados.redes.find(r=>r.rede==='ANGELONI SC');
  aproximado(r.basePromotoriaComissao,1250);
  aproximado(r.custoPromotoria,205);
  aproximado(r.custoComissao,33);
  aproximado(r.percentualPromotoria,205/1250);
  aproximado(r.percentualComissao,33/1250);
  aproximado(r.custoContrato,200);
  assert.equal(r.clientesPositivados,2);
});

test('base zerada não produz NaN ou percentuais infinitos',async t=>{
  const dados=await consultar(t,{clientes:[{codigo:'1'}],vendas:[venda('1',100)],devolucoes:[devolucao('1',100)]});
  const r=dados.redes.find(r=>r.rede==='ANGELONI SC');
  aproximado(r.basePromotoriaComissao,0);
  aproximado(r.custoPromotoria,0);
  aproximado(r.custoComissao,0);
  assert.equal(r.percentualPromotoria,null);
  assert.equal(r.percentualComissao,null);
  assert(Number.isFinite(r.resultadoFinal));
});

test('base usa o bruto já definido pelo portal, sem retirar ST ou tributos novamente',async t=>{
  const dados=await consultar(t,{clientes:[{codigo:'1'}],vendas:[venda('1',1000,200)],devolucoes:[devolucao('1',100)]});
  const r=dados.redes.find(r=>r.rede==='ANGELONI SC');
  aproximado(r.basePromotoriaComissao,1100);
  aproximado(r.custoPromotoria,66);
  aproximado(r.custoComissao,27.5);
  aproximado(r.impostos,144);
  aproximado(r.receitaLiquida,756);
});

test('devoluções sem cadastro seguem no alerta e não reduzem encargos de clientes conhecidos',async t=>{
  const dados=await consultar(t,{clientes:[{codigo:'1'}],vendas:[venda('1',1000)],devolucoes:[devolucao('999',500)]});
  const r=dados.redes.find(r=>r.rede==='ANGELONI SC');
  aproximado(r.custoPromotoria,60);
  aproximado(r.custoComissao,25);
  aproximado(r.devolucoes,0);
  assert.equal(dados.alertas.devolucoesSemCadastro[0].valor,500);
});

test('outras redes mantêm a base anterior enquanto a regra não for confirmada para elas',async t=>{
  const dados=await consultar(t,{clientes:[{codigo:'1',rede:'CONDOR'}],vendas:[venda('1',1000)],devolucoes:[devolucao('1',200)]});
  const r=dados.redes.find(r=>r.rede==='CONDOR');
  aproximado(r.basePromotoriaComissao,1000);
  aproximado(r.custoPromotoria,60);
  aproximado(r.custoComissao,25);
  aproximado(r.custoContrato,100);
});
