import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import rawPlan from "./scenePlan.json";
import { FONTS } from "./theme";
import { COMPONENTS } from "./componentRegistry";

type Scene = {
  beat: string;
  sourceText: string;
  component: string;
  variant: string;
  startFrame: number;
  duration: number;
};

const plan = rawPlan as Scene[];
const MIN_SCENE_DURATION = 150;
const scenes = plan.map((scene) => ({
  ...scene,
  duration: Math.max(MIN_SCENE_DURATION, scene.duration),
}));

export const scenePlanDuration = scenes.reduce(
  (end, scene) => Math.max(end, scene.startFrame + scene.duration),
  1,
);

export const ScenePlan: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body }}>
      {scenes.map((scene, index) => {
        const Component = COMPONENTS[scene.component];
        if (!Component) return null;
        return (
          <Sequence
            key={`${scene.component}-${index}`}
            from={scene.startFrame}
            durationInFrames={scene.duration}
          >
            <Component
              variant={scene.variant}
              duration={scene.duration}
              startFrame={scene.startFrame}
              sourceText={scene.sourceText}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
