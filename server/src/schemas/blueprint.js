import { z } from 'zod';

export const blueprintRequestSchema = z.object({
  body: z.object({
    gradeBand: z.enum(['primary', '6-8', '9-10', '11-12']).default('9-10'),
    idea: z.string().max(1000),
    ideaSummary: z.object({
      goal: z.string().optional().default(''),
      intendedUser: z.string().optional().default(''),
      constraints: z.array(z.string()).optional().default([]),
      mode: z.enum(['hardware', 'software', 'unknown']).optional().default('unknown'),
    }).optional(),
    concepts: z.array(z.any()).optional().default([]),
    messages: z.array(z.any()).max(20).optional().default([]),
  }),
});

export const blueprintResponseSchema = z.object({
  title: z.string(),
  mode: z.enum(['hardware', 'software']),
  studentIdeaSummary: z.string(),
  problemStatement: z.string(),
  concepts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      whyItMatters: z.string(),
    })
  ).default([]),
  howItWorks: z.string(),
  components: z.array(
    z.object({
      name: z.string(),
      purpose: z.string(),
      costTier: z.enum(['low', 'medium', 'high']),
      alternatives: z.array(
        z.object({
          name: z.string(),
          note: z.string(),
        })
      ).min(1),
    })
  ).min(1),
  buildSteps: z.array(
    z.object({
      title: z.string(),
      instructions: z.array(z.string()),
      why: z.string(),
      safetyNote: z.string().nullable().optional(),
    })
  ).min(5),
  testPlan: z.array(
    z.object({
      question: z.string(),
      howToTest: z.string(),
      expectedObservation: z.string(),
    })
  ).min(2),
  improvements: z.array(z.string()).default([]),
  safetyWarnings: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  thinkingQuestions: z.array(z.string()).default([]),
  labId: z.string().nullable().optional(),
});
