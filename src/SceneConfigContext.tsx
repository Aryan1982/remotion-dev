import React, { createContext, useContext, useState, ReactNode } from "react";

type SceneConfig = {
  id: string;
  component: string;
  variant: string;
  duration: number;
  sourceText: string;
};

type SceneConfigContextType = {
  sceneConfigs: SceneConfig[];
  setSceneConfigs: (configs: SceneConfig[]) => void;
};

const SceneConfigContext = createContext<SceneConfigContextType | undefined>(
  undefined,
);

export const SceneConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sceneConfigs, setSceneConfigs] = useState<SceneConfig[]>([]);

  return (
    <SceneConfigContext.Provider value={{ sceneConfigs, setSceneConfigs }}>
      {children}
    </SceneConfigContext.Provider>
  );
};

export const useSceneConfig = () => {
  const context = useContext(SceneConfigContext);
  if (context === undefined) {
    throw new Error("useSceneConfig must be used within a SceneConfigProvider");
  }
  return context;
};