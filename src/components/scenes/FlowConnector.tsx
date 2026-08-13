import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { source?: string; target?: string };

const W = 900;
const H = 380;
const CY = H / 2;

export const FlowConnector: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  source = "A",
  target = "B",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, duration * 0.72], [0, 1], {
    easing: EASING.inOut,
    extrapolateRight: "clamp",
  });
  const head = interpolate(frame, [duration * 0.55, duration * 0.72], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sourceIn = interpolate(frame, [8, 22], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breath = Math.sin(frame / 60) * 4;

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
            width: W,
            height: H,
            transform: `translateY(${breath}px)`,
          }}
        >
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <path
              d={`M 56 ${CY} Q 450 30 850 ${CY}`}
              fill="none"
              stroke={C.inkFaint}
              strokeWidth="2"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - p}
            />
            <g opacity={head} transform={`translate(850, ${CY})`}>
              <polygon points="0,-13 24,0 0,13" fill={C.accent} />
            </g>
          </svg>

          <div
            style={{
              position: "absolute",
              left: 20,
              top: CY - 16,
              opacity: sourceIn,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: C.accent,
                boxShadow: `0 0 40px ${C.accentSoft}`,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: CY + 44,
              textAlign: "center",
            }}
          >
            <span style={{ ...TYPE.metricLabel, fontFamily: FONTS.body, color: C.inkSoft }}>
              {source.toUpperCase()}
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 868,
              top: CY - 13,
              opacity: head,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: `2px solid ${C.inkSoft}`,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 840,
              top: CY + 44,
              width: 90,
              textAlign: "center",
            }}
          >
            <span style={{ ...TYPE.metricLabel, fontFamily: FONTS.body, color: C.inkSoft }}>
              {target.toUpperCase()}
            </span>
          </div>
        </div>
        {sourceText ? (
          <div style={{ marginTop: 40 }}>
            <SceneText text={sourceText} />
          </div>
        ) : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
