# CURIOFORGE — Product Requirements Document (PRD)

> **Tagline:** Turning Curiosity into Invention
> **Document status:** Planning. **Nothing described here is implemented yet.** Every feature is `[PLANNED]` until its phase in `PHASES.md` is ticked off.
> **Companion docs:** `ARCHITECTURE.md` (how), `RULES.md` (boundaries), `PHASES.md` (order of work), `DESIGN.md` (look and feel).
> **Source of truth for:** product scope, user needs, acceptance criteria. If another document conflicts on *scope*, this one wins.

## Legend

| Tag | Meaning |
|---|---|
| `[MVP-M]` | **Must** work in the hackathon demo |
| `[MVP-S]` | **Should** work; first to be cut if time runs short |
| `[EXT]` | Extended version, after the MVP |
| `[LONG]` | Long-term vision, significant development |
| `[PLANNED]` | Designed, not yet built (applies to everything today) |

---

## 1. Project Overview

CURIOFORGE is an inclusive, AI-guided STEM invention platform for school students (target grades 6–12). It turns a student's curiosity, observation or half-formed idea into a practical hardware or software invention, without requiring prior coding, electronics or advanced science.

Journey: **Curiosity → Conversation → Discovery → Learning → Design → Build → Test → Improve → Invention.**

The AI acts as a **mentor, not a generator**: it asks questions, explains the *why*, and makes the student decide.

Two connected journeys:

| Journey | Purpose | Hackathon coverage |
|---|---|---|
| **Create STEM** | Idea → blueprint → build → test → improve | Core of the MVP |
| **Learn STEM** | Concept explanations, tutor, virtual lab, textbook intelligence | Concept explainer, tutor feedback and one simulation in MVP. Textbook PDF is `[EXT]` |

## 2. Problem Statement

- Students have ideas and questions but no structured path from "I wonder…" to a working prototype.
- Existing resources assume prior knowledge (code, circuits) or give finished projects to copy, which teaches little.
- Components and tools can be expensive, and many learners have limited access to labs.
- Generic AI chatbots give long, unverified answers and rarely build understanding or flag safety issues.

## 3. Target Users and Personas

| Persona | Description | Needs |
|---|---|---|
| **Aarav, 13 (primary)** | Grade 8, curious, no coding experience, shared family laptop | Simple language, small steps, cheap parts, encouragement |
| **Meera, 16** | Grade 11, has built a science-fair project, wants to go deeper | Real concepts, test plans, improvement ideas |
| **Ms. Rao (secondary)** | Science teacher mentoring a club | Safe, explainable output she can supervise `[EXT]` for teacher tools |
| **Hackathon judges** | Evaluate in minutes | One clear, working, honest end-to-end journey |

MVP is designed for **Aarav and Meera**. Teacher features are `[LONG]`.

## 4. Proposed Solution

A web app with:

1. **Curiosity Engine** — conversational idea exploration with a live "Idea Board".
2. **Concept explanations** — beginner-friendly cards, adjusted to the student's grade band.
3. **Invention Blueprint** — structured, editable-by-regeneration plan with components, affordable alternatives, build steps, test plan and safety notes.
4. **Interactive STEM Lab** — a clearly-labelled soil-moisture simulation.
5. **Results interpretation** — AI helps the student read the simulation and plan improvements.
6. **Real-world context** — Open-Meteo weather/evapotranspiration data to ground the simulation `[MVP-S]`.

## 5. Product Goals

| # | Goal | Measure (demo-level) |
|---|---|---|
| G1 | Deliver one complete, honest student journey | Demo scenario runs end to end with live AI calls |
| G2 | Build understanding, not just output | Every AI response includes a "why" and at least one thinking prompt |
| G3 | Beginner-friendly and affordable | Every component has a low-cost alternative |
| G4 | Safe by default | Safety notes in every hardware blueprint; simulations always labelled |
| G5 | Inclusive | Keyboard navigable, readable contrast, plain language |

## 6. Core User Journeys

### J1 — Farmers and water (primary demo) `[MVP-M]`

```mermaid
flowchart LR
  A[Student types idea] --> B[Mentor asks 2-3 follow-ups]
  B --> C[Idea Board fills: goal, user, constraints, concepts]
  C --> D[Concept cards: soil moisture, sensors]
  D --> E[Generate Invention Blueprint]
  E --> F[Components + cheap alternatives]
  F --> G[Beginner build steps + safety]
  G --> H[Soil-moisture simulation]
  H --> I[AI helps interpret results]
  I --> J[Improvement ideas, saved project]
```

### J2 — Learn a concept `[MVP-S]`
Student opens a concept card (for example "Evapotranspiration"), reads a grade-appropriate explanation, answers a check-your-understanding question and gets feedback.

