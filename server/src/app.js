import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRouter from './routes/health.js';
import tutorRouter from './routes/tutor.js';
import curiosityRouter from './routes/curiosity.js';
import blueprintRouter from './routes/blueprint.js';
import resultsRouter from './routes/results.js';
import weatherRouter from './routes/weather.js';

export const app = express();

// Security & Parsing
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '500kb' })); // Allow image base64 if sent

// Rate limiting on /api
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/health', healthRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/curiosity', curiosityRouter);
app.use('/api/blueprint', blueprintRouter);
app.use('/api/results', resultsRouter);
app.use('/api/weather', weatherRouter);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);
