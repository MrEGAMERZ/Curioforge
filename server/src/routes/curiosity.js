import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { curiosityRequestSchema, curiosityResponseSchema } from '../schemas/curiosity.js';
import { buildCuriositySystemPrompt } from '../prompts/curiosity.js';
import { generateGeminiJson } from '../services/gemini.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/chat', aiLimiter, validate(curiosityRequestSchema), async (req, res, next) => {
  try {
    const { gradeBand, messages } = req.body;

    if (!env.isGeminiConfigured) {
      // Demo fallback when key is not set
      const lastStudentMsg = [...messages].reverse().find((m) => m.role === 'student')?.text || 'farming water saving';
      return res.json({
        reply: `That is a brilliant challenge! Water conservation in agriculture is critical because plants need balanced moisture. To design the right tool, let's explore your setup.`,
        followUpQuestions: [
          'What kind of crops are the farmers growing in your area?',
          'Do they currently water their fields by hand, canals, or drip irrigation?',
          'Would you prefer a simple buzzer alarm when soil gets dry, or an automatic valve?',
        ],
        thinkingPrompt: 'Why do you think measuring soil moisture is better than watering on a fixed timer?',
        ideaSummary: {
          goal: 'Automated soil moisture sensing to prevent water waste in farming',
          intendedUser: 'Local smallholder farmers',
          constraints: ['Low budget', 'Simple power source', 'Sturdy for outdoor soil'],
          mode: 'hardware',
        },
        detectedConcepts: [
          { id: 'soil_moisture', name: 'Soil Moisture & Resistance', reason: 'Detecting water content using conductivity probes' },
          { id: 'electrical_conductivity', name: 'Electrical Conductivity', reason: 'Water with dissolved minerals conducts electricity' },
          { id: 'evapotranspiration', name: 'Evapotranspiration', reason: 'How plants and soil lose water to the atmosphere' },
        ],
        stage: messages.length >= 2 ? 'ready_for_blueprint' : 'clarifying',
      });
    }

    const systemPrompt = buildCuriositySystemPrompt({ gradeBand });
    const formattedHistory = messages.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n');

    const result = await generateGeminiJson({
      systemPrompt,
      userContent: `CONVERSATION HISTORY:\n${formattedHistory}\n\nPlease generate the next mentor response and updated idea board summary.`,
      schema: curiosityResponseSchema,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
