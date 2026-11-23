function erroFiltro(mensagem) {
  const erro = new Error(mensagem);
  erro.status = 400;
  return erro;
}

function lerParametro(parametros, nome) {
  const valores = parametros.getAll(nome);

  if (valores.length > 1) {
    throw erroFiltro('Parâmetro repetido: ' + nome + '.');
  }

  return valores.length ? valores[0].trim() : '';
}

function validarData(valor, nome) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw erroFiltro('Informe uma ' + nome + ' válida.');
  }

  const ano = Number(valor.slice(0, 4));
  const mes = Number(valor.slice(5, 7));
  const dia = Number(valor.slice(8, 10));

  if (ano < 1900 || ano > 9999) {
    throw erroFiltro('Ano inválido na ' + nome + '.');
  }

  const data = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    throw erroFiltro('Informe uma ' + nome + ' válida.');
  }

  return valor;
}

function lerOpcao(parametros, nome, padrao) {
  const valor = lerParametro(parametros, nome);

  if (!parametros.has(nome)) {
    return padrao;
  }

  if (valor === '1') return true;
  if (valor === '0') return false;

  throw erroFiltro('Opção inválida: ' + nome + '.');
}

export function validarFiltrosFluxoCaixa(parametros) {
  const inicio = validarData(
    lerParametro(parametros, 'inicio'),
    'data inicial'
  );

  const fim = validarData(
    lerParametro(parametros, 'fim'),
    'data final'
  );

  if (inicio > fim) {
    throw erroFiltro(
      'A data inicial não pode ser posterior à data final.'
    );
  }

  const textoContas = lerParametro(parametros, 'contas');

  if (!textoContas) {
    throw erroFiltro('Selecione pelo menos uma conta.');
  }

  const contas = textoContas.split(',').map(function (valor) {
    const conta = valor.trim();

    if (
      !/^[1-9]\d*$/.test(conta) ||
      !Number.isSafeInteger(Number(conta))
    ) {
      throw erroFiltro('A seleção contém uma conta inválida.');
    }

    return conta;
  });

  return {
    inicio,
    fim,
    contas: Array.from(new Set(contas)),
    incluirProvisoes: lerOpcao(
      parametros, 'provisoes', false
    ),
    considerarBaixados: lerOpcao(
      parametros, 'baixados', true
    ),
    considerarCarencia: lerOpcao(
      parametros, 'carencia', true
    ),
    apenasSaldoInicialConciliado: lerOpcao(
      parametros, 'conciliado', false
    )
  };
}
