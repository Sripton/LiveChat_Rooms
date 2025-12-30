import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  IconButton,
  Divider,
  InputBase,
  Stack,
  useMediaQuery,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../redux/actions/roomActions";
import ModalRoomCreate from "../ModalRoomCreate";
import ModalRoomRequest from "../ModalRoomRequest";
import ModalRoomLists from "../ModalRoomLists/ModalRoomLists";

export default function Chatrooms() {
  const [openModalRoomCreate, setOpenModalRoomCreate] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openModalRoomsShow, setOpenModalRomsShow] = useState(false);
  const [roomsView, setRoomsView] = useState("");

  const [selectedRoomID, setSelectedRoomID] = useState(null);

  const { userID } = useSelector((store) => store.user);
  const allRooms = useSelector((store) => store.room.allRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch, userID]);

  const navigate = useNavigate();

  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  const [searchRooms, setSearchRooms] = useState("");

  const filteredSearchRooms = useMemo(() => {
    const query = searchRooms.trim().toLowerCase();
    if (!query) return [];
    return [...allRooms]
      .filter((room) => (room?.nameroom || "").toLowerCase().includes(query))
      .sort((a, b) => (a?.nameroom || "").localeCompare(b?.nameroom || ""));
  }, [allRooms, searchRooms]);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  // функция для обработки создания комнаты
  const handleCreateRoomClick = () => {
    if (!userID) {
      navigate("/signin");
    }
    return setOpenModalRoomCreate(true);
  };

  const mainColor = "#1d102f";
  const mainColorLight = "#2a183d";
  const cardBg = "#231433";
  const accentColor = "#b794f4";
  const accentSoft = "rgba(183,148,244,0.15)";
  const textMuted = "#9ca3af";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: mainColor,
        color: "#e5e7eb",
      }}
    >
      <Grid container sx={{ width: "100%", height: "100%" }}>
        {/* Левая колонка */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            pt: 2,
            pr: 2,
            pb: { xs: 0, md: 2 }, // на мобиле убираем нижний паддинг
            pl: 2,
            borderRight: { md: "1px solid rgba(255,255,255,0.06)" },
            bgcolor: mainColor,
          }}
        >
          {isSmall ? (
            <Stack spacing={2}>
              <Button
                onClick={() => {
                  setRoomsView("open");
                  setOpenModalRomsShow(true);
                }}
                startIcon={<ListAltIcon />}
                sx={{
                  justifyContent: "space-between",
                  bgcolor: mainColorLight,
                  color: "#e5e7eb",
                  borderRadius: 2,
                  p: 2,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#352047",
                    color: accentColor,
                  },
                }}
              >
                <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                  Открытые комнаты
                </Typography>
                <Typography sx={{ opacity: 0.85 }}>
                  {openRooms.length}
                </Typography>
              </Button>

              <Button
                onClick={() => {
                  setRoomsView("private");
                  setOpenModalRomsShow(true);
                }}
                startIcon={<ListAltIcon />}
                sx={{
                  justifyContent: "space-between",
                  bgcolor: mainColorLight,
                  color: "#e5e7eb",
                  borderRadius: 2,
                  p: 2,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#352047",
                    color: accentColor,
                  },
                }}
              >
                <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                  Приватные комнаты
                </Typography>
                <Typography sx={{ opacity: 0.85 }}>
                  {privateRooms.length}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* Открытые (desktop) */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: accentSoft,
                      "&:hover": { bgcolor: accentSoft },
                    }}
                  >
                    <ListAltIcon sx={{ color: accentColor, fontSize: 20 }} />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      flexGrow: 1,
                      color: textMuted,
                      fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      letterSpacing: 0.5,
                    }}
                  >
                    Открытые комнаты
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: "#e5e7eb", opacity: 0.8 }}
                  >
                    {openRooms.length}
                  </Typography>
                </Stack>
                <Divider
                  sx={{
                    mb: 1.5,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                />
                {openRooms.slice(0, 7).map((room) => (
                  <Box
                    key={room.id}
                    sx={{
                      cursor: "pointer",
                      bgcolor: cardBg,
                      p: 1,
                      mb: 1,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.05)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.85)",
                        borderColor: "rgba(183,148,244,0.6)",
                        bgcolor: "#281a3c",
                      },
                    }}
                  >
                    <Box
                      component={NavLink}
                      // поведение  открытых комнат
                      to={`/chatcards/${room.id}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily:
                          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        color: accentColor,
                        "&:hover": { color: "#ddd6fe" },
                      }}
                    >
                      {`🌐 ${room.nameroom}`}
                    </Box>
                  </Box>
                ))}
                {openRooms.length > 8 && (
                  <Box textAlign="right" mt={1}>
                    <Button
                      onClick={() => {
                        setRoomsView("open");
                        setOpenModalRomsShow(true);
                      }}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: textMuted,
                        "&:hover": {
                          color: accentColor,
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Показать все…
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Приватные (desktop) */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: accentSoft,
                      "&:hover": { bgcolor: accentSoft },
                    }}
                  >
                    <ListAltIcon sx={{ color: accentColor, fontSize: 20 }} />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      flexGrow: 1,
                      color: textMuted,
                      fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      letterSpacing: 0.5,
                    }}
                  >
                    Приватные комнаты
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: "#e5e7eb", opacity: 0.8 }}
                  >
                    {privateRooms.length}
                  </Typography>
                </Stack>
                <Divider
                  sx={{
                    mb: 1.5,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                />
                {privateRooms.slice(0, 7).map((room) => (
                  <Box
                    key={room.id}
                    sx={{
                      cursor: "pointer",
                      bgcolor: cardBg,
                      p: 1,
                      mb: 1,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.05)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.85)",
                        borderColor: "rgba(183,148,244,0.6)",
                        bgcolor: "#281a3c",
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
                        fontFamily:
                          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontSize: "0.9rem",
                        color: accentColor,
                        "&:hover": { color: "#ddd6fe" },
                      }}
                    >
                      {`🔒 ${room.nameroom}`}
                    </Box>
                  </Box>
                ))}
                {privateRooms.length > 8 && (
                  <Box textAlign="right" mt={1}>
                    <Button
                      onClick={() => {
                        setRoomsView("private");
                        setOpenModalRomsShow(true);
                      }}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: textMuted,
                        "&:hover": {
                          color: accentColor,
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Показать все…
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </Grid>

        {/* Правая колонка поиск */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            pt: { xs: 0, md: 2 },
            pr: 2,
            pb: 2,
            pl: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            bgcolor: { xs: "transparent", md: "transparent" },
          }}
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
            {/* Поисковая строка */}
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
                  bgcolor: "transparent",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <IconButton sx={{ ml: 0.5, color: textMuted }}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  value={searchRooms}
                  onChange={(e) => setSearchRooms(e.target.value)}
                  placeholder="Поиск комнаты…"
                  sx={{
                    flex: 1,
                    px: 1,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    color: "#e5e7eb",
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                />
                <Button
                  sx={{
                    bgcolor: accentSoft,
                    mr: 0.5,
                    borderRadius: 999,
                    textTransform: "none",
                    px: 2.5,
                    color: accentColor,
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "rgba(183,148,244,0.25)",
                    },
                  }}
                >
                  Найти
                </Button>
              </Paper>
            </Box>

            {/* Результаты поиска */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                pr: 1,
                mt: 2,
              }}
            >
              <Grid container direction="column">
                {filteredSearchRooms.slice(0, 12).map((room) => (
                  <Grid item key={room.id}>
                    <Box
                      sx={{
                        cursor: "pointer",
                        bgcolor: cardBg,
                        p: 1,
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.05)",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.7)",
                        transition:
                          "transform .2s ease, box-shadow .2s ease, border-color .2s ease, background-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.9)",
                          borderColor: "rgba(183,148,244,0.6)",
                          bgcolor: "#281a3c",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily:
                            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          fontSize: "0.9rem",
                          color: accentColor,
                          "&:hover": { color: "#ddd6fe" },
                        }}
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

        {/* FAB — создание комнаты */}

        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 32,
            bgcolor: accentColor,
            color: "#1f2933",
            "&:hover": { bgcolor: "#c4b5fd" },
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            animation: "pulse 1.5s infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 0 0 0 rgba(183,148,244,0.65)",
              },
              "50%": {
                boxShadow: "0 0 0 18px rgba(183,148,244,0)",
              },
              "100%": {
                boxShadow: "0 0 0 0 rgba(183,148,244,0)",
              },
            },
          }}
          onClick={handleCreateRoomClick}
        >
          <AddIcon />
        </Fab>
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
