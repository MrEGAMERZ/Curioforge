# Graph Report - STEM2  (2026-11-17)

## Corpus Check
- 60 files · ~32,798 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 1, .example 1)

## Summary
- 410 nodes · 567 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f079d283`
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
- package.json
- CURIOFORGE — Rules for AI Coding Agents
- 2. Feature Breakdown: The 5 Core Pillars
- InteractiveTutorView.jsx
- routes/weather.js
- CURIOFORGE
- CURIOFORGE — Setup & Run Instructions
- rules/graphify.md
- workflows/graphify.md
- Design: CurioForge — Voice-First Activity Companion (Unified Plan)
- dependencies

## God Nodes (most connected - your core abstractions)
1. `CURIOFORGE — Design System` - 20 edges
2. `CURIOFORGE — Product Requirements Document (PRD)` - 18 edges
3. `CURIOFORGE — Architecture` - 16 edges
4. `CURIOFORGE` - 15 edges
5. `Design: CurioForge — Voice-First Activity Companion (Unified Plan)` - 15 edges
6. `react` - 13 edges
7. `CURIOFORGE — Rules for AI Coding Agents` - 13 edges
8. `5. Main Product Modules and Features` - 13 edges
9. `Design: CurioForge — Voice & Image AI Companion for Primary Students` - 13 edges
10. `Badge()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `19. Reusable Component Guidelines` --references--> `Chip()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx
- `19. Reusable Component Guidelines` --references--> `ErrorState()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx
- `19. Reusable Component Guidelines` --references--> `Button()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Button.jsx
- `19. Reusable Component Guidelines` --references--> `Card()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Card.jsx
- `19. Reusable Component Guidelines` --references--> `Badge()`  [INFERRED]
  DESIGN.md → client/src/components/ui/Misc.jsx

## Import Cycles
- None detected.

## Communities (22 total, 4 thin omitted)

### Community 0 - "client/package.json"
Cohesion: 0.07
Nodes (26): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer, postcss (+18 more)

### Community 1 - "CURIOFORGE — Design System"
Cohesion: 0.08
Nodes (23): 10. Inputs and Forms, 11. Shell Chrome and Navigation, 13. Voice and Camera Interaction, 14. ActivityPlan Presentation (ActivityProgram interpreter), 15. Living Canvas Interface, 16. Parent/Teacher Gate, 17. Responsive and Platform Rules, 18. Accessibility and Contrast Requirements (+15 more)

### Community 2 - "CURIOFORGE"
Cohesion: 0.06
Nodes (31): 10. What Makes CURIOFORGE Distinctive?, 11. Proposed 24-Hour Hackathon MVP, 12. Guiding Principles, 13. Final Vision, 1. The Core Idea, 2. The Problem We Aim to Address, 3. Proposed Solution, 4. The Student's Invention Journey (+23 more)

### Community 3 - "CURIOFORGE — Product Requirements Document (PRD)"
Cohesion: 0.08
Nodes (23): 10. Features Excluded from MVP, 11. Future Enhancements, 12. Accessibility Requirements, 13. Safety and Responsible AI Requirements, 14. Acceptance Criteria for MVP Features, 15. Demo Success Criteria, 16. Assumptions and Open Questions (flagged, not decided), 1. Project Overview (+15 more)

### Community 4 - "5. Main Product Modules and Features"
Cohesion: 0.09
Nodes (22): 5. Main Product Modules and Features, Biology, Chemistry, Hearing-impaired students, Mathematics, Module 10: Adaptive Prototype Builder, Module 11: Invention Testing and Improvement Lab, Module 12: Student Progress and Learning Profile (+14 more)

### Community 5 - "app.js"
Cohesion: 0.06
Nodes (45): 5. Backend Architecture, cors, dotenv, express, express-rate-limit, nodemon, zod, devDependencies (+37 more)

### Community 6 - "CURIOFORGE — Architecture"
Cohesion: 0.07
Nodes (28): 10. Data Shapes and Storage, 11. Error Handling, 12. Security Considerations, 13. Recommended Folder and File Structure, 14. Dependencies and Their Purposes, 15. Open Decisions and Assumptions, 1. System Overview, 2. High-Level Architecture (+20 more)

### Community 7 - "Design: CurioForge — Voice & Image AI Companion for Primary Students"
Cohesion: 0.12
Nodes (15): Approach A: Web Speech API + Gemini Vision (Two calls), Approach B: Gemini 2.0 Flash Multimodal — Recommended, Approaches Considered, Architecture Delta from Existing Docs, Core User Flow (MVP), Design: CurioForge — Voice & Image AI Companion for Primary Students, Next Steps (Build Order), Open Questions (+7 more)

### Community 8 - "CURIOFORGE — Implementation Roadmap (demo-slice-first plan)"
Cohesion: 0.13
Nodes (14): 1. Time Budget and Priorities, Checkpoints, CURIOFORGE — Implementation Roadmap (demo-slice-first plan), Cut line (if behind schedule), Phase 0 — Docs, Contracts and Core Foundation (≈2.0 h) · Mandatory, Phase 1 — SwiftUI macOS Demo Slice (≈5.0 h) · Mandatory / LIVE, Phase 2 — Android + PWA Shells (≈2.0 h) · Planned / Scaffold at demo, Phase 3 — Full Interaction Set (≈2.5 h) · Planned (+6 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (21): { app, BrowserWindow, systemPreferences }, path, { spawn }, description, devDependencies, concurrently, electron, main (+13 more)

### Community 10 - "CURIOFORGE — Rules for AI Coding Agents"
Cohesion: 0.14
Nodes (13): 0. Document Precedence, 10. Definition of Done (per phase), 11. Required Report Format after Each Work Session, 1. Agent Workflow Rules, 2. Coding Rules, 3. Architecture Rules, 4. Dependency Rules, 5. AI Behaviour Rules (what the *product's* AI must do) (+5 more)

### Community 11 - "2. Feature Breakdown: The 5 Core Pillars"
Cohesion: 0.18
Nodes (10): 1. Vision & Core Value Proposition, 2. Feature Breakdown: The 5 Core Pillars, 3. Technical Architecture Stack, CurioForge: Interactive Multilingual Voice STEM Companion, Pillar 1: Multilingual Voice-First Dialogue ("The Socratic Buddy"), Pillar 2: "Interactive Videos" (Living Canvas over Heavy MP4s), Pillar 3: Unbreakable Child Safety Shield, Pillar 4: Lightweight & Low-Resource Deployment (Global South Optimized) (+2 more)

### Community 12 - "InteractiveTutorView.jsx"
Cohesion: 0.15
Nodes (22): App(), InteractiveCanvas(), Button(), Card(), Badge(), Chip(), EmptyState(), ErrorState() (+14 more)

### Community 13 - "routes/weather.js"
Cohesion: 0.33
Nodes (6): router, forecastQuerySchema, geocodeQuerySchema, cache, geocodeCity(), getForecast()

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

## Knowledge Gaps
- **242 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CURIOFORGE — Architecture` connect `CURIOFORGE — Architecture` to `app.js`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `5. Backend Architecture` connect `app.js` to `CURIOFORGE — Architecture`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `validate()` connect `app.js` to `routes/weather.js`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `CURIOFORGE — Design System` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `CURIOFORGE` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._