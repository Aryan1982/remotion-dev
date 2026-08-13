import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASING, SPRING, SPRING_SOFT } from "../theme";
import { springP } from "../motion";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { SceneText } from "./SceneText";
import { AmbientParticles } from "./ambientParticles";
import { Vignette } from "./fx";

export type SceneProps = {
  variant?: string;
  duration?: number;
  startFrame?: number;
  sourceText?: string;
};

export const IntroPulse: React.FC<SceneProps> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Core dot entrance — soft spring settle, not linear
  const dotIn = springP(frame, 12, fps, SPRING);
  const dotScale = 0.4 + Math.max(0, dotIn) * 0.6;
  const glow = Math.max(0, springP(frame, 16, fps, SPRING));

  // Gentle overall breathing/rotation so the composition never feels static
  const drift = Math.sin(frame / 70) * 1.4;
  const breathe = 1 + Math.sin(frame / 40) * 0.022;

  // Three staggered pulse rings, tinted warm rather than neutral ink —
  // reads as energy radiating from the accent, not a generic ripple
  const ringConfigs = [
    { delay: 0, maxSize: 480, opacity: 0.42 },
    { delay: 22, maxSize: 420, opacity: 0.3 },
    { delay: 44, maxSize: 360, opacity: 0.2 },
  ];

  const rings = ringConfigs.map(({ delay, maxSize, opacity }) => {
    const local = interpolate(frame - delay, [0, duration - delay], [0, 1], {
      easing: EASING.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const size = 40 + local * maxSize;
    const fade = interpolate(local, [0, 0.15, 1], [0, opacity, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { size, fade };
  });

  const outerRingOpacity = interpolate(
    frame,
    [0, 20, duration - 20, duration],
    [0, 0.22, 0.22, 0],
    { easing: EASING.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const sceneOpacity = interpolate(
    frame,
    [0, 10, duration - 14, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1040,
            height: 1040,
            transform: `rotate(${drift}deg) scale(${breathe})`,
          }}
        >
          {/* Deep ambient bloom — widest, faintest layer for real depth */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 68%)`,
              filter: "blur(70px)",
              transform: "translate(-50%, -50%)",
              opacity: glow * 0.6,
            }}
          />
          {/* Mid glow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)`,
              filter: "blur(48px)",
              transform: "translate(-50%, -50%)",
              opacity: glow * 0.9,
            }}
          />
          {/* Tight core glow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accent}88 0%, transparent 72%)`,
              filter: "blur(30px)",
              transform: "translate(-50%, -50%)",
              opacity: glow,
            }}
          />

          {/* Faint static outer ring */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 620,
              height: 620,
              borderRadius: "50%",
              border: `1px solid ${C.inkFaint}`,
              transform: "translate(-50%, -50%)",
              opacity: outerRingOpacity,
            }}
          />

          {/* Staggered pulse rings — warm-tinted */}
          {rings.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: r.size,
                height: r.size,
                borderRadius: "50%",
                border: `1.5px solid ${i === 0 ? C.accent : C.inkFaint}`,
                transform: "translate(-50%, -50%)",
                opacity: i === 0 ? r.fade * 0.6 : r.fade,
              }}
            />
          ))}

          {/* Core dot with highlight + layered shadow for real dimensionality */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${C.accent}, ${C.accent} 55%, rgba(0,0,0,0.18) 100%)`,
              boxShadow: `0 0 4px 1px ${C.accent}, 0 0 26px 6px rgba(199,123,92,${0.42 * glow}), 0 0 60px 14px rgba(199,123,92,${0.18 * glow})`,
              transform: `translate(-50%, -50%) scale(${dotScale})`,
            }}
          />
        </div>
        {sourceText ? <SceneText text={sourceText} /> : null}
      </AbsoluteFill>
      <Vignette strength={0.7} />
      <GrainOverlay />
    </SceneFrame>
  );
};