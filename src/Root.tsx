import "./index.css";
import { MyComposition } from "./Composition";
import { DraggableCard } from "./components/DraggableCard";
import { SceneConfig } from "./components/SceneConfig";
import { SampleScenesConfig } from "./components/SampleScenesConfig";
import { PromptTemplate } from "./components/PromptTemplate";
import { ThemeConfig } from "./components/ThemeConfig";
import { Tabs } from "./components/Tabs";
import { SceneConfigProvider } from "./SceneConfigContext";
import { ThemeProvider } from "./ThemeContext";

export const RemotionRoot: React.FC = () => {
  return (
    <ThemeProvider>
      <SceneConfigProvider>
        <DraggableCard initialX={100} initialY={100} width={500} height={600}>
          <Tabs
            labels={[
              "Scene Config",
              "Sample Scenes",
              "Theme",
              "Prompt Template",
            ]}
          >
            <SceneConfig />
            <SampleScenesConfig />
            <ThemeConfig />
            <PromptTemplate />
          </Tabs>
        </DraggableCard>
        <MyComposition />
      </SceneConfigProvider>
    </ThemeProvider>
  );
};
