import { interpolate, spring, useVideoConfig } from "remotion";
import type { SpringConfig } from "remotion";
import { EASING, SPRING } from "./theme";

export const easeOut = EASING.out;
export const easeIn = EASING.in;
export const easeInOut = EASING.inOut;

export const clampInterp = (
  frame: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing: (n: number) => number = easeOut,
) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const useSpringProgress = (
  frame: number,
  start: number,
  config: SpringConfig = SPRING,
) => {
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config });
};

export const springP = (
  frame: number,
  start: number,
  fps: number,
  config: SpringConfig = SPRING,
) => spring({ frame: frame - start, fps, config });

export const springC = (
  damping: number,
  mass: number,
  stiffness: number,
  overshootClamping = false,
): SpringConfig => ({ damping, mass, stiffness, overshootClamping });
