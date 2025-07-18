import React, { memo } from "react";
import { Paper, Typography } from "@mui/material";

function ChatMessage({ sender, text }) {
  return (
    <Paper
      sx={{
        alignSelf: sender === "user" ? "flex-end" : "flex-start",
        background: sender === "user" ? "#f8bbd0" : "#fff",
        color: "#7b1fa2",
        margin: "8px 0",
        padding: "14px 20px",
        borderRadius: 18,
        maxWidth: "70%",
      }}
    >
      <Typography>{text}</Typography>
    </Paper>
  );
}
export default memo(ChatMessage);
