import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TIMING } from "../theme";
import { easeOut } from "../motion";

export type RevealWord = { text: string; style?: React.CSSProperties };

export type RevealLine = {
  words: RevealWord[];
  style?: React.CSSProperties;
  from?: number;
};

export const w = (text: string, style?: React.CSSProperties): RevealWord => ({
  text,
  style,
});

export const words = (text: string): RevealWord[] =>
  text.split(" ").map((t) => ({ text: t }));

const STAGGER = TIMING.wordStagger;
const REVEAL_FRAMES = TIMING.wordReveal;

export const RevealLines: React.FC<{
  lines: RevealLine[];
  startFrame?: number;
  lineGap?: number;
  align?: "center" | "left";
}> = ({ lines, startFrame = 0, lineGap = 8, align = "center" }) => {
  const frame = useCurrentFrame();

  let cursor = startFrame;
  const rendered = lines.map((line) => {
    const from = line.from ?? cursor;
    let wordCursor = from;
    const items = line.words.map((word) => {
      const wf = wordCursor;
      wordCursor += STAGGER;
      const reveal = (frame - wf) / REVEAL_FRAMES;
      const clamped = Math.max(0, Math.min(1, reveal));
      return {
        ...word,
        opacity: interpolate(clamped, [0, 1], [0, 1], { easing: easeOut }),
        y: interpolate(clamped, [0, 1], [20, 0], { easing: easeOut }),
        blur: interpolate(clamped, [0, 1], [10, 0], { easing: easeOut }),
        scale: interpolate(clamped, [0, 1], [0.985, 1], { easing: easeOut }),
      };
    });
    cursor = wordCursor + lineGap;
    return { line, items };
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {rendered.map(({ line, items }, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: align === "center" ? "center" : "flex-start",
            columnGap: "0.28em",
            ...line.style,
          }}
        >
          {items.map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: item.opacity,
                  transform: `translateY(${item.y}px) scale(${item.scale})`,
                  filter: `blur(${item.blur}px)`,
                  ...item.style,
                }}
              >
              {item.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
