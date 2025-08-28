import React from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Avatar, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
export default function ChatRoomsCard({
  room,
  isPrivate,
  userID,
  setSelectedRoomID,
  setOpenRequestModal,
}) {
  const navigate = useNavigate(); // Навигация для перехода по ссылкам

  const onOpen = () => {
    if (!room) return;
    if (!isPrivate) {
      navigate(`/chatcards/${room.id}`);
    }
    if (!userID) {
      navigate(`/signin`);
    }
    if (room.hasAccess) {
      setSelectedRoomID(room.id);
      setOpenRequestModal(true);
    }
  };
  return (
    <Paper
      role="button"
      aria-label={`Комната ${room?.nameroom}`}
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen() : null)}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        backgroundColor: "#fff0f5",
        boxShadow: "0 6px 18px rgba(255, 182, 193, 0.25)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 24px rgba(255,105,180,0.35)",
          backgroundColor: "#ffe4ec",
        },
      }}
    >
      <Avatar sx={{ bgcolor: "transparent", fontSize: 22 }}>
        {isPrivate ? (
          <LockIcon fontSize="small" />
        ) : (
          <PublicIcon fontSize="small" />
        )}
      </Avatar>
      <Typography variant="body2">{room?.nameroom}</Typography>
    </Paper>
  );
}
