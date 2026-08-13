import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";

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

// State lives in a module-level store so that the Studio UI panel and the
// composition preview (which Remotion renders in separate React roots) share
// the same data.
const listeners = new Set<() => void>();
let sceneConfigs: SceneConfig[] = [];

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => sceneConfigs;

const setSceneConfigs = (configs: SceneConfig[]) => {
  sceneConfigs = configs;
  emitChange();
};

const SceneConfigContext = createContext<SceneConfigContextType | undefined>(
  undefined,
);

export const SceneConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const currentConfigs = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <SceneConfigContext.Provider
      value={{ sceneConfigs: currentConfigs, setSceneConfigs }}
    >
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
