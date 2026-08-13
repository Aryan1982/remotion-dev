import React, { useId } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASING, SPRING } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { Vignette } from "./fx";

export type SceneProps = {
  variant?: string;
  duration?: number;
  startFrame?: number;
  sourceText?: string;
};

// Renders a single rolling digit "window". `position` is a float — its
// integer part is the digit currently centered, the fractional part is
// how far it has rolled toward the next one (mechanical-odometer style).
const DigitColumn: React.FC<{
  position: number;
  height: number;
  fontSize: number;
  color: string;
  weight?: number;
}> = ({ position, height, fontSize, color, weight = 800 }) => (
  <div
    style={{
      position: "relative",
      height,
      width: fontSize * 0.64,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(${-position * height}px)`,
      }}
    >
      {Array.from({ length: 20 }, (_, i) => i % 10).map((d, i) => (
        <div
          key={i}
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize,
            fontWeight: weight,
            color,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {d}
        </div>
      ))}
    </div>
  </div>
);

export const DayCounter: React.FC<SceneProps> = ({
  variant,
  duration = 100,
  startFrame = 0,
  sourceText = "1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[:]/g, "");

  // `variant` can optionally override the series length (e.g. "60"),
  // defaulting to a 30-day series — props shape stays untouched.
  const total =
    variant && !Number.isNaN(parseInt(variant, 10)) ? parseInt(variant, 10) : 30;

  const parsed = parseInt(sourceText || "1", 10);
  const number = Math.min(Math.max(Number.isNaN(parsed) ? 1 : parsed, 1), total);
  const prevNumber = Math.max(number - 1, 0);

  const len = String(total).length;
  const digitsPrev = String(prevNumber).padStart(len, "0").split("").map(Number);
  const digitsCurr = String(number).padStart(len, "0").split("").map(Number);
  const digitsTotal = String(total).padStart(len, "0");

  const sceneOut = interpolate(frame, [duration - 14, duration], [1, 0], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Two-stage background pop, same language as the rest of the series.
  const bgHit = interpolate(frame, [0, 5, 16], [0, 0.7, 0], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgAmbient = interpolate(frame, [0, 24, duration], [0, 0.22, 0.1], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eyebrowP = Math.max(0, springP(frame, 3, fps, SPRING));

  // Ring fill: animates from the previous day's fraction to today's.
  const RING_START = 8;
  const RING_LEN = 32;
  const ringP = interpolate(frame, [RING_START, RING_START + RING_LEN], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const prevFraction = prevNumber / total;
  const currFraction = number / total;
  const fractionAnimated = prevFraction + (currFraction - prevFraction) * ringP;

  const RADIUS = 152;
  const STROKE = 9;
  const CIRC = 2 * Math.PI * RADIUS;
  const ringOffset = CIRC * (1 - fractionAnimated);

  // Landing pulse — a soft expanding ring once the count settles.
  const pulseP = interpolate(frame, [RING_START + RING_LEN - 4, RING_START + RING_LEN + 26], [0, 1], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseScale = interpolate(pulseP, [0, 1], [1, 1.55], {
    extrapolateRight: "clamp",
  });
  const pulseOpacity = interpolate(pulseP, [0, 0.15, 1], [0, 0.5, 0], {
    extrapolateRight: "clamp",
  });

  // Digits roll with a slight cascade — units first, then each place left.
  const DIGIT_ROLL_LEN = 26;
  const positions = digitsCurr.map((curr, i) => {
    const prev = digitsPrev[i];
    const target = curr >= prev ? curr : curr + 10;
    const delay = RING_START + (len - 1 - i) * 4;
    const p = interpolate(frame, [delay, delay + DIGIT_ROLL_LEN], [0, 1], {
      easing: EASING.out,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return prev + (target - prev) * p;
  });

  const slashP = Math.max(0, springP(frame, RING_START + 6, fps, SPRING));

  // "FREELANCING SERIES" label — letter-by-letter, then an accent underline.
  const LABEL = "FREELANCING SERIES";
  const LABEL_START = 50;
  const letterStyles = LABEL.split("").map((_, i) => {
    const p = Math.max(0, springP(frame, LABEL_START + i * 1.4, fps, SPRING));
    return {
      opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
      y: interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" }),
      blur: interpolate(p, [0, 1], [6, 0], { extrapolateRight: "clamp" }),
    };
  });
  const underlineP = Math.max(
    0,
    springP(frame, LABEL_START + LABEL.length * 1.4 + 4, fps, SPRING),
  );

  const digitHeight = 108;
  const digitFontSize = 92;

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 44%, ${C.accent}40 0%, transparent 60%)`,
          opacity: bgHit,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 44%, ${C.accentSoft} 0%, transparent 68%)`,
          opacity: bgAmbient,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          opacity: sceneOut,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 340,
            height: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Landing pulse ring */}
          <svg
            width={340}
            height={340}
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
            }}
          >
            <circle
              cx={170}
              cy={170}
              r={RADIUS}
              fill="none"
              stroke={C.accent}
              strokeWidth={STROKE}
            />
          </svg>

          {/* Progress ring */}
          <svg width={340} height={340} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id={`ring-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.accentSoft} />
                <stop offset="100%" stopColor={C.accent} />
              </linearGradient>
              <filter id={`ring-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Track */}
            <circle
              cx={170}
              cy={170}
              r={RADIUS}
              fill="none"
              stroke={C.ink}
              strokeOpacity={0.08}
              strokeWidth={STROKE}
            />
            {/* Fill */}
            <circle
              cx={170}
              cy={170}
              r={RADIUS}
              fill="none"
              stroke={`url(#ring-grad-${uid})`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={ringOffset}
              filter={`url(#ring-glow-${uid})`}
              transform="rotate(-90 170 170)"
            />
          </svg>

          {/* Center content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.42em",
                color: C.accent,
                opacity: interpolate(eyebrowP, [0, 1], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(eyebrowP, [0, 1], [10, 0], {
                  extrapolateRight: "clamp",
                })}px)`,
                textTransform: "uppercase",
              }}
            >
              Day
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              {positions.map((pos, i) => (
                <DigitColumn
                  key={i}
                  position={pos}
                  height={digitHeight}
                  fontSize={digitFontSize}
                  color={C.ink}
                />
              ))}

              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: C.ink,
                  opacity: interpolate(slashP, [0, 1], [0, 0.35], {
                    extrapolateRight: "clamp",
                  }),
                  margin: "0 2px",
                  transform: `translateY(${interpolate(slashP, [0, 1], [8, 0], {
                    extrapolateRight: "clamp",
                  })}px)`,
                }}
              >
                /
              </div>

              {digitsTotal.split("").map((d, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 46,
                    fontWeight: 700,
                    color: C.ink,
                    opacity: interpolate(slashP, [0, 1], [0, 0.55], {
                      extrapolateRight: "clamp",
                    }) as number,
                    fontVariantNumeric: "tabular-nums",
                    transform: `translateY(${interpolate(slashP, [0, 1], [8, 0], {
                      extrapolateRight: "clamp",
                    })}px)`,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex" }}>
            {LABEL.split("").map((ch, i) => {
              const s = letterStyles[i];
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: "0.28em",
                    color: C.ink,
                    opacity: s.opacity * 0.82,
                    filter: `blur(${s.blur}px)`,
                    transform: `translateY(${s.y}px)`,
                    whiteSpace: ch === " " ? "pre" : "normal",
                  }}
                >
                  {ch === " " ? "\u00A0\u00A0" : ch}
                </span>
              );
            })}
          </div>

          <div
            style={{
              width: interpolate(underlineP, [0, 1], [0, 96], {
                extrapolateRight: "clamp",
              }),
              height: 3,
              borderRadius: 2,
              backgroundColor: C.accent,
              boxShadow: `0 0 14px 2px ${C.accentSoft}`,
              opacity: interpolate(underlineP, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.8} />
      <GrainOverlay />
    </SceneFrame>
  );
};