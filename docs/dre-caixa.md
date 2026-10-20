# DRE Caixa

## Navegação e compatibilidade

O menu `DRE` continua em `/dre`, agora com os cards Competência e Caixa.

| Página | Consulta | Auditoria |
| --- | --- | --- |
| `/dre/competencia` | `/api/dre` (preservada) | `/api/dre/auditoria` (preservada) |
| `/dre/caixa` | `/api/dre/caixa` | `/api/dre/caixa/auditoria` |

Todas as rotas exigem a permissão de visualização do módulo `DRE`. Não há alteração de permissões, tabelas financeiras ou configuração dos ERPs. A competência mantém sua SQL original (inclusive a regra de vendas por notas), classificação, filtros e cálculo de indicadores. Apenas o construtor do resultado foi extraído para reutilização.

## Critério atual do Caixa — Sankhya

- Data: `TGFFIN.DHBAIXA`, com data final inclusiva. Não usa `DTNEG`, vencimento ou total de notas como recebimento.
- Somente títulos reais (`PROVISAO = 'N'`), baixados, com `RECDESP IN (-1, 1)` e valor de baixa diferente de zero; não inclui baixas futuras. Não presume que uma baixa contábil é uma movimentação bancária conciliada.
- Valor: `VLRBAIXA * RECDESP`. **Não** reaplica descontos, juros, multa ou retenções sobre o valor de baixa. Sua interpretação na instalação deve ser conciliada com o relatório nativo antes de usar os resultados para decisão financeira.
- Rateio: pesos da `VGFFINRAT.VLRDESDOB`, agregados por NUFIN/natureza/empresa, divididos pela soma dos pesos do título. Centavos residuais são destinados à primeira natureza/empresa em ordem de código. O total rateado permanece igual ao valor assinado da baixa. O filtro de empresa vem depois da alocação.
- Rateio sem base/negativo bloqueia a apuração, em vez de mostrar um resultado silenciosamente incompleto.
- Naturezas usam a classificação já existente em `dre-config.js`. Não classificadas são explicitadas como pendências **excluídas dos subtotais**; não devem ser interpretadas como resultado final homologado.
- Comparação: mesmos dias do ano anterior; 29/02 compara com 28/02. Consultas de até 12 meses para não sobrepor séries em períodos parciais. Padrão: janeiro até hoje, no fuso de São Paulo.
- A.V.: valor absoluto da participação na receita bruta do mês; no total usa receita bruta do período, não soma percentuais. Sem receita bruta, exibe `—`. A.H. preserva o critério do portal; os cards indicam quando não há base anterior.
- Paginação confirma quantidade e ordem das linhas retornadas. Truncamento, falha de autenticação e erros de consulta não viram zero.
- Não é um extrato bancário nem uma DRE contábil certificada. Renegociações, compensações, estornos, baixas parciais e diferenças entre empresa de origem e de baixa precisam de conferência na instalação Sankhya antes da homologação.

As referências oficiais descrevem caixa como realizado e rateio proporcional: [Guia Sankhya Finance](https://ajuda.sankhya.com.br/hc/pt-br/articles/41301087909655-Guia-Sankhya-Finance). A SQL mantém o `WITH` no nível superior para compatibilidade com restrições de versões Oracle anteriores: [ORA-32034](https://docs.oracle.com/en/error-help/db/ora-32034/).

## Preparação para Omie

`src/dre-caixa/providers/index.js` seleciona a origem exclusivamente no servidor. Ausência de `DRE_CAIXA_PROVIDER` mantém **Sankhya**, com as mesmas credenciais já existentes. Nenhuma nova variável é necessária agora.

O adaptador expõe:

```js
{
  id, nome,
  listarMovimentos(filtros),
  // [{ mes: 'AAAA-MM', categoria: 'id canônico', descricao,
  //    grupo: 1 /* grupo interno do DRE ou null */, centavos: -12345 }]
  listarLancamentos(filtros)
  // [{ mes, data: 'DD/MM/AAAA', documento, parceiro, origem, valor, empresa, categoria }]
}
```

O adaptador é responsável por normalizar BRL, sinal, baixas realizadas, rateio, categoria e grupo. A apresentação e os subtotais não conhecem a API do ERP. O identificador canônico deve permanecer consistente entre agregado e auditoria.

Para ativar Omie no futuro, implementar seu adaptador de leitura, definir um mapeamento explícito de categorias Omie para grupos internos, reproduzir os testes de valores/datas/rateios/baixas e homologar. Depois registrar a fábrica e configurar `DRE_CAIXA_PROVIDER=omie`. Hoje esse valor retorna indisponível deliberadamente: **não existe integração Omie ativa nem fallback/mistura de origens**.

## Verificação

```powershell
node --test tests/*.test.mjs
node tests/preview-dre.mjs
```

Prévia local: `http://127.0.0.1:4178/dre`, com aviso de **dados simulados**, sem credenciais nem acesso ao banco da empresa. Nunca publicar o servidor de prévia.

Os testes executam o SQL financeiro em SQLite com compatibilidade somente para as funções de data Oracle/NVL, além de mocks do gateway. Isso verifica expressões, janelas, alocação, filtros, centavos e paginação, mas **não substitui a execução no Oracle/Sankhya nem a conciliação com o DRE Caixa nativo**. A homologação deve comparar um mês fechado, incluindo um título rateado, uma baixa parcial, desconto/juros e eventual compensação/renegociação. Não homologar apenas por contagem de registros ou pelos totais da imagem de referência sem conhecer seus filtros.

Publicação: usar o repositório e o pipeline Cloudflare já existentes. Sem novo site, nova hospedagem, migração de banco ou alteração de audiência.
