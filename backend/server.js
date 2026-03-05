import https from 'https';
import http from 'http';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/locations', locationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Use HTTPS on server, HTTP on localhost for development
const keyPath = '/etc/ssl/private/server.key';
const certPath = '/etc/ssl/certs/server.crt';
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

let server;
if (useHttps) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    minVersion: 'TLSv1.2',
    ciphers: 'DEFAULT:!aNULL:!eNULL:!MD5:!3DES:!DES:!RC4:!IDEA:!SEED:!aDSS:!SRP:!PSK'
  };
  server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`Secure server is running on https://localhost:${PORT}`);
  });
} else {
  server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
