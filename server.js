const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Mock Vercel environment for local testing
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle API routes (Local Emulation)
  if (parsedUrl.pathname === '/api/create-checkout-session') {
    try {
      const handler = require('./api/create-checkout-session.js');
      
      // Mock Vercel res.status().json() behavior
      const apiRes = {
        status: (code) => {
          res.statusCode = code;
          return apiRes;
        },
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        }
      };

      // Read body for the handler
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        req.body = body ? JSON.parse(body) : {};
        handler(req, apiRes);
      });
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // Handle Static Files
  const requestedPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(requestedPath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(process.cwd(), safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
