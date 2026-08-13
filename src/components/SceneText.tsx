import React from "react";
import { C, TYPE } from "../theme";
import { RevealLines, w } from "./RevealLines";

export const SceneText: React.FC<{ text: string; from?: number }> = ({
  text,
  from = 12,
}) => {
  const words = text.split(" ").filter(Boolean);
  if (words.length === 0) return null;

  const revealed = words.map((word, i) =>
    i === words.length - 1
      ? w(word, { fontWeight: 900 })
      : w(word, { fontWeight: 300 }),
  );

  return (
    <div style={{ maxWidth: 920 }}>
      <RevealLines
        startFrame={from}
        lineGap={6}
        lines={[
          {
            style: {
              ...TYPE.h3,
              color: C.ink,
              lineHeight: 1.28,
            },
            words: revealed,
          },
        ]}
      />
    </div>
  );
};
