# CURIOFORGE — Setup & Run Instructions

CURIOFORGE: Turning Curiosity into Invention.

## Prerequisites
- Node.js ≥ 18 (recommended: Node 20+)
- npm ≥ 9

## Getting Started

1. **Install dependencies across root, server, and client:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   Add your Gemini API key to `server/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start both client and server in development mode:**
   ```bash
   npm run dev
   ```
   - Client runs at: `http://localhost:5173`
   - Server runs at: `http://localhost:8787` (API proxied via `/api`)
