import React, { useMemo, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
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
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
};

export default function ModalRoomLists({
  userID,
  openModalRoomsShow,
  closeModalRoomsShow,
  isSmall,
  roomsView, // private
  setOpenRequestModal,
  setSelectedRoomID,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const allRooms = useSelector((store) => store.room.allRooms);
  const openRooms = allRooms.filter((room) => room.isPrivate !== true);
  const privateRooms = allRooms.filter((room) => room.isPrivate === true);

  // Сортировка комнат
  const [sortDirection, setSortDirection] = useState({
    open: null, // null | "asc" | "desc"
    private: null, // null | "asc" | "desc"
  });
  const sortByName = (a, b, asc) =>
    asc
      ? (a?.nameroom || "").localeCompare(b?.nameroom || "")
      : (b?.nameroom || "").localeCompare(a?.nameroom || "");

  // локальные состояния для переключения комнат по статусу
  const [tab, setTab] = useState(roomsView === "private" ? 1 : 0);
  // данные для поисковой строки
  const [query, setQuery] = useState("");

  //  фукнция поиска комнат
  const searchRooms = (rooms) => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rooms.filter((room) => (room?.nameroom || "").toLowerCase().includes(q))
      : rooms; // копия для безопасности
    return base;
  };

  // функция сортировки  комнат
  const sortRooms = (rooms, key) => {
    const dir = sortDirection[key];
    if (!dir) return rooms;
    const asc = dir === "asc";
    return [...rooms].sort((a, b) => sortByName(a, b, asc));
  };

  const visibleOpen = useMemo(() => {
    const filtered = searchRooms(openRooms);
    return sortRooms(filtered, "open");
  }, [openRooms, query, sortDirection]);

  const visiblePrivate = useMemo(() => {
    const filtered = searchRooms(privateRooms);
    return sortRooms(filtered, "private");
  }, [privateRooms, query, sortDirection]);

  // если tab !== 0 -> false
  const isOpenTab = tab === 0;
  // isOpenTab = false, поэтому currentLists = visiblePrivate
  const currentLists = isOpenTab ? visibleOpen : visiblePrivate;

  const toggleSort = () => {
    const key = tab === 0 ? "open" : "private";
    setSortDirection((prev) => {
      const next =
        prev[key] === null ? "desc" : prev[key] === "desc" ? "asc" : "desc";
      return { ...prev, [key]: next };
    });
  };

  // При каждом открытии модального окна сбрасываем таб в соответствии с roomsView
  useEffect(() => {
    if (openModalRoomsShow) {
      const newTab = roomsView === "private" ? 1 : 0;
      setTab(newTab);
    }
  }, [roomsView, openModalRoomsShow]);

  // reset при закрытии
  useEffect(() => {
    if (!openModalRoomsShow) {
      // Сбрасываем поиск при закрытии
      setQuery("");
    }
  }, [openModalRoomsShow]);

  const handleEnterRoom = (room) => {
    if (!room) return;

    // Открытая комната — доступна всем
    if (!room.isPrivate) {
      navigate(`/chatcards/${room.id}`);
      return;
    }

    // Приватная комната
    if (!userID) {
      navigate("/signin");
      return;
    }

    const isOwner = Number(room.ownerID) === Number(userID);

    if (isOwner || room.hasAccess) {
      navigate(`/chatcards/${room.id}`);
      return;
    }

    // Нужен запрос на доступ
    setSelectedRoomID(room.id);
    setOpenRequestModal(true);
  };

  return (
    <Dialog
      open={Boolean(openModalRoomsShow)}
      onClose={closeModalRoomsShow}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          bgcolor: COLORS.mainColor,
          color: "#e5e7eb",
          boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
        },
      }}
    >
      {/* Top AppBar */}
      <AppBar
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: COLORS.mainColorLight,
          boxShadow: "0 4px 14px rgba(0,0,0,0.8)",
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="close"
            onClick={closeModalRoomsShow}
            sx={{ color: "#e5e7eb" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{
              ml: 2,
              flex: 1,
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
            component="div"
          >
            {isOpenTab ? "Открытые комнаты" : "Приватные комнаты"}
          </Typography>
          {/* Сортировка комнат */}
          <SwapVertIcon
            onClick={toggleSort}
            size="small"
            sx={{ fontSize: "1.4em", cursor: "pointer", mr: 1 }}
          />
          <Chip
            label={currentLists.length}
            size="small"
            sx={{
              bgcolor: COLORS.accentSoft,
              color: COLORS.accentColor,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Toolbar>

        {/* Контролы: поиск + табы */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Paper
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 999,
              bgcolor: COLORS.mainColor,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SearchIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
            <InputBase
              placeholder="Поиск комнаты"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                color: "#e5e7eb",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            />
            <Button
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                px: 2,
                borderRadius: 999,
                bgcolor: COLORS.accentSoft,
                color: COLORS.accentColor,
                "&:hover": {
                  bgcolor: "rgba(183,148,244,0.25)",
                },
              }}
            >
              Искать
            </Button>
          </Paper>

          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              mt: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.85rem",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                minHeight: 40,
                color: COLORS.textMuted,
              },
              "& .Mui-selected": {
                color: COLORS.accentColor,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.accentColor,
              },
            }}
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
      <Box
        sx={{
          px: 2,
          py: 2,
          maxHeight: isSmall ? "90vh" : "70vh",
          overflowY: "auto",
          bgcolor: COLORS.mainColor,
        }}
      >
        <List dense disablePadding>
          {currentLists.map((room) => (
            <ListItem key={room.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleEnterRoom(room)}
                sx={{
                  borderRadius: 2,
                  bgcolor: COLORS.cardBg,
                  boxShadow: "0 8px 18px rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  "&:hover": {
                    bgcolor: "#281a3c",
                    borderColor: "rgba(183,148,244,0.6)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 12px 26px rgba(0,0,0,1)",
                  },
                  transition:
                    "background-color .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {room.isPrivate ? (
                    <LockIcon
                      sx={{ color: COLORS.accentColor, fontSize: 20 }}
                    />
                  ) : (
                    <PublicIcon
                      sx={{ color: COLORS.accentColor, fontSize: 20 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontFamily:
                          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "#e5e7eb",
                      }}
                    >
                      {room.nameroom}
                    </Typography>
                  }
                  secondary={
                    room.isPrivate ? (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.textMuted,
                          mt: 0.25,
                        }}
                      >
                        Приватная комната
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.textMuted,
                          mt: 0.25,
                        }}
                      >
                        Открытая комната
                      </Typography>
                    )
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}

          {currentLists.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                color: COLORS.textMuted,
                fontSize: "0.9rem",
              }}
            >
              Комнаты не найдены.
            </Box>
          )}
        </List>
      </Box>
    </Dialog>
  );
}
