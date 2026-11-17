import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { blueprintRequestSchema, blueprintResponseSchema } from '../schemas/blueprint.js';
import { buildBlueprintSystemPrompt } from '../prompts/blueprint.js';
import { generateGeminiJson } from '../services/gemini.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/generate', aiLimiter, validate(blueprintRequestSchema), async (req, res, next) => {
  try {
    const { gradeBand, idea, ideaSummary, concepts, messages } = req.body;

    if (!env.isGeminiConfigured) {
      return res.json({
        blueprint: {
          title: 'Eco-Drop: Smart Soil Moisture Indicator for Farmers',
          mode: 'hardware',
          studentIdeaSummary: idea,
          problemStatement: 'Farmers often over-water or under-water crops, wasting precious groundwater and stressing plants.',
          concepts: [
            { id: 'soil_moisture', name: 'Soil Moisture & Resistance', whyItMatters: 'Wet soil conducts electricity better than dry soil, letting us measure water content.' },
            { id: 'transistor_switch', name: 'Transistor Switch Logic', whyItMatters: 'Small electrical current from wet soil turns an indicator LED on or off.' },
          ],
          howItWorks: 'Two graphite or galvanized metal probes are placed into the soil. When soil is moist, electrical current passes through and turns on an indicator. When soil dries out, the circuit opens, triggering a gentle alert.',
          components: [
            {
              name: 'Conductive Probes',
              purpose: 'Sensing moisture level in root zone',
              costTier: 'low',
              alternatives: [{ name: 'Two #2 Wooden Pencils (Sharpened on both ends)', note: 'Graphite pencil cores are excellent non-rusting electrical conductors!' }],
            },
            {
              name: 'Indicator Light',
              purpose: 'Visual signal when soil is thirsty',
              costTier: 'low',
              alternatives: [{ name: 'Repurposed LED from broken holiday lights or battery torch', note: 'Can be salvaged from old toys' }],
            },
            {
              name: 'Power Source',
              purpose: 'Safe low-voltage power',
              costTier: 'low',
              alternatives: [{ name: '2x 1.5V AA Batteries in holder (or recycled USB 5V adapter)', note: 'Completely safe touch-friendly DC voltage' }],
            },
          ],
          buildSteps: [
            {
              title: 'Prepare the Graphite Probes',
              instructions: ['Carefully sharpen both ends of two standard wooden pencils so the black graphite core is exposed.', 'Make sure the pencils are the same length.'],
              why: 'Graphite conducts electricity safely without rusting quickly in damp soil.',
              safetyNote: 'Use a standard sharpener safely and avoid sharp graphite points sticking into fingers.',
            },
            {
              title: 'Connect Leads to Probes',
              instructions: ['Wrap connecting wire tightly around the top exposed graphite core of each pencil.', 'Secure firmly with electrical tape.'],
              why: 'Ensures reliable electrical contact between the sensor and circuit.',
              safetyNote: null,
            },
            {
              title: 'Wire the Battery & Indicator Loop',
              instructions: ['Connect the positive terminal of the 3V battery to Probe 1.', 'Connect Probe 2 to the LED anode, and the LED cathode back to the negative battery terminal.'],
              why: 'Creates a series circuit that completes only when the soil gap conducts electricity.',
              safetyNote: 'Never connect the battery terminals directly together without the LED or soil resistance.',
            },
            {
              title: 'Calibrate with Water Cups',
              instructions: ['Dip the pencil probes into a cup of dry soil — the LED should remain OFF.', 'Pour water into the cup and observe the LED glow bright!'],
              why: 'Verifies the conductivity threshold before field deployment.',
              safetyNote: null,
            },
            {
              title: 'Install in Farm or Garden Bed',
              instructions: ['Insert the probes into the root zone of your target plant (about 5-10 cm deep).', 'Seal the battery holder inside a recycled plastic bottle to protect from rain.'],
              why: 'Water levels vary by depth; root zone is where plants actually drink.',
              safetyNote: 'Always wash hands after handling outdoor soil and garden fertilizer.',
            },
          ],
          testPlan: [
            {
              question: 'Does the circuit trigger immediately when water is added?',
              howToTest: 'Pour 50ml of water slowly near the probes while watching the LED.',
              expectedObservation: 'LED turns on brightly within 2-3 seconds as water fills pore spaces.',
            },
            {
              question: 'Does probe spacing affect sensitivity?',
              howToTest: 'Test probes 2 cm apart vs 8 cm apart in damp soil.',
              expectedObservation: 'Closer probes provide stronger conductivity and brighter LED glow.',
            },
          ],
          improvements: [
            'Add a solar cell recharge module so batteries never need replacement',
            'Connect to an automated 5V micro-pump for automatic drip irrigation',
          ],
          safetyWarnings: [
            'Only use safe low-voltage batteries (under 6V DC). NEVER connect to household wall plugs!',
            'Keep battery pack dry and protected from heavy mud or flooding.',
          ],
          limitations: [
            'Soil with high salinity conducts more electricity, which can affect calibration',
            'Wooden pencils will eventually soften over weeks in very wet soil',
          ],
          thinkingQuestions: [
            'Why does muddy water conduct electricity better than pure distilled water?',
            'How might sandy soil behave differently than clay soil with this sensor?',
          ],
          labId: 'soil_moisture',
        },
      });
    }

    const systemPrompt = buildBlueprintSystemPrompt({ gradeBand });
    const payload = {
      idea,
      ideaSummary,
      concepts,
      messages: (messages || []).slice(-10),
    };

    const result = await generateGeminiJson({
      systemPrompt,
      userContent: JSON.stringify(payload),
      schema: blueprintResponseSchema,
    });

    res.json({ blueprint: result });
  } catch (err) {
    next(err);
  }
});

export default router;
