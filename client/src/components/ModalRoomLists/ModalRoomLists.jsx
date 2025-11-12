import React, { useMemo, useState, forwardRef, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
  Slide,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  InputBase,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ModalRoomLists({
  userID,
  openModalRoomsShow,
  closeModalRoomsShow,
  isSmall,
  roomsView,
  setOpenRequestModal,
  setSelectedRoomID,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const allRooms = useSelector((store) => store.room.allRooms);
  const openRooms = allRooms.filter((room) => room.isPrivate !== true);
  const privateRooms = allRooms.filter((room) => room.isPrivate === true);

  // локальные состояния
  // инициализация  из пропсов (useState(roomsView === "private" ? 1 : 0)),
  // дальнейшие изменения roomsView автоматически tab не обновляет
  const [tab, setTab] = useState(roomsView === "private" ? 1 : 0); // локальный стейт компонента
  const [sortAsc, setSortAsc] = useState(true);
  const [query, setQuery] = useState("");

  const filterAndSort = (rooms) => {
    const q = query.trim().toLocaleLowerCase();
    const base = q
      ? rooms.filter((room) =>
          (room?.nameroom || "").toLocaleLowerCase().includes(q)
        )
      : rooms;
    return base;
  };
  const visibleOpen = useMemo(
    () => filterAndSort(openRooms),
    [openRooms, query]
  );
  const visiblePrivate = useMemo(
    () => filterAndSort(privateRooms),
    [privateRooms, query]
  );

  const isOpenTab = tab === 0;
  const currentLists = isOpenTab ? visibleOpen : visiblePrivate;

  // проблема с парвильным отображением комнат
  useEffect(() => {
    if (openModalRoomsShow) {
      setTab(roomsView === "private" ? 1 : 0); // если roomsView изменился, вызывает setTab(...)
    }
  }, [roomsView, openModalRoomsShow]);
  console.log("openRooms", openRooms);
  console.log("privateRooms", privateRooms);

  const handleEnterRoom = (room) => {
    if (!room) return;
    if (!userID && room.isPrivate === false) navigate(`/chatcards/${room.id}`);
  };

  return (
    <Dialog
      open={Boolean(openModalRoomsShow)}
      onClose={closeModalRoomsShow}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
    >
      {/* Top AppBar */}
      <AppBar
        sx={{ position: "sticky", top: 0, bgcolor: "#f06292" }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={closeModalRoomsShow}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {isOpenTab ? "Открытые комнаты" : "Приватные комнаты"}
          </Typography>
          <Chip
            label={currentLists.length}
            color="secondary"
            size="small"
            sx={{ bgcolor: "#ffebee", color: "#ad1457", fontWeight: 700 }}
          />
        </Toolbar>

        {/* Контролы: поиск + сортировка */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Paper
            component="form"
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <SearchIcon />
            {/* Надо доработать стили */}
            <InputBase
              placeholder="Поиск комнат"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1, fontSize: { xs: "0.95rem", md: "1rem" } }}
            />
            <Button sx={{ textTransform: "none" }}> Искать</Button>
          </Paper>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mt: 1 }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PublicIcon fontSize="small" />
                  Открытые
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LockIcon fontSize="small" />
                  Приватные
                </Box>
              }
            />
          </Tabs>
        </Box>
      </AppBar>

      {/* Список */}
      <Box sx={{ px: 2, py: 2 }}>
        <List dense>
          {currentLists.map((room) => (
            <ListItem
              key={room.id}
              disablePadding
              // secondaryAction={
              //   room.isPrivate ? (
              //     <Chip label="🔒" size="small" />
              //   ) : (
              //     <Chip label="🌐" size="small" />
              //   )
              // }
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: "#fff0f5",
                  boxShadow: "0 2px 6px rgba(216,27,96,0.15)",
                  "&:hover": { bgcolor: "#ffe4ec" },
                }}
                onClick={() => handleEnterRoom(room)}
              >
                <ListItemIcon>
                  {room.isPrivate ? (
                    <LockIcon sx={{ color: "red" }} />
                  ) : (
                    <PublicIcon sx={{ color: "green" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {room.nameroom}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  );
}

// useMemo = запоминает "что получилось" (результат вычисления)
// useCallback = запоминает "как делать" (саму функцию)
// useMemo → для тяжелых вычислений, преобразований данных
// useCallback → для функций, которые передаются в дочерние компоненты (чтобы избежать лишних ререндеров)
// useMemo - запоминает РЕЗУЛЬТАТ вычисления:
// useMemo запоминает  результат вычисления и пересчитывает его только когда зависимости изменяются.
// const visibleRooms = useMemo(() => {
//   if (roomsView === "open") {
//     return allRooms.filter((room) => room.isPrivate === false);
//   }
//   if (roomsView === "private") {
//     return allRooms.filter((room) => room.isPrivate === true);
//   }
// }, [allRooms, roomsView]);

// const title =
//   roomsView === "open"
//     ? `Открытые комнаты (${visibleRooms.length})`
//     : roomsView === "private"
//     ? `Приватные комнаты (${visibleRooms.length})`
//     : "";

// <Dialog
//   open={Boolean(openModalRoomsShow)} //  Управление видимостью диалога
//   onClose={closeModalRoomsShow} // Функция, вызываемая при закрытии диалога (клик вне области или на ESC)
//   fullWidth // Диалог занимает всю доступную ширину контейнера
//   maxWidth="sm" // Максимальная ширина диалога - small (600px по умолчанию)
//   fullScreen={fullScreen} // Адаптивный режим: на мобильных устройствах диалог будет занимать весь экран
// >
//   <AppBar
//     position="relative"
//     color="inherit"
//     elevation={0} // Убирает тень у компонента (0 - нет тени)
//     sx={{ borderBottom: 1, borderColor: "divider", background: "#fff0f5" }}
//   >
//     <Toolbar>
//       <Typography
//         variant="h6"
//         sx={{ flexGrow: 1, color: "#d81b60", fontWeight: 700 }}
//       >
//         {`${title}`}
//       </Typography>
//       <IconButton edge="end" onClick={closeModalRoomsShow}>
//         <CloseIcon />
//       </IconButton>
//     </Toolbar>
//   </AppBar>
//   {/* Прокручиваемая область со списком */}
//   <Box
//     sx={{
//       maxHeight: isSmall ? "90vh" : "70%",
//       backgroundColor: "#fff0f5",
//       overflow: "auto",
//     }}
//   >
//     <List disablePadding>
//       {(visibleRooms || [])?.map((room) => (
//         <ListItem
//           key={room.id}
//           sx={{
//             px: 2,
//             py: 1.25,
//             mb: 1,
//             cursor: "pointer",
//             backgroundColor: "#fff0f5",
//             p: 1,
//             borderRadius: 3,
//             boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-4px) scale(1.02)",
//               boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
//               backgroundColor: "#ffe4ec",
//             },
//           }}
//         >
//           <ListItemIcon>
//             {room.isPrivate ? (
//               <LockIcon sx={{ color: "#ad1457" }} />
//             ) : (
//               <PublicIcon sx={{ color: "#ad1457" }} />
//             )}
//           </ListItemIcon>
//           <ListItemText>
//             {room.isPrivate ? (
//               <Typography
//                 color="primary"
//                 sx={{
//                   fontFamily: "monospace",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => {
//                   const currentRoom = room;
//                   // если гость — отправляем на логин и выходим
//                   if (!userID) {
//                     navigate("/signin");
//                   } else if (Number(currentRoom.ownerID) === userID) {
//                     navigate(`/chatcards/${currentRoom.id}`);
//                   } else if (currentRoom.hasAccess) {
//                     // авторизован: используем флаг с бэка
//                     navigate(`/chatcards/${currentRoom.id}`);
//                   } else {
//                     setSelectedRoomID(room.id);
//                     setOpenRequestModal(true);
//                   }
//                 }}
//               >
//                 {room.nameroom}
//               </Typography>
//             ) : (
//               <Typography
//                 color="primary"
//                 sx={{
//                   fontFamily: "monospace",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate(`/chatcards/${room.id}`)}
//               >
//                 {room.nameroom}
//               </Typography>
//             )}
//           </ListItemText>
//         </ListItem>
//       ))}
//     </List>
//   </Box>
// </Dialog>
