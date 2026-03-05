import https from 'https';
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

const options = {
  key: fs.readFileSync('/etc/ssl/private/server.key'),
  cert: fs.readFileSync('/etc/ssl/certs/server.crt'),
  minVersion: 'TLSv1.2',
  ciphers: 'DEFAULT:!aNULL:!eNULL:!MD5:!3DES:!DES:!RC4:!IDEA:!SEED:!aDSS:!SRP:!PSK'
};

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

https.createServer(options, app).listen(PORT, () => {
  console.log(`Secure server is running on https://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
