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
  Divider,
  Fade,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";
import ModalRoomCreate from "../ModalRoomCreate/ModalRoomCreate";

export default function Chatrooms() {
  const [openRoomExpanded, setOpenRoomExpanded] = useState(false);
  const [privateRoomExpanded, setPrivateRoomExpanded] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handlerIsExpanded = (state) => {
    if (state === "open") {
      setOpenRoomExpanded((prev) => !prev);
    }
    if (state === "private") {
      setPrivateRoomExpanded((prev) => !prev);
    }
  };
  // Данные для чата
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

  const animationPlayed = useRef(false);

  useEffect(() => {
    if (!animationPlayed.current) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setVisibleMessages((prev) => [...prev, messages[i]]);
          i += 1;
        } else {
          clearInterval(interval);
        }
      }, 1100);
      // После первого запуска эффекта  реф всегда остаётся true (пока компонент не размонтируется),
      //  и анимация больше не проигрывается повторно, даже если произойдёт ререндер по другим причинам.
      animationPlayed.current = true;

      return () => clearInterval(interval);
    }
    return undefined;
  }, []);

  // Открытые комнаты
  const openRooms = [
    {
      name: "General Chat",
      description: "Открытый чат для всех тем и свободного общения.",
    },
    {
      name: "Music Lovers",
      description:
        "Обсуждаем любимые песни, исполнителей и делимся плейлистами.",
    },
    {
      name: "Book Club",
      description: "Читаем, обсуждаем и советуем книги друг другу.",
    },
    {
      name: "Tech Talks",
      description: "Всё о технологиях, гаджетах и цифровом мире.",
    },
    {
      name: "Book Club",
      description: "Читаем, обсуждаем и советуем книги друг другу.",
    },
    {
      name: "Tech Talks",
      description: "Всё о технологиях, гаджетах и цифровом мире.",
    },
    {
      name: "Music Lovers",
      description:
        "Обсуждаем любимые песни, исполнителей и делимся плейлистами.",
    },
    {
      name: "Book Club",
      description: "Читаем, обсуждаем и советуем книги друг другу.",
    },
    {
      name: "Tech Talks",
      description: "Всё о технологиях, гаджетах и цифровом мире.",
    },
    {
      name: "Book Club",
      description: "Читаем, обсуждаем и советуем книги друг другу.",
    },
    {
      name: "Tech Talks",
      description: "Всё о технологиях, гаджетах и цифровом мире.",
    },
    {
      name: "Book Club",
      description: "Читаем, обсуждаем и советуем книги друг другу.",
    },
    {
      name: "Tech Talks",
      description: "Всё о технологиях, гаджетах и цифровом мире.",
    },
  ];

  // Приватные комнаты
  const privateRooms = [
    {
      name: "Team Alpha",
      description: "Закрытая комната для внутреннего общения команды Alpha.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
    {
      name: "Family Space",
      description: "Личное пространство для общения с семьёй.",
    },
    {
      name: "Startup Founders",
      description: "Приватная группа для обсуждения стартап-идей.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
    {
      name: "Family Space",
      description: "Личное пространство для общения с семьёй.",
    },
    {
      name: "Team Alpha",
      description: "Закрытая комната для внутреннего общения команды Alpha.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
    {
      name: "Family Space",
      description: "Личное пространство для общения с семьёй.",
    },
    {
      name: "Startup Founders",
      description: "Приватная группа для обсуждения стартап-идей.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
    {
      name: "Family Space",
      description: "Личное пространство для общения с семьёй.",
    },
    {
      name: "Team Alpha",
      description: "Закрытая комната для внутреннего общения команды Alpha.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
    {
      name: "Family Space",
      description: "Личное пространство для общения с семьёй.",
    },
    {
      name: "Startup Founders",
      description: "Приватная группа для обсуждения стартап-идей.",
    },
    {
      name: "Project X",
      description: "Обсуждение и координация секретного проекта X.",
    },
  ];

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
                <React.Fragment key={room.name + index}>
                  <ListItem sx={{ padding: "10px 0" }}>
                    <ListItemIcon>
                      <MeetingRoomIcon
                        color="secondary"
                        sx={{
                          mr: 1,
                        }}
                      />
                      <ListItemText
                        primary={`${room.name}`}
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
                    </ListItemIcon>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </RoomList>
        </Grid>
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
                        color="secondary"
                        sx={{
                          mr: 1,
                        }}
                      />
                      <ListItemText
                        primary={room.name}
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
                <Fade in key={index} timeout={600}>
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
    </Root>
  );
}
