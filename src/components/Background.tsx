import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AMBIENT, C } from "../theme";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  color: string;
  opacity: number;
};

const PARTICLES: Particle[] = [
  {
    x: 12,
    y: 16,
    size: 5,
    speed: 0.4,
    drift: 26,
    phase: 0,
    color: C.accent,
    opacity: 0.16,
  },
  {
    x: 87,
    y: 10,
    size: 3,
    speed: 0.55,
    drift: 18,
    phase: 1.3,
    color: C.ink,
    opacity: 0.12,
  },
  {
    x: 21,
    y: 72,
    size: 4,
    speed: 0.35,
    drift: 30,
    phase: 2.1,
    color: C.accent,
    opacity: 0.12,
  },
  {
    x: 79,
    y: 84,
    size: 6,
    speed: 0.3,
    drift: 22,
    phase: 3.4,
    color: C.ink,
    opacity: 0.1,
  },
  {
    x: 55,
    y: 28,
    size: 3,
    speed: 0.5,
    drift: 16,
    phase: 0.7,
    color: C.ink,
    opacity: 0.1,
  },
  {
    x: 38,
    y: 57,
    size: 4,
    speed: 0.45,
    drift: 20,
    phase: 2.6,
    color: C.accent,
    opacity: 0.12,
  },
  {
    x: 66,
    y: 62,
    size: 2,
    speed: 0.6,
    drift: 14,
    phase: 4.0,
    color: C.ink,
    opacity: 0.14,
  },
  {
    x: 8,
    y: 44,
    size: 5,
    speed: 0.33,
    drift: 24,
    phase: 5.1,
    color: C.accent,
    opacity: 0.1,
  },
  {
    x: 92,
    y: 50,
    size: 3,
    speed: 0.48,
    drift: 20,
    phase: 0.9,
    color: C.ink,
    opacity: 0.1,
  },
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Parallax depth: every layer drifts and breathes at its own rate.
  // The farther back a layer sits, the slower and subtler its motion.
  const s1 = 1 + Math.sin(t * 0.09) * 0.05;
  const s2 = 1 + Math.sin(t * 0.13 + 1.3) * 0.04;
  const s3 = 1 + Math.sin(t * 0.17 + 2.5) * 0.035;

  const gx1 = 30 + Math.sin(t * 0.2) * 16;
  const gy1 = 24 + Math.sin(t * 0.17 + 2) * 12;
  const gx2 = 72 + Math.sin(t * 0.13 + 4) * 18;
  const gy2 = 76 + Math.cos(t * 0.15) * 14;
  const gx3 = 50 + Math.sin(t * 0.07 + 1) * 12;
  const gy3 = 50 + Math.cos(t * 0.06 + 3) * 10;

  const ringY = Math.sin(t * 0.1) * 26;
  const ringScale = 1 + Math.sin(t * 0.06) * 0.02;

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.cream, overflow: "hidden" }}
      durationInFrames={893}
    >
      {/* Deepest layer: soft cream highlight breathing the slowest */}
      <AbsoluteFill
        style={{
          transform: `scale(${s1})`,
          background: `radial-gradient(70% 55% at ${gx3}% ${gy3}%, ${C.creamSoft}, transparent 70%)`,
        }}
      />
      {/* Mid layers: the accent + charcoal washes at their own pace */}
      <AbsoluteFill
        style={{
          transform: `scale(${s2})`,
          background: `radial-gradient(65% 48% at ${gx1}% ${gy1}%, rgba(199,123,92,${AMBIENT.washOpacity}), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${s3})`,
          background: `radial-gradient(55% 42% at ${gx2}% ${gy2}%, rgba(26,26,26,${AMBIENT.washCharcoalOpacity}), transparent 70%)`,
        }}
      />
      {/* Decorative rings — quiet geometry, each breathing on its own */}
      <div
        style={{
          position: "absolute",
          right: -170,
          top: "-6%",
          width: 430,
          height: 430,
          border: "1px solid rgba(26,26,26,0.055)",
          borderRadius: "50%",
          transform: `translate(0px, ${ringY}px) scale(${ringScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -120,
          bottom: "-4%",
          width: 300,
          height: 300,
          border: "1px solid rgba(199,123,92,0.09)",
          borderRadius: "50%",
          transform: `translate(0px, ${-ringY * 0.6}px) scale(${2 - ringScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-2%",
          bottom: "16%",
          width: 210,
          height: 210,
          border: "1px solid rgba(26,26,26,0.04)",
          borderRadius: "50%",
          transform: `translate(0px, ${ringY * 0.4}px)`,
        }}
      />
      {PARTICLES.map((p, i) => {
        const x =
          p.x + Math.cos(t * p.speed * 0.4 + p.phase * 1.7) * p.drift * 0.5;
        const y = p.y + Math.sin(t * p.speed * 0.6 + p.phase) * p.drift;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
