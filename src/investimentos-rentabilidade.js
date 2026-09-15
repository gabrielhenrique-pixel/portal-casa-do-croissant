import { carregarClientesRentabilidade } from './clientes-rentabilidade.js';

export async function salvarInvestimentoRentabilidade(env, dados, username) {
  await garantirTabelaInvestimentosRentabilidade(env);

  const inicio = dataIsoValida(dados?.inicio);
  const fim = dataIsoValida(dados?.fim);
  const tipo = textoObrigatorio(dados?.tipo, 'Informe o tipo de investimento.');
  const tipoValor = String(dados?.tipoValor || '').trim().toUpperCase();
  const responsavel = textoObrigatorio(
    dados?.responsavel,
    'Informe o responsável.'
  );
  const status = textoObrigatorio(dados?.status, 'Informe o status.');
  const valor = numeroPositivo(dados?.valor);

  if (!inicio || !fim) {
    return { error: 'Informe a data inicial e a data final.', status: 400 };
  }

  if (fim < inicio) {
    return {
      error: 'A data final não pode ser anterior à data inicial.',
      status: 400
    };
  }

  if (!['PREVISAO', 'REAL'].includes(tipoValor)) {
    return { error: 'Selecione o tipo do valor.', status: 400 };
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: 'Informe um valor válido.', status: 400 };
  }

  const rede = await encontrarRedeCadastrada(env, dados?.rede);

  if (!rede) {
    return {
      error: 'Selecione uma rede cadastrada na rentabilidade.',
      status: 400
    };
  }

  const agora = new Date().toISOString();
  const id = crypto.randomUUID();
  const valorPrevisto = tipoValor === 'PREVISAO' ? valor : 0;
  const valorReal = tipoValor === 'REAL' ? valor : null;

  await env.DB.prepare(
    'INSERT INTO rentabilidade_investimentos (' +
      'id, data_inicio, data_fim, rede, tipo, tipo_valor, ' +
      'valor_previsto, valor_real, responsavel, status, created_by, created_at' +
    ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id,
    inicio,
    fim,
    rede,
    tipo,
    tipoValor,
    valorPrevisto,
    valorReal,
    responsavel,
    status,
    String(username || ''),
    agora
  ).run();

  return {
    id,
    rede,
    inicio,
    fim,
    tipoValor,
    valorPrevisto,
    valorReal
  };
}

export async function listarInvestimentosDaMargemRede(env, inicio, fim) {
  validarPeriodo(inicio, fim);
  await garantirTabelaInvestimentosRentabilidade(env);

  const resultado = await env.DB.prepare(
    'SELECT rede, data_inicio, data_fim, valor_real ' +
    'FROM rentabilidade_investimentos ' +
    'WHERE data_fim >= ? AND data_inicio <= ? AND valor_real IS NOT NULL'
  ).bind(inicio, fim).all();

  if (!Array.isArray(resultado.results)) {
    throw new Error('Não foi possível ler os investimentos do banco.');
  }

  const porRede = new Map();
  for (const registro of resultado.results) {
    const valor = calcularRateioInvestimento(registro, inicio, fim);
    porRede.set(registro.rede, (porRede.get(registro.rede) || 0) + valor);
  }
  return Array.from(porRede, ([rede, valor_real]) => ({ rede, valor_real }));
}

export function calcularRateioInvestimento(registro, inicio, fim) {
  validarPeriodo(inicio, fim);
  validarPeriodo(registro.data_inicio, registro.data_fim);
  if (registro.valor_real === null || registro.valor_real === undefined) return 0;
  if (registro.valor_real === '' || !Number.isFinite(Number(registro.valor_real))) {
    throw new Error('Investimento com valor real inválido.');
  }
  const primeiroDia = registro.data_inicio > inicio ? registro.data_inicio : inicio;
  const ultimoDia = registro.data_fim < fim ? registro.data_fim : fim;
  if (primeiroDia > ultimoDia) return 0;
  const diaUtc = (data) => Date.parse(data + 'T00:00:00Z') / 86400000;
  const diasTotais = diaUtc(registro.data_fim) - diaUtc(registro.data_inicio) + 1;
  const diasConsultados = diaUtc(ultimoDia) - diaUtc(primeiroDia) + 1;
  // Preservar precisão até a apresentação. Arredondar a diária perderia centavos.
  return Number(registro.valor_real) * diasConsultados / diasTotais;
}

