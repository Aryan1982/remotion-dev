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

export const SignalRipple: React.FC<SceneProps> = ({
  variant = "single",
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycles = variant === "heartbeat" ? 3 : 1;
  const cycle = duration / cycles;
  const local = frame % cycle;

  const rise = springP(local, 10, fps, SPRING_SOFT);
  const ripple = interpolate(local, [cycle * 0.3, cycle], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotTop = `${72 - rise * 24}%`;
  const ringSize = 40 + ripple * 640;

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
            width: 760,
            height: 760,
            transform: `rotate(${Math.sin(frame / 70) * 1.4}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: dotTop,
              width: 130,
              height: 130,
              borderRadius: "50%",
              backgroundColor: C.accent,
              filter: "blur(30px)",
              transform: "translate(-50%, -50%)",
              opacity: Math.max(0, rise) * 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: dotTop,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: C.accent,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: dotTop,
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: `1.5px solid ${C.inkFaint}`,
              transform: "translate(-50%, -50%)",
              opacity: (1 - ripple) * 0.45,
            }}
          />
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
