import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FONTS } from "./theme";
import type { SceneProps } from "./components/IntroPulse";
import { IntroPulse } from "./components/IntroPulse";
import { HookIntro } from "./components/HookIntro";
import { SignalRipple } from "./components/SignalRipple";
import { ProgressRing } from "./components/ProgressRing";
import { NetworkGrowth } from "./components/NetworkGrowth";
import { IconGlow } from "./components/IconGlow";
import { PortfolioGrid } from "./components/PortfolioGrid";
import { TextReveal } from "./components/TextReveal";
import { BulletList } from "./components/BulletList";
import { QuoteCard } from "./components/QuoteCard";
import { ComparisonSplit } from "./components/ComparisonSplit";
import { Timeline } from "./components/Timeline";
import { FlowConnector } from "./components/FlowConnector";
import { StatCounter } from "./components/StatCounter";
import { BarChart } from "./components/BarChart";
import { LineChart } from "./components/LineChart";
import { ImageFrame } from "./components/ImageFrame";
import { CodeBlock } from "./components/CodeBlock";
import { LowerThird } from "./components/LowerThird";
import { ChapterCard } from "./components/ChapterCard";
import { OutroCTA } from "./components/OutroCTA";
import { MaskReveal } from "./components/MaskReveal";

const DURATION = 150;
const OVERLAP = 10;

type SampleScene = { id: string; element: React.ReactNode };

const build = <T extends SceneProps>(
  Component: React.FC<T>,
  props: T,
): Omit<SampleScene, "id"> => ({
  element: <Component {...props} />,
});

const SCENES: SampleScene[] = [
  { id: "hook-intro", ...build(HookIntro, { variant: "process", duration: DURATION, sourceText: "Process wins. Every time." }) },
  { id: "intro-pulse", ...build(IntroPulse, { duration: DURATION, sourceText: "Your story starts here." }) },
  { id: "signal-ripple", ...build(SignalRipple, { variant: "heartbeat", duration: DURATION, sourceText: "Post. Pause. Post again." }) },
  { id: "progress-ring", ...build(ProgressRing, { variant: "double-fill", duration: DURATION, sourceText: "Learning compounds every day." }) },
  { id: "network-growth", ...build(NetworkGrowth, { variant: "inward", duration: DURATION, sourceText: "The audience finds you." }) },
  { id: "icon-glow", ...build(IconGlow, { duration: DURATION, sourceText: "Take a closer look." }) },
  { id: "portfolio-grid", ...build(PortfolioGrid, { duration: DURATION, sourceText: "The work speaks for itself." }) },
  { id: "text-reveal", ...build(TextReveal, { variant: "centered", duration: DURATION, sourceText: "Most creators quit before compounding begins." }) },
  { id: "bullet-list", ...build(BulletList, { variant: "checkmark", duration: DURATION, items: ["Show up daily.", "Ship small things.", "Let it compound."] }) },
  { id: "quote-card", ...build(QuoteCard, { duration: DURATION, quote: "Consistency is the only shortcut.", attribution: "the process" }) },
  { id: "comparison-split", ...build(ComparisonSplit, { duration: DURATION, left: "GUESSING", right: "TESTING", sourceText: "Stop guessing, start testing." }) },
  { id: "timeline", ...build(Timeline, { duration: DURATION, steps: [{ label: "STEP 01", note: "the idea" }, { label: "STEP 02", note: "the build" }, { label: "STEP 03", note: "the share" }] }) },
  { id: "flow-connector", ...build(FlowConnector, { duration: DURATION, source: "POST", target: "GROWTH", sourceText: "One post leads to the next." }) },
  { id: "stat-counter", ...build(StatCounter, { duration: DURATION, target: 1200, suffix: "+", sourceText: "readers in the first month" }) },
  { id: "bar-chart", ...build(BarChart, { duration: DURATION, data: [42, 60, 50, 78, 66, 96], sourceText: "Consistency beats intensity." }) },
  { id: "line-chart", ...build(LineChart, { duration: DURATION, data: [18, 34, 28, 50, 42, 64, 58, 88], sourceText: "Up and to the right." }) },
  { id: "image-frame", ...build(ImageFrame, { duration: DURATION, src: undefined, sourceText: "A screenshot of the real thing." }) },
  { id: "code-block", ...build(CodeBlock, { variant: "typing", duration: DURATION, code: "const reel = build({\n  beat: 'intro',\n});", language: "JS" }) },
  { id: "lower-third", ...build(LowerThird, { duration: DURATION, label: "CHAPTER 2 — THE BUILD" }) },
  { id: "chapter-card", ...build(ChapterCard, { duration: DURATION, part: "PART", title: "The Build" }) },
  { id: "outro-cta", ...build(OutroCTA, { duration: DURATION, cta: "Follow along.", subtitle: "the next reel is already in the edit." }) },
  { id: "mask-reveal", ...build(MaskReveal, { duration: DURATION, sourceText: "What comes next..." }) },
];

export const sampleScenesDuration =
  SCENES.length * DURATION - (SCENES.length - 1) * OVERLAP;

export const SampleScenes: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body }}>
      {SCENES.map((scene) => {
        const from = cursor;
        cursor += DURATION - OVERLAP;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={DURATION}>
            {scene.element}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
