const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIST_PATH = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_PATH, req.url);
  
  if (req.url === '/' || req.url.startsWith('/?')) {
    filePath = path.join(DIST_PATH, 'index.html');
  } else if (!path.extname(filePath)) {
    filePath = path.join(DIST_PATH, 'index.html');
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(path.join(DIST_PATH, 'index.html')));
    } else {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      }[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
