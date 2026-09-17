export function margemRedePage() {
  return new Response(String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Margem_Rede | Casa do Croissant</title>
  <style>
    :root {
      --faixa:#17130f;
      --titulo:#e7d8bd;
      --azul:#1f4e78;
      --azul-claro:#d9eaf7;
      --fundo:#f4f7f5;
      --borda:#d9d2c3;
      --texto:#182e25;
      --vermelho:#c00000;
      --amarelo:#bf9000;
      --verde:#548235;
    }

    * { box-sizing:border-box; }

    body {
      min-width:0;
      margin:0;
      background:var(--fundo);
      color:var(--texto);
      font-family:Arial, sans-serif;
    }

    main {
      max-width:1560px;
      margin:0 auto;
      padding:24px 18px 36px;
    }

    .faixa-titulo {
      padding:18px 22px;
      background:var(--faixa);
      border-radius:10px 10px 0 0;
    }

    h1 {
      margin:0;
      color:var(--titulo);
      font-size:25px;
      letter-spacing:.2px;
    }

    .nota {
      margin:0;
      padding:10px 22px;
      border:1px solid var(--borda);
      border-top:0;
      background:#f4efe6;
      color:#707070;
      font-size:13px;
      font-style:italic;
    }

    .controles {
      display:flex;
      align-items:end;
      flex-wrap:wrap;
      gap:14px;
      margin:18px 0 0;
      padding:16px;
      border:1px solid #d6e1da;
      border-radius:10px;
      background:#fff;
    }

    .campo {
      display:grid;
      gap:6px;
      min-width:162px;
    }

    label {
      font-size:12px;
      font-weight:700;
    }

    input[type="date"] {
      min-height:38px;
      border:1px solid #9db8aa;
      border-radius:6px;
      padding:7px 9px;
      color:#1b3429;
      font:inherit;
    }

    button {
      min-height:38px;
      border:0;
      border-radius:6px;
      padding:8px 16px;
      background:#0d6a3c;
      color:#fff;
      font:inherit;
      font-weight:700;
      cursor:pointer;
    }

    button:hover:not(:disabled) { background:#09542f; }
    button:disabled { opacity:.7; cursor:wait; }

    .estado {
      min-height:20px;
      margin:15px 0 9px;
      color:#596960;
      font-size:14px;
    }

    .estado.erro {
      padding:12px 14px;
      border:1px solid #f2b8b5;
      border-radius:8px;
      background:#fde9e7;
      color:#b42318;
    }

    .alertas {
      display:none;
      margin:0 0 10px;
      padding:11px 13px;
      border:1px solid #efc675;
      border-radius:8px;
      background:#fff8e6;
      color:#755500;
      font-size:13px;
    }

    .alertas.visivel { display:block; }

    .tabela-area {
      overflow-x:auto;
      border:1px solid var(--borda);
      border-radius:8px;
      background:#fff;
      box-shadow:0 3px 12px rgba(18,47,35,.06);
    }

    table {
      width:100%;
      min-width:1190px;
      border-collapse:collapse;
      font-size:13px;
    }

    th {
      position:sticky;
      top:0;
      z-index:1;
      min-height:30px;
      border:1px solid var(--borda);
      padding:7px 8px;
      background:var(--azul);
      color:#fff;
      font-size:11px;
      font-weight:700;
      line-height:1.15;
      text-align:center;
      white-space:normal;
    }

    td {
      border:1px solid var(--borda);
      padding:7px 9px;
      color:#171717;
      text-align:right;
      vertical-align:middle;
      white-space:nowrap;
    }

    td.rede {
      background:var(--azul-claro);
      text-align:left;
      font-weight:700;
    }

    td.devolucao, td.negativo { color:var(--vermelho); }
    td.margem-critica { background:#f4cccc; color:var(--vermelho); font-weight:700; }
    td.margem-alerta { background:#fff2cc; color:var(--amarelo); font-weight:700; }
    td.margem-boa { background:#e2f0d9; color:var(--verde); font-weight:700; }
    td.vazio { color:#66746d; }
    tbody tr:hover td:not(.rede) { background:#f7faf8; }
    tbody tr:hover td.margem-critica { background:#f0bbbb; }
    tbody tr:hover td.margem-alerta { background:#ffebac; }
    tbody tr:hover td.margem-boa { background:#d6ebc9; }

    .sem-dados td {
      padding:26px;
      color:#5d6f65;
      text-align:center;
    }

    .topo {
  display:flex;
  align-items:center;
  gap:16px;
  padding:18px 34px;
  border-radius:18px;
  background:rgba(255,255,255,.92);
  box-shadow:0 8px 22px #1730521c;
}

.navegacao-topo {
  display:flex;
  gap:8px;
  flex-shrink:0;
}

.nav-icone {
  display:grid;
  width:48px;
  height:48px;
  place-items:center;
  border-radius:50%;
  background:#fff;
  box-shadow:0 5px 15px #1730521c;
  color:#102e49;
  font-size:25px;
  font-weight:700;
  text-decoration:none;
  transition:transform .15s, background .15s;
}

.nav-icone:hover {
  background:#edf3f9;
  transform:translateY(-2px);
}

.marca {
  flex:1;
}

.marca span {
  color:#102e49;
  font-size:30px;
  font-weight:700;
}

.controles {
  display:flex;
  align-items:end;
  flex-wrap:wrap;
  gap:18px;
  margin-top:15px;
  padding:14px 34px;
  border:0;
  border-radius:15px;
  background:rgba(255,255,255,.84);
  box-shadow:0 6px 18px #17305214;
}

.campo {
  display:grid;
  gap:5px;
  min-width:175px;
  color:#17375f;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
}

.campo span {
  font-size:11px;
}

.campo input[type="date"] {
  width:175px;
  min-height:39px;
  border:1px solid #c6d4e4;
  border-radius:7px;
  padding:0 10px;
  color:#142f57;
  background:#fff;
  font-size:14px;
}

#atualizar {
  min-height:39px;
  padding:10px 18px;
  background:#102e49;
  color:#fff;
  font-size:13px;
  font-weight:700;
}

#atualizar:hover:not(:disabled) {
  background:#1b4b7b;
}

    @media (max-width:720px) {
      main { padding:12px 10px 24px; }
      .faixa-titulo { padding:16px; }
      .nota { padding:10px 16px; }
      .controles { align-items:stretch; }
      .campo { flex:1 1 135px; }
      button { width:100%; }
    }
  </style>
</head>
<body>
  <main>
    <header class="topo">
  <nav class="navegacao-topo" aria-label="Navegação">
    <a class="nav-icone" href="/dashboard-rentabilidade" aria-label="Voltar à rentabilidade">←</a>
    <a class="nav-icone" href="/" aria-label="Voltar à página inicial">⌂</a>
  </nav>

  <div class="marca">
    <span>MARGEM POR REDE</span>
  </div>
</header>

<form class="controles" id="formFiltros">
  <label class="campo" for="inicio">
    <span>Data inicial</span>
    <input id="inicio" type="date" required>
  </label>

  <label class="campo" for="fim">
    <span>Data final</span>
    <input id="fim" type="date" required>
  </label>

  <button id="atualizar" type="submit">↻ ATUALIZAR DADOS</button>
</form>
    <p class="estado" id="estado" aria-live="polite">Carregando dados...</p>
    <div class="alertas" id="alertas" role="status"></div>

    <section class="tabela-area" aria-label="Tabela de margem por rede">
      <table>
        <thead>
          <tr>
            <th>Rede</th>
            <th>Fat Bruto</th>
            <th>Devoluções</th>
            <th>Receita Líquida</th>
            <th>Resultado do resumo</th>
            <th>Investimentos</th>
            <th>Frete</th>
            <th>Resultado Final</th>
            <th>Margem %</th>
            <th>Participação</th>
            <th>Clientes Positivados</th>
          </tr>
        </thead>
        <tbody id="linhasTabela"></tbody>
      </table>
    </section>
  </main>

  <script>
    (function() {
      var form = document.getElementById('formFiltros');
      var inicio = document.getElementById('inicio');
      var fim = document.getElementById('fim');
      var consultaAtual = 0;
      var estado = document.getElementById('estado');
      var alertas = document.getElementById('alertas');
      var linhasTabela = document.getElementById('linhasTabela');
      var atualizar = document.getElementById('atualizar');

      function dataParaInput(data) {
        return [
          data.getFullYear(),
          String(data.getMonth() + 1).padStart(2, '0'),
          String(data.getDate()).padStart(2, '0')
        ].join('-');
      }

      function definirPeriodoInicial() {
        var hoje = new Date();
        var mesAnterior = new Date(hoje);
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        inicio.value = dataParaInput(mesAnterior);
        fim.value = dataParaInput(hoje);
      }

      function moeda(valor) {
        var numero = Number(valor || 0);
        if (Math.abs(numero) < 0.00000001) return '—';
        return numero.toLocaleString('pt-BR', {
          style:'currency', currency:'BRL', minimumFractionDigits:2,
          maximumFractionDigits:2
        });
      }

      function percentual(valor) {
        if (valor === null || valor === undefined || valor === '') return '—';
        return Number(valor).toLocaleString('pt-BR', {
          style:'percent', minimumFractionDigits:1, maximumFractionDigits:1
        });
      }

      function inteiro(valor) {
        var numero = Number(valor || 0);
        return numero === 0 ? '—' : numero.toLocaleString('pt-BR');
      }

      function negativo(valor) {
        return Number(valor || 0) < 0 ? 'negativo' : '';
      }

      function classeMargem(valor) {
        if (valor === null || valor === undefined) return 'vazio';
        if (Number(valor) < 0.15) return 'margem-critica';
        if (Number(valor) < 0.20) return 'margem-alerta';
        return 'margem-boa';
      }

      function celula(classe, texto) {
        var td = document.createElement('td');
        td.className = classe || '';
        td.textContent = texto;
        return td;
      }

      function preencherTabela(redes) {
        linhasTabela.innerHTML = '';

        if (!Array.isArray(redes) || redes.length === 0) {
          var semDados = document.createElement('tr');
          semDados.className = 'sem-dados';
          var coluna = celula('', 'Nenhuma rede encontrada no período.');
          coluna.colSpan = 11;
          semDados.appendChild(coluna);
          linhasTabela.appendChild(semDados);
          return;
        }

        redes.forEach(function(rede) {
          var linha = document.createElement('tr');
          linha.appendChild(celula('rede', rede.rede || ''));
          linha.appendChild(celula(negativo(rede.faturamentoBruto), moeda(rede.faturamentoBruto)));
          linha.appendChild(celula('devolucao', moeda(rede.devolucoes)));
          linha.appendChild(celula(negativo(rede.receitaLiquida), moeda(rede.receitaLiquida)));
          linha.appendChild(celula(negativo(rede.resultadoResumo), moeda(rede.resultadoResumo)));
          linha.appendChild(celula(negativo(rede.investimentos), moeda(rede.investimentos)));
          linha.appendChild(celula(negativo(rede.frete), moeda(rede.frete)));
          linha.appendChild(celula(negativo(rede.resultadoFinal), moeda(rede.resultadoFinal)));
          linha.appendChild(celula(classeMargem(rede.margem), percentual(rede.margem)));
          linha.appendChild(celula(negativo(rede.participacao), percentual(rede.participacao)));
          linha.appendChild(celula('', inteiro(rede.clientesPositivados)));
          linhasTabela.appendChild(linha);
        });
      }

      function mostrarAlertas(dados) {
        var grupos = [
          ['vendasSemCadastro', 'venda(s)'],
          ['devolucoesSemCadastro', 'devolução(ões)'],
          ['fretesSemCadastro', 'frete(s)'],
          ['investimentosForaDoModelo', 'investimento(s)']
        ];
        var mensagens = grupos.map(function(grupo) {
          var itens = dados && dados[grupo[0]];
          return Array.isArray(itens) && itens.length
            ? itens.length + ' ' + grupo[1] + ' sem rede válida no Cadastro_Clientes'
            : '';
        }).filter(Boolean);

        alertas.textContent = mensagens.join('. ');
        alertas.className = mensagens.length ? 'alertas visivel' : 'alertas';
      }

      function mostrarEstado(texto, erro) {
        estado.textContent = texto;
        estado.className = erro ? 'estado erro' : 'estado';
      }

      async function carregar() {
        var numeroConsulta = ++consultaAtual;
        if (!inicio.value || !fim.value) return;

        if (fim.value < inicio.value) {
          mostrarEstado('A data final não pode ser anterior à data inicial.', true);
          return;
        }

        atualizar.disabled = true;

        mostrarEstado('Carregando Margem_Rede...', false);
        alertas.className = 'alertas';

        try {
          var parametros = new URLSearchParams({
            inicio: inicio.value,
            fim: fim.value
          });
          var resposta = await fetch(
            '/api/rentabilidade/margem-rede?' + parametros.toString(),
            { credentials:'same-origin' }
          );
          var dados = await resposta.json();
          if (numeroConsulta !== consultaAtual) return;

          if (!resposta.ok) {
            throw new Error(dados.error || 'Não foi possível calcular a Margem_Rede.');
          }

          preencherTabela(dados.redes);
          mostrarAlertas(dados.alertas);
          mostrarEstado('Período consultado: ' + inicio.value.split('-').reverse().join('/') +
            ' a ' + fim.value.split('-').reverse().join('/'), false);
               } catch (erro) {
          if (numeroConsulta !== consultaAtual) return;
          preencherTabela([]);
          mostrarEstado(
            erro.message || 'Não foi possível calcular a Margem_Rede.',
            true
          );
        } finally {
          atualizar.disabled = false;
        }
      }
      }

      form.addEventListener('submit', function(evento) {
        evento.preventDefault();
        carregar();
      });
      inicio.addEventListener('change', carregar);
      fim.addEventListener('change', carregar);

      definirPeriodoInicial();
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
