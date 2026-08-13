import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FONTS } from "./theme";
import { COMPONENTS, type SceneProps } from "./componentRegistry";
import { useSceneConfig } from "./SceneConfigContext";
import sceneConfigs from "./yourScenes.json";

const DURATION = 180;
const OVERLAP = 10;

type SceneConfig = {
  id: string;
  component: string;
  variant: string;
  duration: number;
  sourceText: string;
};

const defaultSceneConfigs: SceneConfig[] = sceneConfigs as SceneConfig[];

type MyScene = {
  id: string;
  element: React.ReactNode;
};

// Type for components that accept SceneProps
type SceneComponent = React.ComponentType<SceneProps>;

// Create a properly typed mapping for scene components
const SCENE_COMPONENTS: Record<string, SceneComponent> = COMPONENTS;

const build = (
  Component: SceneComponent,
  props: SceneProps,
): Omit<MyScene, "id"> => ({
  element: <Component {...props} />,
});

const buildScenes = (configs: SceneConfig[]): MyScene[] => {
  return configs.map((scene) => {
    const Component = SCENE_COMPONENTS[scene.component];
    if (!Component) {
      throw new Error(
        `Component ${scene.component} is not a valid scene component`,
      );
    }
    return {
      id: scene.id,
      ...build(Component, {
        variant: scene.variant,
        duration: scene.duration,
        sourceText: scene.sourceText,
      }),
    };
  });
};

export const sampleScenesDuration =
  defaultSceneConfigs.length * DURATION -
  (defaultSceneConfigs.length - 1) * OVERLAP;

export const Thirteen: React.FC = () => {
  const { sceneConfigs: contextConfigs } = useSceneConfig();
  const configs =
    contextConfigs.length > 0 ? contextConfigs : defaultSceneConfigs;
  const SCENES = buildScenes(configs);

  let cursor = 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body }}>
      {SCENES.map((scene) => {
        const sceneConfig = configs.find((c) => c.id === scene.id);
        const sceneDuration = sceneConfig?.duration || DURATION;
        const from = cursor;

        cursor += sceneDuration - OVERLAP;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={sceneDuration}>
            {scene.element}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