### J3 — Learn from a textbook `[EXT]`
Student uploads a textbook chapter PDF; the app summarises and quizzes from the *uploaded text only*.

### J4 — Return to a project `[MVP-M]`
Student reopens a saved project from the dashboard (LocalStorage).

## 7. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Dashboard with "Start a new idea", recent projects and quick links | MVP-M |
| FR-02 | Optional student profile: nickname and grade band (6–8, 9–10, 11–12) stored locally | MVP-M |
| FR-03 | Curiosity chat: student message → mentor reply with 1–3 follow-up questions | MVP-M |
| FR-04 | Idea Board: live summary of goal, users, constraints and detected concepts | MVP-M |
| FR-05 | Concept explainer: simple explanation, analogy, key terms, check question | MVP-M (explain), MVP-S (feedback on answer) |
| FR-06 | Blueprint generator returning schema-valid structured JSON | MVP-M |
| FR-07 | Components list with purpose, cost tier and ≥1 affordable alternative each | MVP-M |
| FR-08 | Beginner build steps, each with "why this step" and safety note where relevant | MVP-M |
| FR-09 | Test plan: what to measure, expected observation, how to read it | MVP-M |
| FR-10 | Soil-moisture simulation with adjustable inputs and comparison of two watering strategies | MVP-M |
| FR-11 | Results interpretation by AI, using computed simulation numbers | MVP-M |
| FR-12 | Open-Meteo: city lookup and 7-day forecast feeding simulation rain and ET | MVP-S |
| FR-13 | Save, load and delete projects in LocalStorage | MVP-M |
| FR-14 | Clear loading, empty and error states on every AI/network feature | MVP-M |
| FR-15 | Textbook PDF upload, summary and quiz | EXT |
| FR-16 | Software-project blueprints (apps/web) beyond hardware | MVP-S (schema supports it; demo is hardware) |
| FR-17 | Additional labs (circuits, plant growth, etc.) | EXT |

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | AI responses show a loading state within 200 ms; typical AI wait target ≤ 15 s; hard timeout 30 s with retry |
| NFR-02 | Simulation runs fully client-side and responds to slider changes in < 100 ms |
| NFR-03 | Works on current Chrome, Edge, Firefox and Safari; usable from 360 px width |
| NFR-04 | No API keys or secrets in frontend bundle |
| NFR-05 | All AI JSON validated against schemas before reaching the UI |
| NFR-06 | WCAG 2.1 AA target for text contrast and keyboard access (see §12) |
| NFR-07 | Cold start: `npm install && npm run dev` brings up client and server (documented in README at Phase 0) |
| NFR-08 | Free-tier friendly: no paid infrastructure required for the demo |

## 9. MVP Scope (18-hour build)

**In scope:** FR-01 to FR-14 (FR-05 feedback and FR-12 are Should-have). One fully working scenario (water-saving for farmers). The Curiosity Engine itself accepts *any* idea, but the simulation lab covers soil moisture only; for other ideas the blueprint still works and the lab shows "No simulation for this topic yet".

**Honesty rule for the demo:** all AI content is live from Gemini; weather is live from Open-Meteo; the simulation is a simplified model and is labelled as such. No hardcoded responses presented as live.

## 10. Features Excluded from MVP

| Feature | Tag | Reason |
|---|---|---|
| Textbook PDF intelligence | EXT (Phase 6, stretch) | Needs parsing, chunking, grounding |
| Multiple labs (circuits, motion, plants) | EXT | Each lab is its own model + UI |
| User accounts, cloud sync, database | LONG | Out of 18 h; LocalStorage suffices |
| Teacher dashboard, classroom mode | LONG | Needs accounts |
| Real hardware code generation and flashing (Arduino/ESP32) | EXT | Safety and verification burden; MVP gives conceptual wiring and logic only |
| Voice input, multilingual UI | EXT | MVP is English only |
| Streaming AI responses | EXT | Not needed for demo |
| AR/3D model viewer | LONG | |
| Community sharing and gallery | LONG | Moderation burden |

## 11. Future Enhancements

- `[EXT]` Textbook intelligence with page-referenced answers, quizzes and flashcards.
- `[EXT]` Additional simulations; student-entered real sensor readings and charts.
- `[EXT]` Pseudocode and starter code for microcontrollers, with student-run tests only.
- `[EXT]` Offline-friendly mode; Hindi/Kannada and other languages.
- `[LONG]` Accounts, teacher tools, project portfolios, parent/teacher supervision flows.
- `[LONG]` Component price lookup via a real data source (never AI-guessed prices).

## 12. Accessibility Requirements

