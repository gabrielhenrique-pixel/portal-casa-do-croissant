# Bases comerciais da margem por rede

## ANGELONI SC

Regra confirmada pelo responsável em 20/10/2026:

- Promotoria e comissão incidem sobre **faturamento bruto menos devoluções**, antes dos impostos estimados.
- O abatimento usa o percentual cadastrado do cliente da devolução. Não se aplica uma média da rede às devoluções de todos os clientes.
- O contrato mantém a base anterior: faturamento bruto.
- Produtos devolvidos são descartados: esta mudança não estorna CMV nem frete e não duplica esses custos.
- A estimativa de impostos de 12% continua inalterada.

O cálculo é por cliente e consolidado por rede:

```text
promotoria = soma(vendas do cliente × percentual de promotoria)
           − soma(devoluções do cliente × percentual de promotoria)

comissão = soma(vendas do cliente × percentual de comissão)
         − soma(devoluções do cliente × percentual de comissão)
```

Devoluções sem venda no mesmo recorte também são abatidas. A fórmula mantém os sinais de bruto − devoluções, sem impor um piso zero por cliente; esse ajuste analítico não gera crédito, pagamento ou alteração no ERP.

As colunas de percentual passam a dividir o custo consolidado pela mesma base líquida comercial; não pela receita líquida após impostos. Se a base for zero, o percentual é nulo.

As outras redes conservam a regra anterior até confirmação específica. O escopo desta mudança é o relatório **Margem por rede**; o painel por SKU, que apresenta itens de venda sem consolidar devoluções, não foi alterado.

## Verificação

`node --test tests/*.test.mjs` inclui cenários de percentuais diferentes por cliente, devoluções sem venda, base zero, ST e ausência de cadastro, além da preservação das outras redes e dos custos não envolvidos.

Consultas e testes usam os percentuais atuais do cadastro, assim como antes. A mudança não introduz percentuais históricos nem altera a origem dos dados Sankhya.
