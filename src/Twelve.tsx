import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FONTS } from "./theme";
import type { SceneProps } from "./components/IntroPulse";
import { HookIntro } from "./components/HookIntro";
import { IntroPulse } from "./components/IntroPulse";
import { Timeline } from "./components/Timeline";
import { ChapterCard } from "./components/ChapterCard";
import { TextReveal } from "./components/TextReveal";
import { FlowConnector } from "./components/FlowConnector";
import { BulletList } from "./components/BulletList";
import { QuoteCard } from "./components/QuoteCard";
import { ComparisonSplit } from "./components/ComparisonSplit";
import { OutroCTA } from "./components/OutroCTA";
import { DayCounter } from "./components/DayCounter";

const DURATION = 150;
const OVERLAP = 10;

type TwelveScene = { id: string; element: React.ReactNode };

const build = <T extends SceneProps>(
  Component: React.FC<T>,
  props: T,
): Omit<TwelveScene, "id"> => ({
  element: <Component {...props} />,
});

const SCENES: TwelveScene[] = [
  // 1. Hook — "3 mistakes... and the third one is costing you the most."
  {
    id: "hook",
    ...build(HookIntro, {
      variant: "default",
      duration: DURATION,
      sourceText: "3 mistakes freelancers make — and #3 is costing you the most.",
    }),
  },
  // 2. Intro — "Hi everyone, this is day 12 of freelancing series"
  {
    id: "intro",
    ...build(DayCounter, {
      duration: DURATION,
      sourceText: "12",
    }),
  },
  // 3. Preview of the 3 mistakes as a quick timeline
  {
    id: "mistakes-overview",
    ...build(Timeline, {
      duration: DURATION,
      steps: [
        { label: "MISTAKE 01", note: "no clear scope" },
        { label: "MISTAKE 02", note: "no advance payment" },
        { label: "MISTAKE 03", note: "no boundaries" },
      ],
    }),
  },
  // 4. Mistake 1 title — "starting without a clear scope"
  {
    id: "mistake-1-title",
    ...build(ChapterCard, {
      duration: DURATION,
      part: "MISTAKE 01",
      title: "No Clear Scope",
    }),
  },
  // 5. Mistake 1 body — "If you start without a scope, clients will keep giving you changes."
  {
    id: "mistake-1-body",
    ...build(TextReveal, {
      variant: "default",
      duration: DURATION,
      sourceText: "Start without a scope, and clients will keep piling on changes.",
    }),
  },
  // 6. Mistake 1 consequence — "It will waste your time and your efforts will also be wasted."
  {
    id: "mistake-1-consequence",
    ...build(FlowConnector, {
      duration: DURATION,
      source: "NO SCOPE",
      target: "WASTED TIME",
      sourceText: "Your time — and your effort — go to waste.",
    }),
  },
  // 7. Mistake 2 title — "not taking advance payment"
  {
    id: "mistake-2-title",
    ...build(ChapterCard, {
      duration: DURATION,
      part: "MISTAKE 02",
      title: "Skipping Advance Payment",
    }),
  },
  // 8. Mistake 2 body — "You should always take advance payment for every project."
  {
    id: "mistake-2-body",
    ...build(BulletList, {
      variant: "checkmark",
      duration: DURATION,
      items: [
        "Always take an advance.",
        "It protects every project.",
        "It's standard business practice.",
      ],
    }),
  },
  // 9. Mistake 2 reinforcement — "Taking advance payment is a very common thing in business."
  {
    id: "mistake-2-quote",
    ...build(QuoteCard, {
      duration: DURATION,
      quote: "Advance payment isn't rude — it's routine.",
      attribution: "every serious business",
    }),
  },
  // 10. Mistake 3 title — "not setting boundaries and accepting unlimited changes"
  {
    id: "mistake-3-title",
    ...build(ChapterCard, {
      duration: DURATION,
      part: "MISTAKE 03",
      title: "No Boundaries, Unlimited Changes",
    }),
  },
  // 11. Mistake 3 body — "even if not written in the scope, you still should not do this."
  {
    id: "mistake-3-body",
    ...build(ComparisonSplit, {
      duration: DURATION,
      left: "SCOPE",
      right: "UNLIMITED CHANGES",
      sourceText: "Stick to the scope — even when they push for more.",
    }),
  },
  // 12. Outro — "That's it for today. Follow and stay tuned for upcoming videos."
  {
    id: "outro",
    ...build(OutroCTA, {
      duration: DURATION,
      cta: "Follow along.",
      subtitle: "that's it for today — see you in the next one.",
    }),
  },
];

export const twelveDuration =
  SCENES.length * DURATION - (SCENES.length - 1) * OVERLAP;

export const Twelve: React.FC = () => {
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