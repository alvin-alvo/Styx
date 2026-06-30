# STYX Frontend

React + Vite + Tailwind CSS frontend for API Lifecycle Intelligence.

## Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Structure

- `/src/pages/` - Page components (Inventory, Security, Graph, etc.)
- `/src/components/` - Reusable React components
- `/src/services/api.js` - Axios API client
- `/src/utils/formatters.js` - Display formatting utilities

## Development

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Architecture

- **Inventory**: View and filter all APIs
- **Security**: OWASP findings and security posture
- **Dependencies**: D3.js graph visualization
- **Simulator**: Blast radius impact analysis
- **Alerts**: Real-time alert feed

## Frontend Roadmap Priorities

The frontend should make Styx feel like an enterprise control room during the demo.

1. **Inventory polish**
   - Add search across endpoint, owner, method, and status.
   - Add status/risk/owner/documentation/auth badges.
   - Add executive summary cards for total APIs, zombies, shadows, high-risk APIs, and safe retirement candidates.

2. **API detail explainability**
   - Add a "Why was this classified?" panel.
   - Show concrete evidence such as no traffic in N days, missing owner, missing docs, weak auth, and no dependencies.
   - Show formula weights so the score is visibly transparent.

3. **Security page**
   - Add professional vulnerability cards.
   - Future roadmap: display NVD CVE enrichment when backend support exists.

4. **AI roadmap UI**
   - Add clearly disabled/future-labeled modules for natural-language investigation.
   - Position NVIDIA NIM/API Catalog and Ollama as future AI provider options, not implemented dependencies.

5. **Presentation quality**
   - Avoid dead clicks.
   - Keep loading states smooth.
   - Make every screen support the demo story: discover, explain, secure, simulate, decide.
