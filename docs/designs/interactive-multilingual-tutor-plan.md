# CurioForge: Interactive Multilingual Voice STEM Companion
## Product & Technical Feature Specification

---

### 1. Vision & Core Value Proposition
CurioForge transforms passive screen time (like YouTube Kids) into an **active, safe, voice-first STEM playground** accessible on low-cost smartphones in any language.

```
       [ Passive YouTube Loop ]                  [ CurioForge Active Loop ]
     Video plays → Child watches              Child speaks curiosity in native tongue
         (Passive, ads, risks)                                   ↓
                                                 AI Buddy responds with Voice + Action
                                                                 ↓
                                              Interactive Living Canvas (Scrub, Tap, Test)
                                                                 ↓
                                              Safe Household Build Guide (Zero-cost)
```

---

### 2. Feature Breakdown: The 5 Core Pillars

#### Pillar 1: Multilingual Voice-First Dialogue ("The Socratic Buddy")
* **Spoken Input in Any Language**: A large, friendly floating microphone button. Child taps and speaks in Hindi, Swahili, Spanish, Bengali, English, or mixed dialects.
* **Audio-Native Processing**:
  - Web MediaRecorder streams compressed audio (`audio/webm` or `audio/ogg`, < 30KB) to Express backend.
  - Gemini Multimodal processes audio natively or leverages language auto-detection to preserve emotion, tone, and age context.
* **Warm Audio Readback**: AI output is vocalized in the child’s native language with natural inflection and pacing suitable for ages 6–10.
* **Zero-Typing Guarantee**: The child never has to read or write a single word if they cannot yet read fluently.

---

#### Pillar 2: "Interactive Videos" (Living Canvas over Heavy MP4s)
Streaming 50MB YouTube videos in low-connectivity areas consumes scarce mobile data and keeps children passive. Instead, CurioForge uses **Interactive Living Canvases**:

| Dimension | Standard Video (YouTube Kids) | CurioForge Living Canvas |
| :--- | :--- | :--- |
| **Data Size** | 20MB – 80MB per video | **< 150KB** (vector & canvas bytecode) |
| **Interactivity** | Play / Pause / Scrub only | **Touch, drag sliders, mix ingredients, trigger events** |
| **Connectivity** | Buffers & fails on 2G/3G | **Instant load, runs offline once cached** |
| **Hardware Need** | High GPU/video decoding | **Runs smoothly on budget $40–$60 Android devices** |

* **Interactive Canvas Engine**:
  1. **Play/Scrub Mode**: Visual story unfolds step-by-step with synchronized audio narration.
  2. **Touch-to-Experiment**: A student can drag a virtual slider (e.g. increase sunlight, add baking soda, pour water) and watch the simulation react in real-time.
  3. **"Predict First" Pause**: The interactive story pauses before a reaction: *"What do you think happens if we drop the stone in the water?"* Child taps an option or speaks their prediction to continue.

---

#### Pillar 3: Unbreakable Child Safety Shield
Children often ask about dangerous things ("How do I make a fire bomb?", "Can I cut this with a knife?"). CurioForge applies a **Two-Tier Active Shield**:

```
[ Child Input ] 
       ↓
[ Layer 1: Deterministic Guardrail Regex & Word Classifier ]
       ├── If Hazard Detected (Mains power, bleach, fire, sharp tools)
       │       └── Instant Safe Redirection (Zero AI hallucination risk)
       ↓
[ Layer 2: System Persona Enforced by Gemini ]
       ├── Tone: Warm, curious, protective elder sibling
       ├── The "Creative Pivot": Never say "Access Denied" or "That is prohibited".
       └── Example: "Whoa, real fire is way too hot for fingers! But did you know we can make glowing bubbly lava using vinegar, warm water, and red food color? Let's make that instead!"
```

* **Physical Supervision Callouts**: Whenever simple scissors or food ingredients are involved, a friendly audio alert chimes: *"Grab an adult or your teacher for this step!"*

---

#### Pillar 4: Lightweight & Low-Resource Deployment (Global South Optimized)
* **Installable Progressive Web App (PWA)**:
  - Can be added directly to any Android home screen via Chrome without consuming Google Play Store storage.
  - Service Workers cache all interactive physics engines, audio sound effects, and UI components locally.
* **Resilient Offline Fallback**:
  - Pre-cached offline activities (e.g., Soil moisture sandbox, DIY Paper Circuit, Bottle Rocket physics) work without an active internet connection.
* **Data-Saver Mode**: Audio and prompts are compressed; responses stream as compact JSON.

---

#### Pillar 5: Household-Only STEM Inventions
* **No expensive kits required**:
  - Battery + pencil lead = circuit tester.
  - Plastic bottle + rubber band = water pump.
  - Vinegar + baking soda = chemical reaction.
* **Camera Object Scanner**:
  - Child can point their phone camera at items on their table.
  - Gemini Vision identifies the objects (*"I see a plastic bottle, a straw, and a balloon!"*) and generates an invention using strictly those items.

---

### 3. Technical Architecture Stack

```
+--------------------------------------------------------------------------+
| CLIENT: React + Vite + Tailwind CSS (PWA)                                |
|  - Voice Input: MediaRecorder API (compressed webm/ogg audio)            |
|  - Interactive Canvas: HTML5 Canvas / SVG Procedural Simulation Engine   |
|  - Audio Playback: HTML5 Audio + Web Speech Synthesis fallback           |
|  - Storage: LocalStorage / IndexedDB (100% Client-side state)             |
+--------------------------------------------------------------------------+
                                    |
                        HTTP POST /api/tutor/interact
                        (Audio Blob + Locale + Context)
                                    |
                                    v
+--------------------------------------------------------------------------+
| SERVER: Node.js + Express (Stateless)                                    |
|  - Middleware: Safety Classifier + Zod Validation + Rate Limiter         |
|  - Engine: Gemini 2.0 Flash Multimodal API (Audio + Vision + JSON)       |
|  - Output Schema: Structured JSON containing spoken text, interactive    |
|    canvas state parameters, and household step checklist                 |
+--------------------------------------------------------------------------+
```
