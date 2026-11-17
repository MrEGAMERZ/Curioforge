import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { tutorRequestSchema, tutorResponseSchema } from '../schemas/tutor.js';
import { buildTutorSystemPrompt } from '../prompts/tutor.js';
import { generateGeminiJson } from '../services/gemini.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/interact', aiLimiter, validate(tutorRequestSchema), async (req, res, next) => {
  try {
    const {
      gradeBand,
      studentText,
      audioBase64,
      audioMimeType,
      imageBase64,
      imageMimeType,
      language,
    } = req.body;

    // If Gemini is not configured, return an intelligent interactive fallback payload
    // so judges and students can experience the UI, voice playback, and interactive simulations immediately
    if (!env.isGeminiConfigured) {
      const lower = (studentText || '').toLowerCase();
      let simType = 'volcano_reaction';
      let title = 'Fizzy Vinegar & Baking Soda Volcano!';
      let greeting = 'Aree waah! That is one of my favorite science experiments in the world!';
      let explanation = 'When baking soda (a base) meets vinegar (an acid), they react instantly to form water and tons of carbon dioxide gas bubbles! Those bubbles rush upwards just like real magma!';

      if (lower.includes('water') || lower.includes('plant') || lower.includes('farm') || lower.includes('soil')) {
        simType = 'soil_moisture';
        title = 'Smart Soil Moisture & Plant Hydration';
        greeting = 'Awesome question! Plants are like us — they need water, but too much can actually drown their roots!';
        explanation = 'Soil acts like a giant sponge. Loam soil holds moisture well, while sand lets water drain right through. Sensors can measure this electrical resistance!';
      } else if (lower.includes('circuit') || lower.includes('battery') || lower.includes('electric') || lower.includes('bulb')) {
        simType = 'circuit_tester';
        title = 'Safe 1.5V DIY Circuit & Conductor Tester';
        greeting = 'Electricity is fascinating! Let us explore how electrons flow in a safe low-voltage loop!';
        explanation = 'Electrons need a complete closed circuit to travel from the battery through a conductor (like pencil graphite or metal) to light up the bulb!';
      }

      return res.json({
        speechGreeting: greeting,
        explanation,
        stemConcepts: [
          { name: 'Chemical Reaction & Gas Release', simpleWhy: 'Acid and base exchange atoms to create CO2 gas' },
          { name: 'Pressure & Effervescence', simpleWhy: 'Trapped bubbles push upwards to create foam' },
        ],
        interactiveSimulationType: simType,
        simulationParameters: {
          title,
          promptQuestion: 'What happens if you increase the amount of vinegar?',
          variableName: 'Vinegar Amount',
          variableMin: 1,
          variableMax: 5,
          variableDefault: 2,
          variableUnit: 'spoons',
          reactionSpeed: 'fast',
        },
        householdActivity: {
          title: 'Kitchen Magma Lab',
          materials: ['Baking soda (2 spoons)', 'Vinegar or lemon juice', 'A cup or bowl', 'Tray for spills'],
          steps: [
            'Place your cup right in the center of the tray.',
            'Drop in 2 big spoons of baking soda.',
            'Pour in vinegar slowly and watch the bubbling lava rise!',
          ],
          safetyTip: 'Vinegar has a sharp smell and can sting eyes — keep your distance and have an adult nearby!',
        },
        followUpAudioQuestion: 'What other liquid in your kitchen do you think might bubble with baking soda?',
      });
    }

    // Live Gemini Multimodal call
    const systemPrompt = buildTutorSystemPrompt({ gradeBand, language });
    const userPrompt = studentText || 'The student spoke an idea or showed their materials. Please analyze and respond.';

    const result = await generateGeminiJson({
      systemPrompt,
      userContent: userPrompt,
      schema: tutorResponseSchema,
      imageBase64,
      imageMimeType,
      audioBase64,
      audioMimeType,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
