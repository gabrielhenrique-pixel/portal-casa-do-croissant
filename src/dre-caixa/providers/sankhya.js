import { executarConsultaSankhya, obterTokenSankhya } from '../../dre-service.js';
import { identificarGrupoDre } from '../../dre-config.js';

// Só consultas. Nunca registra, cancela ou altera baixas no ERP.
export async function criarSankhyaProvider(env) {
  if (!env.SANKHYA_CLIENT_ID || !env.SANKHYA_CLIENT_SECRET || !env.SANKHYA_X_TOKEN) {
    throw Object.assign(new Error('A integração com o Sankhya ainda não foi configurada.'), { status: 503 });
  }
  const token = await obterTokenSankhya(env);
  return {
    id: 'sankhya',
    nome: 'Sankhya',
    async listarMovimentos(filtros) {
      const rows = await consultarPaginado(token, filtros, false);
      if (rows.some(row => Number(row[4]) !== 0)) {
        throw new Error('Há baixas com rateio inválido ou sem base de rateio. Confira os títulos no Sankhya antes de apurar o DRE Caixa.');
      }
      return rows.map(row => ({
        mes: String(row[0]),
        categoria: String(Number(row[1]) || 0),
        descricao: String(row[2] || 'Sem natureza'),
        centavos: centavosValidos(row[3]),
                grupo: Number(row[1]) === 3070200
          ? 9 // ACORDOS COMERCIAIS → Despesas Comerciais
          : identificarGrupoDre(String(Number(row[1]) || 0))
      }));
    },
    async listarLancamentos(filtros) {
      const rows = await consultarPaginado(token, filtros, true);
      if (rows.some(row => Number(row[8]) !== 0)) {
        throw new Error('Há baixas com rateio inválido nesta natureza. Confira os títulos no Sankhya.');
      }
      return rows.map(row => ({
        mes: String(row[0]), data: String(row[1]), documento: String(row[2]),
        parceiro: String(row[3] || 'Sem parceiro'), origem: 'Financeiro',
        valor: centavosValidos(row[4]) / 100, empresa: String(row[5]),
        categoria: filtros.natureza
      }));
    }
  };
}

function centavosValidos(valor) {
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero)) throw new Error('O Sankhya retornou um valor monetário inválido.');
  return numero;
}

// COUNT confirma que o gateway não truncou o resultado silenciosamente.
async function consultarPaginado(token, filtros, auditoria) {
  const resultado = [];
  let total = null;
  do {
    const pagina = await executarConsultaSankhya(token, montarSqlCaixa(filtros, auditoria, resultado.length));
    if (!pagina.length) {
      if (total !== null && resultado.length < total) throw new Error('Consulta incompleta do Sankhya. Atualize o relatório.');
      break;
    }
    const quantidade = Number(pagina[0][pagina[0].length - 2]);
    if (!Number.isSafeInteger(quantidade) || quantidade < pagina.length ||
        (total !== null && total !== quantidade)) throw new Error('Consulta inconsistente do Sankhya. Atualize o relatório.');
    total = quantidade;
    for (const row of pagina) {
      if (Number(row[row.length - 1]) !== resultado.length + 1) throw new Error('Paginação incompleta do Sankhya.');
      resultado.push(row.slice(0, -2));
    }
    if (resultado.length > 100000) throw new Error('Muitos lançamentos. Selecione um período menor.');
  } while (resultado.length < total);
  return resultado;
}

