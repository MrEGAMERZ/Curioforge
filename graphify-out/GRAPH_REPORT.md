# Graph Report - STEM2  (2026-11-17)

## Corpus Check
- 17 files · ~17,923 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .graphify-bak 1, .example 1)

## Summary
- 265 nodes · 251 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b90e4b5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- client/package.json
- CURIOFORGE — Design System
- CURIOFORGE
- CURIOFORGE — Product Requirements Document (PRD)
- 5. Main Product Modules and Features
- server/package.json
- CURIOFORGE — Architecture
- Design: CurioForge — Voice & Image AI Companion for Primary Students
- CURIOFORGE — Implementation Roadmap (18-hour plan)
- package.json
- CURIOFORGE — Rules for AI Coding Agents
- 2. Feature Breakdown: The 5 Core Pillars
- 15. Backend API Endpoint Specifications
- 4. The Student's Invention Journey
- CURIOFORGE
- CURIOFORGE — Setup & Run Instructions
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `CURIOFORGE — Design System` - 19 edges
2. `CURIOFORGE — Architecture` - 18 edges
3. `CURIOFORGE — Product Requirements Document (PRD)` - 18 edges
4. `CURIOFORGE` - 15 edges
5. `CURIOFORGE — Rules for AI Coding Agents` - 13 edges
6. `5. Main Product Modules and Features` - 13 edges
7. `Design: CurioForge — Voice & Image AI Companion for Primary Students` - 13 edges
8. `CURIOFORGE — Implementation Roadmap (18-hour plan)` - 12 edges
9. `15. Backend API Endpoint Specifications` - 10 edges
10. `4. The Student's Invention Journey` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "client/package.json"
Cohesion: 0.07
Nodes (28): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer, postcss (+20 more)

### Community 1 - "CURIOFORGE — Design System"
Cohesion: 0.08
Nodes (25): 10. Inputs and Forms, 11. Sidebar, 12. Dashboard Cards, 13. Chat Interface (Curiosity Workspace), 14. Blueprint Presentation, 15. STEM Simulation Interface, 16. Responsive Design Rules, 17. Accessibility and Contrast Requirements (+17 more)

### Community 2 - "CURIOFORGE"
Cohesion: 0.08
Nodes (23): 10. What Makes CURIOFORGE Distinctive?, 11. Proposed 24-Hour Hackathon MVP, 12. Guiding Principles, 13. Final Vision, 1. The Core Idea, 2. The Problem We Aim to Address, 3. Proposed Solution, 6. Example End-to-End Use Case (+15 more)

### Community 3 - "CURIOFORGE — Product Requirements Document (PRD)"
Cohesion: 0.09
Nodes (22): 10. Features Excluded from MVP, 11. Future Enhancements, 12. Accessibility Requirements, 13. Safety and Responsible AI Requirements, 14. Acceptance Criteria for MVP Features, 15. Demo Success Criteria, 16. Assumptions and Open Questions (flagged, not decided), 1. Project Overview (+14 more)

### Community 4 - "5. Main Product Modules and Features"
Cohesion: 0.09
Nodes (22): 5. Main Product Modules and Features, Biology, Chemistry, Hearing-impaired students, Mathematics, Module 10: Adaptive Prototype Builder, Module 11: Invention Testing and Improvement Lab, Module 12: Student Progress and Learning Profile (+14 more)

### Community 5 - "server/package.json"
Cohesion: 0.09
Nodes (21): cors, dotenv, express, express-rate-limit, nodemon, zod, dependencies, cors (+13 more)

### Community 6 - "CURIOFORGE — Architecture"
Cohesion: 0.11
Nodes (17): 10. Soil Moisture Simulation Architecture, 11. State and Storage Management, 12. Error Handling, 13. Security Considerations, 14. Recommended Folder and File Structure, 16. Dependencies and Their Purposes, 17. Open Decisions and Assumptions, 1. System Overview (+9 more)

