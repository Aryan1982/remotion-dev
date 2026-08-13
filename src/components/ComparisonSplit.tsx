import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASING, FONTS, RADIUS, SHADOWS, SPRING_SOFT, TYPE } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { left?: string; right?: string };

const Panel: React.FC<{ title: string; offset: number }> = ({ title, offset }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: C.creamSoft,
      borderRadius: RADIUS.card,
      boxShadow: SHADOWS.card,
      padding: "56px 40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transform: `translateX(${offset}px)`,
    }}
  >
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: RADIUS.sm,
        backgroundColor: C.accent,
        marginBottom: 32,
        opacity: 0.85,
      }}
    />
    <span
      style={{
        ...TYPE.h3,
        fontFamily: FONTS.display,
        color: C.ink,
        textAlign: "center",
      }}
    >
      {title}
    </span>
  </div>
);

export const ComparisonSplit: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  left = "BEFORE",
  right = "AFTER",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideL = springP(frame, 10, fps, SPRING_SOFT);
  const slideR = springP(frame, 16, fps, SPRING_SOFT);
  const vs = interpolate(frame, [34, 46], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breath = Math.sin(frame / 60) * 3;

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
            display: "flex",
            alignItems: "center",
            gap: 32,
            width: 960,
            transform: `translateY(${breath}px)`,
          }}
        >
          <Panel title={left} offset={(1 - slideL) * -110} />
          <div style={{ opacity: vs, transform: `scale(${vs})`, flexShrink: 0 }}>
            <span style={{ ...TYPE.index, fontFamily: FONTS.body, color: C.accent }}>
              VS
            </span>
          </div>
          <Panel title={right} offset={(1 - slideR) * 110} />
        </div>
        {sourceText ? (
          <div style={{ marginTop: 72 }}>
            <SceneText text={sourceText} />
          </div>
        ) : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
