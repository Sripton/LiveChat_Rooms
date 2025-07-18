import React from "react";
import { Box } from "@mui/material";
export default function TooltipFloating({
  tooltipVisible,
  showTooltip,
  tooltipX,
  tooltipY,
  tooltipText,
}) {
  if (!tooltipVisible) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: tooltipY,
        left: tooltipX,
        backgroundColor: "#f06292",
        color: "#fff",
        px: 2,
        py: 1,
        borderRadius: 2,
        fontSize: 20,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        pointerEvents: "none",
        zIndex: 1500,
        opacity: showTooltip ? 1 : 0,
        transform: showTooltip ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {tooltipText}
    </Box>
  );
}
