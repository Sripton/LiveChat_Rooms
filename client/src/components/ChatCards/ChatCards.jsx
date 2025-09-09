import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Chip,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import { getRoomById } from "../../redux/actions/roomActions";
import ModalPostCreate from "../ModalPostCreate";
import { fetchAllPosts } from "../../redux/actions/postActions";
import "./chatcards.css";

const easing = [0.2, 0.8, 0.2, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easing },
  },
};

export default function ChatCards() {
  //  Управление отображением модального окна создания поста
  const [openModalPost, setOpenModalPost] = useState(false);

  const dispatch = useDispatch(); // useDispatch — отправка действий
  const navigate = useNavigate(); // переход по маршрутам
  const location = useLocation();
  const { id } = useParams(); //  извлекает id комнаты из URL

  //  Извлечение данных комнаты, постов и ID пользователя из Redux
  const currentRoom = useSelector((store) => store.room.currentRoom); // useSelector - доступ к состоянию Redux-хранилища
  const allPosts = useSelector((store) => store.post.allPosts);
  const userID = useSelector((store) => store.user.userID);

  //  Если пользователь не авторизован, редирект на /signin
  //  Иначе переключение отображения модального окна
  const handleAddPostClick = () => {
    if (!userID) {
      navigate("/signin", {
        state: { from: location },
      });
    }
    setOpenModalPost((prev) => !prev);
  };

  // Загрузка данных. При монтировании компонента (или изменении id)
  // Загружается информация о комнате
  useEffect(() => {
    dispatch(getRoomById(id));
  }, [dispatch, id]);

  // Загружаются все посты, относящиеся к комнате
  useEffect(() => {
    dispatch(fetchAllPosts(id));
  }, [dispatch, id]);
  console.log("allPosts", allPosts);

  return (
    // Основной макет
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2 },
        background: `radial-gradient(1200px 800px at 10% -10%, #fff0f4 10%, rgba(255,240,244,0) 60%),
radial-gradient(1200px 800px at 110% 10%, #fde4ec 10%, rgba(253,228,236,0) 60%),
linear-gradient(120deg, #fde4ec 0%, #fff0f5 45%, #f9e1ea 100%)`,
      }}
    >
      <Paper
        elevation={0} // интесивнгость тени
        sx={{
          width: "100%",
          maxWidth: 1200,
          borderRadius: 5,
          mt: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3, md: 4 },
          background: "rgba(255, 238, 244, 0.65)",
          backdropFilter: "saturate(1.1) blur(8px)",
          border: "1px solid rgba(194, 24, 91, 0.12)",
          boxShadow:
            "0 10px 30px rgba(194, 24, 91, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "flex-start" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.2,
                lineHeight: 1.1,
                color: "#a1134a",
                mb: 1,
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                textShadow: "0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {currentRoom?.nameroom}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6a1b9a",
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                opacity: 0.9,
              }}
            >
              {currentRoom?.description}
            </Typography>
          </Box>

          {!openModalPost && (
            <Button
              onClick={handleAddPostClick}
              variant="contained"
              sx={{
                alignSelf: { xs: "stretch", sm: "initial" },
                background: "linear-gradient(180deg, #f48fb1, #ec407a)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 3,
                px: 2.5,
                height: 44,
                boxShadow: "0 6px 16px rgba(236,64,122,0.35)",
                "&:hover": {
                  background: "linear-gradient(180deg, #f06292, #d81b60)",
                  boxShadow: "0 10px 22px rgba(216,27,96,0.35)",
                  transform: "translateY(-1px)",
                },
                transition: "all .25s ease",
              }}
            >
              Добавить пост
            </Button>
          )}
        </Box>
        {openModalPost && (
          <Box sx={{ mt: 2 }}>
            <ModalPostCreate
              openModalPost={openModalPost}
              setOpenModalPost={setOpenModalPost}
              id={id}
            />
          </Box>
        )}
        <Divider sx={{ my: 3, borderColor: "rgba(194,24,91,0.15)" }} />
        {/* Плоский список постов */}
        {Array.isArray(allPosts) && allPosts.length > 0 ? (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <AnimatePresence>
              {allPosts.map((post) => (
                <Box
                  className="post-list"
                  key={post.id}
                  component={motion.div}
                  variants={itemVariants}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr auto",
                      sm: "minmax(0,1fr) auto",
                    },
                    alignItems: "center",
                    columnGap: 1.5,
                    py: 1.25,
                    borderBottom: "1px solid rgba(161, 19, 74, 0.12)",
                    "&:hover .post-title": { color: "#a1134a" },
                    "&:hover .post-actions": { opacity: 1 },
                  }}
                >
                  <Box>
                    <Typography
                      className="post"
                      sx={{
                        color: "#7a1a50",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        fontFamily:
                          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                        mb: 0.25,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.postTitle}
                    </Typography>
                    <Box />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifySelf: "end",
                        opacity: 0.65,
                        transition: "opacity .2s ease",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Tooltip title="Нравится">
                        <Button
                          size="small"
                          sx={{
                            color: "#d81b60",
                            fontWeight: 700,
                            minWidth: 0,
                            px: 1,
                          }}
                          startIcon={<ThumbUpIcon />}
                        >
                          0
                        </Button>
                      </Tooltip>
                      <Tooltip title="Не нравится">
                        <Button
                          size="small"
                          sx={{
                            color: "#d81b60",
                            fontWeight: 700,
                            minWidth: 0,
                            px: 1,
                          }}
                          startIcon={<ThumbDownIcon />}
                        >
                          0
                        </Button>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton size="small" sx={{ color: "#7a1a50" }}>
                          <EditIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton size="small" sx={{ color: "#7a1a50" }}>
                          <DeleteIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Отправить">
                        <IconButton size="small" sx={{ color: "#7a1a50" }}>
                          <SendIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          ""
        )}
      </Paper>
    </Box>
  );
}
