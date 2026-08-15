import React from "react";
import type { SceneProps } from "./components/IntroPulse";
import { IntroPulse } from "./components/IntroPulse";
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
import { HookIntro } from "./components/HookIntro";
import { DayCounter } from "./components/DayCounter";

export type { SceneProps };

export const COMPONENTS: Record<string, React.FC<SceneProps>> = {
  HookIntro,
  IntroPulse,
  SignalRipple,
  ProgressRing,
  NetworkGrowth,
  IconGlow,
  PortfolioGrid,
  TextReveal,
  BulletList,
  QuoteCard,
  ComparisonSplit,
  Timeline,
  FlowConnector,
  StatCounter,
  BarChart,
  LineChart,
  ImageFrame,
  CodeBlock,
  LowerThird,
  ChapterCard,
  OutroCTA,
  MaskReveal,
  DayCounter,
};
