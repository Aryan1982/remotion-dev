import React from "react";
import { Composition } from "remotion";
import { SampleScenes, sampleScenesDuration } from "./SampleScenes";
import { Thirteen } from "./Thirteen";
import { SceneConfigProvider } from "./SceneConfigContext";
import { ThemeProvider } from "./ThemeContext";

// Remotion renders each composition's component in its own React root, so the
// providers declared in RemotionRoot do not wrap it. Wrap the component here
// with the providers the composition tree needs.
const withProviders = (Component: React.FC): React.FC => {
  return () => (
    <ThemeProvider>
      <SceneConfigProvider>
        <Component />
      </SceneConfigProvider>
    </ThemeProvider>
  );
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="SampleScenes"
        component={withProviders(SampleScenes)}
        durationInFrames={sampleScenesDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Twelve"
        component={withProviders(Thirteen)}
        durationInFrames={2200}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
