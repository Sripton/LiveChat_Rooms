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
  // Состояние для хранения информации о текущей сортировке
  // key — по какому полю сортируем, direction — asc или desc
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Состояния сообщений  для анимации
  const [visibleMessages, setVisibleMessages] = useState([]);

  // Состояния модального окна для создания комнат
  const [openModalRoomCreate, setOpenModalRoomCreate] = useState(false);

  // Состояния модального окна для создания запроса к приватным комнатам
  const [openRequestModal, setOpenRequestModal] = useState(false);

  // состояние для выбранной комнаты
  const [selectedRoomID, setSelectedRoomID] = useState(null);

  // -------------------- Получение ID пользователя  из Redux -----------------------
  const { userID } = useSelector((store) => store.user);

  // -------------------- Получение всех комнат из Redux -----------------------
  const allRooms = useSelector((store) => store.room.allRooms); // Извлечение всех комнат из хранилища Redux.
  const dispatch = useDispatch();

  // -------------------- Навигация для перехода по ссылкам -----------------------
  const navigate = useNavigate();

  // Redux: Загрузка всех комнат
  useEffect(() => {
    dispatch(fetchAllRooms()); // Запрашиваем комнаты при монтировании
  }, [dispatch]);

  // -------------------- Разделение комнат по типу: открытые и приватные. -----------------------
  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  // -------------------- Сортировка комнат -----------------------

  // Сортируем открытые комнаты
  const openRoomsSorted = [...openRooms]
    .map((room) => room)
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const asc = direction === "asc";
      if (!key) return 0;
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
      if (!key) return 0;
      if (key === "privateroom") {
        return asc
          ? a.nameroom.localeCompare(b.nameroom)
          : b.nameroom.localeCompare(a.nameroom);
      }
      return 0;
    });

  // Фукнция для оанимации сортировки
  const handleSortRooms = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ------------------------------------- Данные для чата --------------------------
  const messages = [
    {
      id: 1,
      sender: "user",
      text: "Привет. Я Мария. Ты когда-нибудь задумывался, что наш выбор еды влияет на климат сильнее, чем кажется?",
    },
    {
      id: 2,
      sender: "bot",
      text: "Привет Мария. Я Джон. Да, особенно когда читаешь, сколько воды уходит на килограмм говядины — пугает.",
    },
    {
      id: 3,
      sender: "user",
      text: "Вот почему я отказалась от мяса — не из моды, а ради планеты и будущего детей",
    },
    {
      id: 4,
      sender: "bot",
      text: "Звучит честно… Я давно хотел начать с малого — может, ты мне подскажешь?",
    },
  ];

  // -------------------------------- Анимация сообщений -----------------------------
  const intervalRef = useRef();

  useEffect(() => {
    // Останавливаем анимацию, если открыто модальное окно
    if (openModalRoomCreate || openRequestModal) {
      // Если ранее был создан setInterval — очищаем его,
      // чтобы анимация сообщений остановилась на паузе.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return; // Выходим из эффекта — не запускаем новый интервал.
    }
    // Если не все сообщения показаны — продолжаем анимацию
    // Добавляем сообщения по одному
    if (visibleMessages.length < messages.length) {
      // i — индекс следующего сообщения, начинаем с уже показанного количества
      let i = visibleMessages.length;
      // Запускаем setInterval — каждую 1.2 сек добавляем следующее сообщение
      intervalRef.current = setInterval(() => {
        setVisibleMessages((prev) => {
          if (i < messages.length) {
            const next = [...prev, messages[i]]; // добавляем следующее сообщение
            i += 1;
            return next;
          }

          // Если все сообщения показаны — очищаем интервал
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 1200);
    }
    //  Когда  эффект создаёт “асинхронные” вещи (setInterval, setTimeout), подписки, слушатели событий,
    // Надо обязательно их удалить или “отписаться”, чтобы не было утечек памяти и багов.
    // Если не почистить setInterval, он будет продолжать тикать даже когда компонент уже не нужен
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [openModalRoomCreate, openRequestModal, visibleMessages.length]);

  // -------------------- Мемоизированный рендер  сообщений для анимации --------------------
  const renderedMessages = useMemo(
    () =>
      visibleMessages.map((msg) => (
        <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
      )),
    [visibleMessages]
  );

  // -------------------- Стили через styled --------------------
  const Root = styled(Box)({
    minHeight: "100vh",
    background: "#fff0f5",
    padding: "40px 0",
  });

  console.log("privateRooms", privateRooms);

  return (
    <Root>
      {/* Кнопка для создания новой комнаты */}
      <Grid
        container
        spacing={4}
        sx={{
          position: "relative",
          ml: 14,
          display: "flex",
        }}
      >
        <Grid item>
          <Box>
            <Button
              sx={{
                color: "#d81b60",
                fontWeight: 700,
                fontFamily: "monospace",
                fontSize: "1rem",
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
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 10 }}>
        <Grid item>
          <div className="filter">
            <table>
              <thead>
                <tr>
                  <th
                    className={`${
                      sortConfig.key === "openrooms" ? "active" : ""
                    }`}
                    onClick={() => handleSortRooms("openrooms")}
                  >
                    Открытые комнаты
                    <span
                      className={`arrow ${
                        sortConfig.key === "openrooms"
                          ? sortConfig.direction
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    className={`${
                      sortConfig.key === "privateroom" ? "active" : ""
                    }`}
                    onClick={() => handleSortRooms("privateroom")}
                  >
                    Приватные комнаты
                    <span
                      className={`arrow ${
                        sortConfig.key === "privateroom"
                          ? sortConfig.direction
                          : ""
                      }`}
                    />
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
                          <Box sx={{ display: "flex" }}>
                            {/* <MeetingRoomIcon
                              sx={{
                                mr: 2,
                                color: "#76ce7e",
                                cursor: "pointer",
                              }}
                            /> */}
                            <Avatar
                              sx={{
                                bgcolor: "transparent",
                                fontSize: "1.5rem",
                              }}
                            >
                              🌐
                            </Avatar>

                            <Link
                              component={NavLink}
                              to={`/chatcards/${openRoomsSorted[index]?.id}`}
                              sx={{ textDecoration: "none" }}
                            >
                              <Typography
                                sx={{
                                  background:
                                    "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                                  color: "#d81b60",
                                  fontWeight: 900,
                                  borderRadius: 3,
                                  width: "100%",
                                  boxShadow: "0 2px 12px 0 #ffd6e6",
                                  fontSize: 18,
                                  letterSpacing: 0.6,
                                  textTransform: "none",
                                  px: 3,
                                  py: 2,
                                  fontFamily: "monospace",
                                  cursor: "pointer",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                                    color: "#fff",
                                  },
                                  transition:
                                    "all .23s cubic-bezier(.3,1.4,.3,1)",
                                }}
                              >
                                {" "}
                                {openRoomsSorted[index]?.nameroom || ""}
                              </Typography>
                            </Link>
                          </Box>
                        ) : (
                          <span className="room-cell" />
                        )}
                      </td>

                      <td>
                        {privateRoomsSorted[index] ? (
                          <Box sx={{ display: "flex" }}>
                            {/* <LockIcon
                              sx={{
                                mr: 2,
                                color: "#f26f6f",
                                cursor: "pointer",
                              }}
                            /> */}
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
                                background:
                                  "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                                color: "#d81b60",
                                fontWeight: 900,
                                borderRadius: 3,
                                width: "100%",
                                boxShadow: "0 2px 12px 0 #ffd6e6",
                                fontSize: 18,
                                letterSpacing: 0.6,
                                textTransform: "none",
                                px: 1,
                                py: 2,
                                fontFamily: "monospace",
                                cursor: "pointer",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                                  color: "#fff",
                                },
                                transition:
                                  "all .23s cubic-bezier(.3,1.4,.3,1)",
                              }}
                              onClick={() => {
                                const currentRoom = privateRoomsSorted[index];
                                if (currentRoom.ownerID === userID) {
                                  navigate(`/chatcards/${currentRoom.id}`);
                                } else {
                                  // Если не владелец → открываем модалку для отправки запроса
                                  setSelectedRoomID(
                                    privateRoomsSorted[index].id // или currentRoom.id
                                  );
                                  setOpenRequestModal(true);
                                }
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
          </div>
        </Grid>

        {/* Блок анимации/чата */}
        <Grid item>
          <Paper
            sx={{
              padding: "10px 15px",
              boxShadow: "0 8px 32px 0 rgba(230, 30, 99, 0.10)",
              borderRadius: 6,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "400px",
              }}
            >
              {renderedMessages}
            </Box>
          </Paper>
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
