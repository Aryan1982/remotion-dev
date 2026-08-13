import React from "react";
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

const WORD_STAGGER = 3;
const HOLD_GAP = 10; // beat of stillness before the emphasis word lands
const LAND_OFFSET = 7; // frames after its delay that the emphasis word visually "hits"
const SHAKE_LEN = 10;

const normalize = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "");

export const HookIntro: React.FC<SceneProps> = ({
  variant,
  duration = 90,
  startFrame = 0,
  sourceText = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = sourceText.trim().split(/\s+/).filter(Boolean);
  const emphasisWord = variant?.trim() || words[words.length - 1] || "";
  const emphasisNorm = emphasisWord ? normalize(emphasisWord) : "";
  const isEmphasisWord = (word: string) =>
    !!emphasisNorm && normalize(word) === emphasisNorm;

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

  // Single-frame white cut flash right at frame 0 — trains the eye that
  // something just happened, a beat before anything else appears.
  const preFlash = interpolate(frame, [0, 1, 4], [0, 0.85, 0], {
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

  // Corner brackets — snap inward past their resting point, then bounce
  // back out and settle, like a camera racking focus and locking.
  const bracketPunch = springP(frame, 4, fps, { ...SPRING, damping: 7 });
  const bracketGap = interpolate(bracketPunch, [0, 1], [92, 0]);
  const bracketOpacity = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bracketLockFlash = interpolate(frame, [8, 13, 20], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Non-emphasis words land together as a tight group; the emphasis word
  // waits out a held beat, then lands alone with its own punchier spring.
  let otherIndex = 0;
  const otherDelays = words.map((word) => {
    if (isEmphasisWord(word)) return null;
    const d = 6 + otherIndex * WORD_STAGGER;
    otherIndex += 1;
    return d;
  });
  const otherCount = otherIndex;
  const emphasisDelay = 6 + otherCount * WORD_STAGGER + HOLD_GAP;
  const wordDelays = otherDelays.map((d) => (d === null ? emphasisDelay : d));

  const wordStyles = words.map((word, i) => {
    const delay = wordDelays[i];
    if (isEmphasisWord(word)) {
      const p = Math.max(0, springP(frame, delay, fps, { ...SPRING, damping: 8 }));
      const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
      const y = interpolate(p, [0, 1], [30, 0], { extrapolateRight: "clamp" });
      const blur = interpolate(p, [0, 1], [16, 0], { extrapolateRight: "clamp" });
      // No right-clamp — lets the spring's natural overshoot punch past 1
      // and settle back, so the word "slams" in rather than eases in.
      const scale = interpolate(p, [0, 1], [1.7, 1]);
      return { opacity, y, blur, scale };
    }
    const p = Math.max(0, springP(frame, delay, fps, SPRING));
    const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
    const y = interpolate(p, [0, 1], [30, 0], { extrapolateRight: "clamp" });
    const blur = interpolate(p, [0, 1], [12, 0], { extrapolateRight: "clamp" });
    const scale = interpolate(p, [0, 1], [0.82, 1], { extrapolateRight: "clamp" });
    return { opacity, y, blur, scale };
  });

  // Impact punch: a short, decaying shake fired right as the emphasis word
  // lands — sells the "this matters" hit far more than opacity/blur alone.
  const shakeT = frame - (emphasisDelay + LAND_OFFSET);
  const shakeActive = shakeT >= 0 && shakeT <= SHAKE_LEN;
  const shakeDecay = shakeActive ? Math.exp(-shakeT / 3.2) : 0;
  const shakeX = shakeActive ? shakeDecay * Math.sin(shakeT * 2.6) * 7 : 0;
  const shakeY = shakeActive ? shakeDecay * Math.cos(shakeT * 3.1) * 5 : 0;
  const punchScale = shakeActive ? 1 + shakeDecay * 0.035 : 1;

  const underlineDelay = emphasisDelay + 10;
  const underlineP = Math.max(0, springP(frame, underlineDelay, fps, SPRING));

  return (
    <SceneFrame durationInFrames={duration}>
      <Background />
      <AmbientParticles startFrame={startFrame} />

      {/* Pre-flash cut frame */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: preFlash,
        }}
      />

      {/* Layered background pop: sharp hit + soft settle, not a flat single flash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, ${C.accent}40 0%, transparent 60%)`,
          opacity: bgHit,
        }}
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
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${flashScale * punchScale})`,
        }}
      >
        {/* Corner brackets — snap-lock framing with a brief glow flash on lock */}
        <div
          style={{ position: "absolute", inset: 0, opacity: bracketOpacity }}
        >
          {[
            { top: bracketGap, left: bracketGap, borderWidth: "3px 0 0 3px" },
            { top: bracketGap, right: bracketGap, borderWidth: "3px 3px 0 0" },
            { bottom: bracketGap, left: bracketGap, borderWidth: "0 0 3px 3px" },
            { bottom: bracketGap, right: bracketGap, borderWidth: "0 3px 3px 0" },
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
                filter: `drop-shadow(0 0 ${10 + bracketLockFlash * 22}px ${C.accentSoft})`,
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
            const isEmphasis = isEmphasisWord(word);
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

        {/* Accent underline with a soft glow, draws in after the emphasis word lands */}
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