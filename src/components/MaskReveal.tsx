import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { children?: React.ReactNode };

export const MaskReveal: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  children,
}) => {
  const frame = useCurrentFrame();

  const wipeFrames = Math.max(6, Math.min(30, Math.floor(duration / 4)));
  const wipe = interpolate(frame, [0, wipeFrames], [0, 1], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = 6 + wipe * 1500;

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />
      <AbsoluteFill style={{ clipPath: `circle(${radius}px at 50% 46%)` }}>
        {children ?? (
          <AbsoluteFill
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                backgroundColor: C.accent,
                boxShadow: `0 0 60px ${C.accentSoft}`,
                marginBottom: 48,
              }}
            />
            <SceneText text={sourceText ?? ""} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
