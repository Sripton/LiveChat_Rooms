import React, { memo } from "react";
import { Paper, Typography } from "@mui/material";

function ChatMessage({ sender, text }) {
  // sender — определяет, кто отправил сообщение ("user" или "bot"), влияет на выравнивание и цвет.
  // text — сам текст сообщения.
  return (
    <Paper
      sx={{
        alignSelf: sender === "user" ? "flex-end" : "flex-start", // выравнивание справа для пользователя и слева для бота.
        background: sender === "user" ? "#f8bbd0" : "#fff", //  розовый фон для пользователя, белый — для бота.
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
