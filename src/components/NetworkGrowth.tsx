import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASING, SPRING_SOFT } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { SceneText } from "./SceneText";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

const SIZE = 900;
const NODES: [number, number][] = [
  [450, 450],
  [200, 280],
  [700, 260],
  [190, 640],
  [700, 660],
  [450, 120],
  [450, 780],
];

export const NetworkGrowth: React.FC<SceneProps> = ({
  variant = "outward",
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inward = variant === "inward";
  const p = interpolate(frame, [0, duration], [0, 1], {
    easing: EASING.out,
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: SIZE,
            height: SIZE,
            transform: `translateY(${Math.sin(frame / 60) * 6}px)`,
          }}
        >
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width={SIZE}
            height={SIZE}
            style={{ position: "absolute", inset: 0 }}
          >
            {NODES.slice(1).map((node, i) => {
              const from = inward ? node : NODES[0];
              const to = inward ? NODES[0] : node;
              return (
                <line
                  key={i}
                  x1={from[0]}
                  y1={from[1]}
                  x2={to[0]}
                  y2={to[1]}
                  stroke={C.inkFaint}
                  strokeWidth="1.5"
                  opacity={p * 0.7}
                />
              );
            })}
          </svg>
          {NODES.map(([x, y], i) => {
            const pop = springP(frame, 6 + i * 4, fps, SPRING_SOFT);
            const scale = 0.5 + Math.max(0, pop) * 0.5;
            const size = i === 0 ? 34 : 20;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(x / SIZE) * 100}%`,
                  top: `${(y / SIZE) * 100}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  backgroundColor: i === 0 ? C.accent : C.inkSoft,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                }}
              />
            );
          })}
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
