import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASING, FONTS, SPRING, TYPE } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Step = { label: string; note?: string };
type Props = SceneProps & { steps?: Step[] };

const DEFAULT_STEPS: Step[] = [
  { label: "STEP 01", note: "the idea" },
  { label: "STEP 02", note: "the build" },
  { label: "STEP 03", note: "the share" },
];

export const Timeline: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  steps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list = steps ?? DEFAULT_STEPS;
  const rowGap = 132;
  const totalHeight = list.length * rowGap;

  const p = interpolate(frame, [0, duration], [0, 1], {
    easing: EASING.inOut,
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
            position: "relative",
            width: 820,
            height: totalHeight,
            transform: `translateY(${breath}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 10,
              bottom: 10,
              width: 3,
              borderRadius: 2,
              backgroundColor: C.lineFaint,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 10,
              width: 3,
              borderRadius: 2,
              backgroundColor: C.accent,
              height: `${p * (totalHeight - 20)}px`,
            }}
          />
          {list.map((step, i) => {
            const from = 12 + i * 34;
            const pop = Math.max(0, springP(frame, from, fps, SPRING));
            const reveal = interpolate(
              frame,
              [from + 4, from + 18],
              [0, 1],
              { easing: EASING.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: i * rowGap,
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 62,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      border: `2px solid ${C.accent}`,
                      opacity: (1 - reveal) * 0.6,
                    }}
                  />
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: C.accent,
                      transform: `scale(${pop})`,
                    }}
                  />
                </div>
                <div
                  style={{
                    opacity: reveal,
                    transform: `translateY(${(1 - reveal) * 14}px)`,
                  }}
                >
                  <div
                    style={{
                      ...TYPE.label,
                      fontFamily: FONTS.body,
                      color: C.ink,
                    }}
                  >
                    {step.label}
                  </div>
                  {step.note ? (
                    <div
                      style={{
                        ...TYPE.caption,
                        fontFamily: FONTS.body,
                        fontSize: 34,
                        color: C.inkSoft,
                        marginTop: 8,
                      }}
                    >
                      {step.note}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
