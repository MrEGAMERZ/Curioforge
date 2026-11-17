import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRouter from './routes/health.js';
import tutorRouter from './routes/tutor.js';
import curiosityRouter from './routes/curiosity.js';
import blueprintRouter from './routes/blueprint.js';
import resultsRouter from './routes/results.js';
import weatherRouter from './routes/weather.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

export const app = express();

// Security & Parsing
app.use(cors({
  origin: '*', // Allow Electron and local dev origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '500kb' }));

// Static client assets
app.use(express.static(clientDistPath));

// Rate limiting on /api
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/health', healthRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/curiosity', curiosityRouter);
app.use('/api/blueprint', blueprintRouter);
app.use('/api/results', resultsRouter);
app.use('/api/weather', weatherRouter);

// SPA fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);