### Community 7 - "Design: CurioForge — Voice & Image AI Companion for Primary Students"
Cohesion: 0.12
Nodes (15): Approach A: Web Speech API + Gemini Vision (Two calls), Approach B: Gemini 2.0 Flash Multimodal — Recommended, Approaches Considered, Architecture Delta from Existing Docs, Core User Flow (MVP), Design: CurioForge — Voice & Image AI Companion for Primary Students, Next Steps (Build Order), Open Questions (+7 more)

### Community 8 - "CURIOFORGE — Implementation Roadmap (18-hour plan)"
Cohesion: 0.13
Nodes (14): 1. Time Budget and Priorities, Checkpoints, CURIOFORGE — Implementation Roadmap (18-hour plan), Cut line (if behind schedule), Phase 0 — Project Setup and Foundation  (≈1.5 h) · Mandatory, Phase 1 — UI Foundation and Dashboard  (≈2.0 h) · Mandatory, Phase 2 — AI Curiosity Engine  (≈3.0 h) · Mandatory, Phase 3 — Invention Blueprint Generator  (≈2.5 h) · Mandatory (+6 more)

### Community 9 - "package.json"
Cohesion: 0.14
Nodes (13): description, devDependencies, concurrently, name, private, scripts, build, dev (+5 more)

### Community 10 - "CURIOFORGE — Rules for AI Coding Agents"
Cohesion: 0.14
Nodes (13): 0. Document Precedence, 10. Definition of Done (per phase), 11. Required Report Format after Each Work Session, 1. Agent Workflow Rules, 2. Coding Rules, 3. Architecture Rules, 4. Dependency Rules, 5. AI Behaviour Rules (what the *product's* AI must do) (+5 more)

### Community 11 - "2. Feature Breakdown: The 5 Core Pillars"
Cohesion: 0.18
Nodes (10): 1. Vision & Core Value Proposition, 2. Feature Breakdown: The 5 Core Pillars, 3. Technical Architecture Stack, CurioForge: Interactive Multilingual Voice STEM Companion, Pillar 1: Multilingual Voice-First Dialogue ("The Socratic Buddy"), Pillar 2: "Interactive Videos" (Living Canvas over Heavy MP4s), Pillar 3: Unbreakable Child Safety Shield, Pillar 4: Lightweight & Low-Resource Deployment (Global South Optimized) (+2 more)

### Community 12 - "15. Backend API Endpoint Specifications"
Cohesion: 0.20
Nodes (10): 15. Backend API Endpoint Specifications, GET `/api/health`, GET `/api/weather/forecast?lat=<n>&lon=<n>&days=<1-7>` — Phase 5, GET `/api/weather/geocode?q=<city>` — Phase 5, POST `/api/blueprint/generate` — Phase 3, POST `/api/curiosity/chat` — Phase 2, POST `/api/results/interpret` — Phase 4, POST `/api/textbook/analyze` — Phase 6 `[EXT]` (+2 more)

### Community 13 - "4. The Student's Invention Journey"
Cohesion: 0.25
Nodes (8): 4. The Student's Invention Journey, Stage 1: Curiosity, Stage 2: AI Conversation and Brainstorming, Stage 3: Discovery and STEM Understanding, Stage 4: Design and Planning, Stage 5: Build, Stage 6: Test, Debug and Improve, Stage 7: Present the Invention

### Community 14 - "CURIOFORGE"
Cohesion: 0.50
Nodes (3): CURIOFORGE, graphify, Skill routing

### Community 15 - "CURIOFORGE — Setup & Run Instructions"
Cohesion: 0.50
Nodes (3): CURIOFORGE — Setup & Run Instructions, Getting Started, Prerequisites

## Knowledge Gaps
- **213 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 225 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CURIOFORGE` connect `CURIOFORGE` to `5. Main Product Modules and Features`, `4. The Student's Invention Journey`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `5. Main Product Modules and Features` connect `5. Main Product Modules and Features` to `CURIOFORGE`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `4. The Student's Invention Journey` connect `4. The Student's Invention Journey` to `CURIOFORGE`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `CURIOFORGE — Design System` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `CURIOFORGE` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._