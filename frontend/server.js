import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 8000;
const DIST_PATH = path.join(__dirname, 'dist');
const INDEX_PATH = path.join(DIST_PATH, 'index.html');

const options = {
key: fs.readFileSync('/etc/letsencrypt/live/revenue.projectdesigners.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/revenue.projectdesigners.cloud/fullchain.pem'),
  minVersion: 'TLSv1.2',
  ciphers: 'DEFAULT:!aNULL:!eNULL:!MD5:!3DES:!DES:!RC4:!IDEA:!SEED:!aDSS:!SRP:!PSK'
};

const server = https.createServer(options, (req, res) => {
  let filePath = path.join(DIST_PATH, req.url);
  
  if (req.url === '/' || req.url.startsWith('/?')) {
    filePath = INDEX_PATH;
  } else if (!path.extname(filePath)) {
    filePath = INDEX_PATH;
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(INDEX_PATH, (err2, indexContent) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      });
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
  console.log(`Secure Server running on port ${PORT}`);
});
