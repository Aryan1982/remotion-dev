import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, RADIUS, SHADOWS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { label?: string };

export const LowerThird: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  label,
}) => {
  const frame = useCurrentFrame();
  const text = label ?? sourceText ?? "CHAPTER";

  const inP = interpolate(frame, [10, 26], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breath = Math.sin(frame / 70) * 3;

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 240,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "22px 40px",
            backgroundColor: C.creamSoft,
            borderRadius: RADIUS.md,
            boxShadow: SHADOWS.card,
            border: `1px solid ${C.lineFaint}`,
            opacity: 0.86 + inP * 0.14,
            transform: `translateY(${breath}px)`,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: C.accent,
            }}
          />
          <span style={{ ...TYPE.label, fontFamily: FONTS.body, color: C.ink }}>
            {text.toUpperCase()}
          </span>
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
