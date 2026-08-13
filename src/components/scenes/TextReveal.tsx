import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { text?: string };

export const TextReveal: React.FC<Props> = ({
  variant = "default",
  duration = 150,
  startFrame = 0,
  sourceText,
  text,
}) => {
  const frame = useCurrentFrame();
  const content = (text ?? sourceText ?? "").trim();
  const centered = variant === "centered";

  const lines = content ? content.split("\n").filter((l) => l.trim() !== "") : [];
  const paragraph =
    lines.length > 1
      ? lines
      : content
        ? content
            .split(/\s+/)
            .reduce<string[]>((acc, word) => {
              const last = acc[acc.length - 1];
              if (!last || last.split(" ").length >= 6) {
                acc.push(word);
              } else {
                acc[acc.length - 1] = `${last} ${word}`;
              }
              return acc;
            }, [])
        : [];

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
        <div style={{ maxWidth: 920, transform: `translateY(${breath}px)` }}>
          {paragraph.map((line, i) => {
            const from = 12 + i * 16;
            const progress = Math.max(0, Math.min(1, (frame - from) / 18));
            const opacity = interpolate(progress, [0, 1], [0, 1], { easing: EASING.out });
            const y = interpolate(progress, [0, 1], [22, 0], { easing: EASING.out });
            const blur = interpolate(progress, [0, 1], [8, 0], { easing: EASING.out });
            return (
              <div
                key={i}
                style={{
                  marginBottom: 14,
                  opacity,
                  transform: `translateY(${y}px)`,
                  filter: `blur(${blur}px)`,
                  textAlign: centered ? "center" : "left",
                }}
              >
                <span
                  style={{
                    ...TYPE.caption,
                    fontFamily: FONTS.body,
                    fontSize: 44,
                    fontWeight: 400,
                    lineHeight: 1.45,
                    color: C.ink,
                  }}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
