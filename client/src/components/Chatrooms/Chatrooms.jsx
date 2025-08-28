import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Paper,
  Grid,
  styled,
  Button,
  Typography,
  Link as MLink,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Divider,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  CardContent,
  Card,
  ListItemAvatar,
  ListItemText,
  ListItem,
  List,
  TextField,
  ListItemIcon,
} from "@mui/material";
import { pink, green, red } from "@mui/material/colors";
import { NavLink, useNavigate } from "react-router-dom";

// Иконки
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/system";
import { fetchAllRooms } from "../../redux/actions/roomActions";

// Компоненты
import ModalRoomCreate from "../ModalRoomCreate";
import TooltipFloating from "../TooltipFloating";
import ChatMessage from "../ChatMessage";
import ModalRoomRequest from "../ModalRoomRequest";
import ChatRoomsCard from "../ChatRoomsCard/ChatRoomsCard";

// import "./chatrooms.css";

export default function Chatrooms() {
  // -------------------- Сортировка -----------------------
  // Состояние для хранения информации о текущей сортировке
  // key — по какому полю сортируем, direction — asc или desc
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // -------------------- Модальные окна -------------------
  const [openModalRoomCreate, setOpenModalRoomCreate] = useState(false); // Состояния модального окна для создания комнат
  const [openRequestModal, setOpenRequestModal] = useState(false); // Состояния модального окна для создания запроса к приватным комнатам

  // -------------------- Комнаты -------------------
  const [selectedRoomID, setSelectedRoomID] = useState(null); // состояние для выбранной комнаты

  // -------------------- Redux ----------------------------
  const { userID } = useSelector((store) => store.user); // Получение ID пользователя  из Redux
  const allRooms = useSelector((store) => store.room.allRooms); // Извлечение всех комнат из хранилища Redux.
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllRooms()); // Запрашиваем комнаты при монтировании
  }, [dispatch]);

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

  const handleSortRooms = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // -------------------- UI: стили ------------------------

  const Root = styled(Box)(({ theme }) => ({
    heigth: "100vh",
    background: "linear-gradient(135deg, #fff0f5 0%, #f8fbff 100%)",
    padding: theme.spacing(3, 1, 8),
  }));

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff0f5",
      }}
    >
      <Grid container sx={{ width: "100%", height: "100%" }}>
        <Grid item xs={4} sx={{ p: 2 }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                        variant="h6"
                        color="primary"
                      >
                        🌐
                        <MLink
                          component={NavLink}
                          to={`/chatcards/${room.id}`}
                          sx={{ textDecoration: "none" }}
                        >
                          {` ${room.nameroom}`}
                        </MLink>
                      </Typography>
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
                    animation: "pulse 1.5s infinite",
                    backgroundColor: "transparent", // убрать фон
                    "@keyframes pulse": {
                      "0%": {
                        boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                        // bgcolor: "#f8bbd0",
                      },
                      "50%": {
                        boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                        // bgcolor: "#f48fb1",
                      },
                      "100%": {
                        boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                        // bgcolor: "#f8bbd0",
                      },
                    },
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                        variant="h6"
                        color="primary"
                      >
                        🔒
                        <MLink
                          component={NavLink}
                          to={`/chatcards/${room.id}`}
                          sx={{ textDecoration: "none" }}
                        >
                          {` ${room.nameroom}`}
                        </MLink>
                      </Typography>
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
                    animation: "pulse 1.5s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        boxShadow: "0 0 0 0 rgba(244,143,177, 0.7)",
                        // bgcolor: "#f8bbd0",
                      },
                      "50%": {
                        boxShadow: "0 0 0 10px rgba(244,143,177, 0)",
                        // bgcolor: "#f48fb1",
                      },
                      "100%": {
                        boxShadow: "0 0 0 0 rgba(244,143,177, 0)",
                        // bgcolor: "#f8bbd0",
                      },
                    },
                  }}
                >
                  ...
                </Button>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
