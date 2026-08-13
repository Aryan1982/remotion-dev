# Quiet Luxury Reel — Style Blueprint

A reusable style system for Remotion reels. This is the reference for the
**"quiet luxury tech"** look: lots of negative space, one warm palette, a
two-font system (Playfair Display headlines + Inter supporting text) used
with weight contrast, and motion that feels physical.

Everything below lives in the codebase — this doc is the map. **Never
hardcode colors, type, spacing, or motion values in a component. Import the
tokens.**

---

## 1. The aesthetic

- **Nothing screams.** Negative space is the design. Elements sit calmly, never crowd.
- **One palette direction.** Warm neutral. Pick one accent and stay on it.
- **Two fonts, clear jobs.** Playfair Display for headlines (modern, editorial
  luxury); Inter for everything else — kickers, labels, numbers, body.
- **Typography does the work.** Keep copy short. Emphasize one word per line (weight 800/900), the rest light (400–500).
- **No brand logos, no stock imagery.** Everything is abstracted into shapes — rounded rects, thin lines, dots, ghost numbers.

## 2. Canvas & timeline

| Setting | Value |
| --- | --- |
| Format | 1080 × 1920 (9:16 vertical reel) |
| FPS | 30 |
| Scene length | ~126 frames (~4.2s) |
| Final/payoff scene | 170 frames (holds ~2s of breathing room) |
| Scene overlap | 10 frames (crossfade, no hard cuts) |

Timeline math lives in `src/timeline.ts`; pacing values in `TIMING` (`src/theme.ts`).

Rule of thumb for a 6-beat script:

```
intro ──> post ──> progress ──> metrics ──> callout ──> payoff
  126     126       126          126         126        170
  \_10 frame overlap between each_/
```

Each scene = one `<Sequence>` in `src/LinkedInReel.tsx`, rendered over a shared
ambient background so cuts feel continuous.

## 3. Design tokens — `src/theme.ts`

### Color — `COLORS` (alias `C`)

| Token | Value | Use |
| --- | --- | --- |
| `cream` | `#F5F1EA` | base background |
| `creamSoft` | `#FBF9F4` | card / panel surfaces |
| `creamDeep` | `#ECE5D8` | recessed areas |
| `ink` | `#1A1A1A` | primary text, icon fills |
| `inkSoft` | `#6B6359` | secondary text, kickers |
| `inkFaint` | `rgba(26,26,26,0.45)` | tertiary text |
| `line` | `#DDD4C6` | skeleton bars, dividers |
| `lineFaint` | `rgba(26,26,26,0.08)` | card borders, tracks |
| `accent` | `#C77B5C` | the single accent (dusty terracotta) |
| `accentSoft` | `rgba(199,123,92,0.14)` | glows, washes, tinted shapes |

To swap the accent for the sage alternative: change `accent` + `accentSoft`
to `#8A9A7E` and `rgba(138,154,126,0.14)` — nothing else needs to move.

### Typography — `TYPE`

Two fonts, loaded via `@remotion/google-fonts` in `src/fonts.ts`:
**Playfair Display** (`displayFont`) for headline presets, **Inter** for the rest.

| Token | Family · size / weight / tracking | Use |
| --- | --- | --- |
| `TYPE.h1` | Playfair · 92 · 500 · −0.02em | scene-opening headline |
| `TYPE.h2` | Playfair · 72 · 500 · −0.02em | standard headline |
| `TYPE.h2s` | Playfair · 68 · 500 · −0.02em | slightly smaller headline |
| `TYPE.h3` | Playfair · 60 · 500 · −0.02em | sub-headline / payoff line |
| `TYPE.display` | Playfair · 88 · 500 · −0.02em | big single-line statement |
| `TYPE.kicker` | Inter · 26 · 600 · +0.34em | uppercase section label |
| `TYPE.index` | Inter · 26 · 600 · +0.30em | "01" style indexes |
| `TYPE.label` | Inter · 26 · 600 · +0.22em | card labels |
| `TYPE.metricLabel` | Inter · 22 · 600 · +0.26em | under-numbers labels |
| `TYPE.caption` | Inter · 30 · 400 · +0.04em | quiet footer line |
| `TYPE.number` | Inter · 88 · 800 · −0.03em | counting metrics |
| `TYPE.percent` | Inter · 58 · 800 · −0.02em | progress percentages |

Headline emphasis words go to weight 900 (e.g. `w("portfolio.", { fontWeight: 900 })`).
Playfair has no light cut, so `fontWeight: 300` inside a headline falls back to 400.

### Spacing — `SPACING`
`xs 8 · sm 16 · md 24 · lg 40 · xl 56 · xxl 72 · xxxl 90`

### Radius — `RADIUS`
`sm 8 · md 16 · card 26 · panel 28 · post 32 · icon 52`