export function montarSqlCaixa(filtros, auditoria = false, deslocamento = null) {
  const { inicio, fim, inicioAnterior, fimAnterior, empresa, natureza } = filtros;
  const intervalo = (de, ate) => `(TFIN.DHBAIXA >= TO_DATE('${de}', 'YYYY-MM-DD') AND TFIN.DHBAIXA < TO_DATE('${ate}', 'YYYY-MM-DD') + 1)`;
  const periodo = auditoria ? intervalo(inicio, fim)
    : `(${intervalo(inicio, fim)} OR ${intervalo(inicioAnterior, fimAnterior)})`;
  // Agrupa centros de resultado antes de calcular os pesos por natureza/empresa.
  // O filtro de empresa vem DEPOIS do rateio para não reaplicar 100% a cada empresa.
  const base = `WITH RATEIOS AS (
    SELECT TFIN.NUFIN, TFIN.DHBAIXA, TFIN.CODPARC, TFIN.VLRBAIXA,
      TFIN.RECDESP, NVL(FIN.CODEMP, TFIN.CODEMP) EMPRESA,
      NVL(FIN.CODNAT, TFIN.CODNAT) CODIGO_NATUREZA,
      SUM(NVL(FIN.VLRDESDOB, TFIN.VLRDESDOB)) PESO
    FROM TGFFIN TFIN
    LEFT JOIN VGFFINRAT FIN ON FIN.NUFIN = TFIN.NUFIN
    WHERE TFIN.PROVISAO = 'N' AND TFIN.DHBAIXA IS NOT NULL
      AND TFIN.RECDESP IN (-1, 1) AND NVL(TFIN.VLRBAIXA, 0) <> 0
      AND TFIN.DHBAIXA < TRUNC(SYSDATE) + 1
      AND ${periodo}
    GROUP BY TFIN.NUFIN, TFIN.DHBAIXA, TFIN.CODPARC, TFIN.VLRBAIXA,
      TFIN.RECDESP, NVL(FIN.CODEMP, TFIN.CODEMP), NVL(FIN.CODNAT, TFIN.CODNAT)
  ), PESOS AS (
    SELECT RATEIOS.*, SUM(PESO) OVER (PARTITION BY NUFIN) PESO_TOTAL,
      MIN(PESO) OVER (PARTITION BY NUFIN) MENOR_PESO,
      ROW_NUMBER() OVER (PARTITION BY NUFIN ORDER BY CODIGO_NATUREZA, EMPRESA) ORDEM
    FROM RATEIOS
  ), PARCELAS AS (
    SELECT PESOS.*, ROUND(VLRBAIXA * RECDESP * 100) TOTAL_CENTAVOS,
      ROUND(VLRBAIXA * RECDESP * 100 * PESO / NULLIF(PESO_TOTAL, 0)) PARCELA_CENTAVOS,
      CASE WHEN PESO_TOTAL <= 0 OR PESO_TOTAL IS NULL OR MENOR_PESO < 0 THEN 1 ELSE 0 END INVALIDO
    FROM PESOS
  ), LANCAMENTOS AS (
    SELECT PARCELAS.*,
      PARCELA_CENTAVOS + CASE WHEN ORDEM = 1 THEN TOTAL_CENTAVOS -
        SUM(PARCELA_CENTAVOS) OVER (PARTITION BY NUFIN) ELSE 0 END VALOR_CENTAVOS
    FROM PARCELAS
  )`;
  const filtroEmpresa = empresa ? `AND L.EMPRESA = ${Number(empresa)}` : '';
  const selecao = auditoria ? `SELECT TO_CHAR(L.DHBAIXA, 'YYYY-MM') MES,
      TO_CHAR(L.DHBAIXA, 'DD/MM/YYYY') DATA_BAIXA, L.NUFIN DOCUMENTO,
      PAR.NOMEPARC PARCEIRO, L.VALOR_CENTAVOS, L.EMPRESA,
      L.CODIGO_NATUREZA, L.DHBAIXA DATA_ORDENACAO, L.INVALIDO
    FROM LANCAMENTOS L LEFT JOIN TGFPAR PAR ON PAR.CODPARC = L.CODPARC
    WHERE NVL(L.CODIGO_NATUREZA, 0) = ${Number(natureza)} ${filtroEmpresa}`
    : `SELECT TO_CHAR(L.DHBAIXA, 'YYYY-MM') MES,
      NVL(L.CODIGO_NATUREZA, 0) CODIGO_NATUREZA, NAT.DESCRNAT NOME_NATUREZA,
      SUM(L.VALOR_CENTAVOS) VALOR_CENTAVOS, SUM(L.INVALIDO) INVALIDOS
    FROM LANCAMENTOS L LEFT JOIN TGFNAT NAT ON NAT.CODNAT = L.CODIGO_NATUREZA
    WHERE 1 = 1 ${filtroEmpresa}
    GROUP BY TO_CHAR(L.DHBAIXA, 'YYYY-MM'), NVL(L.CODIGO_NATUREZA, 0), NAT.DESCRNAT`;
  if (deslocamento === null) return `${base}\n${selecao}`;
  // WITH permanece no nível superior: versões Oracle anteriores ao 26ai não
  // aceitam todas as formas de WITH aninhado (ORA-32034).
  const ordem = auditoria ? 'DATA_ORDENACAO, DOCUMENTO, EMPRESA' : 'MES, CODIGO_NATUREZA';
  return `${base}, DRE_CONSULTA AS (${selecao}), DRE_PAGINADOS AS (
    SELECT DRE_CONSULTA.*, COUNT(*) OVER() DRE_TOTAL,
      ROW_NUMBER() OVER (ORDER BY ${ordem}) DRE_LINHA FROM DRE_CONSULTA
  ) SELECT * FROM DRE_PAGINADOS
    WHERE DRE_LINHA > ${deslocamento} AND DRE_LINHA <= ${deslocamento + 500}
    ORDER BY DRE_LINHA`;
}
