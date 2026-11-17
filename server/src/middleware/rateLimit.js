import rateLimit from 'express-rate-limit';

// Standard API rate limiter: 60 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please wait a moment before trying again.',
    },
  },
});

// AI endpoints limiter: 30 requests per minute per IP
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'CurioForge is thinking fast! Please wait a few seconds before your next question.',
    },
  },
});
