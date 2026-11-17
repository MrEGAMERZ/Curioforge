import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 CurioForge Server running on http://localhost:${env.PORT}`);
  console.log(`   Client Origin: ${env.CLIENT_ORIGIN}`);
  console.log(`   Gemini Status: ${env.isGeminiConfigured ? '✅ Configured (' + env.GEMINI_MODEL + ')' : '⚠️ Not configured (Demo fallbacks active)'}`);
});
