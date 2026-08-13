import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING, TIMING } from "../theme";
import { clampInterp, easeIn, easeOut, springP } from "../motion";

export const SceneFrame: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrames = Math.max(
    1,
    Math.min(TIMING.sceneEnter, durationInFrames / 6),
  );
  const exitFrames = Math.max(
    1,
    Math.min(TIMING.sceneExit, durationInFrames / 6),
  );

  // Entrance: fade in while the whole scene settles from a spring overshoot.
  const enter = clampInterp(frame, 0, enterFrames, 0, 1, easeOut);
  const settle = Math.max(0, springP(frame, 0, fps, { ...SPRING, damping: 13 }));
  const enterScale = interpolate(settle, [0, 1], [1.04, 1], {
    extrapolateRight: "clamp",
  });

  // Exit: a distinct veil — quicker, drifting up slightly — never a reverse
  // of the entrance so consecutive scenes feel like a continuous camera.
  const exitT = clampInterp(
    frame,
    durationInFrames - exitFrames,
    durationInFrames,
    1,
    0,
    easeIn,
  );
  const exitY = (1 - exitT) * -14;
  const exitScale = 1 + (1 - exitT) * 0.015;

  // Camera breathing: the whole scene is on a barely-there continuous drift
  // so nothing on screen is ever perfectly static.
  const breathe = 1 + Math.sin((frame / fps) * 0.55) * 0.004;

  return (
    <AbsoluteFill
      style={{
        opacity: enter * exitT,
        transform: `translateY(${exitY}px) scale(${enterScale * breathe * exitScale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
