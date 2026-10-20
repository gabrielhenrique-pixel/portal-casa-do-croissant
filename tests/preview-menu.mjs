// Prévia local isolada: sessão fictícia, sem banco, credenciais ou chamadas ao ERP.
import http from 'node:http';
import worker from '../src/index.js';

const session = {
  user: { id: 'preview', username: 'gabrielh', role: 'Administrador' },
  modules: ['DASHBOARDS','DRE','CLIENTES','PRODUTOS','INVESTIMENTOS','INVESTIMENTOS_PENDENTES','USUARIOS','HISTORICO','ACESSOS'].map(id => ({id, can_view: 1}))
};
const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    const url = new URL(req.url, 'http://127.0.0.1:4179');
    if (url.pathname.startsWith('/api/')) {
      res.setHeader('content-type', 'application/json');
      const value = url.pathname === '/api/me' ? session :
        url.pathname === '/api/profile' ? {user:session.user,avatar:null} :
        url.pathname === '/api/status' ? {hasUsers:true} : {investimentos:[]};
      res.end(JSON.stringify(value));
      return;
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    if (url.pathname === '/qa') {
      const width = Math.max(320, Math.min(1440, Number(url.searchParams.get('largura')) || 390));
      res.end(`<!doctype html><html><head><title>Prévia local do menu</title><style>body{margin:0;padding:20px;background:#e6eae8;font:14px Arial}iframe{display:block;border:1px solid #bbc9c2;border-radius:12px;background:white}p{margin:0 0 12px}</style></head><body><p>Prévia local · sessão fictícia · ${width}px</p><iframe title="Portal em teste" width="${width}" height="844" src="/"></iframe></body></html>`);
      return;
    }
    const response = await worker.fetch(new Request(url), {});
    const html = (await response.text()).replace(/<script\b[^>]*\bsrc=[^>]*>[\s\S]*?<\/script>/g, '').replace(/<img\b[^>]*>/g,'');
    res.end(html);
  } catch(error) {
    res.writeHead(500, {'content-type':'text/plain'});
    res.end(error.message);
  }
});
server.listen(4179, '127.0.0.1', () => console.log('Prévia local: http://127.0.0.1:4179/qa?largura=390'));
