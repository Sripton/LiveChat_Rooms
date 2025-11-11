import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Paper,
  Grid,
  styled,
  Button,
  Typography,
  Link as MLink,
  IconButton,
  Divider,
  InputBase,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../redux/actions/roomActions";
import ModalRoomCreate from "../ModalRoomCreate";
import ModalRoomRequest from "../ModalRoomRequest";
import ModalRoomLists from "../ModalRoomLists/ModalRoomLists";

// import "./chatrooms.css";

export default function Chatrooms() {
  // -------------------- Сортировка -----------------------
  // Состояние для хранения информации о текущей сортировке
  // key — по какому полю сортируем, direction — asc или desc
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // -------------------- Модальные окна -------------------
  const [openModalRoomCreate, setOpenModalRoomCreate] = useState(false); // Состояния модального окна для создания комнат
  const [openRequestModal, setOpenRequestModal] = useState(false); // Состояния модального окна для создания запроса к приватным комнатам
  const [openModalRoomsShow, setOpenModalRomsShow] = useState(false); // Состояния модального окна для отображения списка всех комнат
  const [roomsView, setRoomsView] = useState("");

  // -------------------- Комнаты -------------------
  const [selectedRoomID, setSelectedRoomID] = useState(null); // состояние для выбранной комнаты

  // -------------------- Redux ----------------------------
  const { userID } = useSelector((store) => store.user); // Получение ID пользователя  из Redux
  const allRooms = useSelector((store) => store.room.allRooms); // Извлечение всех комнат из хранилища Redux.
  const dispatch = useDispatch();
  useEffect(() => {
    // Запрашиваем комнаты при монтировании
    dispatch(fetchAllRooms());
  }, [dispatch, userID]);

  // -------------------- Хук для навгации -----------------------
  const navigate = useNavigate();

  // -------------------- Разделение комнат по типу: открытые и приватные. -----------------------
  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  // -------------------- Сортировка комнат -----------------------
  const sortByName = (a, b, asc) =>
    asc
      ? (a?.nameroom || "").localeCompare(b?.nameroom || "")
      : (b?.nameroom || "").localeCompare(a?.nameroom || "");

  // Сортируем открытые комнаты
  const openRoomsSorted = useMemo(() => {
    if (sortConfig.key !== "open") return openRooms;
    const asc = sortConfig.direction === "asc";
    return [...openRooms].sort((a, b) => sortByName(a, b, asc));
  }, [openRooms, sortConfig]);

  // Сортируем приватные комнаты
  const privateRoomsSorted = useMemo(() => {
    if (sortConfig.key !== "private") return privateRooms;
    const asc = sortConfig.direction === "asc";
    return [...privateRooms].sort((a, b) => sortByName(a, b, asc));
  }, [privateRooms, sortConfig]);

  // -------------------- Поиск комнат ------------------------
  const [searchRooms, setSearchRooms] = useState("");
  // useMemo  нельзя вызывать внутри функции (кроме как на верхнем уровне компонента).
  // useMemo нужен, чтобы результат кэшировался между рендерами, пока зависимости (allRooms, searchRooms) не изменились.
  const filteredSearchRooms = useMemo(() => {
    const query = searchRooms.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return [...allRooms]
      .filter((room) => (room?.nameroom || "").toLowerCase().includes(query))
      .sort((a, b) => (a?.nameroom || "").localeCompare(b?.nameroom || ""));
  }, [allRooms, searchRooms]);

  // -------------------- UI: стили ------------------------
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg")); // lg = 1200px по умолчанию

  return (
    <Box sx={{ width: "100%", height: "100vh", bgcolor: "#fff0f5" }}>
      <Grid container sx={{ width: "100%", height: "100%" }}>
        {/* Левая колонка (на мобильных сверху) */}
        <Grid item xs={12} md={4} sx={{ p: 2 }}>
          {isSmall ? (
            <Stack spacing={2}>
              {/* Открытые */}
              <Button
                onClick={() => {
                  setRoomsView("open");
                  setOpenModalRomsShow(true);
                }}
                startIcon={<ListAltIcon />}
                sx={{
                  justifyContent: "space-between",
                  bgcolor: "#fce4ec",
                  color: "#ad1457",
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 3,
                }}
              >
                <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                  {`Открытые комнаты ${openRoomsSorted.length}`}
                </Typography>
              </Button>

              {/* Приватные */}
              <Button
                onClick={() => {
                  setRoomsView("private");
                  setOpenModalRomsShow(true);
                }}
                startIcon={<ListAltIcon />}
                sx={{
                  justifyContent: "space-between",
                  bgcolor: "#fce4ec",
                  color: "#ad1457",
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 3,
                }}
              >
                <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                  {`Приватные комнаты ${privateRoomsSorted.length}`}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack>
              {/* Открытые */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "rgba(194,24,91,0.1)" }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, color: "#777", fontFamily: "monospace" }}
                  >
                    Открытые комнаты
                  </Typography>
                  <Typography size="small">{openRoomsSorted.length}</Typography>
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {openRoomsSorted.slice(0, 7).map((room) => (
                  <Box
                    key={room.id}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "#fff0f5",
                      p: 1,
                      mb: 1,
                      borderRadius: 3,
                      boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
                        bgcolor: "#ffe4ec",
                      },
                    }}
                  >
                    <Box
                      component={NavLink}
                      to={`/chatcards/${room.id}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        color: "#60a5fa",
                      }}
                    >
                      {` 🌐 ${room.nameroom}`}
                    </Box>
                  </Box>
                ))}
                {openRoomsSorted.length > 8 && (
                  <Box textAlign="right" mt={1}>
                    <Button
                      onClick={() => {
                        setRoomsView("open");
                        setOpenModalRomsShow(true);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      ...
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Приватные */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "rgba(194,24,91,0.1)" }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1, color: "#777" }}>
                    Приватные комнаты
                  </Typography>
                  <Typography size="small">
                    {privateRoomsSorted.length}
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {privateRoomsSorted.slice(0, 7).map((room) => (
                  <Box
                    key={room.id}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "#fff0f5",
                      p: 1,
                      mb: 1,
                      borderRadius: 3,
                      boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
                        bgcolor: "#ffe4ec",
                      },
                    }}
                  >
                    <Box
                      onClick={() => {
                        const currentRoom = room;
                        if (!userID) return navigate("/signin");
                        if (currentRoom?.hasAccess) {
                          navigate(`/chatcards/${currentRoom.id}`);
                        } else {
                          setSelectedRoomID(currentRoom.id);
                          setOpenRequestModal(true);
                        }
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        color: "#60a5fa",
                      }}
                    >
                      {`🔒 ${room.nameroom}`}
                    </Box>
                  </Box>
                ))}
                {privateRoomsSorted.length > 8 && (
                  <Box textAlign="right" mt={1}>
                    <Button
                      onClick={() => {
                        setRoomsView("private");
                        setOpenModalRomsShow(true);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      ...
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </Grid>

        {/* Правая колонка */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          <Stack
            sx={{
              width: "100%",
              maxWidth: 720,
              mx: "auto",
              flex: 1,
              minHeight: 0,
            }}
          >
            <Box>
              <Paper
                component="form"
                onSubmit={(e) => e.preventDefault()}
                elevation={0}
                sx={{
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <IconButton sx={{ ml: 0.5 }}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  value={searchRooms}
                  onChange={(e) => setSearchRooms(e.target.value)}
                  sx={{
                    flex: 1,
                    px: 1,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                  }}
                />
                <Button
                  sx={{
                    bgcolor: "#fff0f5",
                    mr: 0.5,
                    borderRadius: 999,
                    textTransform: "none",
                    px: 2.5,
                    color: "#1976d2",
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  Поиск
                </Button>
              </Paper>
            </Box>

            <Box
              sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 1, mt: 2 }}
            >
              <Grid container direction="column">
                {filteredSearchRooms.slice(0, 12).map((room) => (
                  <Grid item key={room.id}>
                    <Box
                      sx={{
                        cursor: "pointer",
                        bgcolor: "#fff0f5",
                        p: 1,
                        mb: 1,
                        borderRadius: 3,
                        boxShadow: "0 4px 10px rgba(255,182,193,0.2)",
                        transition: "transform .3s ease, box-shadow .3s ease",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: "0 6px 14px rgba(255,105,180,.35)",
                          bgcolor: "#ffe4ec",
                        },
                      }}
                    >
                      <Typography
                        sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                        color="primary"
                        onClick={() => {
                          const currentRoom = room;
                          if (!userID) return navigate("/signin");
                          if (room?.hasAccess) {
                            navigate(`/chatcards/${currentRoom.id}`);
                          } else {
                            setSelectedRoomID(currentRoom.id);
                            setOpenRequestModal(true);
                          }
                        }}
                      >
                        {`${room.isPrivate ? "🔒 " : "🌐 "}${room.nameroom}`}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Grid>
        {/* FAB на мобильных, кнопка на десктопе */}
        {isSmall ? (
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 16,
              bgcolor: "#d81b60",
              ":hover": { bgcolor: "#c2185b" },
            }}
            onClick={() => setOpenModalRoomCreate(true)}
          >
            <AddIcon />
          </Fab>
        ) : (
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              top: 75,
              right: 16,
              bgcolor: "#d81b60",
              ":hover": { bgcolor: "#c2185b" },
            }}
            onClick={() => setOpenModalRoomCreate(true)}
          >
            <AddIcon />
          </Fab>
        )}
      </Grid>
      <ModalRoomRequest
        openRequestModal={openRequestModal}
        closeModalRequest={() => setOpenRequestModal(false)}
        selectedRoomID={selectedRoomID}
      />
      <ModalRoomCreate
        openModalRoomCreate={openModalRoomCreate}
        closeModalRoomCreate={() => setOpenModalRoomCreate(false)}
        setOpenModalRoomCreate={setOpenModalRoomCreate}
      />
      <ModalRoomLists
        userID={userID}
        openModalRoomsShow={openModalRoomsShow}
        closeModalRoomsShow={() => setOpenModalRomsShow(false)}
        roomsView={roomsView}
        setOpenRequestModal={setOpenRequestModal}
        setSelectedRoomID={setSelectedRoomID}
      />
    </Box>
  );
}
