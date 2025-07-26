import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { getRoomById } from "../../redux/actions/roomActions";
import ModalPostCreate from "../ModalPostCreate";
import { fetchAllPosts } from "../../redux/actions/postActions";
import "./chatcards.css";

export default function ChatCards() {
  //  Управление отображением модального окна создания поста
  const [openModalPost, setOpenModalPost] = useState(false);

  const dispatch = useDispatch(); // useDispatch — отправка действий
  const navigate = useNavigate(); // переход по маршрутам
  const { id } = useParams(); //  извлекает id комнаты из URL

  //  Извлечение данных комнаты, постов и ID пользователя из Redux
  const currentRoom = useSelector((store) => store.room.currentRoom); // useSelector - доступ к состоянию Redux-хранилища
  const allPosts = useSelector((store) => store.post.allPosts);
  const userID = useSelector((store) => store.user.userID);

  //  Если пользователь не авторизован, редирект на /signin
  //  Иначе переключение отображения модального окна
  const handleAddPostClick = () => {
    if (!userID) {
      navigate("/signin");
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

  return (
    // Основной макет
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: 2,
      }}
    >
      {/* Карточка со всей информацией (включает заголовок, описание, посты) */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1200,
          borderRadius: 4,
          mt: 2,
          p: 4,
          backgroundColor: "#ffe4e9", // светло-розовый фон
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Заголовок и кнопка "Добавить пост" */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#c2185b",
                mb: 1,
                fontFamily: "monospace",
              }}
            >
              {" "}
              {currentRoom?.nameroom || "Название комнаты"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6a1b9a",
                fontSize: "1.5rem",
                fontFamily: "monospace",
              }}
            >
              {" "}
              {currentRoom?.description || "Описание комнаты"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f06292",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ec407a",
              },
              height: "40px",
              mt: { xs: 2, sm: 0 },
              display: openModalPost ? "none" : "",
            }}
            onClick={handleAddPostClick}
          >
            Добавить пост
          </Button>
        </Box>
        {/* Отображение постов */}
        {openModalPost ? (
          <>
            <Box>
              <ModalPostCreate
                openModalPost={openModalPost}
                setOpenModalPost={setOpenModalPost}
                id={id}
              />
            </Box>
            <Box className="post-list">
              {/* Рендер всех постов, связанных с комнатой */}
              {allPosts.map((post) => (
                <Box className="post" key={post.id} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#6a1b9a",
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {post.postTitle}
                  </Typography>
                  <Box className="post-action">
                    <Button sx={{ color: "#ec407a" }}>
                      <ThumbUpIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                      {0}
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <ThumbDownIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                      {0}
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <EditIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <SendIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box className="post-list">
            {/* Рендер всех постов, связанных с комнатой */}
            {allPosts.map((post) => (
              <Box className="post" sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: "#6a1b9a",
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                  }}
                >
                  {post.postTitle}
                </Typography>
                <Box className="post-action">
                  <Button sx={{ color: "#ec407a" }}>
                    <ThumbUpIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                    {0}
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <ThumbDownIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                    {0}
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <EditIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <SendIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
