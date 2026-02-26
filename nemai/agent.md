# Nemai — Agent Context

## Project Overview
Nemai is an **AI-powered emergency decision support** landing page. The product tagline is *"Act Smart. Save Countless Lives."* This is currently a pre-launch marketing site with a "Get Early Access" call-to-action.

## Tech Stack
- **Framework:** React 19 (with React Compiler via `babel-plugin-react-compiler`)
- **Bundler:** Vite 7
- **Language:** JavaScript (JSX) — no TypeScript
- **Styling:** Vanilla CSS (per-component, co-located files)
- **Font:** Custom "AllumiSTD" font (`.otf` files in `src/assets/fonts/`)
- **Linting:** ESLint 9 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Architecture
Single-page landing site with a flat, component-based architecture. No routing, no state management, no API calls.

### Data Flow
```
index.html → main.jsx → App.jsx → [ Navbar | Hero | Footer ]
```

- `main.jsx` is the entry point. It loads `global.css` and renders `<App />` inside `<React.StrictMode>`.
- `App.jsx` composes three child components in order: `Navbar`, `Hero`, `Footer`.
- Each component is self-contained with hardcoded content and its own CSS file.

## Project Structure
```
nemai/
├── index.html              # HTML shell (Vite entry)
├── vite.config.js          # Vite config with React Compiler plugin
├── package.json
├── public/                 # Static public assets
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Root component (composes Navbar, Hero, Footer)
│   ├── App.css             # Vite default styles (unused)
│   ├── index.css           # Vite default styles (unused)
│   ├── assets/
│   │   ├── fonts/          # AllumiSTD custom font files (.otf)
│   │   ├── images/
│   │   │   ├── NEM_LOGO.png
│   │   │   ├── icons/      # Social icons (discord.svg, x.png)
│   │   │   └── mascots/    # Mascot illustrations (NEM-85, 86, 87)
│   │   └── react.svg       # Vite default (unused)
│   ├── components/
│   │   ├── Navbar/         # Navbar.jsx + Navbar.css
│   │   ├── Hero/           # Hero.jsx + Hero.css
│   │   └── Footer/         # Footer.jsx + Footer.css
│   └── styles/
│       └── global.css      # CSS reset, body styles, @font-face declarations
```

## Components

### Navbar (`src/components/Navbar/`)
- Fixed top navigation bar (absolute positioned, overlays Hero)
- Contains: brand logo, nav links (About, Contact), social icons (X, Discord), "Coming Soon" CTA button
- Social links currently use placeholder URLs

### Hero (`src/components/Hero/`)
- Full-viewport (`100vh`) hero section with gradient background (`#f5f5f5 → #e9e9ff`)
- Contains: main headline, subtitle, "Get Early Access" button
- Mascot image on the right with floating + fade-in animations
- Unused CSS classes: `.hero-bg-logo`, `.secondary` button

### Footer (`src/components/Footer/`)
- Simple copyright bar: "© 2026 Nemai. All rights reserved."
- Dark background (`#111`) with white text

## Styling Conventions
- **Component styles are co-located**: each component has its own `.css` file in the same folder
- **Global reset and fonts** are in `src/styles/global.css` (imported by `main.jsx`)
- **Custom font**: "AllumiSTD" loaded via `@font-face` — used throughout all components
- **No CSS modules or CSS-in-JS** — plain class-based CSS
- **Design tokens**: black/white primary palette, pill-shaped buttons (`border-radius: 999px`), hover lift effects (`translateY(-2px)`)

## Dev Commands
```bash
npm install     # Install dependencies
npm run dev     # Start Vite dev server
npm run build   # Production build
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Known Issues & Notes
- `index.css` and `App.css` are Vite boilerplate defaults — not imported by custom code, can be removed
- Font-weight mapping in `global.css` may be swapped (bold → 400, regular → 500)
- No mobile responsiveness — no media queries exist
- Social media links use placeholder URLs
- Mascot images `NEM-86.png` and `NEM-87.png` are unused
- `react.svg` asset is unused (Vite default)

## Coding Conventions
- Functional components (no class components)
- Named exports via `export default`
- Component naming: PascalCase (e.g., `Navbar`, `Hero`, `Footer`)
- File naming: matches component name (e.g., `Hero.jsx`, `Hero.css`)
- CSS class naming: kebab-case (e.g., `hero-content`, `nav-links`, `hero-mascot`)
- Imports: CSS imported at the top of each component, assets imported as modules
