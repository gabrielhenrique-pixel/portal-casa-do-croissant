export function drePage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DRE | Casa do Croissant</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #eaf1f6;
      color: #163a5a;
      font-family: Arial, sans-serif;
    }

    main {
      max-width: 1500px;
      margin: 0 auto;
      padding: 14px 16px 36px;
    }

    .cabecalho {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 20px 26px;
      margin-bottom: 16px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 22px #17305212;
    }

    .voltar {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fff;
      color: #163a5a;
      text-decoration: none;
      font-size: 25px;
      box-shadow: 0 5px 16px #17305216;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    .subtitulo {
      margin: 7px 0 0;
      color: #607a91;
      font-size: 13px;
    }

    .painel {
      overflow: hidden;
      margin-bottom: 18px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 6px 18px #17305212;
    }

    .titulo-painel {
      padding: 15px 20px;
      background: #163a5a;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }

    .filtros {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 14px;
      padding: 18px 20px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: #315a78;
      font-size: 12px;
      font-weight: bold;
    }

    input,
    select,
    button {
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid #b9cfe2;
      border-radius: 8px;
      background: #fff;
      color: #163a5a;
      font: inherit;
    }

    input,
    select {
      min-width: 180px;
    }

    button {
      border: 0;
      background: #163a5a;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }

    .tabela-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 720px;
      border-collapse: collapse;
    }

    th {
      padding: 12px 14px;
      background: #e8f0f6;
      color: #315a78;
      text-align: right;
      font-size: 12px;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    td {
      padding: 11px 14px;
      border-top: 1px solid #dce6ee;
      text-align: right;
      font-size: 13px;
    }

    .linha-grupo {
      background: #eef3f8;
      font-weight: bold;
    }

    .linha-resultado {
      background: #dce8f3;
      font-weight: bold;
    }

    .vazio {
      padding: 28px;
      color: #607a91;
      text-align: center;
    }
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <a class="voltar" href="/" aria-label="Voltar">←</a>

      <div>
        <h1>DRE</h1>
        <p class="subtitulo">
          Demonstração do Resultado do Exercício
        </p>
      </div>
    </header>

    <section class="painel">
      <div class="titulo-painel">Filtros</div>

      <div class="filtros">
        <label>
          Data inicial
          <input id="dataInicial" type="date">
        </label>

        <label>
          Data final
          <input id="dataFinal" type="date">
        </label>

        <label>
          Empresa
          <select id="empresa">
            <option value="">Todas</option>
          </select>
        </label>

        <button id="atualizar" type="button">
          Atualizar DRE
        </button>
      </div>
    </section>

    <section class="painel">
      <div class="titulo-painel">Resultado por período</div>

      <div class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Grupo DRE</th>
              <th>Resultado</th>
              <th>% A.H.</th>
              <th>% A.V.</th>
            </tr>
          </thead>

          <tbody id="linhasDre">
            <tr>
              <td class="vazio" colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8'
    }
  });
}
