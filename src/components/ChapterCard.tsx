import React, { useId } from "react";
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
import { Vignette } from "./fx";
import { RevealLines, w } from "./RevealLines";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { part?: string; title?: string };

export const ChapterCard: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  part = "PART",
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[:]/g, "");

  const heading = title ?? sourceText ?? "";
  const words = heading.split(" ").filter(Boolean);

  const enter = Math.max(0, springP(frame, 14, fps, SPRING));
  const markScale = 0.8 + enter * 0.2;
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.5, 0.9], {
    easing: EASING.inOut,
  });
  const breath = Math.sin(frame / 60) * 4;

  // ---- Entrance impact flash, same language as the rest of the series ----
  const bgHit = interpolate(frame, [0, 5, 16], [0, 0.7, 0], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgAmbient = interpolate(frame, [0, 24, duration], [0, 0.2, 0.09], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- Numeral badge: pull the number out of `part`, else monogram ----
  const numMatch = part.match(/\d+/);
  const badgeText = numMatch ? numMatch[0] : (part.trim()[0] || "•").toUpperCase();
  const badgeFontSize = badgeText.length > 2 ? 40 : badgeText.length === 2 ? 66 : 78;

  // ---- Progress ring drawing in around the mark ----
  const RING_SIZE = 240;
  const RING_RADIUS = 104;
  const RING_STROKE = 4;
  const CIRC = 2 * Math.PI * RING_RADIUS;
  const ringP = interpolate(frame, [0, 34], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOffset = CIRC * (1 - ringP);

  // ---- Corner brackets, focus-lock framing around the mark ----
  const bracketIn = Math.max(0, springP(frame, 2, fps, SPRING));
  const bracketGap = interpolate(bracketIn, [0, 1], [40, 6], {
    extrapolateRight: "clamp",
  });
  const bracketOpacity = interpolate(frame, [2, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- 3D entrance tilt + one-time shine sweep across the mark ----
  const tiltP = interpolate(frame, [0, 26], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tiltX = interpolate(tiltP, [0, 1], [22, 0], { extrapolateRight: "clamp" });
  const tiltY = interpolate(tiltP, [0, 1], [-16, 0], { extrapolateRight: "clamp" });
  const shineP = interpolate(frame, [14, 46], [0, 1], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shineX = interpolate(shineP, [0, 1], [-160, 220], {
    extrapolateRight: "clamp",
  });
  const shineOpacity = interpolate(shineP, [0, 0.5, 1], [0, 0.5, 0], {
    extrapolateRight: "clamp",
  });

  // ---- Divider between kicker and title ----
  const dividerP = Math.max(0, springP(frame, 18, fps, SPRING));

  // ---- Emphasis word (last word) tinted with the accent color ----
  const wordNodes = words.map((word, i) => {
    const isLast = i === words.length - 1;
    return w(word, {
      fontWeight: isLast ? 900 : 400,
      color: isLast ? C.accent : C.ink,
    });
  });

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${C.accent}40 0%, transparent 60%)`,
          opacity: bgHit,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${C.accentSoft} 0%, transparent 68%)`,
          opacity: bgAmbient,
        }}
      />

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
          <div
            style={{
              position: "relative",
              width: RING_SIZE,
              height: RING_SIZE,
              marginBottom: 48,
              perspective: 800,
            }}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: RADIUS.icon,
                backgroundColor: "rgba(199,123,92,0.5)",
                filter: "blur(40px)",
                opacity: glow,
              }}
            />

            {/* Progress ring */}
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              style={{ position: "absolute", inset: 0 }}
            >
              <defs>
                <linearGradient id={`chapter-ring-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={C.accentSoft} />
                  <stop offset="100%" stopColor={C.accent} />
                </linearGradient>
              </defs>
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={C.ink}
                strokeOpacity={0.08}
                strokeWidth={RING_STROKE}
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={`url(#chapter-ring-${uid})`}
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={ringOffset}
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              />
            </svg>

            {/* Corner brackets */}
            <div style={{ position: "absolute", inset: 0, opacity: bracketOpacity }}>
              {[
                { top: bracketGap, left: bracketGap, borderWidth: "2px 0 0 2px" },
                { top: bracketGap, right: bracketGap, borderWidth: "2px 2px 0 0" },
                { bottom: bracketGap, left: bracketGap, borderWidth: "0 0 2px 2px" },
                { bottom: bracketGap, right: bracketGap, borderWidth: "0 2px 2px 0" },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 22,
                    height: 22,
                    borderColor: C.accent,
                    borderStyle: "solid",
                    borderRadius: 2,
                    ...pos,
                  }}
                />
              ))}
            </div>

            {/* The mark itself, with numeral badge, 3D entrance, and shine sweep */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 140,
                height: 140,
                borderRadius: RADIUS.icon,
                backgroundColor: C.accent,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(-50%, -50%) scale(${markScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.normal,
                  fontSize: badgeFontSize,
                  fontWeight: 900,
                  color: C.white ?? "#fff",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {badgeText}
              </span>

              {/* Shine sweep */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  bottom: -40,
                  left: shineX,
                  width: 60,
                  background:
                    "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                  opacity: shineOpacity,
                  transform: "rotate(0deg)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                ...TYPE.kicker,
                fontFamily: FONTS.body,
                color: C.inkSoft,
                fontSize: 46,
                fontWeight: 800,
              }}
            >
              {part.toUpperCase()}
            </span>
          </div>

          {/* Divider between kicker and title */}
          <div
            style={{
              width: interpolate(dividerP, [0, 1], [0, 80], {
                extrapolateRight: "clamp",
              }),
              height: 3,
              borderRadius: 2,
              backgroundColor: C.accent,
              boxShadow: `0 0 14px 2px ${C.accentSoft}`,
              opacity: interpolate(dividerP, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              }),
              marginBottom: 28,
            }}
          />

          <RevealLines
            startFrame={22}
            lineGap={6}
            lines={[
              {
                style: {
                  ...TYPE.display,
                  color: C.ink,
                  lineHeight: 1.18,
                },
                words: wordNodes,
              },
            ]}
          />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.6} />
      <GrainOverlay />
    </SceneFrame>
  );
};