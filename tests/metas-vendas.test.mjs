import test from 'node:test';
import assert from 'node:assert/strict';
import { salvarMetasPainel } from '../src/vendas-metas-caixas-service.js';

function bancoSimulado() {
  const lotes = [];
  const consultas = [];
  return {
    lotes,
    consultas,
    DB: {
      prepare(sql) {
        consultas.push(sql);
        return { sql, bind(...valores) { return { sql, valores }; } };
      },
      async batch(comandos) { lotes.push(comandos); }
    }
  };
}

for (const meta of [1700000, 0, 1234.56, 999999999.99]) {
  test(`salva a meta total ${meta} sem alterar metas de vendedores`, async () => {
    const env = bancoSimulado();
    assert.deepEqual(await salvarMetasPainel(env, { metaEmpresa: meta }, 'teste'), { ok: true });
    const comandos = env.lotes.at(-1);
    assert.equal(comandos.length, 2);
    assert.match(comandos[0].sql, /INSERT INTO vendas_meta_empresa/);
    assert.match(comandos[0].sql, /ON CONFLICT\(id\) DO UPDATE/);
    assert.equal(comandos[0].valores[0], meta);
    assert.match(comandos[1].sql, /INSERT INTO audit_log/);
    assert.equal(comandos[1].valores[2], 'teste');
    assert.deepEqual(JSON.parse(comandos[1].valores[4]), { metaEmpresa: meta });
    assert.ok(!comandos.some(c => /INSERT INTO vendas_metas_(vendedores|caixas)/.test(c.sql)));
  });
}

for (const meta of [-1, 1000000000, NaN, Infinity, '1700000', null]) {
  test(`rejeita meta inválida ${String(meta)} sem gravar dados`, async () => {
    const env = bancoSimulado();
    const resultado = await salvarMetasPainel(env, { metaEmpresa: meta }, 'teste');
    assert.equal(resultado.status, 400);
    assert.equal(env.consultas.length, 0);
    assert.equal(env.lotes.length, 0);
  });
}
