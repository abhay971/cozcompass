# COZ COMPASS — Website

Premium marketing site for **COZ COMPASS — 360° Soft Solutions**. Built with Next.js
(App Router) + TypeScript, with awwwards-tier motion using **GSAP** and **Three.js**.

> **Product:** COZ COMPASS — 360° Soft Solutions
> **One-liner / hero:** Your GCC in India, without the setup.
> **Tagline:** From Vision to Execution — From Design to Delivery — From Lead to Logistics.

### ⚠️ Content sourcing rule

The site uses the deck **`COZ COMPASS - 360 Soft Solutions.pptx`** (repo root),
cleaned into **`/docs/deck-content.md`** — the source of truth for all copy & stats.
**Slides 1–3 are the parent company (COZ CLUB) and are intentionally excluded** (the
"Good/Better/Best", Purpose/Principles, and "Club of Soft Solutions" slides — incl.
the parent's "Connect/Consult/CoServe/Capitalize" framing). Do **not** invent stats
and do **not** pull copy from slides 1–3.

---

## 1. What the company does (read before writing copy)

COZ COMPASS gives global **SMBs / SMEs** a full India-based **GCC (Global Capability
Center)** _without_ the cost, legal, and operational burden of setting one up. It does
this through a **curated network of verified Indian service providers**, with COZ
COMPASS as the **single accountable partner** managing delivery end-to-end.

**The pitch (deck S4–S8, validated against the market):**

- Traditional GCC = $1.2M–$6M capital, 200+ FTE minimum, 12–18 month setup. Out of
  reach for SMBs/SMEs → "the SMB/SME GCC gap."
- COZ COMPASS answer: **zero capital**, pay only for services, **live in days not
  months**, 40–70% lower cost, start with one service and scale to a full GCC.
- Offer spans **six service pillars** (not just tech): Information Technology, Sales &
  Marketing, Finance & Accounting, Human Resources, Supply Chain Management, R&D.

**Distinct vs. competitors** (ANSR, The Scalers, Rishabh, Inductus, Sansovi, Wisemonk):
those mostly build *captive tech teams for enterprises*; COZ COMPASS is **SMB-focused,
multi-function, and provider-curated**. See web notes in `docs/deck-content.md`.

---

## 2. Brand system

### ⚠️ Section division system (every light section MUST be visually distinct)

Sections were blending together (same background, no borders). The rule now:
- **Light sections are CONSISTENTLY white** `var(--surface)` — do NOT alternate bg colours
  (user disliked the white/grey alternation). Division comes from: the **dark↔light contrast**,
  a **`border-top: 1px solid var(--line-strong)`** on each light section, and the big
  full-width heading + numbered eyebrow at the top.
- **Section headings + descriptions are FULL-WIDTH** (user requirement) — eyebrow + a big
  headline (`~clamp(42px, 6vw, 92px)`) AND the sub-description both span the container; NO
  `max-width` boxing them into a narrow left column. Body/grid sits full-width below.

### ⚠️ Shared 3D compass (`CompassStage`)

There is exactly ONE 3D particle compass for the whole site — `components/CompassStage.tsx`,
fixed/full-screen at `z-0` with a dark base, which eases toward `compass.target`.

**Where it sits is driven by ONE controller: `components/CompassJourney.tsx`.** It holds an
ordered list of per-section ANCHORS (`{ id, target }`, desktop + mobile). The compass is
**PINNED at the active section's anchor while that section is in view** (it does NOT drift as
you scroll within a section — user requirement), and only **moves during a short transition
band** (`BAND ≈ 0.6 × viewport`) around the boundary between two sections. It's a pure
function of scroll, so it behaves identically up and down — no trigger races, no leftover
positions (this fixed the "scroll-up compass misaligned" bug). Light sections use `opacity: 0`
anchors. **To position the compass in a NEW section, ADD AN ANCHOR to CompassJourney's list**
(keyed by the section's `id`) — do NOT write `setCompassTarget` ScrollTriggers inside section
components (they race, only fire on entry, and drift the compass mid-section).

The splash owns the compass (centred) until reveal — gated by `compass.live` (false during
splash, set true at the hand-off). `compass.live` must be set true in every splash exit path.
The hero registers `compass.headingEl` for the HUD readout. **Never create a second WebGL
compass.** Dark sections are **transparent** (stage shows through); light sections sit
**opaque** on top. Vary the compass position per section for visual interest (hero right,
promise right, process left/lower/larger, …).

**Readability scrim is PER-SECTION, matching the content side** (NOT on the fixed stage —
a fixed left-dark scrim dimmed a left-placed compass and made it look washed out). Each
dark section adds its own `.scrim` div: **left-dark** where content is on the left
(`linear-gradient(90deg, …0.88 → 0)`), **right-dark** (`270deg`) where content is on the
right (so a left compass stays bright). Adjacent dark sections (hero ↔ promise) MUST use
the **identical** scrim gradient or a seam appears at the boundary. The ambient glows stay
on the fixed stage (soft, no seam). Keep the compass clear of the heading (drop it lower /
bleed it off-edge) since headings are full-width and left-aligned.

### ⚠️ Theme: LIGHT default, with some DARK "compass" sections

The body is a **clean off-white / modern-minimal** theme — that's the consistent default.
**Some sections may be dark** for rhythm (these are the transparent "compass" sections that
reveal the CompassStage behind them). The hero is dark. Don't make *everything* dark.

**Brand colours only — and NO red anywhere.** Palette is restricted to the brand
accents + neutrals. Never introduce off-brand colours (the old red `--red` was removed
on the user's instruction).

### Colours (defined in `app/globals.css` as CSS vars — keep in sync)

```
LIGHT (body — use these for all sections except hero):
  --paper #F4F5F7 (page bg) · --paper-soft #ECEEF1 · --surface #FFFFFF (cards)
  --ink-900 #0E1116 (text) · --ink-700 #39414B · --ink-500 #6B7280 (muted) · --ink-300 #A7ADB6
  --line / --line-strong  (hairline borders on light)

BRAND ACCENTS (sparingly, on either theme):
  --orange #FF7F32 (primary) · --blue #298FC2 · --green #6CC24A
  --orange-soft #FF8A45 · --blue-soft #4FA2D6

DARK (hero only): --ink #0A0C0E · --ink-deep #07090B · --panel · --text/-bright/-hi · --muted*
```

Premium minimal: lots of whitespace, charcoal type on off-white, soft large shadows
for depth, accents used as signal — never as big fills. On light, "win" states
(e.g. the COZ COMPASS card) get an orange accent + warm orange shadow glow; ✓ = green.
Negative/old-way states use neutral greys (NOT red).

### Typography (loaded via `next/font/google` in `app/layout.tsx`)

| Role                      | Family             | CSS var          |
| ------------------------- | ------------------ | ---------------- |
| Display headlines         | **Sora** (800)     | `--f-display`    |
| Italic accent words       | **Fraunces** (italic) | `--f-serif`   |
| Body / paragraphs         | **Inter**          | `--f-body`       |
| Labels, mono, HUD numbers | **JetBrains Mono** | `--f-mono`       |

Signature headline treatment: a large Sora phrase with a key word swapped to **Fraunces
italic** in an accent colour (e.g. _"Built for **giants**. Made for **you**."_). Keep
it clean — outlined `-webkit-text-stroke` glyphs are reserved for the dark hero only; on
light surfaces use solid colour, never thin outlines (they read as cheap).

### Voice

Confident, precise, "navigation/compass" metaphors (true north, heading, calibrate).
Premium but plain-spoken. B2B, aimed at founders/ops leaders of 5–500-person firms.

---

## 3. Tech stack & commands

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **three** (npm, not CDN) for WebGL particle systems
- **gsap** (npm) for magnetic UI, counters, timeline animation
- Styling: **CSS Modules** per component + global tokens/keyframes in `app/globals.css`.
  (No Tailwind — exact design fidelity via scoped CSS.)
- Fonts via `next/font` (self-hosted, no layout shift)

```bash
npm run dev      # local dev (http://localhost:3000)
npm run build    # production build + type check
npm start        # serve production build
```

---

## 4. Architecture & conventions

```
app/
  layout.tsx        # fonts, metadata, <html> shell
  page.tsx          # composes sections (server component)
  globals.css       # tokens, reset, keyframes, reveal utilities
components/
  Noise.tsx         # global film-grain overlay
  SmoothScroll.tsx  # Lenis smooth scroll, synced to GSAP ticker (mounted in layout)
  CompassStage.tsx  # THE single persistent 3D particle compass (fixed, full-screen, z-0)
  hero/
    Hero.tsx        # orchestrates the hero (client)
    CustomCursor.tsx   # dot + lagging ring (desktop only)
    SplashScreen.tsx   # splash: drives the shared compass (center→hero) + wordmark reveal
    Nav.tsx
  sections/
    Gap.tsx         # "The SMB/SME Gap" before/after comparison (client)
lib/
  brand.ts          # colour tokens + content constants
  gsap.ts           # gsap + ScrollTrigger, registered once (import from here)
  smoothScrollTo.ts # scroll to a section id via Lenis (nav/CTA links)
  usePointer.ts     # global pointer state in a ref (no re-renders)
  useMagnetic.ts    # GSAP magnetic-hover hook
  useIsomorphicLayoutEffect.ts  # layout effect on client (no FOUC), effect on server
docs/
  deck-content.md   # full pitch-deck text (source for section copy)
public/assets/      # logo etc.
```

### Rules of the road

1. **Never re-render on pointer move.** Mouse state lives in `usePointer`'s ref;
   animation loops read it inside their own `requestAnimationFrame`. Don't lift
   pointer position into React state.
2. **One rAF per concern, paused when offscreen.** Every canvas/loop must use an
   `IntersectionObserver` to stop work when not visible, and clean up on unmount
   (`cancelAnimationFrame`, dispose Three.js geometries/materials/renderer).
3. **Respect `prefers-reduced-motion`.** Static fallbacks already exist in
   `globals.css` and `CompassCanvas`; honour it in new motion too.
4. **Mobile-first reality.** Custom cursor and heavy particle counts are gated by
   `(hover: hover) and (pointer: fine)` / screen width. Scale `three` particle
   counts down on small screens (`Q` multiplier in `CompassCanvas`).
5. **CSS Modules for layout, inline styles only for dynamic/computed values.**
   Brand colours come from CSS vars (`var(--orange)`), not hard-coded hex in JSX.
6. **Reveal pattern:** add `data-reveal` (or `data-fade`/`data-line` inside the hero
   `.is-lit` root) and let CSS handle the transition. A scroll `IntersectionObserver`
   utility should add `.in` for sections below the fold.
7. **Scroll animation pattern (follow `Gap.tsx`).** Client component, `import { gsap }
   from "@/lib/gsap"`, run setup in `useIsomorphicLayoutEffect` (no FOUC) inside a
   `gsap.context(self => …, rootRef)` that you `ctx.revert()` on cleanup. Use
   `gsap.matchMedia()` with THREE branches: desktop (`(min-width:901px) and
   (prefers-reduced-motion: no-preference)`) = the rich/pinned motion; mobile
   (`(max-width:900px) and (prefers-reduced-motion: no-preference)`) = simpler stacked
   reveals; reduced-motion = no branch (static final state). Animate transforms/opacity
   only; `will-change: transform`. Lenis smooth scroll is global (`SmoothScroll.tsx`) and
   already synced to the GSAP ticker, so ScrollTrigger + pin/scrub just work.
   **Every section should have its own scroll-driven moment** — aim for awwwards-level
   (pinned scroll-theatre, kinetic oversized type, masked reveals, parallax), not plain
   fades. See the Gap section as the reference bar.
8. **Accessibility:** real `<button>`/`<a>` for interactions, `aria-hidden` on
   decorative canvas/cursor/noise, keep colour contrast on text surfaces.

---

## 5. Performance budget

- Keep the hero's first-load JS dominated by `three`; **lazy-load** WebGL for
  below-the-fold sections (`next/dynamic`, `ssr: false`) so they don't inflate the
  initial bundle.
- `renderer.setPixelRatio(Math.min(dpr, 1.5))` — never render at full retina DPR.
- Prefer transforms/opacity for animation; avoid animating layout properties.
- Use `next/image` for raster assets; SVG inline where possible.
- Target: smooth 60fps on a mid M-series / modern laptop, graceful degradation on mobile.

---

## 6. Build-out roadmap (sections, in deck order)

**COZ COMPASS-first plan** (agreed with user). Goal: sell COZ COMPASS, NOT teach "what is
a GCC". GCC/India facts are a thin proof strip only. **Light is the default; a few DARK
"compass" sections** (transparent over `CompassStage`) carry the 3D compass on scroll.
Old `Gap.tsx`/`Gcc.tsx` are **unmounted** (kept in components/sections for reference only).

| # | Section | id | BG | Deck | Status / notes |
|---|---------|----|----|------|----------------|
| 1 | **Hero** | — | dark·compass | — | ✅ Your GCC in India, without the setup |
| 2 | **The COZ COMPASS Promise** | `promise` | dark·compass | S7 | ✅ `CozPromise.tsx` — "One accountable partner." + 5 pillars; compass follows from hero to the right edge, drifts on scroll |
| 3 | **Why COZ COMPASS** | `why-us` | light | S8 | ✅ `WhyUs.tsx` — **bento grid** of 8 differentiators (varied widths, oversized numbers, 3 featured cards on subtle solid brand-colour blocks orange/blue/green, hover lift); compass fades out (paused) while on this light section. (User rejected a plain sticky list; chose bento.) |
| 4 | **What we deliver** | `services` | light | S10–16 | ✅ `Services.tsx` — **accordion explorer**: 6 pillars (IT/blue, Sales/orange, Finance/green, HR, Supply Chain, R&D) each expands to a 3-col service grid with its brand accent; +/- icons, grid-rows expand trick. Compass paused while here. |
| 5 | **How COZ COMPASS works** | `process` | dark·compass | S9 | ✅ `Process.tsx` — full-width "From align to scale." + vertical timeline (Align→Curate→Structure→Execute→Scale) with orange nodes & a line that draws on scroll; compass fades back in on the right and **descends through the steps** as you scroll. Mobile = faint centered backdrop. |
| 6 | **Vetted & accountable** | `vetting` | light | S17 | ✅ `Vetting.tsx` — horizontal **4-stage pipeline** (Discover/blue→Assess/orange→Verify/green→Onboard) with a brand-gradient rail that draws on scroll + numbered nodes; then an orange **accountability band** ("Onboarded isn't the finish line." + SLAs/KPIs/QA). Distinct from Process's vertical timeline. |
| 7 | **Who we serve** | `markets` | light | S18 | ✅ `Markets.tsx` — full-width heading + 6-region **geographies grid** (flags) + a 2-col split: orange "Sound like you?" ideal-client checklist (green checks) and a sectors pill cloud. |
| 8 | **Flexible engagement** | `pricing` | light | S19 | ✅ `Pricing.tsx` — 3 **editorial full-width rows** (Project/Retainer/Outcome): big Sora names, hairline dividers, "Best for" list, hover reveals an accent bar + arrow. (Redesigned from childish colour-bar cards.) No invented prices. |
| 9 | **Book a call** (CTA) | `contact` | dark·compass | — | ✅ `CTA.tsx` — centred conversion, compass **settles centred** (journey's final visible anchor) behind a radial scrim; "Find your *true north*." + Book-a-call mailto + email + assurances. |
| 10 | **Footer** | `footer` | **dark** | — | ✅ `Footer.tsx` — **dark bold closing** (user choice; flows from the dark CTA). White logo, big "Let's chart your *course*." + email-with-arrow, Explore nav, oversized faded "COZ COMPASS" mark (solid faint white fill), warm glow, legal + back-to-top. Opaque dark (covers the compass). |

**Site is feature-complete** (all 10 sections built). **Brand logo** lives at `public/assets/coz-compass-white.png` (for dark surfaces — used in `Nav`) and `coz-compass-dark.png` (for light — used in `Footer`); both are the wordmark with the orange/blue/green swirl as the "O". Remaining = polish/QA, OG image, copy review.

> ⚠️ **Reveal-attribute gotcha:** `data-line` / `data-fade` are HERO-ONLY (scoped under
> `.hero-reveals` in globals.css; hidden until `.is-lit`). In any OTHER section, use your
> OWN attr names for GSAP reveals (e.g. `data-rline` / `data-rfade`, see `CozPromise.tsx`).
> Reusing the hero names pins your elements invisible.

### Competitive landscape (researched — for positioning, not copying)

Same-model players: **ANSR** (GCC-as-a-Service), **The Scalers**, **Rishabh Software**,
**Inductus GCC**, **Sansovi**, **Wisemonk**, **VLink**, **Clarion**. Market hero shape:
tight headline → benefit subhead → 1 strong CTA → proof stats/trust strip → how-it-works
→ proof → conversion. They sell speed (days/weeks vs 12–24mo), no-capex, 30–70% savings,
one accountable partner — all of which the deck supports. **Stay distinct:** SMB-focused,
multi-function, provider-curated, compass/navigation identity.

---

## 7. When adding a section — checklist

- [ ] Copy/stats sourced from `docs/deck-content.md` (no invented numbers)
- [ ] Brand colours via CSS vars; fonts via the four families above
- [ ] CSS Module for layout; responsive at 1024 / 760 / 400 breakpoints
- [ ] Motion respects `prefers-reduced-motion`; loops pause offscreen + clean up
- [ ] Heavy WebGL lazy-loaded with `next/dynamic`
- [ ] Section has an `id` matching the nav target if linked
- [ ] `npm run build` passes (type check) before considering it done
