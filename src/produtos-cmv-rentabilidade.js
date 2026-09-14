// Base fixa extraída da aba Produtos_CMV da planilha de rentabilidade.
// As descrições são mantidas exatamente como estão no cadastro de CMV.
export const produtosCmvRentabilidade = Object.freeze([
  Object.freeze({
    descricao: 'PÃO CROISSANT A CASA DO CROISSANT (CAIXA C/ 10 UNIDADES)',
    cmvUnitario: 5.22
  }),
  Object.freeze({
    descricao: 'BISCOITO DE POLVILHO QUEIJO PARMESÃO (CAIXA C/ 15 UNIDADES)',
    cmvUnitario: 4.03
  }),
  Object.freeze({
    descricao: 'BISCOITO DE POLVILHO PEPPERONI (CAIXA C/ 15 UNIDADES)',
    cmvUnitario: 5.29
  }),
  Object.freeze({
    descricao: 'BISCOITO DE POLVILHO TRADICIONAL (CAIXA C/ 15 UNIDADES)',
    cmvUnitario: 2.57
  }),
  Object.freeze({
    descricao: 'PAO CROISSANT AMÊNDOAS 170G (CAIXA C/ 14 UNIDADES)',
    cmvUnitario: 3.33
  }),
  Object.freeze({
    descricao: 'PÃO CROISSANT A CASA DO CROISSANT (CAIXA C/ 25 UNIDADES)',
    cmvUnitario: 4.27
  }),
  Object.freeze({
    descricao: 'PÃO CROISSANT RECHEADO TO GO "CHOCOLATE AO LEITE " 60G',
    cmvUnitario: 3.58
  }),
  Object.freeze({
    descricao: 'PÃO CROISSANT RECHEADO TO GO " DARK " 60G',
    cmvUnitario: 3.58
  }),
  Object.freeze({
    descricao: 'PÃO CROISSANT RECHEADO TO GO "CREME DE AVELÃ" 60G',
    cmvUnitario: 3.58
  }),
  Object.freeze({
    descricao: 'PÃO CROISSANT TO GO RECHEADO "CHOCOLATE BRANCO 60G',
    cmvUnitario: 3.58
  }),
  Object.freeze({
    descricao: 'PAO CROISSANT 125G (CAIXA C/ 14 UNIDADES)',
    cmvUnitario: 2.69
  }),
  Object.freeze({
    descricao: 'PAO CROISSANT OBA BEM QUERER (CAIXA C/ 25 UNIDADES)',
    cmvUnitario: 5.29
  })
]);

function chaveDaDescricao(descricao) {
  return String(descricao || '').trim().toLocaleUpperCase('pt-BR');
}

const cmvPorDescricao = new Map(
  produtosCmvRentabilidade.map((produto) => [
    chaveDaDescricao(produto.descricao),
    produto.cmvUnitario
  ])
);

// Equivale à procura exata da planilha, sem diferenciar maiúsculas/minúsculas.
// Espaços no início e no fim são desconsiderados; produto não cadastrado vale zero.
export function buscarCmvUnitario(descricao) {
  return cmvPorDescricao.get(chaveDaDescricao(descricao)) || 0;
}
