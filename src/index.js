export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' });
    }

    return new Response(
      `<!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Portal Casa do Croissant</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              font-family: Arial, sans-serif;
              background: #f4f8f6;
              color: #073b2a;
            }
            main {
              width: min(480px, calc(100% - 48px));
              padding: 40px;
              text-align: center;
              background: #fff;
              border: 1px solid #d6e6de;
              border-radius: 18px;
              box-shadow: 0 12px 30px rgba(7, 59, 42, .10);
            }
            h1 { margin: 0 0 12px; font-size: 28px; }
            p { margin: 0; color: #50675d; line-height: 1.5; }
          </style>
        </head>
        <body>
          <main>
            <h1>Portal Casa do Croissant</h1>
            <p>Nova versão em preparação.</p>
          </main>
        </body>
      </html>`,
      {
        headers: { 'content-type': 'text/html; charset=UTF-8' }
      }
    );
  }
};
