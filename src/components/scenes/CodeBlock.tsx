import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, RADIUS, SHADOWS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { code?: string; language?: string };

const DEFAULT_LINES = [
  "const reel = build({",
  "  beat: 'intro',",
  "  duration: '5s',",
  "});",
];

export const CodeBlock: React.FC<Props> = ({
  variant = "lineReveal",
  duration = 150,
  startFrame = 0,
  code,
  language = "CODE",
}) => {
  const frame = useCurrentFrame();

  const lines = code ? code.split("\n").filter((l) => l.trim() !== "") : [];
  const display = lines.length ? lines : DEFAULT_LINES;
  const typing = variant === "typing";
  const chars = display.join("\n").length;

  const p = interpolate(frame, [12, Math.max(13, duration * 0.7)], [0, 1], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(p * chars);
  const blink = Math.abs(Math.sin(frame / 8));
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
            width: 880,
            backgroundColor: C.creamDeep,
            borderRadius: RADIUS.md,
            boxShadow: SHADOWS.card,
            padding: "40px 48px",
            transform: `translateY(${breath}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {[C.accent, C.inkSoft, C.line].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: c,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
            <span
              style={{ ...TYPE.metricLabel, fontFamily: FONTS.body, color: C.inkSoft }}
            >
              {language.toUpperCase()}
            </span>
          </div>

          {typing ? (
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 34,
                lineHeight: 1.5,
                color: C.ink,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {display.join("\n").slice(0, visibleChars)}
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: C.accent,
                  opacity: blink,
                  verticalAlign: "text-bottom",
                }}
              />
            </div>
          ) : (
            <div>
              {display.map((line, i) => {
                const from = 12 + i * 10;
                const reveal = interpolate(
                  frame,
                  [from, from + 14],
                  [0, 1],
                  { easing: EASING.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={i}
                    style={{
                      opacity: reveal,
                      transform: `translateX(${(1 - reveal) * 14}px)`,
                      fontFamily: FONTS.body,
                      fontSize: 34,
                      lineHeight: 1.5,
                      color: C.ink,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
