import { z } from 'zod';

export const resultsRequestSchema = z.object({
  body: z.object({
    gradeBand: z.enum(['primary', '6-8', '9-10', '11-12']).default('9-10'),
    studentPrediction: z.string().nullable().optional(),
    inputs: z.object({
      soilType: z.string(),
      days: z.number(),
      cropFactor: z.number(),
      strategyA: z.any().optional(),
      strategyB: z.any().optional(),
      usedForecast: z.boolean().optional(),
    }),
    results: z.object({
      A: z.object({
        totalWaterMm: z.number(),
        stressDays: z.number(),
        wastedMm: z.number(),
      }),
      B: z.object({
        totalWaterMm: z.number(),
        stressDays: z.number(),
        wastedMm: z.number(),
      }),
      waterSavedPct: z.number().nullable().optional(),
    }),
  }),
});

export const resultsResponseSchema = z.object({
  explanation: z.string(),
  predictionFeedback: z.string().nullable().optional(),
  caveats: z.array(z.string()).min(1),
  improvements: z.array(z.string()).min(2),
  nextQuestion: z.string().optional().default('What variable would you test next?'),
});
