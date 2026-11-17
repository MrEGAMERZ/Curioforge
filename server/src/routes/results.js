import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { resultsRequestSchema, resultsResponseSchema } from '../schemas/results.js';
import { buildResultsSystemPrompt } from '../prompts/results.js';
import { generateGeminiJson } from '../services/gemini.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/interpret', aiLimiter, validate(resultsRequestSchema), async (req, res, next) => {
  try {
    const { gradeBand, studentPrediction, inputs, results } = req.body;

    if (!env.isGeminiConfigured) {
      const savedPct = results.waterSavedPct !== null ? `${results.waterSavedPct.toFixed(1)}%` : 'a significant amount of';
      return res.json({
        explanation: `Your sensor-based strategy saved ${savedPct} water compared to fixed scheduled watering! By waiting until soil moisture actually dropped below your threshold before watering, you prevented excessive runoff and deep drainage losses.`,
        predictionFeedback: studentPrediction
          ? `You predicted: "${studentPrediction}". Your intuition was spot-on! Plants don't need water every single day if the soil still holds moisture.`
          : 'Good observation! Letting soil dry slightly encourages root systems to reach deeper.',
        caveats: [
          'This simulation assumes uniform soil texture throughout the root depth; real fields often have variable layers.',
          'High winds and direct sunlight increase evapotranspiration faster than standard daily averages.',
        ],
        improvements: [
          'Try increasing the sensor threshold to see if plant stress days drop to zero.',
          'Test how clay soil behaves compared to sandy soil under the exact same weather pattern.',
        ],
        nextQuestion: 'If a surprise rainstorm delivers 20mm of rain on Day 4, which watering strategy benefits more?',
      });
    }

    const systemPrompt = buildResultsSystemPrompt({ gradeBand });
    const payload = {
      studentPrediction,
      inputs,
      results,
    };

    const result = await generateGeminiJson({
      systemPrompt,
      userContent: JSON.stringify(payload),
      schema: resultsResponseSchema,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
