import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, RADIUS, SPRING } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { data?: number[] };

const DEFAULT_DATA = [42, 60, 50, 78, 66, 96];

export const BarChart: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  data,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const values = data ?? DEFAULT_DATA;
  const max = Math.max(...values);
  const width = 840;
  const height = 600;
  const gap = 36;
  const barW = (width - gap * (values.length - 1)) / values.length;
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
            width,
            height,
            display: "flex",
            alignItems: "flex-end",
            gap,
            transform: `translateY(${breath}px)`,
          }}
        >
          {values.map((v, i) => {
            const p = Math.max(0, springP(frame, 12 + i * 8, fps, SPRING));
            const active = i === values.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: barW,
                  height: (v / max) * (height - 40),
                  borderRadius: RADIUS.sm,
                  backgroundColor: active ? C.accent : C.creamDeep,
                  boxShadow: active ? `0 14px 44px ${C.accentSoft}` : "none",
                  transform: `scaleY(${p})`,
                  transformOrigin: "bottom",
                }}
              />
            );
          })}
        </div>
        {sourceText ? (
          <div style={{ marginTop: 60 }}>
            <SceneText text={sourceText} />
          </div>
        ) : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
