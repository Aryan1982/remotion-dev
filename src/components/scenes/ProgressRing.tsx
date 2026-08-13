import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { SceneText } from "./SceneText";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

const SIZE = 520;
const CENTER = SIZE / 2;

export const ProgressRing: React.FC<SceneProps> = ({
  variant = "fill",
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, duration], [0, 1], {
    easing: EASING.inOut,
    extrapolateRight: "clamp",
  });
  const rings = variant === "double-fill" ? [200, 132] : [200];

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
            transform: `rotate(${Math.sin(frame / 70) * 1.4}deg)`,
          }}
        >
          {rings.map((radius, i) => {
            const angle = p * Math.PI * 2;
            const gx = CENTER + radius * Math.cos(angle);
            const gy = CENTER + radius * Math.sin(angle);
            return (
              <svg
                key={radius}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                width={SIZE}
                height={SIZE}
                style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  fill="none"
                  stroke={i ? C.inkFaint : C.line}
                  strokeWidth="6"
                />
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  fill="none"
                  stroke={i ? C.inkSoft : C.accent}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * radius}
                  strokeDashoffset={2 * Math.PI * radius * (1 - p)}
                />
                <circle cx={gx} cy={gy} r="22" fill={i ? C.inkSoft : C.accent} fillOpacity={i ? "0.18" : "0.28"} />
                <circle cx={gx} cy={gy} r="9" fill={i ? C.inkSoft : C.accent} />
              </svg>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: C.ink,
              transform: "translate(-50%, -50%)",
              opacity: 0.8,
            }}
          />
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
