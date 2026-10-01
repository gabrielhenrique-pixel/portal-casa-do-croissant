export function paginaInicialPage() {
  return `
    <section id="viewInicio" class="visao">
      <div class="inicio-institucional">
        <div class="inicio-institucional__texto">
          <span>CASA DO CROISSANT · PORTAL INTERNO</span>
          <h2>Seu espaço de trabalho começa aqui.</h2>
          <p>
            Use o menu lateral para acessar as áreas liberadas para o seu perfil.
          </p>
        </div>

        <div class="inicio-institucional__selo" aria-hidden="true">
          <strong>CC</strong>
          <small>Portal</small>
        </div>
      </div>

      <div class="inicio-orientacao">
        <span class="inicio-orientacao__icone" aria-hidden="true">↗</span>
        <div>
          <strong>Navegação personalizada</strong>
          <p>
            Os módulos exibidos no menu são definidos de acordo com as permissões do seu acesso.
          </p>
        </div>
      </div>
    </section>
  `;
}
