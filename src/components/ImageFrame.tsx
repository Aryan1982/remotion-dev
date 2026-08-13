import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, RADIUS, SHADOWS } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { src?: string };

export const ImageFrame: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  src,
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, duration], [1.06, 1.18], {
    easing: EASING.inOut,
  });
  const pan = Math.sin(frame / 80) * 10;
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
            position: "relative",
            width: 760,
            height: 860,
            borderRadius: RADIUS.card,
            overflow: "hidden",
            boxShadow: SHADOWS.post,
            transform: `translateY(${breath}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${zoom}) translateX(${pan}px)`,
            }}
          >
            {src ? (
              <Img
                src={src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: C.creamDeep,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: RADIUS.md,
                    backgroundColor: C.accent,
                    opacity: 0.6,
                  }}
                />
              </div>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: `inset 0 0 0 1px ${C.lineFaint}, inset 0 0 120px ${C.accentSoft}`,
            }}
          />
        </div>
        {sourceText ? (
          <div style={{ marginTop: 48 }}>
            <SceneText text={sourceText} />
          </div>
        ) : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
