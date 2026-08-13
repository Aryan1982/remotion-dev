import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASING } from "../theme";
import { clampInterp } from "../motion";

/**
 * Back-ease: a touch of anticipation then an overshooting settle.
 * Use for single high-tension moments (headline pop, ring flash) instead
 * of a plain out-ease.
 */
export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * HeroLight — the scene's single accent moment of light.
 * A soft terracotta bloom swells in, holds, then recedes once per scene so
 * the accent is felt but never static. Opt-in; do not stack with other glows.
 */
export const HeroLight: React.FC<{
  duration?: number;
  peakAt?: number;
  size?: number;
  strength?: number;
  top?: number;
}> = ({
  duration = 150,
  peakAt = 0.45,
  size = 760,
  strength = 1,
  top = 34,
}) => {
  const frame = useCurrentFrame();
  const t = frame / Math.max(1, duration);

  const rise = clampInterp(t, 0, peakAt, 0, 1, EASING.out);
  const fall = clampInterp(t, peakAt, 1, 1, 0, EASING.inOut);
  const env = Math.min(rise, fall);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${top}%`,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle at 50% 50%, ${C.accentSoft} 0%, transparent 65%)`,
          opacity: env * strength,
          filter: "blur(46px)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Vignette — a faint inset of warm charcoal at the frame edges.
 * Draws the eye to the center without framing or borders. Breathes very slowly.
 */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breathe = 0.92 + Math.sin((frame / fps) * 0.6) * 0.08;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(118% 118% at 50% 42%, transparent 62%, ${C.vignette} 100%)`,
        opacity: breathe * strength,
        pointerEvents: "none",
      }}
    />
  );
};
