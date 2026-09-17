export const REDES_RENTABILIDADE = Object.freeze([
  'ALIMAX', 'ANGELONI', 'ANGELONI SC', 'ARCHER', 'ASSAÍ', 'BAVARESCO',
  'BELLA VILLA', 'BOZA', 'CIRCUITO', 'COLATUSSO', 'CONDOR', 'COOP',
  'FESTVAL', 'GEPETTO', 'GIASSI', 'HIPER SELECT', 'HIPPO', 'ITALO',
  'JACOMAR', 'KOCH', 'MUFFATO', 'NO PONTO', 'OBA', 'OUTROS', 'REDE MAX',
  'STRAPASSON', 'SUPER GOLFF', 'TELEMACO', 'TOZETTO', 'VERONA',
  'ZAMPROGNA', 'IMPERATRIZ', 'SEM REDE'
]);

function camposDaLinhaSankhya(linha) {
  if (Array.isArray(linha)) return linha;
  if (linha && Array.isArray(linha.row)) return linha.row;
  if (linha && typeof linha === 'object') return Object.values(linha);
  return [];
}

function numeroPercentualSankhya(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;

  let texto = String(valor).trim();

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) return 0;

  return numero > 1 ? numero / 100 : numero;
}

function redeEditavel(valor) {
  const rede = String(valor || '').trim().toUpperCase() || 'SEM REDE';

  if (!REDES_RENTABILIDADE.includes(rede)) {
    throw new Error('Selecione uma rede válida.');
  }

  return rede;
}

export async function sincronizarClientesRentabilidadeSankhya(env, linhas) {
  await garantirCadastroClientesRentabilidade(env);

  const clientes = (Array.isArray(linhas) ? linhas : [])
    .map(camposDaLinhaSankhya)
    .map((campos) => ({
      codigoParceiro: String(campos[0] || '').trim(),
      cliente: String(campos[1] || '').trim(),
      percentualContrato: numeroPercentualSankhya(campos[2]),
      percentualComissao: numeroPercentualSankhya(campos[3])
    }))
    .filter((cliente) => cliente.codigoParceiro && cliente.cliente);

  const agora = new Date().toISOString();
  const tamanhoDoLote = 50;

  for (let inicio = 0; inicio < clientes.length; inicio += tamanhoDoLote) {
    const lote = clientes.slice(inicio, inicio + tamanhoDoLote);

    await env.DB.batch(
      lote.map((cliente) =>
        env.DB.prepare(
          'INSERT INTO rentabilidade_clientes (' +
            'codigo_parceiro, cliente, rede, percentual_contrato, ' +
            'percentual_promotoria, percentual_comissao, created_at, ' +
            'updated_at, updated_by' +
          ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(codigo_parceiro) DO UPDATE SET ' +
            'cliente = excluded.cliente, ' +
            'percentual_contrato = excluded.percentual_contrato, ' +
            'percentual_comissao = excluded.percentual_comissao, ' +
            'updated_at = excluded.updated_at, ' +
            'updated_by = excluded.updated_by'
        ).bind(
          cliente.codigoParceiro,
          cliente.cliente,
          'SEM REDE',
          cliente.percentualContrato,
          null,
          cliente.percentualComissao,
          agora,
          agora,
          'Sankhya'
        )
      )
    );
  }

  return { totalSincronizado: clientes.length };
}

export async function atualizarClientesRentabilidadeEmLote(
  env,
  codigosRecebidos,
  dadosRecebidos,
  username
) {
  const codigos = Array.from(
    new Set(
      (Array.isArray(codigosRecebidos) ? codigosRecebidos : [])
        .map((codigo) => String(codigo || '').trim())
        .filter(Boolean)
    )
  );

  const dados = dadosRecebidos && typeof dadosRecebidos === 'object'
    ? dadosRecebidos
    : {};

  const alterarRede = possuiCampo(dados, 'rede');
  const alterarDesconto = possuiCampo(dados, 'percentualContrato');
  const alterarPromotoria = possuiCampo(dados, 'percentualPromotoria');
  const alterarComissao = possuiCampo(dados, 'percentualComissao');

  if (!codigos.length) {
    return { status: 400, error: 'Selecione pelo menos um cliente.' };
  }

  if (
    !alterarRede &&
    !alterarDesconto &&
    !alterarPromotoria &&
    !alterarComissao
  ) {
    return { status: 400, error: 'Informe ao menos um campo para editar.' };
  }

  let rede;
  let desconto;
  let promotoria;
  let comissao;

  try {
    rede = alterarRede ? redeEditavel(dados.rede) : null;

    desconto = alterarDesconto
      ? normalizarPercentualRentabilidade(
        dados.percentualContrato,
        'Desconto financeiro'
      )
      : null;

    promotoria = alterarPromotoria
      ? normalizarPercentualRentabilidade(
        dados.percentualPromotoria,
        'Promotoria'
      )
      : null;

    comissao = alterarComissao
      ? normalizarPercentualRentabilidade(
        dados.percentualComissao,
        'Comissão de venda'
      )
      : null;
  } catch (error) {
    return { status: 400, error: error.message };
  }

  await garantirCadastroClientesRentabilidade(env);

  const atualizadoEm = new Date().toISOString();
  const tamanhoDoLote = 50;

  for (let inicio = 0; inicio < codigos.length; inicio += tamanhoDoLote) {
    const lote = codigos.slice(inicio, inicio + tamanhoDoLote);

    await env.DB.batch(
      lote.map((codigoParceiro) =>
        env.DB.prepare(
          'UPDATE rentabilidade_clientes SET ' +
            'rede = CASE WHEN ? = 1 THEN ? ELSE rede END, ' +
            'percentual_contrato = CASE WHEN ? = 1 THEN ? ELSE percentual_contrato END, ' +
            'percentual_promotoria = CASE WHEN ? = 1 THEN ? ELSE percentual_promotoria END, ' +
            'percentual_comissao = CASE WHEN ? = 1 THEN ? ELSE percentual_comissao END, ' +
            'updated_at = ?, updated_by = ? ' +
          'WHERE codigo_parceiro = ?'
        ).bind(
          alterarRede ? 1 : 0,
          rede,
          alterarDesconto ? 1 : 0,
          desconto,
          alterarPromotoria ? 1 : 0,
          promotoria,
          alterarComissao ? 1 : 0,
          comissao,
          atualizadoEm,
          username,
          codigoParceiro
        )
      )
    );
  }

  return {
    status: 200,
    totalAtualizado: codigos.length
  };
}
