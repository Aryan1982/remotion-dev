import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  COLORS,
  FONTS,
  EASING,
  SPRING,
  TYPE,
  SPACING,
  RADIUS,
  SHADOWS,
  LAYOUT,
  TIMING,
  AMBIENT,
} from "./theme";

type ThemeColors = typeof COLORS;
type ThemeFonts = typeof FONTS;
type ThemeEasing = typeof EASING;
type ThemeSpring = typeof SPRING;
type ThemeType = typeof TYPE;
type ThemeSpacing = typeof SPACING;
type ThemeRadius = typeof RADIUS;
type ThemeShadows = typeof SHADOWS;
type ThemeLayout = typeof LAYOUT;
type ThemeTiming = typeof TIMING;
type ThemeAmbient = typeof AMBIENT;

type Theme = {
  colors: ThemeColors;
  fonts: ThemeFonts;
  easing: ThemeEasing;
  spring: ThemeSpring;
  type: ThemeType;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  layout: ThemeLayout;
  timing: ThemeTiming;
  ambient: ThemeAmbient;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (updates: Partial<Theme>) => void;
  resetTheme: () => void;
};

const defaultTheme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  easing: EASING,
  spring: SPRING,
  type: TYPE,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  layout: LAYOUT,
  timing: TIMING,
  ambient: AMBIENT,
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

// State lives in a module-level store so that the Studio UI panel and the
// composition preview (which Remotion renders in separate React roots) share
// the same data.
const listeners = new Set<() => void>();
let themeStore: Theme = defaultTheme;

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

const getSnapshot = () => themeStore;

const setThemeState = (updates: Partial<Theme>) => {
  themeStore = { ...themeStore, ...updates };
  emitChange();
};

const resetThemeState = () => {
  themeStore = defaultTheme;
  emitChange();
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: setThemeState, resetTheme: resetThemeState }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// Export for use in scene components
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};
