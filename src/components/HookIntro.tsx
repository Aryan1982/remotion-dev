import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASING, SPRING } from "../theme";
import { useThemeColors } from "../ThemeContext";
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

export const HookIntro: React.FC<SceneProps> = ({
  variant,
  duration = 90,
  startFrame = 0,
  sourceText = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = useThemeColors();

  const words = sourceText.trim().split(/\s+/).filter(Boolean);
  const emphasisWord = variant?.trim() || words[words.length - 1] || "";

  const flash = springP(frame, 0, fps, { ...SPRING, damping: 14 });
  const flashOpacity = interpolate(Math.max(0, flash), [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const flashScale = interpolate(Math.max(0, flash), [0, 1], [1.15, 1], {
    extrapolateRight: "clamp",
  });

  const sceneOut = interpolate(frame, [duration - 14, duration], [1, 0], {
    easing: EASING.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Two-stage background pop: a fast bright hit, then a slower ambient settle
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

  const bracketIn = Math.max(0, springP(frame, 4, fps, SPRING));
  const bracketGap = interpolate(bracketIn, [0, 1], [92, 0], {
    extrapolateRight: "clamp",
  });
  const bracketOpacity = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Brackets ease back out slightly as the shot "settles focus"
  const bracketSettle = interpolate(frame, [16, 34], [0, 14], {
    easing: EASING.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const WORD_STAGGER = 3;
  const wordStyles = words.map((_, i) => {
    const delay = 6 + i * WORD_STAGGER;
    const p = Math.max(0, springP(frame, delay, fps, SPRING));
    const opacity = interpolate(p, [0, 1], [0, 1], {
      extrapolateRight: "clamp",
    });
    const y = interpolate(p, [0, 1], [30, 0], { extrapolateRight: "clamp" });
    const blur = interpolate(p, [0, 1], [12, 0], { extrapolateRight: "clamp" });
    const scale = interpolate(p, [0, 1], [0.82, 1], {
      extrapolateRight: "clamp",
    });
    return { opacity, y, blur, scale };
  });

  const underlineP = Math.max(
    0,
    springP(frame, 6 + words.length * WORD_STAGGER, fps, SPRING),
  );

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />
      {/* Layered background pop: sharp hit + soft settle, not a flat single flash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, ${C.accent}40 0%, transparent 60%)`,
          opacity: bgHit,
        }}
        from={77}
        durationInFrames={103}
        trimBefore={77}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, ${C.accentSoft} 0%, transparent 68%)`,
          opacity: bgAmbient,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          opacity: flashOpacity * sceneOut,
          transform: `scale(${flashScale})`,
        }}
      >
        {/* Corner brackets — focus-lock framing, with a faint glow and gentle settle-out */}
        <div
          style={{ position: "absolute", inset: 0, opacity: bracketOpacity }}
        >
          {[
            {
              top: bracketGap + bracketSettle,
              left: bracketGap + bracketSettle,
              borderWidth: "3px 0 0 3px",
            },
            {
              top: bracketGap + bracketSettle,
              right: bracketGap + bracketSettle,
              borderWidth: "3px 3px 0 0",
            },
            {
              bottom: bracketGap + bracketSettle,
              left: bracketGap + bracketSettle,
              borderWidth: "0 0 3px 3px",
            },
            {
              bottom: bracketGap + bracketSettle,
              right: bracketGap + bracketSettle,
              borderWidth: "0 3px 3px 0",
            },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderColor: C.accent,
                borderStyle: "solid",
                borderRadius: 3,
                filter: `drop-shadow(0 0 10px ${C.accentSoft})`,
                ...pos,
              }}
            />
          ))}
        </div>

        {/* Kinetic word-by-word hook text */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
            gap: "0 18px",
            padding: "0 60px",
          }}
        >
          {words.map((word, i) => {
            const isEmphasis =
              !!emphasisWord &&
              word.toLowerCase().replace(/[.,!?]/g, "") ===
                emphasisWord.toLowerCase().replace(/[.,!?]/g, "");
            const s = wordStyles[i];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: isEmphasis ? 78 : 64,
                  fontWeight: isEmphasis ? 800 : 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: isEmphasis ? C.accent : C.ink,
                  opacity: s.opacity,
                  filter: `blur(${s.blur}px)`,
                  transform: `translateY(${s.y}px) scale(${s.scale})`,
                  textShadow: isEmphasis
                    ? `0 2px 0 rgba(0,0,0,0.04), 0 0 34px ${C.accentSoft}, 0 0 60px ${C.accentSoft}`
                    : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Accent underline with a soft glow, draws in after text lands */}
        <div
          style={{
            marginTop: 30,
            width: interpolate(underlineP, [0, 1], [0, 130], {
              extrapolateRight: "clamp",
            }),
            height: 4,
            borderRadius: 2,
            backgroundColor: C.accent,
            boxShadow: `0 0 16px 2px ${C.accentSoft}`,
            opacity: interpolate(underlineP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
      <Vignette strength={0.8} />
      <GrainOverlay />
    </SceneFrame>
  );
};
