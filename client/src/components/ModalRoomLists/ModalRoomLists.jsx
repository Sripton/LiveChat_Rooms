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
  const [tab, setTab] = useState(roomsView === "private" ? 1 : 0);
  const [query, setQuery] = useState("");

  const mainColor = "#1d102f";
  const mainColorLight = "#2a183d";
  const cardBg = "#231433";
  const accentColor = "#b794f4";
  const accentSoft = "rgba(183,148,244,0.15)";
  const textMuted = "#9ca3af";

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

  useEffect(() => {
    if (openModalRoomsShow) {
      setTab(roomsView === "private" ? 1 : 0);
    }
  }, [roomsView, openModalRoomsShow]);

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
          bgcolor: mainColor,
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
          bgcolor: mainColorLight,
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
          <Chip
            label={currentLists.length}
            size="small"
            sx={{
              bgcolor: accentSoft,
              color: accentColor,
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
              bgcolor: mainColor,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SearchIcon sx={{ color: textMuted, fontSize: 20 }} />
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
                bgcolor: accentSoft,
                color: accentColor,
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
                color: textMuted,
              },
              "& .Mui-selected": {
                color: accentColor,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: accentColor,
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
          bgcolor: mainColor,
        }}
      >
        <List dense disablePadding>
          {currentLists.map((room) => (
            <ListItem key={room.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleEnterRoom(room)}
                sx={{
                  borderRadius: 2,
                  bgcolor: cardBg,
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
                    <LockIcon sx={{ color: accentColor, fontSize: 20 }} />
                  ) : (
                    <PublicIcon sx={{ color: accentColor, fontSize: 20 }} />
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
                          color: textMuted,
                          mt: 0.25,
                        }}
                      >
                        Приватная комната
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: textMuted,
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
                color: textMuted,
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
