# Styx Enterprise Design System (Phase 2.0)

## 1. Design Philosophy
- **Aesthetic:** Enterprise SaaS Modernism. Clean, trustworthy, fast, accessible, and features extensive "Frosted Glass" (Glassmorphism) elements for a premium, dynamic feel.
- **Vibe:** Looks like a mature Series-B cybersecurity product.
- **Constraints:** ZERO emojis. Use strictly `lucide-react` for all iconography. No heavy, blocky shadows; use subtle borders and soft diffusion shadows. Zero lag on transitions.

## 2. Tech Stack Additions
To achieve the new UX requirements, ensure these packages are installed:
- `framer-motion`: For smooth page transitions and micro-interactions.
- `react-hotkeys-hook`: For global keyboard shortcuts.
- `react-i18next` & `i18next`: For comprehensive internationalization (i18n) across 6 languages (English, Hindi, Tamil, Telugu, Malayalam, Marathi).
- `clsx` & `tailwind-merge`: For dynamic class compilation.
## 3. Color Palette (Tailwind)
- **Backgrounds:** - Light Mode: `bg-zinc-50` (App), `bg-white` (Cards).
  - Dark Mode: `bg-zinc-950` (App), `bg-zinc-900` (Cards).
- **Primary Accent:** Cobalt Blue (`blue-600` light, `blue-500` dark).
- **Borders:** `border-zinc-200` (Light), `border-zinc-800` (Dark).
- **Semantic Status Colors (Strict Mapping):**
  - ACTIVE: Emerald (`text-emerald-600`, `bg-emerald-500/10`)
  - DEPRECATED: Amber (`text-amber-600`, `bg-amber-500/10`)
  - ZOMBIE: Crimson (`text-rose-600`, `bg-rose-500/10`)
  - SHADOW: Deep Violet (`text-indigo-600`, `bg-indigo-500/10`)

## 4. Typography
- **Font:** Inter or Geist (Sans-serif).
- **Hierarchy:** - Page Titles: `text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white`
  - Card Titles: `text-sm font-medium text-zinc-500 dark:text-zinc-400`
  - Hero Metrics: `text-3xl font-bold tracking-tight text-zinc-900 dark:text-white`

## 5. Structural Layout (App Shell)
- **Top Navbar:** - Left: Breadcrumb navigation.
  - Center: Global Search Bar (`cmd+k` / `ctrl+k` trigger, flexible layout to prevent occlusion).
  - Right: eBPF Interactive Controls, Live Telemetry Status, Language Switcher dropdown (6 languages supported), Theme Toggle (Sun/Moon), User Profile / Logout.
- **Sidebar (Left):**
  - Brand Logo (Styx).
  - Main Navigation links with active states (bg-blue-50/10).
  - Bottom: Global Shortcut Legend (e.g., `⌘K` Search, `⌘D` Theme).
- **Main Content:** Padded area (`p-6` or `p-8`) housing the dynamic route content.

## 6. Page Specifications
- **Landing Page (Public):** Modern hero section, abstract data graphic, value propositions, and a primary CTA "Enter Platform" leading to Login.
- **Login (Auth):** Centered, elegant card. Hardcoded admin/admin validation. Redirects to Dashboard on success.
- **Global Dashboard (New):** - Top Row: 4 KPI Cards (Total APIs, Active Zombies, Avg Risk Score, Open Alerts). Include mini sparklines (Recharts) in the cards.
  - Middle Row: Main Activity Chart (Line/Area) & Status Donut Chart.
- **Simulator (Blast Radius):** - D3.js Graph update: When a node is selected to be "decommissioned," all dependent edges must transition to `stroke-dasharray="5,5"` (dotted) and turn Crimson red, visually demonstrating the blast radius.
- **Data Lists:** All tables/lists must include a filter bar above them (Search by name, Filter by Status dropdown, Sort by Risk).

## 7. UX & Animations
- Wrap page routes in `framer-motion` `<AnimatePresence>` for subtle fade-in (`opacity: 0` to `opacity: 1`, duration `0.2s`).
- Buttons and interactive elements must have `active:scale-95 transition-all` for tactile feedback.