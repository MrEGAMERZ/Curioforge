import { z } from 'zod';

export const curiosityRequestSchema = z.object({
  body: z.object({
    gradeBand: z.enum(['primary', '6-8', '9-10', '11-12']).default('9-10'),
    messages: z.array(
      z.object({
        role: z.enum(['student', 'mentor']),
        text: z.string().max(1000),
      })
    ).max(20),
  }),
});

export const curiosityResponseSchema = z.object({
  reply: z.string(),
  followUpQuestions: z.array(z.string()).min(1).max(3),
  thinkingPrompt: z.string().nullable().optional(),
  ideaSummary: z.object({
    goal: z.string().default(''),
    intendedUser: z.string().default(''),
    constraints: z.array(z.string()).default([]),
    mode: z.enum(['hardware', 'software', 'unknown']).default('unknown'),
  }),
  detectedConcepts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      reason: z.string(),
    })
  ).default([]),
  stage: z.enum(['clarifying', 'ready_for_blueprint']).default('clarifying'),
});
