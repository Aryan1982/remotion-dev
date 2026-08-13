import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { data?: number[] };

const DEFAULT_DATA = [18, 34, 28, 50, 42, 64, 58, 88];
const W = 860;
const H = 560;
const PAD = 60;

export const LineChart: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  data,
}) => {
  const frame = useCurrentFrame();

  const values = data ?? DEFAULT_DATA;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values.map((v, i) => ({
    x: PAD + (i / (values.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((v - min) / range) * (H - PAD * 2),
  }));
  const path = points
    .map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`)
    .join(" ");

  const p = interpolate(frame, [0, duration * 0.75], [0, 1], {
    easing: EASING.inOut,
    extrapolateRight: "clamp",
  });
  const total = values.length - 1;
  const pos = Math.min(total, p * total);
  const i0 = Math.floor(pos);
  const i1 = Math.min(total, i0 + 1);
  const t = pos - i0;
  const cx = points[i0].x + (points[i1].x - points[i0].x) * t;
  const cy = points[i0].y + (points[i1].y - points[i0].y) * t;

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
          <svg width={W} height={H}>
            <path
              d={path}
              fill="none"
              stroke={C.inkFaint}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - p}
            />
            <circle cx={cx} cy={cy} r="26" fill={C.accentSoft} />
            <circle cx={cx} cy={cy} r="10" fill={C.accent} />
          </svg>
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
