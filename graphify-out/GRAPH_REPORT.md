# Graph Report - STEM2  (2026-11-17)

## Corpus Check
- 88 files · ~50,964 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .plist 1, .css 1)

## Summary
- 702 nodes · 1140 edges · 41 communities (29 shown, 12 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 82 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3149927`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- client/package.json
- CURIOFORGE — Design System
- CURIOFORGE
- CURIOFORGE — Product Requirements Document (PRD)
- 5. Main Product Modules and Features
- app.js
- CURIOFORGE — Architecture
- Design: CurioForge — Voice & Image AI Companion for Primary Students
- CURIOFORGE — Implementation Roadmap (demo-slice-first plan)
- scripts
- CURIOFORGE — Rules for AI Coding Agents
- 2. Feature Breakdown: The 5 Core Pillars
- InteractiveTutorView.jsx
- SocraticMessage
- CURIOFORGE
- CURIOFORGE — Setup & Run Instructions
- rules/graphify.md
- workflows/graphify.md
- Design: CurioForge — Voice-First Activity Companion (Unified Plan)
- dependencies
- CloudSyncService
- SpeechRecognizerService
- AppState
- CURIOFORGE: RESEARCH, SYSTEM DESIGN & ARCHITECTURE MASTER PLAN
- SwiftUI
- View
- LivingCanvasView
- .sendStudentMessage
- GlassCard
- SimulationState
- CameraScannerView
- SettingsView
- Package.swift
- .speak
- 6. Core User Journeys
- APIClient
- SiriOrbView
- 1. Time Budget and Priorities

## God Nodes (most connected - your core abstractions)
1. `AppState` - 54 edges
2. `CURIOFORGE — Design System` - 20 edges
3. `SocraticMessage` - 19 edges
4. `CURIOFORGE — Product Requirements Document (PRD)` - 18 edges
5. `SupportedLanguage` - 17 edges
6. `ActivityPlan` - 16 edges
7. `react` - 16 edges
8. `CURIOFORGE — Architecture` - 16 edges
9. `Card()` - 15 edges
10. `CURIOFORGE` - 15 edges

## Surprising Connections (you probably didn't know these)
- `19. Reusable Component Guidelines` --references--> `Chip()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx
- `19. Reusable Component Guidelines` --references--> `ErrorState()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx
- `12. Activity Home Cards` --references--> `EmptyState()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx
- `4.1 macOS shell (live demo)` --references--> `APIClient`  [INFERRED]
  ARCHITECTURE.md → apps/macos/Sources/Curioforge/Services/APIClient.swift
- `19. Reusable Component Guidelines` --references--> `Button()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Button.jsx

## Import Cycles
- None detected.

## Communities (41 total, 12 thin omitted)

### Community 0 - "client/package.json"
Cohesion: 0.07
Nodes (28): dependencies, lucide-react, react, react-dom, react-router-dom, three, devDependencies, autoprefixer (+20 more)

### Community 1 - "CURIOFORGE — Design System"
Cohesion: 0.08
Nodes (23): 10. Inputs and Forms, 11. Shell Chrome and Navigation, 12. Activity Home Cards, 14. ActivityPlan Presentation (ActivityProgram interpreter), 15. Living Canvas Interface, 16. Parent/Teacher Gate, 17. Responsive and Platform Rules, 18. Accessibility and Contrast Requirements (+15 more)

### Community 2 - "CURIOFORGE"
Cohesion: 0.06
Nodes (31): 10. What Makes CURIOFORGE Distinctive?, 11. Proposed 24-Hour Hackathon MVP, 12. Guiding Principles, 13. Final Vision, 1. The Core Idea, 2. The Problem We Aim to Address, 3. Proposed Solution, 4. The Student's Invention Journey (+23 more)

### Community 3 - "CURIOFORGE — Product Requirements Document (PRD)"
Cohesion: 0.14
Nodes (13): 10. Features Excluded from MVP, 11. Future Enhancements, 13. Safety and Responsible AI Requirements, 15. Demo Success Criteria, 16. Assumptions and Open Questions (flagged, not decided), 1. Project Overview, 2. Problem Statement, 3. Target Users and Personas (+5 more)

### Community 4 - "5. Main Product Modules and Features"
Cohesion: 0.09
Nodes (22): 5. Main Product Modules and Features, Biology, Chemistry, Hearing-impaired students, Mathematics, Module 10: Adaptive Prototype Builder, Module 11: Invention Testing and Improvement Lab, Module 12: Student Progress and Learning Profile (+14 more)

### Community 5 - "app.js"
Cohesion: 0.05
Nodes (54): 5. Backend Architecture, cors, dotenv, express, express-rate-limit, nodemon, zod, devDependencies (+46 more)

### Community 6 - "CURIOFORGE — Architecture"
Cohesion: 0.08
Nodes (23): 10. Data Shapes and Storage, 11. Error Handling, 12. Security Considerations, 13. Recommended Folder and File Structure, 14. Dependencies and Their Purposes, 15. Open Decisions and Assumptions, 1. System Overview, 2. High-Level Architecture (+15 more)

### Community 7 - "Design: CurioForge — Voice & Image AI Companion for Primary Students"
Cohesion: 0.12
Nodes (15): Approach A: Web Speech API + Gemini Vision (Two calls), Approach B: Gemini 2.0 Flash Multimodal — Recommended, Approaches Considered, Architecture Delta from Existing Docs, Core User Flow (MVP), Design: CurioForge — Voice & Image AI Companion for Primary Students, Next Steps (Build Order), Open Questions (+7 more)

### Community 8 - "CURIOFORGE — Implementation Roadmap (demo-slice-first plan)"
Cohesion: 0.17
Nodes (11): CURIOFORGE — Implementation Roadmap (demo-slice-first plan), Phase 0 — Docs, Contracts and Core Foundation (≈2.0 h) · Mandatory, Phase 1 — SwiftUI macOS Demo Slice (≈5.0 h) · Mandatory / LIVE, Phase 2 — Android + PWA Shells (≈2.0 h) · Planned / Scaffold at demo, Phase 3 — Full Interaction Set (≈2.5 h) · Planned, Phase 4 — Multilingual Prompts + TTS (≈1.0 h) · Planned, Phase 5 — Full Parent/Teacher Dashboard (≈1.0 h) · Planned, Phase 6 — Textbook Intelligence and PDF Support (≈2.0 h) · Postponed / Extended (+3 more)

### Community 9 - "scripts"
Cohesion: 0.04
Nodes (45): { app, BrowserWindow, systemPreferences, session }, createWindow(), http, path, waitForServer(), check(), retry(), build (+37 more)

### Community 10 - "CURIOFORGE — Rules for AI Coding Agents"
Cohesion: 0.15
Nodes (12): 0. Document Precedence, 10. Definition of Done (per phase), 11. Required Report Format after Each Work Session, 1. Agent Workflow Rules, 2. Coding Rules, 3. Architecture Rules, 4. Dependency Rules, 5. AI Behaviour Rules (what the *product's* AI must do) (+4 more)

### Community 11 - "2. Feature Breakdown: The 5 Core Pillars"
Cohesion: 0.18
Nodes (10): 1. Vision & Core Value Proposition, 2. Feature Breakdown: The 5 Core Pillars, 3. Technical Architecture Stack, CurioForge: Interactive Multilingual Voice STEM Companion, Pillar 1: Multilingual Voice-First Dialogue ("The Socratic Buddy"), Pillar 2: "Interactive Videos" (Living Canvas over Heavy MP4s), Pillar 3: Unbreakable Child Safety Shield, Pillar 4: Lightweight & Low-Resource Deployment (Global South Optimized) (+2 more)

### Community 12 - "InteractiveTutorView.jsx"
Cohesion: 0.13
Nodes (31): App(), InteractiveCanvas(), ThreeDLabCanvas(), AVATARS, GRADE_OPTIONS, LANGUAGES, ProfileModal(), SessionDrawer() (+23 more)

### Community 13 - "SocraticMessage"
Cohesion: 0.07
Nodes (35): ActivityPlan, ActivityStep, PredictionOption, PredictionQuestion, ScienceConcept, ScrapItem, .normalizedRect, StageMode (+27 more)

### Community 14 - "CURIOFORGE"
Cohesion: 0.50
Nodes (3): CURIOFORGE, graphify, Skill routing

### Community 15 - "CURIOFORGE — Setup & Run Instructions"
Cohesion: 0.14
Nodes (13): Android Scaffold, Android scaffold (Phase 2), Contracts, CURIOFORGE — Setup & Run Instructions, Docs Map, Getting Started (once Phase 0 lands), macOS Demo Shell, macOS demo shell (Phase 1) (+5 more)

### Community 18 - "Design: CurioForge — Voice-First Activity Companion (Unified Plan)"
Cohesion: 0.11
Nodes (18): 10. Setup Scope (planned, not yet built), 11. Build Phases, 12. Success Criteria (demo, ≤5 minutes), 13. Open Questions, 14. What I Noticed About How You Think, 1. Problem Statement, 2. What Makes This Cool, 3. Landscape Findings (+10 more)

### Community 19 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, cors, dotenv, express, express-rate-limit, zod

### Community 22 - "CloudSyncService"
Cohesion: 0.24
Nodes (3): CloudSyncService, StudentProfile, .verificationView

### Community 23 - "SpeechRecognizerService"
Cohesion: 0.09
Nodes (4): SpeechRecognizerService, SpeechSynthesizerService, AVFoundation, Speech

### Community 24 - "AppState"
Cohesion: 0.21
Nodes (4): AppState, steps, StepByStepPlayerView, .body

### Community 25 - "CURIOFORGE: RESEARCH, SYSTEM DESIGN & ARCHITECTURE MASTER PLAN"
Cohesion: 0.06
Nodes (34): 1.1 The Failure of Current "Kids' AI", 1.2 The Competitive Landscape & The "Uncontested Wedge", 1.3 The "Closed Physical Build Loop", 1. THE PROBLEM & MARKET OPPORTUNITY, 2.1 The Architectural Master Thesis: "Shared Core + Declarative Bytecode + Thin Shells", 2.2 Why This Means Infinite Scalability ("Run Anywhere"), 2. SYSTEM ARCHITECTURE & SYSTEM DESIGN, 3.1 The Schema & Block Types (+26 more)

### Community 26 - "SwiftUI"
Cohesion: 0.12
Nodes (8): CurioforgeApp, .body, CertificateModalView, .body, MainView, .body, CinemaStageView, SwiftUI

### Community 27 - "View"
Cohesion: 0.21
Nodes (6): CoPilotSidebarView, .body, CuriosityFeedView, .body, SafetyBadgeView, .body

### Community 32 - "CameraScannerView"
Cohesion: 0.15
Nodes (5): CameraScannerView, .body, ChapterScrubberView, .body, .body

### Community 36 - ".speak"
Cohesion: 0.25
Nodes (6): 13. Voice and Camera Interaction, 12. Accessibility Requirements, 14. Acceptance Criteria for MVP Features, 4. Proposed Solution, 7. Functional Requirements, 9. Things to Avoid

### Community 37 - "6. Core User Journeys"
Cohesion: 0.33
Nodes (6): 6. Core User Journeys, J1 — "Make something that fizzes" (primary demo) `[MVP-M]`, J2 — Learn a concept `[MVP-S]`, J3 — Learn from a textbook `[EXT]`, J4 — Return to an activity `[MVP-M]`, J5 — Adult review `[MVP-M]`

### Community 38 - "APIClient"
Cohesion: 0.21
Nodes (6): APIClient, 4.1 macOS shell (live demo), 4.2 Android shell (`[PHASE 2]` scaffold), 4.3 PWA shell (`[PHASE 2]` scaffold), 4.4 Parent/teacher view, 4. Platform Shell Architecture

### Community 50 - "1. Time Budget and Priorities"
Cohesion: 0.67
Nodes (3): 1. Time Budget and Priorities, Checkpoints, Cut line (if behind schedule)

## Knowledge Gaps
- **298 isolated node(s):** `PackageDescription`, `CoreGraphics`, `.normalizedRect`, `Combine`, `scanner` (+293 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 355 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `5. Backend Architecture` connect `app.js` to `.speak`, `CURIOFORGE — Architecture`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `CURIOFORGE — Design System` connect `CURIOFORGE — Design System` to `.speak`, `InteractiveTutorView.jsx`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `AppState` connect `AppState` to `CameraScannerView`, `SettingsView`, `SocraticMessage`, `SiriOrbView`, `CloudSyncService`, `SpeechRecognizerService`, `SwiftUI`, `View`, `LivingCanvasView`, `.sendStudentMessage`, `SimulationState`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `AppState` (e.g. with `MainView` and `.body`) actually correct?**
  _`AppState` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `SocraticMessage` (e.g. with `.nextStep()` and `.runSimulation()`) actually correct?**
  _`SocraticMessage` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PackageDescription`, `CoreGraphics`, `.normalizedRect` to the rest of the system?**
  _298 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._