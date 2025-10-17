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
} from "@mui/material";
import { Stack } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, NavLink, useNavigate } from "react-router-dom";

// Иконки
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../redux/actions/roomActions";

// Компоненты
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

  // const handleSortRooms = (key) => {
  //   setSortConfig((prev) => ({
  //     key,
  //     direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  //   }));
  // };

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
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff0f5",
      }}
    >
      <Grid container sx={{ width: "100%", height: isSmall ? "70%" : "100%" }}>
        {/* Правая колонка */}
        <Grid item xs={4} sx={{ p: 2 }}>
          {/* Для мониторов веньше 1200px */}
          {isSmall ? (
            <Box>
              {/* Секция 1 */}
              <Box
                sx={{
                  borderRadius: 2,
                  p: 1,
                  boxShadow: 3,
                  bgcolor: "#fce4ec", // нежный светло-бордовый
                  mb: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    aria-label="Показать весь список"
                    sx={{
                      animation: "pulseIcon 1.5s infinite",
                      bgcolor: "rgba(194,24,91,0.1)",
                      "@keyframes pulseIcon": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                          bgcolor: "#f8bbd0",
                        },
                        "50%": {
                          boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                          bgcolor: "#f48fb1",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                          bgcolor: "#f8bbd0",
                        },
                      },
                      "&:hover": { bgcolor: "rgba(194,24,91,0.2)" },
                    }}
                    onClick={() => {
                      setRoomsView("open");
                      setOpenModalRomsShow(true);
                    }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1, color: " #777" }}>
                    Открытые комнаты
                  </Typography>
                  {/* Ко-во новых комнат */}
                  <Typography size="small">{openRoomsSorted.length}</Typography>
                </Stack>
              </Box>

              {/* Секция 2 */}
              <Box
                sx={{
                  borderRadius: 2,
                  p: 1,
                  boxShadow: 3,
                  bgcolor: "#fce4ec", // тот же светло-бордовый
                  mb: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    aria-label="Показать весь список"
                    sx={{
                      animation: "pulseIcon 1.5s infinite",
                      bgcolor: "rgba(194,24,91,0.1)",
                      "@keyframes pulseIcon": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                          bgcolor: "#f8bbd0",
                        },
                        "50%": {
                          boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                          bgcolor: "#f48fb1",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                          bgcolor: "#f8bbd0",
                        },
                      },
                      "&:hover": { bgcolor: "rgba(194,24,91,0.2)" },
                    }}
                    onClick={() => {
                      setRoomsView("private");
                      setOpenModalRomsShow(true);
                    }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1, color: " #777" }}>
                    Приватные комнаты
                  </Typography>
                  {/* Ко-во новых пользователей */}
                  <Typography size="small">
                    {privateRoomsSorted.length}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Stack spacing={2}>
              {/* Секция 1 */}
              <Box
                sx={{
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 3,
                  bgcolor: "#fce4ec", // нежный светло-бордовый
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    aria-label="Показать весь список"
                    sx={{
                      bgcolor: "rgba(194,24,91,0.1)",
                      "&:hover": { bgcolor: "rgba(194,24,91,0.2)" },
                    }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      flexGrow: 1,
                      color: " #777",
                      fontFamily: "monospace",
                    }}
                  >
                    Открытые комнаты
                  </Typography>
                  {/* Ко-во новых комнат */}
                  <Typography size="small">{openRoomsSorted.length}</Typography>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                {openRoomsSorted.slice(0, 6).map((room) => (
                  <Grid key={room.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                      sx={{
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
                      <Box
                        component={NavLink}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          color: "#60a5fa",
                        }}
                        to={`/chatcards/${room.id}`}
                      >
                        {` 🌐 ${room.nameroom}`}
                      </Box>
                    </Box>
                  </Grid>
                ))}

                <Box textAlign="right" mt={1}>
                  <Button
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      display: openRoomsSorted.length > 6 ? "block" : "none",
                      animation:
                        openRoomsSorted.length > 6 ? "pulse 1.5s infinite" : 0,
                      backgroundColor: "transparent", // убрать фон
                      "@keyframes pulse": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                        },
                        "50%": {
                          boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                        },
                      },
                    }}
                    onClick={() => {
                      setRoomsView("open");
                      setOpenModalRomsShow(true);
                    }}
                  >
                    ...
                  </Button>
                </Box>
              </Box>

              {/* Секция 2 */}
              <Box
                sx={{
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 3,
                  bgcolor: "#fce4ec", // тот же светло-бордовый
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    aria-label="Показать весь список"
                    sx={{
                      bgcolor: "rgba(194,24,91,0.1)",
                      "&:hover": { bgcolor: "rgba(194,24,91,0.2)" },
                    }}
                  >
                    <ListAltIcon sx={{ color: "#ad1457" }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1, color: " #777" }}>
                    Приватные комнаты
                  </Typography>
                  {/* Ко-во новых пользователей */}
                  <Typography size="small">
                    {privateRoomsSorted.length}
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                {privateRoomsSorted.slice(0, 6).map((room) => (
                  <Grid key={room.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                      sx={{
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          color: "#60a5fa",
                        }}
                        onClick={() => {
                          const currentRoom = room;
                          // если гость — отправляем на логин и выходим
                          console.log("currentRoom", currentRoom);
                          if (!userID) {
                            navigate("/signin");
                          } else if (currentRoom?.hasAccess) {
                            // Есть доступ (owner/member/accepted) — пускаем сразу
                            navigate(`/chatcards/${currentRoom.id}`);
                          } else {
                            // Авторизован, но доступа нет — показываем модалку заявки
                            setSelectedRoomID(currentRoom.id);
                            setOpenRequestModal(true);
                          }
                        }}
                      >
                        {`🔒 ${room.nameroom}`}
                      </Box>
                    </Box>
                  </Grid>
                ))}

                <Box textAlign="right" mt={1}>
                  <Button
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      backgroundColor: "transparent",
                      animation:
                        privateRoomsSorted.length > 6
                          ? "pulse 1.5s infinite"
                          : 0,
                      "@keyframes pulse": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                        },
                        "50%": {
                          boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                        },
                      },
                    }}
                    onClick={() => {
                      setRoomsView("private");
                      setOpenModalRomsShow(true);
                    }}
                  >
                    ...
                  </Button>
                </Box>
              </Box>
            </Stack>
          )}
        </Grid>

        <Grid
          item
          xs={8}
          sx={{
            p: 2,
            height: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column", // обязателен, чтобы justifyContent работал по вертикали
            alignItems: "center", // центр по горизонтали
            justifyContent: "flex-start",
            pt: isSmall ? "5vh" : "30vh",
            pl: isSmall ? "8vw" : "12vw",
            overflow: "auto",
          }}
        >
          <Stack
            sx={{
              width: isSmall ? "80%" : "100%",
              position: isSmall ? "absolute" : "",
              top: isSmall ? "350px" : "",
              right: isSmall ? "10%" : "",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 720,
                mx: "auto",
              }}
            >
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
                    backgroundColor: "#fff0f5",
                    mr: 0.5,
                    borderRadius: 999,
                    textTransform: "none",
                    px: 2.5,
                    color: "#1976d2",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    "&:hover": {
                      boxShadow: "0 6px 14px rgba(255,105,180,.35)",
                      transform: "translateY(-1px)",
                      transition: ".3s",
                    },
                  }}
                >
                  Поиск
                </Button>
              </Paper>
            </Box>
            {/* Результаты поиска */}
            <Box
              sx={{
                position: isSmall ? "absolute" : "",
                top: isSmall ? "60px" : "",
                flex: 1, // займёт оставшееся место в колонке
                maxHeight: isSmall ? "40vh" : "auto", // ограничиваем высоту только на маленьких экранах
                overflowY: isSmall ? "auto" : "visible", // скроллим при переполнении
                pr: 1, // чтобы скроллбар не перекрывал текст
              }}
            >
              <Grid container direction="column">
                {filteredSearchRooms.slice(0, 8).map((room) => (
                  <Grid item>
                    <Box
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#fff0f5",
                        p: 1,
                        mb: 1,
                        borderRadius: 3,
                        boxShadow: "0 4px 10px rgba(255,182,193,0.2)",
                        transition: "transform .3s ease, box-shadow .3s ease",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: "0 6px 14px rgba(255,105,180,.35)",
                          backgroundColor: "#ffe4ec",
                        },
                      }}
                    >
                      <Typography
                        sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                        variant="h6"
                        color="primary"
                        onClick={() => {
                          const currentRoom = room;
                          if (!userID) {
                            navigate(`/signin`);
                          }
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
        {!isSmall ? (
          <Grid item>
            <Button
              size="small"
              sx={{
                position: "absolute",
                top: 90,
                right: 16,
                background: "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                color: "#d81b60",
              }}
              variant="contained"
              onClick={() => setOpenModalRoomCreate(true)}
            >
              Создать комнату
            </Button>
          </Grid>
        ) : (
          <Button
            sx={{
              position: "fixed",
              top: 80,
              right: 5,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              animation: "pulse 1.5s infinite",
              backgroundColor: "transparent", // убрать фон
              "@keyframes pulse": {
                "0%": {
                  boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                },
                "50%": {
                  boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                },
                "100%": {
                  boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                },
              },
            }}
            onClick={() => setOpenModalRoomCreate(true)}
          >
            <CreateIcon sx={{ color: "#d81b60" }} />
          </Button>
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
        isSmall={isSmall}
        roomsView={roomsView}
        setOpenRequestModal={setOpenRequestModal}
        setSelectedRoomID={setSelectedRoomID}
      />
    </Box>
  );
}
