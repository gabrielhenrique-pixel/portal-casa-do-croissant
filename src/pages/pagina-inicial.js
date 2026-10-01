export function paginaInicialPage() {
  return `
    <section id="viewInicio" class="visao inicio-corporativo">
      <header class="inicio-corporativo__cabecalho">
        <div>
          <span>PORTAL INTERNO</span>
          <h2>Centro de trabalho</h2>
        </div>

        <div class="inicio-corporativo__status">
          <i aria-hidden="true"></i>
          Ambiente corporativo
        </div>
      </header>

      <section class="inicio-corporativo__boas-vindas">
        <div>
          <span class="inicio-corporativo__sobretitulo">CASA DO CROISSANT</span>
          <h3>Portal de gestão e operações</h3>
          <p>
            Utilize o menu lateral para acessar as áreas e ferramentas disponíveis para o seu perfil.
          </p>
        </div>

        <div class="inicio-corporativo__identidade" aria-hidden="true">
          <strong>CC</strong>
          <span>Portal<br>corporativo</span>
        </div>
      </section>

      <div class="inicio-corporativo__grade">
        <section class="inicio-corporativo__bloco">
          <header>
            <span class="inicio-corporativo__icone" aria-hidden="true">▤</span>
            <div>
              <h3>Áreas de trabalho</h3>
              <p>Organização por processo e responsabilidade.</p>
            </div>
          </header>

          <ul class="inicio-corporativo__lista">
            <li>
              <span>01</span>
              <div><strong>Acesso por perfil</strong><small>Cada usuário visualiza somente as áreas autorizadas.</small></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>Informações centralizadas</strong><small>Os dados ficam organizados em um único ambiente.</small></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>Gestão integrada</strong><small>Uma estrutura preparada para a evolução do portal.</small></div>
            </li>
          </ul>
        </section>

        <aside class="inicio-corporativo__bloco inicio-corporativo__bloco--apoio">
          <span class="inicio-corporativo__icone inicio-corporativo__icone--verde" aria-hidden="true">✓</span>
          <h3>Acesso organizado</h3>
          <p>
            As permissões e ferramentas do portal são administradas de acordo com a função de cada pessoa.
          </p>
          <div class="inicio-corporativo__legenda">
            <i aria-hidden="true"></i>
            Navegue pelo menu para começar
          </div>
        </aside>
      </div>
    </section>
  `;
}
