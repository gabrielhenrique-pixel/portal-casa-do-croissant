import { criarSankhyaProvider } from './sankhya.js';

// Contrato do adaptador:
// listarMovimentos(filtros) -> [{mes, categoria, descricao, grupo, centavos}]
// listarLancamentos(filtros) -> [{mes, data, documento, parceiro, valor, empresa, categoria}]
// Valores são realizados, assinados (entrada + / saída -), em BRL, com rateio aplicado.
// O adaptador resolve categoria do ERP -> grupo interno do DRE; a tela ignora o ERP.
export async function criarProviderDreCaixa(env) {
  const origem = String(env.DRE_CAIXA_PROVIDER || 'sankhya').trim().toLowerCase();
  if (origem === 'sankhya') return criarSankhyaProvider(env);
  if (origem === 'omie') {
    throw Object.assign(new Error('A integração do DRE Caixa com o Omie ainda não está habilitada. A origem atual deve permanecer Sankhya.'), { status: 503 });
  }
  throw Object.assign(new Error('Origem do DRE Caixa não reconhecida.'), { status: 503 });
}
