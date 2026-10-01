export function paginaInicialPage() {
  return `
    <section id="viewInicio" class="visao">
      <div class="inicio-hero">
        <div class="inicio-hero__marca">
          <span class="inicio-hero__sinal" aria-hidden="true">✦</span>
          Portal Casa do Croissant
        </div>

        <h2>Seu espaço de trabalho.</h2>
        <p>
          Acesse os módulos disponíveis para o seu perfil de forma simples e organizada.
        </p>

        <div class="inicio-hero__linha" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="inicio-secao">
        <div>
          <span class="inicio-secao__rotulo">NAVEGAÇÃO</span>
          <h3>Acessos rápidos</h3>
          <p>Escolha um módulo para começar.</p>
        </div>
      </div>

      <div id="atalhosInicio" class="inicio-grade">
        <button class="inicio-atalho" type="button" data-view="dashboards" data-home-module="DASHBOARDS">
          <span class="inicio-atalho__icone inicio-atalho__icone--azul" aria-hidden="true">▦</span>
          <span>
            <strong>Dashboards</strong>
            <small>Visões e acompanhamentos</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="dre" data-home-module="DRE">
          <span class="inicio-atalho__icone inicio-atalho__icone--verde" aria-hidden="true">≋</span>
          <span>
            <strong>DRE</strong>
            <small>Resultado do exercício</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="clientes" data-home-module="CLIENTES">
          <span class="inicio-atalho__icone inicio-atalho__icone--laranja" aria-hidden="true">◉</span>
          <span>
            <strong>Clientes</strong>
            <small>Rentabilidade e relacionamento</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="produtos" data-home-module="PRODUTOS">
          <span class="inicio-atalho__icone inicio-atalho__icone--roxo" aria-hidden="true">◇</span>
          <span>
            <strong>Produtos</strong>
            <small>Cadastro e acompanhamento</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="investimentos" data-home-module="INVESTIMENTOS">
          <span class="inicio-atalho__icone inicio-atalho__icone--amarelo" aria-hidden="true">↗</span>
          <span>
            <strong>Investimentos</strong>
            <small>Solicitações e registros</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="pendentes" data-home-module="INVESTIMENTOS_PENDENTES">
          <span class="inicio-atalho__icone inicio-atalho__icone--vermelho" aria-hidden="true">!</span>
          <span>
            <strong>Pendências</strong>
            <small>Itens que precisam de atenção</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="usuarios" data-home-module="USUARIOS">
          <span class="inicio-atalho__icone inicio-atalho__icone--azul" aria-hidden="true">♙</span>
          <span>
            <strong>Usuários</strong>
            <small>Cadastros e permissões</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>

        <button class="inicio-atalho" type="button" data-view="historico" data-home-module="HISTORICO">
          <span class="inicio-atalho__icone inicio-atalho__icone--cinza" aria-hidden="true">◷</span>
          <span>
            <strong>Histórico</strong>
            <small>Registro de atividades</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>
      </div>

      <div id="inicioSemAtalhos" class="inicio-sem-atalhos oculto">
        <span aria-hidden="true">✦</span>
        <div>
          <strong>Seus acessos ainda serão configurados.</strong>
          <p>Fale com o administrador do portal para liberar os módulos necessários.</p>
        </div>
      </div>
    </section>
  `;
}
