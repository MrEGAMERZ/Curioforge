import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: env.isGeminiConfigured,
    model: env.GEMINI_MODEL,
    time: new Date().toISOString(),
  });
});

export default router;
