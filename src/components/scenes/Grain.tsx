import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AMBIENT } from "../theme";

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(#n)'/></svg>`;

export const NOISE_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG)}")`;

export const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;
  const dx = (t * AMBIENT.grainSpeed) % 160;
  const dy = (t * (AMBIENT.grainSpeed * 0.6)) % 160;

  return (
    <AbsoluteFill
      style={{
        opacity: AMBIENT.grainOpacity,
        backgroundImage: NOISE_URL,
        backgroundSize: "160px 160px",
        mixBlendMode: "multiply",
        translate: `${-dx}px ${-dy}px`,
      }}
    />
  );
};