| ID | Requirement |
|---|---|
| A-01 | Body text contrast ≥ 4.5:1, large text and UI components ≥ 3:1 (palette in `DESIGN.md`) |
| A-02 | Full keyboard operation with visible focus rings; logical tab order |
| A-03 | Semantic HTML landmarks, labelled inputs, `aria-live="polite"` for AI responses and loading status |
| A-04 | Respect `prefers-reduced-motion` |
| A-05 | Minimum 44×44 px touch targets for primary controls |
| A-06 | Plain-language writing: short sentences, jargon defined on first use, grade-band adjustment |
| A-07 | Never convey meaning by colour alone (icons/text accompany status colours) |
| A-08 | Simulation charts have text summaries and a data table alternative |
| A-09 | Affordability: every component suggests a low-cost or household alternative where safe |

## 13. Safety and Responsible AI Requirements

| ID | Requirement |
|---|---|
| S-01 | Simulations carry a persistent "Simulation — simplified model" label |
| S-02 | Physical-electronics steps include supervision warnings ("Do this with a teacher or adult") |
| S-03 | AI never suggests mains voltage, lithium battery abuse, open flames, chemicals or hazardous experiments; it redirects to safer options |
| S-04 | AI output is framed as guidance, never as guaranteed scientific fact; uncertainty and limits are stated |
| S-05 | No invented citations or textbook references; blueprint says "not sourced from a textbook" unless textbook mode is used |
| S-06 | Cost information is a **tier** (low/medium/high), not a fabricated price |
| S-07 | No collection of sensitive personal data; nickname only; no real names required |
| S-08 | AI-generated code is never executed by the app |
| S-09 | Mentor prompts the student to predict, decide and justify before revealing answers where practical |

## 14. Acceptance Criteria for MVP Features

| Feature | Acceptance criteria |
|---|---|
| **FR-01 Dashboard** | Shows start-idea input, recent projects (or empty state), profile chip. Works with no stored data. |
| **FR-02 Profile** | Grade band can be set and persists after reload; skipping is allowed (default 9–10). |
| **FR-03 Curiosity chat** | Entering the demo prompt returns a mentor reply with 1–3 relevant follow-up questions (water use, crop, budget, etc.). Student can answer and conversation continues. Error shows retry button. |
| **FR-04 Idea Board** | After ≥1 exchange, board shows goal, intended user, constraints and ≥2 detected concepts. Updates after each reply. |
| **FR-05 Concept explainer** | "Soil moisture" and "Sensors" cards open with explanation, analogy, ≥3 key terms, one check question. Language differs by grade band. |
| **FR-06 Blueprint** | "Generate blueprint" returns and renders all sections (summary, concepts, how it works, components, steps, test plan, improvements, safety, limitations) within 30 s or shows a retry. Invalid AI JSON is never rendered. |
| **FR-07 Components** | Each component has purpose, cost tier chip and ≥1 alternative. |
| **FR-08 Build steps** | ≥5 ordered steps; each has instructions and a "why". Hardware steps include a safety/supervision note. |
| **FR-09 Test plan** | ≥2 tests, each with how-to and expected observation. |
| **FR-10 Simulation** | Changing soil type, ET, rain, threshold or schedule updates the chart immediately. Shows both strategies, total water used, stress days and water saved %. Labelled "Simulation". |
| **FR-11 Interpretation** | "Explain my results" sends computed numbers, returns explanation, ≥1 caveat and ≥2 improvement ideas, asks student to predict first. |
| **FR-12 Weather** | Entering a city resolves to coordinates, fetches forecast and fills rain/ET for 7 days; shows source "Open-Meteo" and fetch time. Failure leaves manual inputs usable. |
| **FR-13 Persistence** | Reload keeps project, conversation, blueprint and simulation settings. Delete works. |
| **FR-14 States** | Every AI/network view has distinct loading, empty and error UI. |

## 15. Demo Success Criteria

The first review is successful if, in **≤ 5 minutes**, presenter can:

1. Enter "I want to build something that helps farmers save water."
2. Show mentor follow-ups and the Idea Board filling in.
3. Open concept cards for soil moisture and sensors.
4. Generate a blueprint with components, cheap alternatives, steps and safety notes.
5. Open the simulation, change inputs, and show the water-saving comparison.
6. Run "Explain my results" and get an AI explanation.
7. (If built) fetch a real forecast for a city and show it affecting the simulation.
8. Reload the browser and show the project persisted.

Failure conditions: any fake or hardcoded response presented as live, API key visible in browser, or unhandled crash during the scenario.

## 16. Assumptions and Open Questions (flagged, not decided)

| # | Item | Assumed for now |
|---|---|---|
| Q1 | Gemini model and free-tier limits | Configurable via `GEMINI_MODEL`; verify availability on build day |
| Q2 | Open-Meteo variables/terms of use for the hackathon | Free non-commercial endpoint; verify parameters and terms at Phase 5 |
| Q3 | Grade band default | 9–10 |
| Q4 | Demo region for weather | Bengaluru (editable) |
