const SCRIPT = String.raw`
(function () {
  if (window.portalInatividadeInstalada) return;
  window.portalInatividadeInstalada = true;

  var autenticado = false;
  var encerrando = false;
  var verificando = false;
  var enviando = false;
  var atividadePendente = false;
  var temporizador = null;

  function encerrar() {
    if (encerrando) return;

    encerrando = true;
    clearTimeout(temporizador);

    // Também sai da página quando ela estiver dentro de um iframe.
    window.top.location.href = '/';
  }

  async function verificar() {
    if (verificando || encerrando) return;

    verificando = true;

    try {
      var resposta = await fetch('/api/session/activity', {
        credentials:'same-origin',
        cache:'no-store'
      });

      if (resposta.status === 401) {
        if (autenticado) encerrar();
        return;
      }

      if (resposta.ok) autenticado = true;
    } catch {
      // Falha de rede não renova nem elimina a sessão.
    } finally {
      verificando = false;
    }
  }

  async function registrar() {
    temporizador = null;

    if (
      !autenticado ||
      encerrando ||
      enviando ||
      !atividadePendente
    ) {
      return;
    }

    atividadePendente = false;
    enviando = true;

    try {
      var resposta = await fetch('/api/session/activity', {
        method:'POST',
        credentials:'same-origin',
        cache:'no-store',
        headers:{
          'content-type':'application/json'
        },
        body:'{}',
        keepalive:true
      });

      if (resposta.status === 401) encerrar();
    } catch {
      // O servidor continua controlando a expiração.
    } finally {
      enviando = false;

      if (atividadePendente && !encerrando) {
        temporizador = setTimeout(registrar, 1000);
      }
    }
  }

  function atividade(evento) {
    if (
      !evento.isTrusted ||
      document.visibilityState !== 'visible' ||
      !autenticado ||
      encerrando
    ) {
      return;
    }

    atividadePendente = true;

    if (!temporizador && !enviando) {
      temporizador = setTimeout(registrar, 1000);
    }
  }

  [
    'pointerdown',
    'pointermove',
    'keydown',
    'wheel',
    'touchstart'
  ].forEach(function (evento) {
    document.addEventListener(evento, atividade, {
      capture:true,
      passive:true
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') verificar();
  });

  window.addEventListener('focus', verificar);
  window.addEventListener('pageshow', verificar);
  window.addEventListener('portal-login', verificar);

  // Apenas consulta a validade. Não conta como atividade.
  setInterval(verificar, 15000);
  verificar();
})();
`;

export function scriptInatividade() {
  return new Response(SCRIPT, {
    headers: {
      'content-type': 'application/javascript; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

export function incluirControleInatividade(resposta) {
  const tipo = resposta.headers.get('content-type') || '';

  if (!tipo.includes('text/html')) return resposta;

  return new HTMLRewriter()
    .on('body', {
      element(elemento) {
        elemento.append(
          '<script src="/sessao-inatividade.js"></script>',
          { html: true }
        );
      }
    })
    .transform(resposta);
}
