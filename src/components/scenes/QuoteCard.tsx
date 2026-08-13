import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, RADIUS, SHADOWS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { quote?: string; attribution?: string };

export const QuoteCard: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  quote,
  attribution,
}) => {
  const frame = useCurrentFrame();
  const text = quote ?? sourceText ?? "";

  const bar = interpolate(frame, [10, 26], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteIn = interpolate(frame, [22, 42], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const attrIn = interpolate(frame, [44, 58], [0, 1], {
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
            position: "relative",
            width: 880,
            backgroundColor: C.creamSoft,
            borderRadius: RADIUS.card,
            boxShadow: SHADOWS.card,
            padding: "72px 64px 72px 92px",
            transform: `translateY(${breath}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "14%",
              bottom: "14%",
              width: 8,
              borderRadius: 4,
              backgroundColor: C.accent,
              transform: `scaleY(${bar})`,
              transformOrigin: "top",
            }}
          />
          <div
            style={{
              opacity: quoteIn,
              transform: `translateY(${(1 - quoteIn) * 16}px)`,
              filter: `blur(${(1 - quoteIn) * 8}px)`,
            }}
          >
            <div
              style={{
                ...TYPE.h2s,
                fontFamily: FONTS.display,
                color: C.ink,
                lineHeight: 1.25,
              }}
            >
              “{text}”
            </div>
          </div>
          {attribution ? (
            <div
              style={{
                marginTop: 40,
                opacity: attrIn,
                transform: `translateY(${(1 - attrIn) * 10}px)`,
              }}
            >
              <span style={{ ...TYPE.label, fontFamily: FONTS.body, color: C.inkSoft }}>
                — {attribution}
              </span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
