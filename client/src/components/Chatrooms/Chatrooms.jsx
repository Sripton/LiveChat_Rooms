import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  DialogActions,
  Checkbox,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close"; // крестик

export default function Chatrooms() {
  const [openRoomExpanded, setOpenRoomExpanded] = useState(false);
  const [privateRoomExpanded, setPrivateRoomExpanded] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [roomCreate, setRoomCreate] = useState({
    nameroom: "",
    description: "",
  });

  const inputFocusRef = useRef(null);
  const roomInputsHandler = (e) => {
    setRoomCreate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const roomSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/rooms`, {
        nameroom: roomCreate.nameroom,
        description: roomCreate.description,
        isPrivate,
      });
      if (response.status === 200) {
        const { data } = response;
        setRooms((prev) => [...prev, data]);
        setRoomCreate({ nameroom: "", description: "" });
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          </Box>
        </Grid>
      </Grid>

      {/* МОДАЛЬНОЕ ОКНО */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        paperpops={{
          sx: {
            background: "linear-gradient(135deg, #ffe4ef 0%, #ffe3e3 100%)",
            boxShadow:
              "0 12px 48px 0 rgba(230, 30, 99, 0.15), 0 1.5px 4px 0 #fff1f7",
            minWidth: 420,
            p: 0,
            borderRadius: 5,
          },
        }}
        transitionDuration={400}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#d81b60",
            letterSpacing: 1,
            fontSize: 22,
            pb: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fde4ec",
            borderBottom: "1.5px solid #fad5e6",
            mb: 4,
          }}
        >
          Новая комната
          <IconButton
            aria-label="close"
            sx={{
              color: "#ec407a",
              ml: 2,
              "&:hover": {
                background: "#fff0f6",
              },
            }}
            size="small"
            onClick={() => setOpenModal(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={roomSubmitHandler}>
          <DialogContent
            sx={{
              px: 4,
              py: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: "transparent",
            }}
          >
            <TextField
              name="nameroom"
              value={roomCreate.nameroom}
              inputRef={inputFocusRef}
              onChange={roomInputsHandler}
              margin="dense"
              fullWidth
              variant="outlined"
              label="Название комнаты"
              sx={{
                background: "#fff",
                borderRadius: 2,
                input: { color: "#ad1457", fontWeight: 500 },
                label: { color: "#d81b60" },
              }}
            />
            <TextField
              name="description"
              value={roomCreate.description}
              onChange={roomInputsHandler}
              margin="dense"
              fullWidth
              variant="outlined"
              label="Описание комнаты"
              sx={{
                background: "#fff",
                borderRadius: 2,
                input: {
                  color: "#ad1457",
                  fontWeight: 500,
                },
                label: { color: "#d81b60" },
              }}
            />
            <Fade in timeout={600}>
              <Box>
                <Checkbox
                  icon=<MeetingRoomIcon />
                  checkedIcon=<LockIcon />
                  sx={{
                    "&.Mui-checked": { color: "#d81b60" },
                  }}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <Typography sx={{ color: "#d81b60", fontWeight: 500 }}>
                  Приватная комната
                </Typography>
              </Box>
            </Fade>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", pr: 3, pb: 2 }}>
            <Button
              sx={{
                background: "#f8bbd0",
                color: "#d81b60",
                fontWeight: 700,
                borderRadius: 3,
                px: 3,
                boxShadow: "0 2px 12px 0 #ffd6e6",
                "&:hover": {
                  background: "#f06292",
                  color: "#fff",
                },
              }}
            >
              Создать
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* <TestDialog /> */}
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
                      <MeetingRoomIcon color="secondary" sx={{ mr: 1 }} />
                      <ListItemText
                        primary={`${room.name}`}
                        sx={{
                          cursor: "pointer",
                        }}
                      />
                    </ListItemIcon>
                  </ListItem>
                  <Divider />
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
            sx={{ color: "#d81b60", textTransform: "uppercase", mb: 2 }}
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
                      <LockIcon color="secondary" sx={{ mr: 1 }} />
                      <ListItemText primary={room.name} />
                    </ListItemIcon>
                  </ListItem>
                  <Divider />
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
