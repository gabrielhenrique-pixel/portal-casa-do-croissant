export function clientesRentabilidadePage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Cadastro de clientes</title>
  <style>
    :root{--navy:#102e49;--blue:#1f4e78;--bg:#edf4fa;--line:#cfdce8;--text:#142b3d;--green:#0a6237;--red:#b42318}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,sans-serif}
    main{max-width:1540px;margin:auto;padding:12px}
    .topo{display:flex;align-items:center;gap:12px;padding:18px 22px;border-radius:16px;background:#fff;box-shadow:0 5px 18px #1231}
    .voltar,.inicio{display:grid;place-items:center;width:45px;height:45px;border-radius:50%;background:#fff;color:var(--navy);box-shadow:0 4px 12px #1232;font-size:22px;text-decoration:none}
    .topo h1{margin:0;font-size:26px}
    .topo p{margin:4px 0 0;color:#627283;font-size:13px}
    .barra{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:12px 0;padding:14px;border-radius:14px;background:#fff;box-shadow:0 3px 10px #1231}
    .busca{flex:1 1 270px;min-height:38px;border:1px solid #b9cce0;border-radius:7px;padding:8px 11px;font:inherit}
    .botao{min-height:38px;border:0;border-radius:7px;padding:9px 13px;background:var(--navy);color:#fff;font:inherit;font-weight:700;cursor:pointer}
    .botao.verde{background:var(--green)}
    .botao:disabled{opacity:.55;cursor:not-allowed}
    .contagem{margin-left:auto;color:#586a7b;font-size:13px;font-weight:700}
    .tabela-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px;background:#fff;box-shadow:0 3px 11px #1231}
    table{width:100%;min-width:1110px;border-collapse:collapse;font-size:13px}
    th,td{border-bottom:1px solid #dce5ed;padding:10px 9px;text-align:left;vertical-align:middle}
    th{position:sticky;top:0;z-index:2;background:var(--blue);color:#fff;font-size:12px;white-space:nowrap}
    th .cab{display:flex;align-items:center;justify-content:space-between;gap:5px}
    th button{border:0;background:transparent;color:#fff;font:inherit;font-weight:700;cursor:pointer}
    th .filtro{width:22px;height:22px;border-radius:4px;background:#ffffff22}
    tbody tr:nth-child(even){background:#f8fbfe}
    tbody tr:hover{background:#e8f3fb}
    td.numero{text-align:right}
    td.centro{text-align:center}
    .vazio{text-align:center;color:#64748b;padding:30px}
    .estado{min-height:18px;margin:7px 2px;color:#52677a;font-size:13px}
    .estado.erro{color:var(--red)}
    .menu-filtro{position:fixed;z-index:20;width:292px;max-height:410px;padding:12px;border:1px solid #9eb3c7;border-radius:8px;background:#fff;box-shadow:0 12px 26px #1235}
    .menu-filtro input[type=search]{width:100%;margin:8px 0;padding:8px;border:1px solid #b9cce0;border-radius:5px}
    .opcoes-filtro{max-height:235px;overflow:auto;border:1px solid #d6e1ea}
    .opcoes-filtro label{display:flex;gap:7px;align-items:center;padding:6px 8px;font-size:12px}
    .opcoes-filtro label:hover{background:#edf5fc}
    .acoes-filtro{display:flex;justify-content:flex-end;gap:7px;margin-top:10px}
    .secundario{min-height:32px;border:1px solid #aebfd0;border-radius:5px;padding:6px 9px;background:#fff;color:#244866;font-weight:700;cursor:pointer}
    .modal{position:fixed;z-index:30;inset:0;display:none;place-items:center;padding:16px;background:#102e4988}
    .modal.aberto{display:grid}
    .caixa{width:min(580px,100%);max-height:90vh;overflow:auto;padding:22px;border-radius:14px;background:#fff;box-shadow:0 16px 42px #0005}
    .caixa h2{margin:0 0 6px}
    .caixa p{margin:0 0 16px;color:#607287;font-size:13px}
    .grade{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .campo{display:grid;gap:5px;font-size:12px;font-weight:700}
    .campo input,.campo select{min-height:38px;border:1px solid #b9cce0;border-radius:6px;padding:8px;font:inherit}
    .rodape-modal{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}
    @media(max-width:650px){main{padding:6px}.topo{padding:14px}.topo h1{font-size:20px}.contagem{margin-left:0;width:100%}.grade{grid-template-columns:1fr}}
  </style>
</head>
<body>
<main>
  <header class="topo">
    <a class="voltar" href="/" title="Voltar ao menu">←</a>
    <a class="inicio" href="/" title="Página inicial">⌂</a>
    <div>
      <h1>Cadastro de clientes</h1>
    </div>
  </header>

  <section class="barra">
    <input id="busca" class="busca" placeholder="Pesquisar código, cliente, rede ou percentual">
    <button id="sincronizar" class="botao verde" type="button"hidden>Sincronizar Sankhya</button>
    <button id="editar" class="botao" type="button" disabled>Editar selecionados</button>
    <strong id="contagem" class="contagem">Carregando...</strong>
  </section>

  <p id="estado" class="estado"></p>

  <section class="tabela-wrap">
    <table>
      <thead id="cabecalho"></thead>
      <tbody id="linhas"></tbody>
    </table>
  </section>

  <div id="modal" class="modal">
    <section class="caixa">
      <h2>Editar clientes selecionados</h2>
      <p id="textoModal"></p>

      <div class="grade">
        <label class="campo">
          Rede
          <select id="campoRede">
            <option value="">Não alterar</option>
          </select>
        </label>

        <label class="campo">
          % Desc. Financeiro
          <input id="campoDesconto" type="number" min="0" max="100" step="0.01" placeholder="Não alterar">
        </label>

        <label class="campo">
          % Promotoria
          <input id="campoPromotoria" type="number" min="0" max="100" step="0.01" placeholder="Não alterar">
        </label>

        <label class="campo">
          % Comissão de venda
          <input id="campoComissao" type="number" min="0" max="100" step="0.01" placeholder="Não alterar">
        </label>
      </div>

      <div class="rodape-modal">
        <button id="cancelar" class="secundario" type="button">Cancelar</button>
        <button id="salvar" class="botao verde" type="button">Salvar alterações</button>
      </div>
    </section>
  </div>
</main>

<script>
(function () {
  var clientes = [];
  var redes = [];
  var selecionados = new Set();
  var filtros = {};
  var ordenacao = { campo: 'cliente', direcao: 'asc' };
  var aberto = null;

  var colunas = [
    ['codigoParceiro', 'Código'],
    ['cliente', 'Cliente'],
    ['percentualContrato', '% Desc. Financeiro'],
    ['percentualPromotoria', '% Promotoria'],
    ['percentualComissao', '% Comissão de venda'],
    ['rede', 'Rede']
  ];

  var $ = function (id) {
    return document.getElementById(id);
  };

  var fmt = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  function esc(valor) {
    var div = document.createElement('div');
    div.textContent = String(valor == null ? '' : valor);
    return div.innerHTML;
  }

  function pct(valor) {
    if (valor == null || valor === '') return '—';
    return fmt.format(Number(valor) * 100) + '%';
  }

  function filtroValor(cliente, campo) {
    if (campo.indexOf('percentual') === 0) {
      return pct(cliente[campo]);
    }

    return String(cliente[campo] || 'SEM REDE');
  }

  function lista() {
    var texto = $('busca').value.trim().toLocaleLowerCase('pt-BR');

    return clientes
      .filter(function (cliente) {
        if (
          texto &&
          !colunas.some(function (coluna) {
            return filtroValor(cliente, coluna[0])
              .toLocaleLowerCase('pt-BR')
              .includes(texto);
          })
        ) {
          return false;
        }

        return colunas.every(function (coluna) {
          var filtro = filtros[coluna[0]];
          return !filtro || filtro.has(filtroValor(cliente, coluna[0]));
        });
      })
      .sort(function (a, b) {
        var x = filtroValor(a, ordenacao.campo);
        var y = filtroValor(b, ordenacao.campo);

        return x.localeCompare(y, 'pt-BR', { numeric: true }) *
          (ordenacao.direcao === 'asc' ? 1 : -1);
      });
  }

  function cabecalho() {
    var html = '<tr><th><input id="todos" type="checkbox"></th>';

    html += colunas.map(function (coluna) {
      var seta = ordenacao.campo === coluna[0]
        ? (ordenacao.direcao === 'asc' ? ' ▲' : ' ▼')
        : '';

      return '<th><span class="cab">' +
        '<button data-ordenar="' + coluna[0] + '" type="button">' +
        esc(coluna[1]) + seta +
        '</button>' +
        '<button class="filtro" data-filtrar="' + coluna[0] + '" type="button">▾</button>' +
        '</span></th>';
    }).join('');

    html += '</tr>';

    $('cabecalho').innerHTML = html;

    var exibidos = lista();

    $('todos').checked =
      exibidos.length > 0 &&
      exibidos.every(function (cliente) {
        return selecionados.has(cliente.codigoParceiro);
      });

    $('editar').disabled = selecionados.size === 0;
  }

  function render() {
    var dados = lista();

    cabecalho();

    $('linhas').innerHTML = dados.length
      ? dados.map(function (cliente) {
        return '<tr>' +
          '<td class="centro"><input class="selecionar" type="checkbox" data-codigo="' +
          esc(cliente.codigoParceiro) + '" ' +
          (selecionados.has(cliente.codigoParceiro) ? 'checked' : '') +
          '></td>' +
          '<td>' + esc(cliente.codigoParceiro) + '</td>' +
          '<td>' + esc(cliente.cliente) + '</td>' +
          '<td class="numero">' + pct(cliente.percentualContrato) + '</td>' +
          '<td class="numero">' + pct(cliente.percentualPromotoria) + '</td>' +
          '<td class="numero">' + pct(cliente.percentualComissao) + '</td>' +
          '<td>' + esc(cliente.rede || 'SEM REDE') + '</td>' +
          '</tr>';
      }).join('')
      : '<tr><td class="vazio" colspan="7">Nenhum cliente encontrado.</td></tr>';

    $('contagem').textContent =
      dados.length + ' exibido(s) • ' +
      selecionados.size + ' selecionado(s)';
  }

  function abrirFiltro(campo, botao) {
    if (aberto) aberto.remove();

    var valores = Array.from(
      new Set(
        clientes.map(function (cliente) {
          return filtroValor(cliente, campo);
        })
      )
    ).sort(function (a, b) {
      return a.localeCompare(b, 'pt-BR', { numeric: true });
    });

    var atual = filtros[campo] || new Set(valores);
    var div = document.createElement('section');

    div.className = 'menu-filtro';

    div.innerHTML =
      '<strong>Filtro: ' +
      esc(colunas.find(function (coluna) {
        return coluna[0] === campo;
      })[1]) +
      '</strong>' +
      '<input type="search" placeholder="Pesquisar">' +
      '<label><input class="marcar" type="checkbox"> Selecionar tudo</label>' +
      '<div class="opcoes-filtro">' +
      valores.map(function (valor) {
        return '<label data-opcao="' + esc(valor) + '">' +
          '<input type="checkbox" ' +
          (atual.has(valor) ? 'checked' : '') +
          '> ' + esc(valor) +
          '</label>';
      }).join('') +
      '</div>' +
      '<div class="acoes-filtro">' +
      '<button class="secundario limpar" type="button">Limpar</button>' +
      '<button class="botao aplicar" type="button">Aplicar</button>' +
      '</div>';

    document.body.appendChild(div);

    var posicao = botao.getBoundingClientRect();

    div.style.top = Math.min(posicao.bottom + 5, innerHeight - 420) + 'px';
    div.style.left = Math.min(posicao.left, innerWidth - 305) + 'px';

    aberto = div;

    var busca = div.querySelector('input[type=search]');

    busca.addEventListener('input', function () {
      var texto = busca.value.toLocaleLowerCase('pt-BR');

      div.querySelectorAll('[data-opcao]').forEach(function (item) {
        item.hidden = !item.textContent
          .toLocaleLowerCase('pt-BR')
          .includes(texto);
      });
    });

    div.querySelector('.marcar').addEventListener('change', function (evento) {
      div.querySelectorAll('[data-opcao]:not([hidden]) input')
        .forEach(function (input) {
          input.checked = evento.target.checked;
        });
    });

    div.querySelector('.limpar').onclick = function () {
      delete filtros[campo];
      div.remove();
      aberto = null;
      render();
    };

    div.querySelector('.aplicar').onclick = function () {
      filtros[campo] = new Set(
        Array.from(div.querySelectorAll('[data-opcao] input:checked'))
          .map(function (input) {
            return input.parentElement.textContent.trim();
          })
      );

      div.remove();
      aberto = null;
      render();
    };
  }

  async function carregar() {
    try {
      $('estado').textContent = 'Carregando cadastro...';

      var resposta = await fetch('/api/rentabilidade/clientes', {
        credentials: 'same-origin'
      });

      var dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível carregar os clientes.');
      }

      clientes = dados.clientes || [];
      redes = dados.redes || [];

      $('campoRede').innerHTML =
        '<option value="">Não alterar</option>' +
        redes.map(function (rede) {
          return '<option value="' + esc(rede) + '">' + esc(rede) + '</option>';
        }).join('');

      $('estado').textContent = 'Cadastro atualizado.';
      $('estado').className = 'estado';

      render();
    } catch (erro) {
      $('estado').textContent = erro.message;
      $('estado').className = 'estado erro';
    }
  }

  async function sincronizar() {
    var botao = $('sincronizar');

    botao.disabled = true;
    botao.textContent = 'Sincronizando...';

    try {
      var resposta = await fetch(
        '/api/rentabilidade/clientes/sincronizar',
        {
          method: 'POST',
          credentials: 'same-origin'
        }
      );

      var dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível sincronizar.');
      }

      $('estado').textContent =
        dados.totalSincronizado +
        ' clientes ativos sincronizados pelo Sankhya.';

      await carregar();
    } catch (erro) {
      $('estado').textContent = erro.message;
      $('estado').className = 'estado erro';
    } finally {
      botao.disabled = false;
      botao.textContent = 'Sincronizar Sankhya';
    }
  }

  function abrirModal() {
    if (!selecionados.size) return;

    $('textoModal').textContent =
      selecionados.size +
      ' cliente(s) selecionado(s). Deixe em branco o campo que não deve mudar.';

    $('campoRede').value = '';
    $('campoDesconto').value = '';
    $('campoPromotoria').value = '';
    $('campoComissao').value = '';

    $('modal').classList.add('aberto');
  }

  function fecharModal() {
    $('modal').classList.remove('aberto');
  }

  function valorPercentual(id) {
    var valor = $(id).value.trim();

    if (valor === '') return undefined;

    return Number(valor) / 100;
  }

  async function salvar() {
    var campos = {};
    var valor = valorPercentual('campoDesconto');

    if (valor !== undefined) campos.percentualContrato = valor;

    valor = valorPercentual('campoPromotoria');

    if (valor !== undefined) campos.percentualPromotoria = valor;

    valor = valorPercentual('campoComissao');

    if (valor !== undefined) campos.percentualComissao = valor;

    if ($('campoRede').value) {
      campos.rede = $('campoRede').value;
    }

    if (!Object.keys(campos).length) {
      $('estado').textContent = 'Informe um campo para alterar.';
      $('estado').className = 'estado erro';
      return;
    }

    var botao = $('salvar');

    botao.disabled = true;

    try {
      var resposta = await fetch('/api/rentabilidade/clientes/lote', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          codigoParceiros: Array.from(selecionados),
          campos: campos
        })
      });

      var dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível salvar.');
      }

      selecionados.clear();
      fecharModal();

      $('estado').textContent =
        dados.totalAtualizado + ' cliente(s) atualizado(s).';

      await carregar();
    } catch (erro) {
      $('estado').textContent = erro.message;
      $('estado').className = 'estado erro';
    } finally {
      botao.disabled = false;
    }
  }

  document.addEventListener('click', function (evento) {
    var filtro = evento.target.closest('[data-filtrar]');
    var ordem = evento.target.closest('[data-ordenar]');

    if (filtro) {
      evento.stopPropagation();
      abrirFiltro(filtro.dataset.filtrar, filtro);
      return;
    }

    if (ordem) {
      ordenacao.direcao =
        ordenacao.campo === ordem.dataset.ordenar &&
        ordenacao.direcao === 'asc'
          ? 'desc'
          : 'asc';

      ordenacao.campo = ordem.dataset.ordenar;
      render();
      return;
    }

    if (aberto && !aberto.contains(evento.target)) {
      aberto.remove();
      aberto = null;
    }
  });

  $('busca').addEventListener('input', render);

  $('cabecalho').addEventListener('change', function (evento) {
    if (evento.target.id !== 'todos') return;

    lista().forEach(function (cliente) {
      if (evento.target.checked) {
        selecionados.add(cliente.codigoParceiro);
      } else {
        selecionados.delete(cliente.codigoParceiro);
      }
    });

    render();
  });

  $('linhas').addEventListener('change', function (evento) {
    if (!evento.target.classList.contains('selecionar')) return;

    if (evento.target.checked) {
      selecionados.add(evento.target.dataset.codigo);
    } else {
      selecionados.delete(evento.target.dataset.codigo);
    }

    render();
  });

  $('sincronizar').onclick = sincronizar;
  $('editar').onclick = abrirModal;
  $('cancelar').onclick = fecharModal;
  $('salvar').onclick = salvar;

  $('modal').addEventListener('click', function (evento) {
    if (evento.target === $('modal')) fecharModal();
  });

  carregar();
})();
</script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
