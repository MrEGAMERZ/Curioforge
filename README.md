# CURIOFORGE — Setup & Run Instructions

CURIOFORGE: Turning Curiosity into Invention.

> **Status:** Planning/scaffolding only. The scripts below are declared in `package.json`, but application source does not exist yet. They will fail until Phase 0 creates the server source and Phase 1/2 creates the native and PWA entry files. Nothing here is a working app yet.

## Docs Map

| Document | Purpose |
|---|---|
| `docs/designs/curioforge-unified-activity-plan.md` | Approved decision record; supersedes the two older design drafts |
| `PRD.md` | Scope, personas, requirements, acceptance criteria |
| `ARCHITECTURE.md` | Core, contracts, endpoints, data shapes, folder structure |
| `RULES.md` | Mandatory rules for coding agents |
| `PHASES.md` | Order of work and what is actually built |
| `DESIGN.md` | Visual system for PWA, macOS and Android |

## Prerequisites

### Shared core + PWA
- Node.js ≥ 18 (recommended: Node 20+)
- npm ≥ 9

### macOS demo shell (Phase 1)
- macOS 13+
- Xcode 15+ with Swift 5.9
- A Mac camera and microphone (Continuity Camera is an acceptable fallback)

### Android scaffold (Phase 2)
- Android Studio
- JDK 17
- Android SDK 34

## Getting Started (once Phase 0 lands)

1. **Install dependencies across root, core and PWA:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env`:
   ```env
   PORT=8787
   CLIENT_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   The key must stay server-side. Never use `VITE_GEMINI_API_KEY`, commit `.env`, or put the key in a Swift/Android bundle.

3. **Start core + PWA in development mode:**
   ```bash
   npm run dev
   ```
   - PWA: `http://localhost:5173`
   - Core: `http://localhost:8787`
   - PWA proxies `/api` → `http://localhost:8787`

   Individual commands:
   ```bash
   npm run dev:server
   npm run dev:client
   npm run build
   ```

4. **Run the Gemini smoke test** `[PLANNED — Phase 0]`:
   ```bash
   npm run smoke
   ```
   This sends one text + audio + image probe and records whether Gemini `inlineData` worked. If audio is unavailable, the documented fallback is shell transcription + Gemini Vision.

## Contracts

Versioned contract files live in `packages/contracts/v1/`:

- `activityProgram.schema.json` — the portable activity "bytecode"
- `sessionState.schema.json`
- `safetyEvent.schema.json`
- `dashboardEvent.schema.json`
- `examples/` — checked-in valid examples, including `activity.fizz.json`

Any contract change must update the JSON Schema, the core's zod schemas, the examples, and `ARCHITECTURE.md` together (`RULES.md` W-10/A-7).

## macOS Demo Shell

```bash
open apps/macos/CurioForge.xcodeproj
```

Then select a simulator or a physical Mac target and Run. After Phase 1, the app will:

1. Ask permission for microphone and camera (`NSMicrophoneUsageDescription`, `NSCameraUsageDescription` in `Info.plist`).
2. Send voice/photo input to the local core at `http://localhost:8787`.
3. Render an `ActivityProgram` with SwiftUI views and `AVSpeechSynthesizer`.
4. Store session, activities and events in `UserDefaults`.
5. Expose a read-only parent gate on the same device.

The shell must never call Gemini directly or contain prompt/safety logic.

## Android Scaffold

```bash
open apps/android
```

After Phase 2:

- Install JDK 17 and SDK 34 in Android Studio.
- Run on an emulator or device.
- The first screen interprets the checked-in example `activity.fizz.json`.
- Permissions are requested only when the child taps mic or camera.
- Data is stored with DataStore.

## PWA Shell

The PWA uses the existing `client/` Vite setup. After Phase 2 it will include:

- React/Vite dev server on port 5173.
- `/api` proxy to the core in `client/vite.config.js`.
- Service Worker and web manifest for install/offline example activity caching.
- Tailwind tokens from `DESIGN.md`.
- One ActivityProgram interpreter screen.

Live AI still requires the core and `GEMINI_API_KEY`; offline mode only serves cached example activities.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module src/index.js` | Expected until Phase 0 creates the server source. |
| `Failed to resolve ./index.html` | Expected until Phase 0/2 creates the Vite entry files. |
| Server exits with "GEMINI_API_KEY missing" | Copy `.env.example` to `.env` and set the key. |
| Mic/camera permission denied | Allow access in System Settings / browser site settings; text fallback remains usable. |
| PWA API calls fail | Confirm the core is running on 8787 and the Vite proxy targets it. |
| Key appears in a build | Stop and remove it immediately; keys belong only in `server/.env`. |

## Safety

The demo is for supervised learning. ActivityPrograms may involve household materials and always include adult-help notes where relevant. The app is not a substitute for adult supervision and must not be described as risk-free.
