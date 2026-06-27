# COZ COMPASS — 360° Soft Solutions

Premium marketing site for **COZ COMPASS** — _Your GCC in India, without the setup._

COZ COMPASS gives global SMBs & SMEs a full India-based **Global Capability Center**
through a curated network of verified Indian providers, with COZ COMPASS as the single
accountable partner — zero capital, live in days, 40–70% lower cost.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Three.js** — the persistent 3D particle compass
- **GSAP** + ScrollTrigger — scroll-linked motion
- **Lenis** — smooth scroll (synced to the GSAP ticker)
- **CSS Modules** + global design tokens (no Tailwind)
- Fonts via `next/font` — Sora, Inter, Fraunces, JetBrains Mono

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
npm start        # serve production build
```

## Structure

```
app/          # App Router entry, layout, global styles
components/   # Hero, sections, the shared CompassStage + CompassJourney, Footer
lib/          # gsap, smooth scroll, pointer/magnetic hooks, brand tokens
docs/         # cleaned pitch-deck content (copy source)
public/       # brand logos + assets
```

The page is composed in `app/page.tsx` as ten sections: Hero → Promise → Why →
Services → How We Work → Vetted & Accountable → Who We Serve → Engagement → Book a Call
→ Footer. One shared WebGL compass travels the page, driven by `components/CompassJourney.tsx`.

See [`CLAUDE.md`](./CLAUDE.md) for the full design system and architecture notes.

## Deploy

Optimised for **Vercel** — import the repo and deploy (zero config for Next.js).

---

© COZ COMPASS — 360° Soft Solutions.
