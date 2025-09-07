import React, { useMemo } from "react";
import {
  AppBar,
  Box,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ModalRoomLists({
  userID,
  openModalRoomsShow,
  closeModalRoomsShow, // передай: () => setOpenModalRomsShow(false)
  isSmall,
  roomsView,
  setOpenRequestModal,
  setSelectedRoomID,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const allRooms = useSelector((store) => store.room.allRooms);

  const visibleRooms = useMemo(() => {
    if (roomsView === "open") {
      return allRooms.filter((room) => room.isPrivate === false);
    }
    if (roomsView === "private") {
      return allRooms.filter((room) => room.isPrivate === true);
    }
  }, [allRooms, roomsView]);
  const title =
    roomsView === "open"
      ? `Открытые комнаты (${visibleRooms.length})`
      : roomsView === "private"
      ? `Приватные комнаты (${visibleRooms.length})`
      : "";

  return (
    <Dialog
      open={Boolean(openModalRoomsShow)} //  Управление видимостью диалога
      onClose={closeModalRoomsShow} // Функция, вызываемая при закрытии диалога (клик вне области или на ESC)
      fullWidth // Диалог занимает всю доступную ширину контейнера
      maxWidth="sm" // Максимальная ширина диалога - small (600px по умолчанию)
      fullScreen={fullScreen} // Адаптивный режим: на мобильных устройствах диалог будет занимать весь экран
    >
      <AppBar
        position="relative"
        color="inherit"
        elevation={0} // Убирает тень у компонента (0 - нет тени)
        sx={{ borderBottom: 1, borderColor: "divider", background: "#fff0f5" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "#d81b60", fontWeight: 700 }}
          >
            {`${title}`}
          </Typography>
          <IconButton edge="end" onClick={closeModalRoomsShow}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Прокручиваемая область со списком */}
      <Box
        sx={{
          maxHeight: isSmall ? "90vh" : "70%",
          backgroundColor: "#fff0f5",
          overflow: "auto",
        }}
      >
        <List disablePadding>
          {(visibleRooms || [])?.map((room) => (
            <ListItem
              key={room.id}
              sx={{
                px: 2,
                py: 1.25,
                mb: 1,
                cursor: "pointer",
                backgroundColor: "#fff0f5",
                p: 1,
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
                  backgroundColor: "#ffe4ec",
                },
              }}
            >
              <ListItemIcon>
                {room.isPrivate ? (
                  <LockIcon sx={{ color: "#ad1457" }} />
                ) : (
                  <PublicIcon sx={{ color: "#ad1457" }} />
                )}
              </ListItemIcon>
              <ListItemText>
                {room.isPrivate ? (
                  <Typography
                    color="primary"
                    sx={{
                      fontFamily: "monospace",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const currentRoom = room;
                      // если гость — отправляем на логин и выходим
                      if (!userID) {
                        navigate("/signin");
                      } else if (currentRoom.hasAccess) {
                        // авторизован: используем флаг с бэка
                        navigate(`/chatcards/${currentRoom.id}`);
                      } else {
                        setSelectedRoomID(room.id);
                        setOpenRequestModal(true);
                      }
                    }}
                  >
                    {room.nameroom}
                  </Typography>
                ) : (
                  <Typography
                    color="primary"
                    sx={{
                      fontFamily: "monospace",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/chatcards/${room.id}`)}
                  >
                    {room.nameroom}
                  </Typography>
                )}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  );
}
