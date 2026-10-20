// Fonte do navegador preservada como texto: o bundler do Worker não deve
// inserir helpers de servidor neste script. Não consulta nem altera dados.
export const MENU_MOBILE_SCRIPT = String.raw`(function iniciarMenuMobile() {
  const menu = document.getElementById('menuLateral');
  const abrir = document.getElementById('abrirMenu');
  const fechar = document.getElementById('fecharMenu');
  const fundo = document.getElementById('fundoMenu');
  const conteudo = document.getElementById('conteudoPortal');
  const mobile = window.matchMedia('(max-width: 700px)');
  let aberto = false;

  function definirMenu(abrirMenu, restaurarFoco = true) {
    aberto = mobile.matches && abrirMenu;
    document.body.classList.toggle('menu-mobile-aberto', aberto);
    abrir.setAttribute('aria-expanded', String(aberto));
    menu.inert = mobile.matches && !aberto;
    conteudo.inert = aberto;

    if (aberto) {
      menu.setAttribute('role', 'dialog');
      menu.setAttribute('aria-modal', 'true');
      fechar.focus();
    } else {
      menu.removeAttribute('role');
      menu.removeAttribute('aria-modal');
      if (restaurarFoco && mobile.matches) abrir.focus();
    }
  }

  abrir.addEventListener('click', () => definirMenu(true));
  fechar.addEventListener('click', () => definirMenu(false));
  fundo.addEventListener('click', () => definirMenu(false));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) definirMenu(false, false);
  });

  document.addEventListener('keydown', (event) => {
    if (!aberto) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      definirMenu(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const controles = Array.from(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'))
      .filter((elemento) => elemento.getClientRects().length > 0);
    const primeiro = controles[0];
    const ultimo = controles[controles.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  });

  mobile.addEventListener('change', () => {
    const focoAnterior = document.activeElement;
    definirMenu(false, false);
    if (mobile.matches && menu.contains(focoAnterior)) abrir.focus();
    if (!mobile.matches && (focoAnterior === abrir || focoAnterior === fechar)) {
      menu.querySelector('a[href]').focus();
    }
  });
  window.addEventListener('pageshow', () => definirMenu(false, false));
  definirMenu(false, false);
  return (restaurarFoco = false) => definirMenu(false, restaurarFoco);
})()`;