function validarPeriodo(inicio, fim) {
  if (!dataIsoValida(inicio) || !dataIsoValida(fim) || inicio > fim) {
    throw new Error('Período inválido. Informe datas válidas em ordem crescente.');
  }
}

export async function redesRentabilidade(env) {
  const clientes = await carregarClientesRentabilidade(env);

  return Array.from(new Set(
    clientes
      .map((cliente) => String(cliente.rede || '').trim())
      .filter(Boolean)
  )).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

async function encontrarRedeCadastrada(env, valor) {
  const chave = normalizarRede(valor);

  if (!chave) return '';

  const redes = await redesRentabilidade(env);
  return redes.find((rede) => normalizarRede(rede) === chave) || '';
}

export async function listarTodosInvestimentos(env) {
  await garantirTabelaInvestimentosRentabilidade(env);

  const resultado = await env.DB.prepare(
    `SELECT
      id,
      data_inicio,
      data_fim,
      rede,
      tipo,
      tipo_valor,
      valor_previsto,
      valor_real,
      responsavel,
      status,
      created_at
    FROM rentabilidade_investimentos
    ORDER BY data_inicio DESC, created_at DESC`
  ).all();

  return Array.isArray(resultado.results)
    ? resultado.results
    : [];
}

export async function listarInvestimentosPendentes(env) {
  await garantirTabelaInvestimentosRentabilidade(env);

  const resultado = await env.DB.prepare(
    `SELECT
      id,
      data_inicio,
      data_fim,
      rede,
      tipo,
      valor_previsto,
      responsavel,
      status
    FROM rentabilidade_investimentos
    WHERE tipo_valor = 'PREVISAO'
      AND valor_real IS NULL
    ORDER BY data_inicio ASC, created_at DESC`
  ).all();

  return Array.isArray(resultado.results)
    ? resultado.results
    : [];
}

export async function informarValorRealInvestimento(env, id, valorInformado) {
  await garantirTabelaInvestimentosRentabilidade(env);

  const investimentoId = String(id || '').trim();
  const valorReal = numeroPositivo(valorInformado);

  if (!investimentoId) {
    return { error: 'Investimento não informado.', status: 400 };
  }

  if (!Number.isFinite(valorReal) || valorReal <= 0) {
    return { error: 'Informe um valor real válido.', status: 400 };
  }

  const pendente = await env.DB.prepare(
    `SELECT id, rede, valor_previsto
     FROM rentabilidade_investimentos
     WHERE id = ?
       AND tipo_valor = 'PREVISAO'
       AND valor_real IS NULL`
  ).bind(investimentoId).first();

  if (!pendente) {
    return {
      error: 'Investimento pendente não encontrado.',
      status: 404
    };
  }

  await env.DB.prepare(
    `UPDATE rentabilidade_investimentos
     SET valor_real = ?
     WHERE id = ?`
  ).bind(valorReal, investimentoId).run();

  return {
    id: investimentoId,
    rede: pendente.rede,
    valorPrevisto: Number(pendente.valor_previsto || 0),
    valorReal
  };
}

async function garantirTabelaInvestimentosRentabilidade(env) {
  await env.DB.batch([
    env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS rentabilidade_investimentos (' +
        'id TEXT PRIMARY KEY, ' +
        'data_inicio TEXT NOT NULL, ' +
        'data_fim TEXT NOT NULL, ' +
        'rede TEXT NOT NULL, ' +
        'tipo TEXT NOT NULL, ' +
        'tipo_valor TEXT NOT NULL, ' +
        'valor_previsto REAL NOT NULL DEFAULT 0, ' +
        'valor_real REAL, ' +
        'responsavel TEXT NOT NULL, ' +
        'status TEXT NOT NULL, ' +
        'created_by TEXT NOT NULL, ' +
        'created_at TEXT NOT NULL' +
      ')'
    ),
    env.DB.prepare(
      'CREATE INDEX IF NOT EXISTS idx_rentabilidade_investimentos_fim_rede ' +
      'ON rentabilidade_investimentos (data_fim, rede)'
    )
  ]);
}

function dataIsoValida(valor) {
  const texto = String(valor || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return '';
  const data = new Date(texto + 'T00:00:00Z');
  return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === texto
    ? texto : '';
}

function textoObrigatorio(valor, mensagem) {
  const texto = String(valor || '').trim();

  if (!texto) {
    throw new Error(mensagem);
  }

  return texto;
}

function numeroPositivo(valor) {
  if (typeof valor === 'number') return valor;

  let texto = String(valor || '').replace('R$', '').trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  return Number(texto);
}

function normalizarRede(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
}
