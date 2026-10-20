// Prévia exclusivamente local, sem credenciais, banco de produção ou alterações no ERP.
import http from 'node:http';
import { dreInicioPage } from '../src/pages/dre-inicio.js';
import { drePage } from '../src/pages/dre.js';
import { filtrosDreCaixa, montarResultadoCaixa } from '../src/dre-caixa/service.js';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4178');
  try {
    if (url.pathname.startsWith('/api/dre')) {
      if (url.pathname.endsWith('/auditoria')) {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({meses:['2026-01','2026-02'],lancamentos:[{mes:'2026-01',data:'15/01/2026',documento:'TESTE-1',parceiro:'Parceiro simulado',origem:'Financeiro',valor:1000}]}));
        return;
      }
      const filtros = filtrosDreCaixa(new Request(url));
      const ano = filtros.inicio.slice(0,4);
      const movimentos = [
        {mes:ano+'-01',categoria:'1010000',descricao:'Vendas (simulado)',grupo:1,centavos:100000},
        {mes:ano+'-02',categoria:'1010000',descricao:'Vendas (simulado)',grupo:1,centavos:150000},
        {mes:String(Number(ano)-1)+'-01',categoria:'1010000',descricao:'Vendas (simulado)',grupo:1,centavos:80000},
        {mes:ano+'-01',categoria:'3010100',descricao:'Matéria-prima (simulado)',grupo:4,centavos:-45000},
        {mes:ano+'-01',categoria:'7777777',descricao:'Natureza de teste não classificada',grupo:null,centavos:-1000}
      ];
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(montarResultadoCaixa(movimentos, filtros, {id:'sankhya',nome:'Sankhya (simulado)'})));
      return;
    }
    const response = url.pathname === '/dre/caixa' ? drePage({regime:'caixa'}) :
      url.pathname === '/dre/competencia' ? drePage() : dreInicioPage();
    res.setHeader('content-type', 'text/html; charset=utf-8');
    const banner = '<div style="background:#fff1c8;color:#614400;padding:8px 16px;text-align:center;font:14px Arial">PRÉVIA LOCAL · DADOS SIMULADOS · NÃO É PRODUÇÃO</div>';
    res.end((await response.text()).replace('<body>', '<body>' + banner));
  } catch (error) {
    res.writeHead(error.status || 500, {'content-type':'application/json'});
    res.end(JSON.stringify({error:error.message}));
  }
});
server.listen(4178, '127.0.0.1', () => console.log('Prévia local: http://127.0.0.1:4178/dre'));
