import { Composition } from "remotion";
import { SampleScenes, sampleScenesDuration } from "./SampleScenes";
import { Thirteen } from "./Thirteen";

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="SampleScenes"
        component={SampleScenes}
        durationInFrames={sampleScenesDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Twelve"
        component={Thirteen}
        durationInFrames={2200}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
