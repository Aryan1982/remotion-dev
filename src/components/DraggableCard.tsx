import React, { useState, useRef, MouseEvent } from "react";
import { C, RADIUS, SHADOWS } from "../theme";

type DraggableCardProps = {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  backgroundColor?: string;
};

export const DraggableCard: React.FC<DraggableCardProps> = ({
  children,
  initialX = 100,
  initialY = 100,
  width = 500,
  height = 600,
  minWidth = 350,
  minHeight = 400,
  backgroundColor = C.creamSoft,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (isResizing) {
      const newWidth = Math.max(
        minWidth,
        resizeStart.width + (e.clientX - resizeStart.x),
      );
      const newHeight = Math.max(
        minHeight,
        resizeStart.height + (e.clientY - resizeStart.y),
      );
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          backgroundColor,
          borderRadius: RADIUS.card,
          boxShadow: isDragging ? SHADOWS.panel : SHADOWS.card,
          pointerEvents: "auto",
          overflow: "hidden",
          transition: "box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.inkSoft}`,
            backgroundColor: C.ink,
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: C.inkSoft,
              borderRadius: "2px",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "20px",
            height: "20px",
            cursor: "se-resize",
            zIndex: 10,
          }}
          onMouseDown={handleResizeStart}
        >
          <div
            style={{
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "0 0 12px 12px",
              borderColor: "transparent transparent C.inkSoft transparent",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};
