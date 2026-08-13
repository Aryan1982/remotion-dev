import React, { createContext, useContext, useState, ReactNode } from "react";
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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = (updates: Partial<Theme>) => {
    setThemeState((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setThemeState(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
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
