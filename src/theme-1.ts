import { Easing } from "remotion";
import type { SpringConfig } from "remotion";
import type { CSSProperties } from "react";
import { displayFont, fontFamily } from "./fonts";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  QUIET LUXURY REEL — DESIGN TOKENS
 *  Single source of truth for colors, type, motion, spacing and layout.
 *  Import from here everywhere; never hardcode values in scene components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Color palette ──────────────────────────────────────────────────────────
   One cohesive direction: warm neutral. Cream base, deep charcoal ink,
   a single muted accent (dusty terracotta). Never mix in brand colors.       */

export const COLORS = {
  cream: "#F5F1EA",
  creamSoft: "#FBF9F4",
  creamDeep: "#ECE5D8",
  ink: "#1A1A1A",
  inkSoft: "#6B6359",
  inkFaint: "rgba(26, 26, 26, 0.45)",
  line: "#DDD4C6",
  lineFaint: "rgba(26, 26, 26, 0.08)",
  accent: "#C77B5C",
  accentSoft: "rgba(199, 123, 92, 0.14)",
  vignette: "rgba(26, 26, 26, 0.14)",
  white: "#FFFFFF",
} as const;

/** Short alias, used across the codebase. */
export const C = COLORS;

/* ── Fonts ─────────────────────────────────────────────────────────────────
   Global type definition: body = Inter, display = Playfair Display.
   Everything should pull from here (or TYPE), never hardcode a family.       */

export const FONTS = {
  body: displayFont,
  display: displayFont,
} as const;

/* ── Motion ────────────────────────────────────────────────────────────────
   spring(): mass 0.8–1, damping 12–15 for a soft overshoot.
   interpolate(): always with a bezier curve, never linear.                   */

export const EASING = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.55, 0.06, 0.9, 0.36),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};

export const SPRING: SpringConfig = {
  damping: 14,
  mass: 1,
  stiffness: 85,
  overshootClamping: false,
};

export const SPRING_SOFT: SpringConfig = {
  damping: 15,
  mass: 0.9,
  stiffness: 70,
  overshootClamping: false,
};

/* ── Typography ────────────────────────────────────────────────────────────
   Two-type system: Playfair Display for display/headline moments (modern,
   editorial luxury), Inter for everything else (kickers, labels, numbers,
   body). Hierarchy comes from weight + size mixing, never from a third font.
   Playfair has no light weight; 300 requests fall back to 400.              */

export const TYPE: { [name: string]: CSSProperties } = {
  h1: { fontSize: 92, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 500, fontFamily: displayFont },
  h2: { fontSize: 72, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 500, fontFamily: displayFont },
  h2s: { fontSize: 68, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 500, fontFamily: displayFont },
  h3: { fontSize: 60, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 500, fontFamily: displayFont },
  display: { fontSize: 88, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 500, fontFamily: displayFont },
  kicker: { fontSize: 26, fontWeight: 600, letterSpacing: "0.34em" },
  index: { fontSize: 26, fontWeight: 600, letterSpacing: "0.3em" },
  label: { fontSize: 26, fontWeight: 600, letterSpacing: "0.22em" },
  metricLabel: { fontSize: 22, fontWeight: 600, letterSpacing: "0.26em" },
  caption: { fontSize: 30, fontWeight: 400, letterSpacing: "0.04em" },
  number: { fontSize: 88, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 },
  percent: { fontSize: 58, fontWeight: 800, letterSpacing: "-0.02em" },
};

/* ── Spacing (px) ────────────────────────────────────────────────────────── */

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 56,
  xxl: 72,
  xxxl: 90,
} as const;

/* ── Radius & shadow ─────────────────────────────────────────────────────── */

export const RADIUS = {
  sm: 8,
  md: 16,
  card: 26,
  panel: 28,
  post: 32,
  icon: 52,
} as const;

export const SHADOWS = {
  card: "0 20px 50px rgba(26, 26, 26, 0.07)",
  panel: "0 30px 70px rgba(26, 26, 26, 0.08)",
  post: "0 40px 90px rgba(26, 26, 26, 0.10)",
  icon: "0 40px 90px rgba(26, 26, 26, 0.35)",
} as const;

/* ── Layout (reel is 1080 × 1920, 9:16) ──────────────────────────────────── */

export const LAYOUT = {
  width: 1080,
  height: 1920,
  postCard: 620,
  barRow: 640,
  metricPanel: 640,
  gridWidth: 624,
  gridCardHeight: 180,
  iconSize: 200,
} as const;

/* ── Timeline / pacing (frames @ 30fps) ────────────────────────────────────
   Scenes ~4s. 10-frame overlaps between scenes instead of hard cuts.
   The payoff scene runs longer and holds ~2s of breathing room at the end.   */

export const TIMING = {
  wordStagger: 2.5, // ~83ms between words
  wordReveal: 11, // frames for one word to fully appear
  sceneEnter: 12,
  sceneExit: 12,
  sceneOverlap: 10,
  sceneDuration: 126,
  portfolioDuration: 170,
} as const;

/* ── Ambient layer ───────────────────────────────────────────────────────── */

export const AMBIENT = {
  grainOpacity: 0.05,
  grainSpeed: 3.5,
  washOpacity: 0.085,
  washCharcoalOpacity: 0.05,
} as const;
