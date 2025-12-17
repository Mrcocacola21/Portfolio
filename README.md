# Anime Dark Portfolio (GitHub Pages ready)

## What you get
- 1-page portfolio: anchors, sections, anime vibe (dark + neon)
- High FX on desktop (GSAP + ScrollTrigger, Lenis, SplitType, VanillaTilt)
- Respects `prefers-reduced-motion` (animations/Lenis/canvas are disabled)
- No build tools. CDN only.

## How to deploy on GitHub Pages
1. Create a repo (or use an existing one).
2. Put these files in the repo root:
   - `index.html`
   - `styles.css`
   - `main.js`
   - `assets/` folder
3. GitHub → Settings → Pages → Deploy from branch → `main` / `(root)`.

## Customize
- Edit text directly in `index.html` (links + contacts).
- For bilingual micro-texts: edit `i18n` in `main.js`.
- Replace gallery images:
  - `assets/waifu-1.svg`, `waifu-2.svg`, `waifu-3.svg`
  - keep aspect ratio `16:10` for perfect fit.

## OG image
For best link previews:
- set `og:image` to an **absolute URL**:
  `https://mrcocacola21.github.io/Portfolio/assets/og.png`
