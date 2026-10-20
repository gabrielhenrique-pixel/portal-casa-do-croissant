import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext, Script } from 'node:vm';
import { MENU_MOBILE_SCRIPT } from '../src/menu-mobile.js';
import worker from '../src/index.js';

function cenario(matches = true) {
  let document;
  function elemento() {
    const listeners = {};
    const atributos = new Map();
    const classes = new Set();
    return {
      inert: false,
      visivel: true,
      listeners,
      addEventListener(tipo, callback) { listeners[tipo] = callback; },
      setAttribute(nome, valor) { atributos.set(nome, valor); },
      getAttribute(nome) { return atributos.get(nome); },
      removeAttribute(nome) { atributos.delete(nome); },
      classList: { contains: nome => classes.has(nome), toggle(nome, ligar) { ligar ? classes.add(nome) : classes.delete(nome); } },
      focus() { document.activeElement = this; },
      getClientRects() { return this.visivel ? [{}] : []; },
      closest() { return null; },
      clicar(target = this) { listeners.click?.({ target }); }
    };
  }
  const ids = Object.fromEntries(['menuLateral', 'abrirMenu', 'fecharMenu', 'fundoMenu', 'conteudoPortal'].map(id => [id, elemento()]));
  const perfil = elemento();
  const pagina = elemento();
  const oculto = elemento();
  oculto.visivel = false;
  const ultimo = elemento();
  const controles = [ids.fecharMenu, perfil, pagina, ultimo, oculto];
  ids.menuLateral.querySelectorAll = () => controles;
  ids.menuLateral.querySelector = () => perfil;
  ids.menuLateral.contains = el => controles.includes(el);
  document = { body: elemento(), getElementById: id => ids[id], listeners: {}, addEventListener(tipo, callback) { this.listeners[tipo] = callback; } };
  const media = { matches, addEventListener(_tipo, callback) { this.alterar = callback; } };
  const window = { listeners: {}, matchMedia: () => media, addEventListener(tipo, callback) { this.listeners[tipo] = callback; } };
  const fechar = runInNewContext(MENU_MOBILE_SCRIPT, { document, window });
  function tecla(key, shiftKey = false) {
    const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
    document.listeners.keydown(event);
    return event;
  }
  return { ids, perfil, pagina, ultimo, document, window, media, fechar, tecla };
}

test('celular inicia recolhido e não deixa focar o menu invisível', () => {
  const c = cenario();
  assert.equal(c.ids.abrirMenu.getAttribute('aria-expanded'), 'false');
  assert.equal(c.ids.menuLateral.inert, true);
  assert.equal(c.ids.conteudoPortal.inert, false);
  assert.equal(c.document.body.classList.contains('menu-mobile-aberto'), false);
});

test('abrir torna o menu modal, bloqueia o conteúdo e move o foco para fechar', () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  assert.equal(c.ids.menuLateral.getAttribute('role'), 'dialog');
  assert.equal(c.ids.menuLateral.getAttribute('aria-modal'), 'true');
  assert.equal(c.ids.abrirMenu.getAttribute('aria-expanded'), 'true');
  assert.equal(c.ids.menuLateral.inert, false);
  assert.equal(c.ids.conteudoPortal.inert, true);
  assert.equal(c.document.activeElement, c.ids.fecharMenu);
  assert.equal(c.document.body.classList.contains('menu-mobile-aberto'), true);
});

for (const acao of ['botao', 'fundo', 'Escape']) test(`fechar por ${acao} restaura o conteúdo e o foco`, () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  if (acao === 'botao') c.ids.fecharMenu.clicar();
  if (acao === 'fundo') c.ids.fundoMenu.clicar();
  if (acao === 'Escape') assert.equal(c.tecla('Escape').prevented, true);
  assert.equal(c.ids.abrirMenu.getAttribute('aria-expanded'), 'false');
  assert.equal(c.ids.menuLateral.inert, true);
  assert.equal(c.ids.conteudoPortal.inert, false);
  assert.equal(c.ids.menuLateral.getAttribute('aria-modal'), undefined);
  assert.equal(c.document.body.classList.contains('menu-mobile-aberto'), false);
  assert.equal(c.document.activeElement, c.ids.abrirMenu);
});

test('Tab e Shift+Tab permanecem nos controles visíveis do menu', () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  assert.equal(c.tecla('Tab', true).prevented, true);
  assert.equal(c.document.activeElement, c.ultimo);
  assert.equal(c.tecla('Tab').prevented, true);
  assert.equal(c.document.activeElement, c.ids.fecharMenu);
  c.perfil.focus();
  assert.equal(c.tecla('Tab').prevented, false);
});

test('navegação fecha o menu sem desviar o foco da página', () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  c.fechar();
  assert.equal(c.ids.menuLateral.inert, true);
  assert.equal(c.ids.conteudoPortal.inert, false);
  c.ids.abrirMenu.clicar();
  c.ids.menuLateral.clicar({ closest: () => c.perfil });
  assert.equal(c.ids.abrirMenu.getAttribute('aria-expanded'), 'false');
});

test('desktop não fica modal e o menu permanece acessível', () => {
  const c = cenario(false);
  c.ids.abrirMenu.clicar();
  assert.equal(c.ids.menuLateral.inert, false);
  assert.equal(c.ids.conteudoPortal.inert, false);
  assert.equal(c.ids.menuLateral.getAttribute('aria-modal'), undefined);
});

test('trocar a largura remove o bloqueio e preserva um foco visível', () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  c.media.matches = false;
  c.media.alterar();
  assert.equal(c.ids.menuLateral.inert, false);
  assert.equal(c.ids.conteudoPortal.inert, false);
  assert.equal(c.document.activeElement, c.perfil);
  c.media.matches = true;
  c.media.alterar();
  assert.equal(c.ids.menuLateral.inert, true);
  assert.equal(c.document.activeElement, c.ids.abrirMenu);
});

test('voltar pelo navegador não preserva a página bloqueada', () => {
  const c = cenario();
  c.ids.abrirMenu.clicar();
  c.window.listeners.pageshow();
  assert.equal(c.ids.menuLateral.inert, true);
  assert.equal(c.ids.conteudoPortal.inert, false);
  assert.equal(c.document.body.classList.contains('menu-mobile-aberto'), false);
});

test('HTML do portal incorpora os controles, estilos e JavaScript válidos', async () => {
  const response = await worker.fetch(new Request('http://portal.test/'), {});
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const id of ['menuLateral','abrirMenu','fecharMenu','fundoMenu','conteudoPortal']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /height:100dvh/);
  assert.match(html, /width:min\(280px, calc\(100vw - 48px\)\)/);
  assert.match(html, /const fecharMenuMobile = \(function iniciarMenuMobile/);
  assert.doesNotMatch(MENU_MOBILE_SCRIPT, /__name|__publicField|\.toString\(/);
  assert.match(html, /function openView\(view\) \{\s*fecharMenuMobile\(\);/);
  for (const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new Script(script[1]);
});
