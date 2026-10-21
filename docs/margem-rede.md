# Margem por Rede — composição das colunas

Regra de apresentação solicitada em 21/10/2026:

- Faturamento bruto permanece com ST.
- A coluna Receita Líquida nesta visão corresponde somente a bruto menos ST, antes de impostos estimados e devoluções.
- Resultado Final = Receita Líquida − devoluções − impostos estimados − CMV total − promotoria − contrato − comissão − investimentos − frete.
- Os impostos continuam estimados em 12% do bruto. Impostos e devoluções são deduzidos uma única vez, no Resultado Final. A mudança de posição das deduções não muda o resultado em reais.
- Margem % e Participação mantêm suas fórmulas existentes, usando a nova composição da Receita Líquida. Seus percentuais, portanto, podem mudar.
- O dashboard de rentabilidade e a exportação de Margem por Rede consomem os mesmos valores desta API e acompanham a nova composição.
- Rentabilidade SKU mantém sua fórmula anterior de Receita Líquida, já descontada de impostos. Esta alteração é limitada à visão agregada de Margem por Rede e seus consumidores.

Nenhum percentual cadastrado, CMV, regra de frete, valor de devolução, seleção de documentos, investimento ou registro do ERP foi alterado por esta mudança.

Os testes em `tests/receita-margem-rede.test.mjs` usam dados sintéticos e banco em memória. Comparam os demais componentes e os resultados contra a versão publicada anterior às duas mudanças, inclusive com devoluções superiores às vendas e redes com devoluções sem vendas.
