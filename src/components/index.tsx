import { Background } from "./Background";
import { DayCounter } from "./DayCounter";
import { DraggableCard } from "./DraggableCard";
import { GrainOverlay } from "./Grain";
import { IconGlow } from "./IconGlow";
import { RevealLines } from "./RevealLines";
import { SampleScenesConfig } from "./SampleScenesConfig";
import { SceneConfig } from "./SceneConfig";
import { SceneFrame } from "./SceneFrame";
import { SceneText } from "./SceneText";
import { Tabs } from "./Tabs";
import { PromptTemplate } from "./PromptTemplate";
import { AmbientParticles } from "./ambientParticles";
import { HeroLight, Vignette, easeOutBack } from "./fx";
import {
  COMPONENTS as RegistryComponents,
  type SceneProps,
} from "../componentRegistry";

export const COMPONENTS = {
  Background,
  DayCounter,
  DraggableCard,
  GrainOverlay,
  IconGlow,
  RevealLines,
  SampleScenesConfig,
  SceneConfig,
  SceneFrame,
  SceneText,
  Tabs,
  PromptTemplate,
  AmbientParticles,
  HeroLight,
  Vignette,
  easeOutBack,
  ...RegistryComponents,
} as const;
