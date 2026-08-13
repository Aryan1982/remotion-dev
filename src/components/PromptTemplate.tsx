import React, { useState } from "react";
import { C, RADIUS } from "../theme";
import { COMPONENTS } from "../componentRegistry";

const getPromptTemplate = () => {
  const componentNames = Object.keys(COMPONENTS);

  const componentDescriptions: Record<string, string> = {
    HookIntro: "Dynamic word-by-word text intro with brackets and emphasis",
    IntroPulse: "Pulsing circle intro with ambient effects",
    SignalRipple: "Ripple effects with heartbeat animation",
    ProgressRing: "Animated progress/ring visualization",
    NetworkGrowth: "Network/connected nodes animation",
    IconGlow: "Icon with glowing effects",
    PortfolioGrid: "Grid layout for portfolio items",
    TextReveal: "Cinematic text reveal animation",
    BulletList: "Animated bullet points",
    QuoteCard: "Quote display with attribution",
    ComparisonSplit: "Split-screen comparison",
    Timeline: "Timeline/steps visualization",
    FlowConnector: "Flow/connection visualization",
    StatCounter: "Animated number counter",
    BarChart: "Animated bar chart",
    LineChart: "Animated line chart",
    ImageFrame: "Image frame with effects",
    CodeBlock: "Code typing animation",
    LowerThird: "Lower third graphic",
    ChapterCard: "Chapter/part introduction",
    OutroCTA: "Call-to-action outro",
    MaskReveal: "Mask reveal animation",
  };

  return `You are a video scene designer for Remotion. Create a JSON configuration for video scenes based on the script provided.

## Available Components:

${componentNames
  .map(
    (
      name,
      index,
    ) => `${index + 1}. **${name}** - ${componentDescriptions[name] || "Scene component"}
   - Props: variant (string), duration (number), sourceText (string)`,
  )
  .join("\n")}

## How to Create Scenes:

1. Analyze the script and break it into logical segments
2. Choose appropriate components from the available list above
3. Set duration (typically 120-180 frames per scene)
4. Extract relevant text for sourceText
5. Use variant to customize component behavior
6. Ensure unique id for each scene

## JSON Structure:
\`\`\`json
[
  {
    "id": "unique-scene-id",
    "component": "ComponentName",
    "variant": "default",
    "duration": 150,
    "sourceText": "Your text here"
  }
]
\`\`\`

Here's the script.. //enter your script`;
};

export const PromptTemplate: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const PROMPT_TEMPLATE = getPromptTemplate();

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: C.ink,
            marginBottom: "6px",
            flexShrink: 0,
          }}
        >
          AI Prompt Template
        </label>
        <div
          style={{
            width: "100%",
            flex: 1,
            minHeight: "150px",
            fontFamily: "monospace",
            fontSize: "11px",
            padding: "10px",
            border: `1px solid ${C.inkSoft}`,
            borderRadius: RADIUS.sm,
            backgroundColor: C.cream,
            color: C.ink,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            lineHeight: "1.4",
          }}
        >
          {PROMPT_TEMPLATE}
        </div>
      </div>

      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "10px 16px",
          backgroundColor: isHovered ? C.ink : C.accent,
          color: "white",
          border: "none",
          borderRadius: RADIUS.sm,
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "10px",
          flexShrink: 0,
          transition: "background-color 0.2s ease",
        }}
      >
        {copied ? "✓ Copied!" : "Copy Template"}
      </button>
    </div>
  );
};
