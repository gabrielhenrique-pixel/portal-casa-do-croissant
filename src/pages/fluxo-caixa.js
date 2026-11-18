export function fluxoCaixaPage() {
  return new Response(String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fluxo de Caixa | Casa do Croissant</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: #173247;
      background: #eef4f7;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .painel {
      margin-bottom: 18px;
      padding: 22px;
      border: 1px solid #dce6ec;
      border-radius: 16px;
      background: #fff;
    }

    header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .voltar {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      border: 1px solid #dce6ec;
      border-radius: 50%;
      color: #173247;
      text-decoration: none;
      font-size: 24px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    h2 {
      margin-top: 0;
      font-size: 20px;
    }

    p {
      line-height: 1.5;
    }

    .aviso {
      padding: 14px;
      border-left: 4px solid #c78b1b;
      background: #fff8e8;
    }

    .observacao {
      color: #526575;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      main {
        padding: 12px;
      }

      .painel {
        padding: 16px;
      }

      h1 {
        font-size: 23px;
      }
    }
  </style>
</head>
<body>
  <main>
    <header class="painel">
      <a
        class="voltar"
        href="/dashboards"
        aria-label="Voltar para Dashboards"
      >←</a>
      <h1>Fluxo de Caixa</h1>
    </header>

    <section class="painel" aria-labelledby="tituloDisponibilidade">
      <h2 id="tituloDisponibilidade">Módulo em preparação</h2>

      <p class="aviso">
        A consulta financeira ainda não está disponível.
        Nenhum saldo ou lançamento está sendo apresentado nesta etapa.
      </p>

      <p>
        Aqui serão exibidos o saldo inicial, as entradas, as saídas
        e o saldo acumulado por dia, conforme o período e as contas
        selecionadas.
      </p>

      <p class="observacao">
        A opção de carência ajustará sábados e domingos,
        sem considerar feriados.
      </p>
    </section>
  </main>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin'
    }
  });
}
