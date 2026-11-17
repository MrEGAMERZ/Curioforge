import { z } from 'zod';

export const geocodeQuerySchema = z.object({
  query: z.object({
    q: z.string().min(1).max(100),
  }),
});

export const forecastQuerySchema = z.object({
  query: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
    days: z.coerce.number().min(1).max(7).default(7),
  }),
});
