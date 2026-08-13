import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { C, RADIUS } from "../theme";

type ThemePreset = {
  name: string;
  colors: Partial<typeof C>;
};

const presets: ThemePreset[] = [
  {
    name: "Default",
    colors: {
      cream: "#F6F0E4",
      creamSoft: "#FCF8F0",
      creamDeep: "#ECE1CC",
      ink: "#15100D",
      inkSoft: "#6B5C4E",
      inkFaint: "rgba(21, 16, 13, 0.45)",
      line: "#E2D4B8",
      lineFaint: "rgba(21, 16, 13, 0.08)",
      accent: "#9A3324",
      accentSoft: "rgba(154, 51, 36, 0.14)",
      vignette: "rgba(21, 16, 13, 0.14)",
      white: "#FFFFFF",
    },
  },
  {
    name: "Dark Mode",
    colors: {
      cream: "#1a1a1a",
      creamSoft: "#2d2d2d",
      creamDeep: "#0d0d0d",
      ink: "#ffffff",
      inkSoft: "#cccccc",
      inkFaint: "rgba(255, 255, 255, 0.45)",
      line: "#404040",
      lineFaint: "rgba(255, 255, 255, 0.08)",
      accent: "#ff6b6b",
      accentSoft: "rgba(255, 107, 107, 0.14)",
      vignette: "rgba(0, 0, 0, 0.3)",
      white: "#1a1a1a",
    },
  },
  {
    name: "Ocean Blue",
    colors: {
      cream: "#e8f4f8",
      creamSoft: "#f0f9fc",
      creamDeep: "#d4e8f0",
      ink: "#0a1628",
      inkSoft: "#2d4a6a",
      inkFaint: "rgba(10, 22, 40, 0.45)",
      line: "#b8d4e6",
      lineFaint: "rgba(10, 22, 40, 0.08)",
      accent: "#0077b6",
      accentSoft: "rgba(0, 119, 182, 0.14)",
      vignette: "rgba(10, 22, 40, 0.14)",
      white: "#FFFFFF",
    },
  },
  {
    name: "Forest Green",
    colors: {
      cream: "#f0f5f0",
      creamSoft: "#f8faf8",
      creamDeep: "#e0ebe0",
      ink: "#0a1a0a",
      inkSoft: "#2d4a2d",
      inkFaint: "rgba(10, 26, 10, 0.45)",
      line: "#b8e0b8",
      lineFaint: "rgba(10, 26, 10, 0.08)",
      accent: "#2d8659",
      accentSoft: "rgba(45, 134, 89, 0.14)",
      vignette: "rgba(10, 26, 10, 0.14)",
      white: "#FFFFFF",
    },
  },
];

export const ThemeConfig: React.FC = () => {
  const { theme, setTheme, resetTheme } = useTheme();
  const [activePreset, setActivePreset] = useState("Default");
  const [success, setSuccess] = useState(false);

  const handlePresetChange = (presetName: string) => {
    setActivePreset(presetName);
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setTheme({ colors: { ...theme.colors, ...preset.colors } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleReset = () => {
    resetTheme();
    setActivePreset("Default");
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: C.ink,
            marginBottom: "6px",
            flexShrink: 0,
          }}
        >
          Video Theme (Scene Components)
        </label>

        <div
          style={{
            marginBottom: "12px",
            flexShrink: 0,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 500,
              color: C.inkSoft,
              marginBottom: "6px",
            }}
          >
            Color Presets
          </label>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetChange(preset.name)}
                style={{
                  padding: "6px 12px",
                  backgroundColor:
                    activePreset === preset.name ? C.accent : C.inkSoft,
                  color: activePreset === preset.name ? "white" : C.ink,
                  border: "none",
                  borderRadius: RADIUS.sm,
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {success && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#efe",
            border: "1px solid #3c3",
            borderRadius: RADIUS.sm,
            color: "#3c3",
            fontSize: "13px",
            marginBottom: "10px",
            flexShrink: 0,
          }}
        >
          ✅ Theme applied to scenes!
        </div>
      )}

      <button
        onClick={handleReset}
        style={{
          padding: "10px 16px",
          backgroundColor: C.inkSoft,
          color: C.ink,
          border: "none",
          borderRadius: RADIUS.sm,
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "10px",
          flexShrink: 0,
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = C.ink;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = C.inkSoft;
        }}
      >
        Reset to Default
      </button>
    </div>
  );
};
