export const DRE_GRUPOS = Object.freeze({
  1: {
    nome: 'Receita de Vendas',
    nv2: 1,
    nv2Nome: 'Receita Bruta'
  },
  2: {
    nome: 'Receitas não Operacionais',
    nv2: 1,
    nv2Nome: 'Receita Bruta'
  },
  3: {
    nome: 'Deduções Sobre Receitas',
    nv2: 6,
    nv2Nome: 'Deduções Sobre Receitas'
  },
  4: {
    nome: 'Custos com Pessoal',
    nv2: 3,
    nv2Nome: 'Custo de Produção'
  },
  5: {
    nome: 'Outros Custos de Produção',
    nv2: 3,
    nv2Nome: 'Custo de Produção'
  },
  6: {
    nome: 'Despesas com Pessoal (ADM)',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  },
  7: {
    nome: 'Despesas de Produção',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  },
  8: {
    nome: 'Despesas Administrativas',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  },
  9: {
    nome: 'Despesas Comerciais',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  },
  10: {
    nome: 'Receitas e Despesas Financeiras',
    nv2: 7,
    nv2Nome: 'Receitas e Despesas Financeiras'
  },
  11: {
    nome: 'Investimentos',
    nv2: 5,
    nv2Nome: 'Investimentos'
  },
  12: {
    nome: 'Impostos S/ Lucro',
    nv2: 2,
    nv2Nome: 'Impostos'
  },
  13: {
    nome: 'Despesas Logísticas',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  },
  14: {
    nome: 'Impostos S/ Vendas',
    nv2: 6,
    nv2Nome: 'Deduções Sobre Receitas'
  },
  15: {
    nome: 'Emprestimos e Dividas',
    nv2: 8,
    nv2Nome: 'Emprestimos e Dividas'
  },
  16: {
    nome: 'Outras Receitas e Despesas não Operacionais',
    nv2: 9,
    nv2Nome: 'Outras Receitas e Despesas não Operacionais'
  },
  17: {
    nome: 'Despesas Financeiras',
    nv2: 4,
    nv2Nome: 'Despesas Gerais'
  }
});

export const DRE_NATUREZAS_POR_GRUPO = Object.freeze({
  1: [
    '1010000'
  ],

  2: [
    '1020200',
    '1020300',
    '1020500',
    '2090000',
    '5130000'
  ],

  3: [
    '1030000',
    '1030100',
    '1040000',
    '3070200',
    '4020000'
  ],

  4: [
    '2040000',
    '3010300',
    '3020300',
    '4010100',
    '4010200',
    '4010300',
    '4010400',
    '4010500',
    '4010600',
    '4010700',
    '4010800',
    '4010900',
    '4011000',
    '4011200',
    '8201001',
    '8201003',
    '8201004',
    '8201005',
    '8201006',
    '8201007',
    '8201008',
    '8201010'
  ],

  5: [
    '0',
    '4020100',
    '4020200',
    '4020300',
    '4020400',
    '4020500',
    '4020600',
    '8202009',
    '8202010',
    '8202011',
    '8202012',
    '8202013',
    '8202016'
  ],

  6: [
    '3010100',
    '3010400',
    '3010500',
    '3010600',
    '3010700',
    '3010800',
    '3011000',
    '3011500',
    '3011600',
    '3011800'
  ],

  7: [
    '3030100',
    '3030300',
    '3030400',
    '3030500',
    '3030600',
    '3030900',
    '8010000',
    '8020000',
    '8030000',
    '8040000',
    '8050000',
    '8060000'
  ],

  8: [
    '3011700',
    '3011900',
    '3020100',
    '3020200',
    '3020500',
    '3020600',
    '3020700',
    '3020800',
    '3020900',
    '3021000',
    '3021100',
    '3021200',
    '3021300',
    '3021400',
    '3021500',
    '3021600',
    '3021800',
    '3021900',
    '3022000',
    '3022100',
    '3030200',
    '3030700',
    '3030800',
    '3031100',
    '3031200',
    '3031300',
    '3031400',
    '3031500',
    '5030000',
    '5040000'
  ],

  9: [
    '3070100',
    '3070300',
    '3070400',
    '3070500',
    '3070600',
    '3070700',
    '3070800',
    '3070900',
    '3071000',
    '3071100',
    '4030100',
    '4030300',
    '4030500',
    '4030600',
    '4030700',
    '4030800',
    '4030900',
    '4031100',
    '6010000'
  ],

  10: [
    '1020100',
    '3031000',
    '3060100',
    '3060200',
    '3060400',
    '3060500',
    '3060600',
    '3060700',
    '3060900'
  ],

  11: [
    '3011700',
    '3011900',
    '3020100'
  ],

  12: [
    '2010000',
    '2020000',
    '2070000',
    '2080000',
    '2100000',
    '2120000',
    '5060000',
    '5080000',
    '5090000',
    '5100000',
    '5110000',
    '5120000',
    '5140000'
  ],

  13: [
    '2030000',
    '3080100',
    '3080200',
    '3080300',
    '4040100',
    '4040200',
    '4040300'
  ],

  14: [
    '2050000',
    '2060000'
  ],

  15: [
    '1020400',
    '1020600'
  ],

  16: [],

  17: []
});

const GRUPO_POR_NATUREZA = new Map();

for (const [grupo, naturezas] of Object.entries(
  DRE_NATUREZAS_POR_GRUPO
)) {
  for (const natureza of naturezas) {
    GRUPO_POR_NATUREZA.set(
      String(natureza),
      Number(grupo)
    );
  }
}

export function identificarGrupoDre(codigoNatureza) {
  return GRUPO_POR_NATUREZA.get(
    String(codigoNatureza || '').trim()
  ) || null;
}

export function identificarGrupoSuperiorDre(codigoNatureza) {
  const grupo = identificarGrupoDre(codigoNatureza);

  return grupo
    ? DRE_GRUPOS[grupo]?.nv2 || null
    : null;
}
