import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASING, FONTS, RADIUS, SPRING, TYPE } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { cta?: string; subtitle?: string };

export const OutroCTA: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  cta,
  subtitle = "the next reel is already in the edit.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = cta ?? sourceText ?? "FOLLOW ALONG";
  const handle = "@aryaninprogress";

  const enter = Math.max(0, springP(frame, 14, fps, SPRING));
  const markScale = 0.8 + enter * 0.2;

  const glowOuter = interpolate(Math.sin(frame / 22), [-1, 1], [0.35, 0.7], {
    easing: EASING.inOut,
  });
  const glowInner = interpolate(Math.sin(frame / 14), [-1, 1], [0.55, 0.95], {
    easing: EASING.inOut,
  });
  const ringRotate = interpolate(frame, [0, duration], [0, 40], {
    extrapolateRight: "clamp",
  });

  const handleIn = interpolate(frame, [10, 26], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textIn = interpolate(frame, [26, 48], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subIn = interpolate(frame, [38, 58], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnIn = interpolate(frame, [52, 70], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineW = interpolate(frame, [30, 56], [0, 64], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnPulse = 1 + Math.sin(frame / 20) * 0.015;
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${breath}px)`,
          }}
        >
          {/* Mark with layered glow + rotating ring */}
<div style={{ position: "relative", width: 220, height: 220, marginBottom: 32 }}>
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: RADIUS.icon,
      backgroundColor: "rgba(199,123,92,0.45)",
      filter: "blur(46px)",
      opacity: glowOuter,
    }}
  />
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 168,
      height: 168,
      borderRadius: "50%",
      border: `1px solid ${C.line}`,
      transform: `translate(-50%, -50%) rotate(${ringRotate}deg)`,
      opacity: 0.5,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -3,
        left: "50%",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: C.accent,
        transform: "translateX(-50%)",
      }}
    />
  </div>
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 140,
      height: 140,
      borderRadius: RADIUS.icon,
      backgroundColor: C.creamSoft,
      border: `1px solid ${C.line}`,
      boxShadow: `0 12px 34px rgba(0,0,0,0.06)`,
      transform: `translate(-50%, -50%) scale(${markScale})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      style={{ opacity: glowInner }}
    >
      {/* Abstract monogram: two crossing strokes, forms an open "A" */}
      <line
        x1="10" y1="42" x2="26" y2="8"
        stroke={C.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="26" y1="8" x2="42" y2="42"
        stroke={C.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="16" y1="30" x2="36" y2="30"
        stroke={C.accent}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  </div>
</div>

          {/* Handle */}
          <div
            style={{
              ...TYPE.label,
              fontFamily: FONTS.body,
              color: C.accent,
              letterSpacing: 2,
              opacity: handleIn,
              transform: `translateY(${(1 - handleIn) * 10}px)`,
              marginBottom: 18,
            }}
          >
            {handle}
          </div>

          {/* Title */}
          <div
            style={{
              ...TYPE.display,
              fontFamily: FONTS.display,
              color: C.ink,
              padding: "30px",
              textAlign: "center",
              opacity: textIn,
              transform: `translateY(${(1 - textIn) * 16}px)`,
              filter: `blur(${(1 - textIn) * 8}px)`,
            }}
          >
            {text}
          </div>

          {/* Divider line */}
          <div
            style={{
              width: lineW,
              height: 2,
              backgroundColor: C.accent,
              borderRadius: 2,
              marginTop: 20,
              marginBottom: 20,
              opacity: subIn,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              ...TYPE.caption,
              fontFamily: FONTS.body,
              color: C.inkSoft,
              textAlign: "center",
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 8}px)`,
            }}
          >
            {subtitle}
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: 52,
              opacity: btnIn,
              transform: `translateY(${(1 - btnIn) * 14}px) scale(${btnPulse})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "24px 60px",
                borderRadius: RADIUS.card,
                backgroundColor: C.accent,
                boxShadow: `0 20px 50px ${C.accentSoft}`,
              }}
            >
              <span style={{ ...TYPE.label, fontFamily: FONTS.body, color: C.cream }}>
                FOLLOW
              </span>
              <span
                style={{
                  ...TYPE.label,
                  fontFamily: FONTS.body,
                  color: C.cream,
                  opacity: 0.7,
                  transform: `translateX(${interpolate(
                    Math.sin(frame / 14),
                    [-1, 1],
                    [0, 4]
                  )}px)`,
                }}
              >
                →
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};