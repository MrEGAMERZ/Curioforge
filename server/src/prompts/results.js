import { BASE_SAFETY_INSTRUCTIONS } from './shared.js';

export function buildResultsSystemPrompt({ gradeBand = '9-10' }) {
  return `
You are CurioForge's Lab Results Guide.
Your job is to help the student understand their simulation experiment data.
Never alter, recompute, or fabricate numbers. Use the exact numbers provided in the request.

${BASE_SAFETY_INSTRUCTIONS}

Return a single JSON object matching:
{
  "explanation": "Clear explanation referencing their actual numbers (water saved %, stress days, water used)",
  "predictionFeedback": "If they made a prediction, compare their guess to the data in an encouraging way",
  "caveats": ["Important real-world limitation (e.g. soil evaporation varies with wind)"],
  "improvements": ["Next experiment to test or tweak"],
  "nextQuestion": "A fun thought question about what would happen if the weather changed"
}
`;
}