### Shadows — `SHADOWS`
Soft, warm-toned greys. `card 0 20px 50px · panel 0 30px 70px · post 0 40px 90px · icon 0 40px 90px`.

### Layout — `LAYOUT`
`width 1080 · height 1920 · postCard 620 · barRow 640 · metricPanel 640 · gridWidth 624 · gridCardHeight 180 · iconSize 200`.

### Ambient — `AMBIENT`
`grainOpacity 0.05 · grainSpeed 3.5 · washOpacity 0.085 · washCharcoalOpacity 0.05`.

## 4. Motion language

Two primitives in `src/motion.ts` + `src/theme.ts`:

- **`springP(frame, start, fps, config)`** — entrances. Use `SPRING`
  (damping 14, mass 1) or `SPRING_SOFT` (damping 15, mass 0.9). The slight
  overshoot is the point — never `overshootClamping: true`.
- **`clampInterp(frame, from, to, a, b, easing)`** — continuous motion.
  Default easing `easeOut` = `bezier(0.16, 1, 0.3, 1)`. Never linear.

Rules:

1. **Word reveals** — fade + rise + blur-to-focus, staggered ~2.5 frames
   (`TIMING.wordStagger`). Use `<RevealLines>` or the per-scene `reveal()` helper.
2. **Entrances** — spring in with translate + scale. Overshoot settles.
3. **Count-ups** — `springP` over the target so numbers briefly overshoot then settle.
4. **Progress bars** — spring fill, plus a blurred glow pill at the leading edge.
5. **Draw-ons** — underlines scale from 0 (`transformOrigin: "left center"`), graph lines via `strokeDashoffset`.
6. **Micro-interactions** — pulsing dots, expanding ripple rings, cursor press.
7. **Ambient life** — a global `<Background>` (drifting washes, floating particles)
   and `<GrainOverlay>` sit under/over every scene so nothing ever freezes.
8. **Transitions** — `<SceneFrame>` crossfades each scene in/out over `TIMING.sceneEnter`/`sceneExit`.
9. **Breathing room** — let a beat land, then pause 0.3–0.5s before the next.

## 5. Component architecture

```
src/
├── theme.ts          ← all design tokens (colors, type, springs, spacing, radius, shadows, layout, timing, ambient)
├── fonts.ts          ← Inter + Playfair Display via @remotion/google-fonts
├── motion.ts         ← easing re-exports, springP, clampInterp, useSpringProgress
├── timeline.ts       ← scene durations, starts, overlaps, total length
├── LinkedInReel.tsx  ← root: Background + <Sequence> per scene + GrainOverlay
└── components/
    ├── Background.tsx     ← ambient washes, rings, floating particles
    ├── Grain.tsx          ← film grain overlay
    ├── SceneFrame.tsx     ← per-scene enter/exit crossfade wrapper
    ├── RevealLines.tsx    ← word-by-word reveal + `w()` helper
    ├── Kicker.tsx         ← uppercase section label
    ├── IntroScene.tsx     ← text-only hook
    ├── PostCard.tsx       ← abstract post card
    ├── ProgressBars.tsx   ← progress with glow edge
    ├── MetricsCounter.tsx ← overshoot count-ups + self-drawing graph
    ├── IconPulse.tsx      ← abstract icon + cursor click
    └── PortfolioGrid.tsx  ← final card grid
```

Scene conventions:

- Each scene renders inside `<SceneFrame durationInFrames={...}>`.
- Each scene owns one script beat. File = scene, e.g. `PostCard.tsx`.
- Ghost/parallax shapes are placed `position: absolute` inside the scene
  `AbsoluteFill` and drift with `Math.sin(frame / 30 * k)`.
- Kicker + headline + (shape) is the standard layout rhythm.

## 6. Building the next video (checklist)

1. Read the script, split it into beats, write 1 short English line per beat.
2. Pick scene order in `src/LinkedInReel.tsx`; set durations in `src/timeline.ts`.
3. Create a scene component in `src/components/`:
   - Wrap in `<SceneFrame>`.
   - Add a `<Kicker>` + a `<RevealLines>` headline.
   - Pull every value from `COLORS`/`TYPE`/`RADIUS`/`SHADOWS`/`SPACING`/`LAYOUT`.
   - Animate entrances with `springP`, continuous motion with `clampInterp`.
4. Keep one accent word per headline at weight 900.
5. Verify with `npm run lint` and `npx remotion still LinkedInReel --frame=...`.
6. Render: `npx remotion render LinkedInReel`.

## 7. Do / don't

**Do** — negative space · one accent · spring overshoot · word-by-word reveals ·
blur-to-focus · glow edges · ambient motion · breathing pauses.

**Don't** — brand colors/logos · emojis · a third font · linear easing ·
hard cuts · stock imagery · crowding the frame.
