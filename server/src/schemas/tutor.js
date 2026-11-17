import { z } from 'zod';

export const tutorRequestSchema = z.object({
  body: z.object({
    gradeBand: z.enum(['primary', '6-8', '9-10', '11-12']).default('primary'),
    studentText: z.string().max(1000).optional().default(''),
    audioBase64: z.string().optional().nullable(),
    audioMimeType: z.string().optional().default('audio/webm'),
    imageBase64: z.string().optional().nullable(),
    imageMimeType: z.string().optional().default('image/jpeg'),
    language: z.string().max(20).optional().default('auto'),
  }),
});

export const tutorResponseSchema = z.object({
  speechGreeting: z.string(),
  explanation: z.string(),
  stemConcepts: z.array(
    z.object({
      name: z.string(),
      simpleWhy: z.string(),
    })
  ).default([]),
  interactiveSimulationType: z.string().default('volcano_reaction'),
  simulationParameters: z.object({
    title: z.string().default('Interactive Science Lab'),
    promptQuestion: z.string().default('What do you think will happen?'),
    variableName: z.string().default('Amount'),
    variableMin: z.number().default(1),
    variableMax: z.number().default(5),
    variableDefault: z.number().default(2),
    variableUnit: z.string().default('spoons'),
    reactionSpeed: z.string().default('medium'),
  }).optional(),
  householdActivity: z.object({
    title: z.string(),
    materials: z.array(z.string()).default([]),
    steps: z.array(z.string()).default([]),
    safetyTip: z.string().default('Ask an adult to supervise!'),
  }),
  followUpAudioQuestion: z.string().default('What should we test next?'),
});
