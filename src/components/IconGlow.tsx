import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASING, RADIUS, SHADOWS, SPRING } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { SceneText } from "./SceneText";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

export const IconGlow: React.FC<SceneProps> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = springP(frame, 12, fps, SPRING);
  const scale = 0.8 + Math.max(0, enter) * 0.2;
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.4, 0.9], {
    easing: EASING.inOut,
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
            width: 300,
            height: 300,
            transform: `rotate(${Math.sin(frame / 70) * 1.6}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 220,
              height: 220,
              borderRadius: RADIUS.icon,
              backgroundColor: C.accent,
              filter: "blur(40px)",
              transform: "translate(-50%, -50%)",
              opacity: glow * 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 200,
              height: 200,
              borderRadius: RADIUS.icon,
              backgroundColor: C.creamSoft,
              border: `1px solid ${C.line}`,
              boxShadow: SHADOWS.card,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 84,
              height: 84,
              borderRadius: RADIUS.md,
              backgroundColor: C.accent,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
