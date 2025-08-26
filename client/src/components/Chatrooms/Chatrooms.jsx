import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Paper,
  Grid,
  styled,
  Button,
  Typography,
  Link,
  Avatar,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

// Иконки
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../redux/actions/roomActions";

// Компоненты
import ModalRoomCreate from "../ModalRoomCreate";
import TooltipFloating from "../TooltipFloating";
import ChatMessage from "../ChatMessage";
import ModalRoomRequest from "../ModalRoomRequest";

import "./chatrooms.css";

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

  // -------------------- Сортировка комнат -----------------------

  // -------------------- Навигация для перехода по ссылкам -----------------------
  const navigate = useNavigate();

  // -------------------- Разделение комнат по типу: открытые и приватные. -----------------------
  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  // Сортируем открытые комнаты
  const openRoomsSorted = [...openRooms]
    .map((room) => room)
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const asc = direction === "asc";
      if (key === "openrooms") {
        return asc
          ? a.nameroom.localeCompare(b.nameroom)
          : b.nameroom.localeCompare(a.nameroom);
      }
      return 0;
    });

  // Сортируем приватные комнаты
  const privateRoomsSorted = [...privateRooms]
    .map((room) => room)
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const asc = direction === "asc";
      if (key === "privateroom") {
        return asc
          ? a.nameroom.localeCompare(b.nameroom)
          : b.nameroom.localeCompare(a.nameroom);
      }
      return 0;
    });

  // Фукнция для оанимации сортировки
  // Старая фукнция
  // const handleSortRooms = (key) => {
  //   setSortConfig((prev) => ({
  //     key,
  //     // direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  //     direction: prev.direction === "asc" ? "desc" : "asc",
  //   }));
  // };

  // Новая функция
  const handleSortRooms = (key) => {
    setSortConfig((prev) => {
      const sameKey = prev.key === key;
      return {
        key,
        direction: sameKey
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
      };
    });
  };

  // -------------------- Стили через styled --------------------
  const Root = styled(Box)({
    height: "100vh",
    background: "#fff0f5",
    padding: "40px 0",
    overflow: "hidden",
  });

  return (
    <Root>
      {/* Кнопка для создания новой комнаты */}
      <Grid
        container
        spacing={4}
        sx={{
          position: "relative",
          ml: { xs: 0, sm: 2, md: 6, lg: 14 },
          px: { xs: 2, sm: 0 },
          display: "flex",
        }}
      >
        <Grid item>
          <Box>
            <Button
              sx={{
                mt: { xs: 1, md: 2 },
                color: "#999",
                fontFamily: "monospace",
                fontSize: { xs: 14, sm: 16 },
              }}
              onClick={() => setOpenModalRoomCreate(true)}
            >
              Создать комнату
            </Button>
            {/* Модальное окно */}
            <ModalRoomCreate
              openModalRoomCreate={openModalRoomCreate}
              setOpenModalRoomCreate={setOpenModalRoomCreate}
              closeModalRoomCreate={() => setOpenModalRoomCreate(false)}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Основной контент: комнаты и чат */}
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ mt: { xs: 4, md: 10 }, px: { xs: 2, sm: 3, md: 0 } }}
      >
        <Grid item xs={12} md="auto" sx={{ maxWidth: { xs: "100%" } }}>
          <Box
            className="filter"
            sx={{ overflowX: { xs: "auto", md: "visible" } }}
          >
            <table className="rooms-table">
              <thead>
                <tr>
                  <th
                    className={`${
                      sortConfig.key === "openrooms" ? "active" : ""
                    }`}
                    onClick={() => handleSortRooms("openrooms")}
                    style={{ fontFamily: "monospace", color: "gray" }}
                  >
                    <Typography
                      sx={{
                        mt: { xs: 1, md: 2 },
                        color: "#999",
                        fontFamily: "monospace",
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    >
                      Открытые комнаты
                      <span
                        className={`arrow ${
                          sortConfig.key === "openrooms"
                            ? sortConfig.direction
                            : ""
                        }`}
                      />
                    </Typography>
                  </th>
                  <th
                    className={`${
                      sortConfig.key === "privateroom" ? "active" : ""
                    }`}
                    onClick={() => handleSortRooms("privateroom")}
                    style={{ fontFamily: "monospace", color: "gray" }}
                  >
                    <Typography
                      sx={{
                        mt: { xs: 1, md: 2 },
                        color: "#999",
                        fontFamily: "monospace",
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    >
                      Приватные комнаты
                      <span
                        className={`arrow ${
                          sortConfig.key === "privateroom"
                            ? sortConfig.direction
                            : ""
                        }`}
                      />
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Math.max(openRooms.length, privateRooms.length) > 0 &&
                  Array.from({
                    length: Math.max(openRooms.length, privateRooms.length),
                  }).map((room, index) => (
                    <tr key={index}>
                      <td>
                        {openRoomsSorted[index] ? (
                          <Link
                            component={NavLink}
                            to={`/chatcards/${openRoomsSorted[index]?.id}`}
                            sx={{ textDecoration: "none" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                cursor: "pointer",
                                backgroundColor: "#fff0f5",
                                p: { xs: 1.25, md: 2 },
                                borderRadius: 3,
                                boxShadow:
                                  "0 4px 10px rgba(255, 182, 193, 0.2)",
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-2px) scale(1.01)",
                                  boxShadow:
                                    "0 6px 14px rgba(255, 105, 180, 0.35)",
                                  backgroundColor: "#ffe4ec",
                                },
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "transparent",
                                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                                }}
                              >
                                🌐
                              </Avatar>

                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  cursor: "pointer",
                                  backgroundColor: "#fff0f5",
                                  p: { xs: 1, md: 1 },
                                  borderRadius: 3,
                                  transition:
                                    "transform 0.3s ease, box-shadow 0.3s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px) scale(1.01)",
                                    backgroundColor: "#ffe4ec",
                                  },
                                }}
                              >
                                {" "}
                                {openRoomsSorted[index]?.nameroom || ""}
                              </Typography>
                            </Box>
                          </Link>
                        ) : (
                          <span className="room-cell" />
                        )}
                      </td>

                      <td>
                        {privateRoomsSorted[index] ? (
                          <Box
                            sx={{
                              display: "flex",
                              cursor: "pointer",
                              backgroundColor: "#fff0f5",
                              p: 2,
                              borderRadius: 3,
                              boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                              "&:hover": {
                                transition: "translateY(-4px) scale(1.02)",
                                boxShadow:
                                  "0 6px 14px rgba(255, 105, 180, 0.35)",
                                backgroundColor: "#ffe4ec",
                              },
                            }}
                            onClick={() => {
                              const currentRoom = privateRoomsSorted[index];
                              // если гость — отправляем на логин и выходим
                              if (!userID) {
                                navigate("/signin"); // роут на авторизацию
                                return;
                              }

                              // авторизован: используем флаг с бэка
                              if (currentRoom.hasAccess) {
                                navigate(`/chatcards/${currentRoom.id}`);
                              } else {
                                setSelectedRoomID(
                                  privateRoomsSorted[index].id // или currentRoom.id
                                );
                                setOpenRequestModal(true);
                              }
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "transparent",
                                fontSize: "1.5rem",
                              }}
                            >
                              {" "}
                              🔒
                            </Avatar>

                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: " #1976d2",
                                gap: 1,
                                cursor: "pointer",
                                backgroundColor: "#fff0f5",
                                p: { xs: 1, md: 1 },
                                borderRadius: 3,
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-2px) scale(1.01)",

                                  backgroundColor: "#ffe4ec",
                                },
                              }}
                            >
                              {privateRoomsSorted[index]?.nameroom || ""}
                            </Typography>
                          </Box>
                        ) : (
                          <span className="room-cell" /> // Пуйстой
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Box>
        </Grid>
      </Grid>

      <ModalRoomRequest
        openRequestModal={openRequestModal}
        closeModalRequest={() => setOpenRequestModal(false)}
        roomID={selectedRoomID}
      />
    </Root>
  );
}
