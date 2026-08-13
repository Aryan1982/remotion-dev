import React, { useState } from "react";
import { C } from "../theme";

type TabProps = {
  children: React.ReactNode;
  labels: string[];
};

export const Tabs: React.FC<TabProps> = ({ children, labels }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${C.inkSoft}`,
          backgroundColor: C.cream,
          flexShrink: 0,
        }}
      >
        {labels.map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              flex: 1,
              padding: "14px 16px",
              backgroundColor: activeTab === index ? "#fff" : "transparent",
              color: activeTab === index ? C.accent : C.ink,
              border: "none",
              borderBottom:
                activeTab === index
                  ? `3px solid ${C.accent}`
                  : "3px solid transparent",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeTab === index ? 600 : 500,
              transition: "all 0.2s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== index) {
                e.currentTarget.style.backgroundColor =
                  "rgba(199, 123, 92, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== index) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "hidden", backgroundColor: "#fff" }}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            style={{
              display: activeTab === index ? "block" : "none",
              height: "100%",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
