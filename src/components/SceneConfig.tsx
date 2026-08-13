import React, { useState } from "react";
import { C, RADIUS } from "../theme";
import { useSceneConfig } from "../SceneConfigContext";
import { COMPONENTS } from "../componentRegistry";

type SceneConfig = {
  id: string;
  component: string;
  variant: string;
  duration: number;
  sourceText: string;
};

export const SceneConfig: React.FC = () => {
  const { setSceneConfigs } = useSceneConfig();
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      [
        {
          id: "hook",
          component: "HookIntro",
          variant: "default",
          duration: 180,
          sourceText: "THINGS I LEARNED FROM MY WORST CLIENT",
        },
      ],
      null,
      2,
    ),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const validateJson = (jsonString: string): SceneConfig[] | null => {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of scene configurations");
      }

      // Available scene components from registry
      const availableComponents = Object.keys(COMPONENTS);

      for (const item of parsed) {
        if (!item.id || typeof item.id !== "string") {
          throw new Error("Each scene must have an 'id' string");
        }
        if (!item.component || typeof item.component !== "string") {
          throw new Error("Each scene must have a 'component' string");
        }
        if (!availableComponents.includes(item.component)) {
          throw new Error(
            `Component '${item.component}' is not available. Available components: ${availableComponents.join(", ")}`,
          );
        }
        if (!item.variant || typeof item.variant !== "string") {
          throw new Error("Each scene must have a 'variant' string");
        }
        if (
          !item.duration ||
          typeof item.duration !== "number" ||
          item.duration <= 0
        ) {
          throw new Error("Each scene must have a positive 'duration' number");
        }
        if (!item.sourceText || typeof item.sourceText !== "string") {
          throw new Error("Each scene must have a 'sourceText' string");
        }
      }

      return parsed as SceneConfig[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setError(null);
    setSuccess(false);
  };

  const handleApply = () => {
    const validated = validateJson(jsonInput);
    if (validated) {
      setError(null);
      setSuccess(true);
      setSceneConfigs(validated);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
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
          Scene Configuration (JSON)
        </label>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          style={{
            width: "100%",
            flex: 1,
            minHeight: "150px",
            fontFamily: "monospace",
            fontSize: "12px",
            padding: "10px",
            border: error ? `2px solid ${C.accent}` : `1px solid ${C.inkSoft}`,
            borderRadius: RADIUS.sm,
            backgroundColor: C.cream,
            color: C.ink,
            resize: "none",
            outline: "none",
          }}
          placeholder="Enter scene configuration as JSON array..."
        />
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee",
            border: `1px solid ${C.accent}`,
            borderRadius: RADIUS.sm,
            color: "#c33",
            fontSize: "13px",
            marginBottom: "10px",
            flexShrink: 0,
          }}
        >
          ❌ {error}
        </div>
      )}

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
          ✅ Configuration applied successfully!
        </div>
      )}

      <button
        onClick={handleApply}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "10px 16px",
          backgroundColor: isHovered ? C.ink : C.accent,
          color: "white",
          border: "none",
          borderRadius: RADIUS.sm,
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "10px",
          flexShrink: 0,
          transition: "background-color 0.2s ease",
        }}
      >
        Apply Configuration
      </button>
    </div>
  );
};
