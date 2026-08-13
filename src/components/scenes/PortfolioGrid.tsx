import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASING, RADIUS, SHADOWS, SPRING_SOFT } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { SceneText } from "./SceneText";
import { AmbientParticles } from "./ambientParticles";
import { HeroLight } from "./fx";
import type { SceneProps } from "./IntroPulse";

type Tile = { x: number; y: number; w: number; h: number; accent: boolean };

const TILES: Tile[] = [
  { x: -90, y: -80, w: 300, h: 210, accent: true },
  { x: 110, y: -60, w: 210, h: 160, accent: false },
  { x: -110, y: 80, w: 220, h: 170, accent: false },
  { x: 90, y: 90, w: 300, h: 200, accent: true },
];

export const PortfolioGrid: React.FC<SceneProps> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breathing = Math.sin(frame / 60) * 6;

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />
      <HeroLight duration={duration} size={640} top={42} strength={0.5} />
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
            width: 640,
            height: 620,
            transform: `translateY(${breathing}px)`,
          }}
        >
          {TILES.map((tile, i) => {
            const pop = springP(frame, 8 + i * 5, fps, SPRING_SOFT);
            const opacity = interpolate(
              frame,
              [i * 5, i * 5 + 12],
              [0, 1],
              { easing: EASING.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: tile.w,
                  height: tile.h,
                  borderRadius: RADIUS.card,
                  backgroundColor: C.creamSoft,
                  border: `1px solid ${C.line}`,
                  boxShadow: SHADOWS.card,
                  opacity,
                  transform: `translate(-50%, -50%) translate(${tile.x * (1 - pop)}px, ${tile.y * (1 - pop)}px) scale(${0.88 + Math.max(0, pop) * 0.12})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 26,
                    top: 26,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: tile.accent ? C.accent : C.inkSoft,
                    opacity: 0.75,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 26,
                    right: 26,
                    bottom: 24,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: tile.accent ? C.accent : C.line,
                    opacity: 0.7,
                  }}
                />
              </div>
            );
          })}
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
