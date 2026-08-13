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

type Props = SceneProps & { items?: string[] };

export const BulletList: React.FC<Props> = ({
  variant = "checkmark",
  duration = 150,
  startFrame = 0,
  sourceText,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list =
    items ??
    (sourceText
      ? sourceText.split(/\n+/).map((s) => s.trim()).filter(Boolean)
      : []);

  const breath = Math.sin(frame / 60) * 3;

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
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
            width: 880,
            display: "flex",
            flexDirection: "column",
            gap: 36,
            transform: `translateY(${breath}px)`,
          }}
        >
          {list.map((item, i) => {
            const from = 12 + i * 22;
            const mark = Math.max(0, springP(frame, from, fps, SPRING));
            const reveal = interpolate(
              frame,
              [from + 6, from + 20],
              [0, 1],
              { easing: EASING.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    flexShrink: 0,
                    borderRadius: "50%",
                    backgroundColor: C.accentSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${mark})`,
                  }}
                >
                  {variant === "dot" ? (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: C.accent,
                      }}
                    />
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 30 30">
                      <path
                        d="M 5 16 L 12 23 L 25 8"
                        fill="none"
                        stroke={C.accent}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="40"
                        strokeDashoffset={40 - 40 * reveal}
                      />
                    </svg>
                  )}
                </div>
                <div
                  style={{
                    opacity: reveal,
                    transform: `translateY(${(1 - reveal) * 12}px)`,
                  }}
                >
                  <span
                    style={{
                      ...TYPE.caption,
                      fontFamily: FONTS.body,
                      fontSize: 42,
                      fontWeight: 400,
                      lineHeight: 1.4,
                      color: C.ink,
                    }}
                  >
                    {item}
                  </span>
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
