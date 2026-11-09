function normalizarCampo(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function interpretarData(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);

  if (!partes) return null;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);

  if (ano < 1900 || ano > 9999) return null;

  const data = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    return null;
  }

  return `${partes[3]}-${partes[2]}-${partes[1]}`;
}

export function interpretarMensagemValidade(texto) {
  if (typeof texto !== 'string' || !texto.trim()) {
    return {
      status: 'IGNORAR',
      motivos: ['Mensagem vazia.']
    };
  }

  if (texto.length > 10000) {
    return {
      status: 'REVISAR',
      motivos: ['Mensagem muito longa.']
    };
  }

  const linhas = texto
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(Boolean);

  const possuiTitulo = normalizarCampo(linhas[0]) === 'validade';

  const nomesCampos = {
    loja: 'loja',
    produto: 'produto',
    quantidade: 'quantidade',
    venc: 'vencimento',
    vencimento: 'vencimento',
    validade: 'vencimento'
  };

  const campos = {};
  const motivos = [];
  let camposReconhecidos = 0;

  for (let i = possuiTitulo ? 1 : 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const separador = linha.indexOf(':');

    if (separador < 0) {
      motivos.push(`Linha sem identificação: ${linha}`);
      continue;
    }

    const nome = normalizarCampo(linha.slice(0, separador));
    const campo = nomesCampos[nome];

    if (!campo) {
      motivos.push(`Campo não reconhecido: ${linha.slice(0, separador)}`);
      continue;
    }

    camposReconhecidos++;

    if (Object.prototype.hasOwnProperty.call(campos, campo)) {
      motivos.push(`Campo repetido: ${campo}.`);
      continue;
    }

    campos[campo] = linha.slice(separador + 1).trim();
  }

  if (!possuiTitulo && camposReconhecidos < 2) {
    return {
      status: 'IGNORAR',
      motivos: ['Mensagem fora do padrão de validade.']
    };
  }

  for (const campo of ['loja', 'produto', 'quantidade', 'vencimento']) {
    if (!campos[campo]) {
      motivos.push(`Informe o campo ${campo}.`);
    }
  }

  const quantidadeEncontrada =
    /^(\d+)\s*(?:un|und|unid|unidade|unidades)?\.?$/i.exec(
      campos.quantidade || ''
    );

  const quantidade = quantidadeEncontrada
    ? Number(quantidadeEncontrada[1])
    : null;

  if (
    campos.quantidade &&
    (!Number.isSafeInteger(quantidade) || quantidade <= 0)
  ) {
    motivos.push('Quantidade deve ser um número inteiro positivo em unidades.');
  }

  const vencimento = interpretarData(campos.vencimento || '');

  if (campos.vencimento && !vencimento) {
    motivos.push('Vencimento deve ser uma data válida no formato DD/MM/AAAA.');
  }

  if (motivos.length) {
    return {
      status: 'REVISAR',
      mensagemOriginal: texto,
      camposRecebidos: campos,
      motivos
    };
  }

  return {
    status: 'VALIDO',
    mensagemOriginal: texto,
    dados: {
      lojaNome: campos.loja,
      produtoNome: campos.produto,
      quantidade,
      unidade: 'UN',
      vencimento
    }
  };
}
