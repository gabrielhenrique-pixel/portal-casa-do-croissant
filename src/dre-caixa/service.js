import { montarRelatorioDre } from '../dre-service.js';
import { criarProviderDreCaixa } from './providers/index.js';

const moeda = centavos => centavos / 100;

export function filtrosDreCaixa(request, auditoria = false, hoje = new Date()) {
  const params = new URL(request.url).searchParams;
  const atual = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(hoje);
  const inicio = params.get('inicio') || atual.slice(0, 4) + '-01-01';
  const fim = params.get('fim') || atual;
  for (const data of [inicio, fim]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || data.slice(0, 4) < '1901' ||
        data.slice(0, 4) > '9998' || !Number.isFinite(Date.parse(data + 'T00:00:00Z')) ||
        new Date(data + 'T00:00:00Z').toISOString().slice(0, 10) !== data) {
      throw Object.assign(new Error('Informe datas válidas para o período.'), { status: 400 });
    }
  }
  if (inicio > fim) throw Object.assign(new Error('A data inicial não pode ser maior que a data final.'), { status: 400 });
  if (fim > atual) throw Object.assign(new Error('O DRE Caixa é realizado: a data final não pode ultrapassar hoje.'), { status: 400 });
  // Até 12 meses evita sobrepor as séries atual e anterior em recortes parciais.
  if (listarMesesCaixa(inicio, fim).length > 12) throw Object.assign(new Error('Selecione até 12 meses por consulta.'), { status: 400 });
  const empresa = (params.get('empresa') || '').trim();
  const natureza = (params.get('natureza') || '').trim();
  if ((empresa && !/^\d{1,9}$/.test(empresa)) || (auditoria && !/^\d{1,15}$/.test(natureza))) {
    throw Object.assign(new Error('Empresa ou natureza inválida.'), { status: 400 });
  }
  return { inicio, fim, empresa, natureza, inicioAnterior: anoAnterior(inicio), fimAnterior: anoAnterior(fim) };
}

function anoAnterior(data) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(ano - 1, mes, 0)).getUTCDate();
  return String(ano - 1) + '-' + String(mes).padStart(2, '0') + '-' + String(Math.min(dia, ultimoDia)).padStart(2, '0');
}

export function listarMesesCaixa(inicio, fim) {
  const meses = [];
  const atual = new Date(inicio.slice(0, 7) + '-01T00:00:00Z');
  while (atual.toISOString().slice(0, 7) <= fim.slice(0, 7)) {
    meses.push(atual.toISOString().slice(0, 7));
    atual.setUTCMonth(atual.getUTCMonth() + 1);
  }
  return meses;
}

export async function listarDreCaixa(request, env) {
  const filtros = filtrosDreCaixa(request);
  const provider = await criarProviderDreCaixa(env);
  const movimentos = await provider.listarMovimentos(filtros);
  return montarResultadoCaixa(movimentos, filtros, provider);
}

export function montarResultadoCaixa(movimentos, filtros, provider) {
  const grupos = new Map();
  const pendencias = new Map();
  const linhas = movimentos.map(item => {
    if (!Number.isSafeInteger(item.centavos)) throw new Error('Valor monetário inválido no adaptador DRE Caixa.');
    grupos.set(item.categoria, item.grupo);
    if (!item.grupo && item.centavos !== 0) {
      const pendencia = pendencias.get(item.categoria) || { codigo: item.categoria, nome: item.descricao, centavos: 0, anterior: 0 };
      if (item.mes >= filtros.inicio.slice(0, 7) && item.mes <= filtros.fim.slice(0, 7)) pendencia.centavos += item.centavos;
      else pendencia.anterior += item.centavos;
      pendencias.set(item.categoria, pendencia);
    }
    return [item.mes, item.categoria, item.descricao, item.centavos];
  });
  const dados = montarRelatorioDre(linhas, {
    ...filtros, origem: provider.id, classificar: codigo => grupos.get(codigo),
    normalizarCategoria: codigo => String(codigo)
  });
  for (const item of [...dados.grupos.flatMap(grupo => [grupo, ...grupo.detalhes]), ...Object.values(dados.subtotais)]) {
    for (const indicador of [...Object.values(item.indicadores), item.total]) {
      indicador.resultado = moeda(indicador.resultado);
      indicador.anoAnterior = moeda(indicador.anoAnterior);
    }
    if (item.valores) item.valores = Object.fromEntries(Object.entries(item.valores).map(([mes, valor]) => [mes, moeda(valor)]));
  }
  dados.naoClassificados = Object.fromEntries(Object.entries(dados.naoClassificados).map(([mes, valor]) => [mes, moeda(valor)]));
  return {
    ...dados, regime: 'caixa', fonte: provider.nome, moeda: 'BRL', atualizadoEm: new Date().toISOString(),
    criterio: 'Data da baixa (DHBAIXA), valor da baixa (VLRBAIXA) rateado por natureza; somente títulos reais baixados até hoje. Não é conciliação bancária.',
    pendenciasClassificacao: Array.from(pendencias.values()).map(item => ({ codigo: item.codigo, nome: item.nome, valor: moeda(item.centavos), valorAnterior: moeda(item.anterior) })),
    comparacao: { inicio: filtros.inicioAnterior, fim: filtros.fimAnterior }
  };
}

export async function listarAuditoriaDreCaixa(request, env) {
  const filtros = filtrosDreCaixa(request, true);
  const provider = await criarProviderDreCaixa(env);
  return {
    origem: provider.id, regime: 'caixa', natureza: filtros.natureza,
    meses: listarMesesCaixa(filtros.inicio, filtros.fim),
    lancamentos: await provider.listarLancamentos(filtros)
  };
}
