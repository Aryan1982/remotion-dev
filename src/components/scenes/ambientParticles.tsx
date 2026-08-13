import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING } from "../theme";

// [left%, top%, size, phase, depth] — depth drives parallax: small+slow sit in
// the far background, big+fast drift closer to the lens.
const PARTICLES: [number, number, number, number, number][] = [
  [10, 18, 7, 0, 0.4], [84, 12, 5, 1.4, 0.6], [20, 76, 6, 2.2, 0.7],
  [78, 86, 8, 3.1, 1.3], [52, 25, 4, 0.8, 1.0], [38, 58, 5, 2.8, 1.6],
  [68, 62, 3, 4.2, 0.3], [8, 46, 5, 5.1, 1.1], [30, 40, 9, 6.0, 1.5],
];

export const AmbientParticles: React.FC<{ startFrame?: number }> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame() + startFrame;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {PARTICLES.map(([left, top, size, phase, depth], index) => {
        // Foreground particles swing wider and faster; background barely moves.
        const amp = 12 + depth * 14;
        const speed = 26 + depth * 22;
        const driftY = Math.sin(frame / speed + phase) * amp;
        const driftX = Math.cos(frame / (speed * 1.6) + phase * 1.3) * amp * 0.55;
        const opacity = interpolate(
          Math.sin(frame / 42 + phase),
          [-1, 1],
          [0.03 + depth * 0.02, 0.08 + depth * 0.07],
          { easing: EASING.inOut },
        );
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: index % 2 ? C.inkSoft : C.accent,
              opacity,
              transform: `translate(${driftX}px, ${driftY}px)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `radial-gradient(${C.inkSoft} 0.6px, transparent 0.6px)`,
          backgroundSize: "9px 9px",
          transform: `translateY(${Math.sin(frame / 80) * 3}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
