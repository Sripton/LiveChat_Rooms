import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Paper,
  Grid,
  styled,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import ModalRoomCreate from "../ModalRoomCreate/ModalRoomCreate";
import { fetchAllRooms } from "../../redux/actions/roomActions";

export default function Chatrooms() {
  const [openRoomExpanded, setOpenRoomExpanded] = useState(false);
  const [privateRoomExpanded, setPrivateRoomExpanded] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // -------------------- Плавное отображение описания комнат ---------------
  const [tooltip, setToolTip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const showTimeoutRef = useRef(null);
  const hideTimeOutRef = useRef(null);

  const handleMouseEnter = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    clearTimeout(hideTimeOutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      const newX = rect.left + rect.width / 2;
      const newY = rect.top - 10;

      // Только если данные изменились — обновляем стейт
      if (
        !tooltip.visible ||
        tooltip.text !== text ||
        tooltip.x !== newX ||
        tooltip.y !== newY
      ) {
        setToolTip({
          visible: true,
          text,
          x: newX,
          y: newY,
        });
      }
      setShowTooltip(true);
    }, 400); // Задержка перед появлением
  };

  const handleMouseLeave = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeOutRef.current = setTimeout(() => {
      setShowTooltip(false); // Начать исчезновение
      setTimeout(() => {
        setToolTip({
          visible: false,
          text: "",
          x: 0,
          y: 0,
        });
      }, 300);
    }, 100); // После окончания анимации скрытия
    setToolTip({ ...tooltip, visible: false });
  };

  //  Очистка таймеров при размонтировании (безопасность)
  useEffect(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeOutRef.current);
  }, []);

  // -------------------- Получение всех комнат с сервера -----------------------
  const allRooms = useSelector((store) => store.room.allRooms);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);
  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  const handlerIsExpanded = (state) => {
    if (state === "open") {
      setOpenRoomExpanded((prev) => !prev);
    }
    if (state === "private") {
      setPrivateRoomExpanded((prev) => !prev);
    }
  };
  // ------------------------------------- Данные для чата --------------------------
  const messages = [
    {
      sender: "user",
      text: "Привет. Я Мария. Ты когда-нибудь задумывался, что наш выбор еды влияет на климат сильнее, чем кажется?",
    },
    {
      sender: "bot",
      text: "Привет Мария. Я Джон. Да, особенно когда читаешь, сколько воды уходит на килограмм говядины — пугает.",
    },
    {
      sender: "user",
      text: "Вот почему я отказалась от мяса — не из моды, а ради планеты и будущего детей",
    },
    {
      sender: "bot",
      text: "Звучит честно… Я давно хотел начать с малого — может, ты мне подскажешь?",
    },
  ];

  // -------------------------------- Анимация -----------------------------
  // Старая логика для анимации
  // const animationPlayed = useRef(false);
  // useEffect(() => {
  //   if (!animationPlayed.current) {
  //     let i = 0;
  //     const interval = setInterval(() => {
  //       if (i < messages.length) {
  //         setVisibleMessages((prev) => [...prev, messages[i]]);
  //         i += 1;
  //       } else {
  //         clearInterval(interval);
  //       }
  //     }, 1100);
  //     // После первого запуска эффекта  реф всегда остаётся true (пока компонент не размонтируется),
  //     //  и анимация больше не проигрывается повторно, даже если произойдёт ререндер по другим причинам.
  //     animationPlayed.current = true;

  //     return () => clearInterval(interval);
  //   }
  //   return undefined;
  // }, []);

  // Новая логика для анимации
  const intervalRef = useRef();
  useEffect(() => {
    // Если открыта модалка создания комнаты
    if (openModal) {
      // Если ранее был создан setInterval — очищаем его,
      // чтобы анимация сообщений остановилась на паузе.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return; // Выходим из эффекта — не запускаем новый интервал.
    }
    // Если не все сообщения показаны — продолжаем анимацию
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
    //  Когда  эффект создаёт “асинхронные” вещи (setInterval, setTimeout, подписки, слушатели событий),
    // Надо обязательно их удалить или “отписаться”, чтобы не было утечек памяти и багов.
    // Если не почистить setInterval, он будет продолжать тикать даже когда компонент уже не нужен!
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [openModal, visibleMessages.length]);

  const Root = styled(Box)({
    minHeight: "100vh",
    background: "#fde4ec",
    padding: "40px 0",
  });

  const RoomList = styled(Paper)({
    background: "#fff0f6",
    padding: "24px",
    borderRadius: 20,
    marginBottom: 24,
    boxShadow: "0 4px 16px 0 rgba(230, 30, 99, 0.04)",
  });

  // const ChatAnimation = styled(motion.div)(({ sender }) => ({
  //   alignSelf: sender === "user" ? "flex-end" : "flex-start",
  //   background: sender === "user" ? "#f8bbd0" : "#fff",
  //   color: "#7b1fa2",
  //   margin: "8px 0",
  //   padding: "14px 20px",
  //   borderRadius: 18,
  //   maxWidth: "90%",
  //   boxShadow: "0 1px 8px rgba(230,30,99,0.06)",
  // }));

  return (
    <Root>
      <Grid
        container
        sx={{
          position: "relative",
          mt: 6,
          ml: 14,
          display: "flex",
        }}
      >
        <Grid item>
          <Box>
            <Button
              sx={{ color: "#d81b60", fontWeight: 700 }}
              onClick={() => setOpenModal(true)}
            >
              Создать комнату
            </Button>
            {/* Модальное окно */}
            <ModalRoomCreate
              openModal={openModal}
              setOpenModal={setOpenModal}
              closeModal={() => setOpenModal(false)}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ position: "relative", mt: 8 }}
      >
        {/* Блок открытых комнат */}
        <Grid
          item
          sx={{
            maxHeight: openRoomExpanded ? "none" : "628px",
            overflow: openRoomExpanded ? "auto" : "hidden",
            transition: "max-height 0.3s ease",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#d81b60",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                transform: openRoomExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                mr: 1,
              }}
              onClick={() => handlerIsExpanded("open")}
            />
            Открытые комнаты
          </Typography>
          <RoomList>
            <List>
              {openRooms.map((room, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ padding: "10px 0" }}>
                    <ListItemIcon>
                      <MeetingRoomIcon
                        // color="secondary"
                        sx={{
                          mr: 1,
                          color: "#76ce7e",
                        }}
                      />
                      {/* <Tooltip
                        title={`${room.description}`}
                        arrow
                        placement="top"
                        // можно задать стили тултипа напрямую через slotProps
                        slotProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#f06292", // розовый фон
                              color: "#fff", // белый текст
                              fontSize: 25,
                              fontWeight: 500,
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                              borderRadius: 1.5,
                              px: 2,
                              py: 1,
                            },
                          },
                          arrow: {
                            sx: {
                              color: "#f06292", // цвет стрелки — как фон тултипа
                            },
                          },
                        }}
                      >
                        <ListItemText
                          primary={`${room.nameroom}`}
                          sx={{
                            background:
                              "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                            color: "#d81b60",
                            fontWeight: 900,
                            borderRadius: 3,
                            width: "100%",
                            boxShadow: "0 2px 12px 0 #ffd6e6",
                            fontSize: 24,
                            letterSpacing: 0.6,
                            textTransform: "none",
                            px: 3,
                            py: -1.5,
                            "&:hover": {
                              background:
                                "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                              color: "#fff",
                            },
                            transition: "all .23s cubic-bezier(.3,1.4,.3,1)",
                          }}
                        />
                      </Tooltip> */}
                      <Box
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, room.description)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <ListItemText
                          primary={`${room.nameroom}`}
                          sx={{
                            background:
                              "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                            color: "#d81b60",
                            fontWeight: 900,
                            borderRadius: 3,
                            width: "100%",
                            boxShadow: "0 2px 12px 0 #ffd6e6",
                            fontSize: 24,
                            letterSpacing: 0.6,
                            textTransform: "none",
                            px: 3,
                            py: -1.5,
                            "&:hover": {
                              background:
                                "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                              color: "#fff",
                            },
                            transition: "all .23s cubic-bezier(.3,1.4,.3,1)",
                          }}
                        />
                      </Box>
                    </ListItemIcon>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </RoomList>
        </Grid>

        {/* Блок приватных комнат */}
        <Grid
          item
          sx={{
            maxHeight: privateRoomExpanded ? "none" : "628px",
            overflow: privateRoomExpanded ? "auto" : "hidden",
            transition: "max-height 0.3s ease",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#d81b60",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                transform: privateRoomExpanded
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s ease",
                mr: 1,
              }}
              onClick={() => handlerIsExpanded("private")}
            />
            Закрытые комнаты
          </Typography>
          <RoomList>
            <List>
              {privateRooms.map((room, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ padding: "15px 0" }}>
                    <ListItemIcon>
                      <LockIcon
                        // color="secondary"
                        sx={{
                          mr: 1,
                          color: "#f26f6f",
                        }}
                      />
                      <Box
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, room.description)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <ListItemText
                          primary={room.nameroom}
                          sx={{
                            background:
                              "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                            color: "#d81b60",
                            fontWeight: 900,
                            borderRadius: 3,
                            width: "100%",
                            boxShadow: "0 2px 12px 0 #ffd6e6",
                            fontSize: 24,
                            letterSpacing: 0.6,
                            textTransform: "none",
                            px: 3,
                            py: -1.5,
                            "&:hover": {
                              background:
                                "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                              color: "#fff",
                            },
                            transition: "all .23s cubic-bezier(.3,1.4,.3,1)",
                          }}
                        />
                      </Box>
                    </ListItemIcon>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </RoomList>
        </Grid>

        {/* Блок анимации/чата */}
        <Grid item>
          <Paper
            sx={{
              padding: "32px 28px",
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
              }}
            >
              {/* {visibleMessages.map((msg, index) => (
                <ChatAnimation
                  sender={msg.sender}
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 1 }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                </ChatAnimation>
              ))} */}
              {visibleMessages.map((msg, index) => (
                <Fade in key={msg.text + msg.sender} timeout={600}>
                  <Paper
                    sx={{
                      alignSelf:
                        msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "#f8bbd0" : "#fff",
                      color: "#7b1fa2",
                      margin: "8px 0",
                      padding: "14px 20px",
                      borderRadius: 18,
                      maxWidth: "70%",
                    }}
                  >
                    <Typography>{msg.text}</Typography>
                  </Paper>
                </Fade>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {tooltip.visible && (
        <Box
          sx={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "#f06292",
            color: "#fff",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: 14,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            pointerEvents: "none",
            zIndex: 1500,
            opacity: showTooltip ? 1 : 0,
            transform: showTooltip ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {tooltip.text}
        </Box>
      )}
    </Root>
  );
}
