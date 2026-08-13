import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASING, FONTS, TYPE } from "../theme";
import { SceneFrame } from "./SceneFrame";
import { Background } from "./Background";
import { GrainOverlay } from "./Grain";
import { AmbientParticles } from "./ambientParticles";
import { SceneText } from "./SceneText";
import type { SceneProps } from "./IntroPulse";

type Props = SceneProps & { target?: number; prefix?: string; suffix?: string };

const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const StatCounter: React.FC<Props> = ({
  duration = 150,
  startFrame = 0,
  sourceText,
  target = 100,
  prefix = "",
  suffix = "",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, Math.max(1, Math.floor(duration * 0.7))], [0, 1], {
    easing: EASING.inOut,
    extrapolateRight: "clamp",
  });
  const count = Math.round(target * Math.max(0, easeOutBack(p)));
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
            display: "flex",
            alignItems: "baseline",
            transform: `translateY(${breath}px)`,
          }}
        >
          {prefix ? (
            <span
              style={{
                ...TYPE.percent,
                fontFamily: FONTS.body,
                fontWeight: 600,
                color: C.accent,
                marginRight: 12,
              }}
            >
              {prefix}
            </span>
          ) : null}
          <span
            style={{
              ...TYPE.number,
              fontFamily: FONTS.display,
              color: C.ink,
            }}
          >
            {count.toLocaleString("en-US")}
          </span>
          {suffix ? (
            <span
              style={{
                ...TYPE.percent,
                fontFamily: FONTS.body,
                color: C.inkSoft,
                marginLeft: 12,
              }}
            >
              {suffix}
            </span>
          ) : null}
        </div>
        {sourceText ? (
          <div style={{ marginTop: 48 }}>
            <SceneText text={sourceText} />
          </div>
        ) : null}
      </AbsoluteFill>
      <GrainOverlay />
    </SceneFrame>
  );
};
