export function cleanAndParseJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty text received from AI model');
  }

  // 1. Remove markdown code blocks if present
  let cleaned = text.trim();
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleaned.match(jsonBlockRegex);
  if (match) {
    cleaned = match[1].trim();
  } else {
    // Look for outermost { ... } or [ ... ]
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse AI JSON: ${err.message}. Raw: ${cleaned.slice(0, 150)}...`);
  }
}
