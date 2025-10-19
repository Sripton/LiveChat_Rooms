import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import { getRoomById } from "../../redux/actions/roomActions";
import ModalPostCreate from "../ModalPostCreate";
import CommentEditor from "../CommentEditor";
import CommentsCard from "../CommentsCard";
import {
  fetchAllPosts,
  deletePostHandler,
} from "../../redux/actions/postActions";
import {
  createReactionPostSubmit,
  fetchAllReactionPosts,
} from "../../redux/actions/reactionPostActions";

import {
  fetchComments,
  fetchCommentCounts,
} from "../../redux/actions/commentActions";
import "./chatcards.css";

const easing = [0.2, 0.8, 0.2, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
  const dispatch = useDispatch(); // useDispatch — отправка действий
  const navigate = useNavigate(); // переход по маршрутам
  const location = useLocation();
  const { id } = useParams(); //  извлекает id комнаты из URL
  //  Извлечение данных пользователя из Redux
  const { userID, userAvatar, userName } = useSelector((store) => store.user);
  //  Извлечение данных комнаты из Redux
  const currentRoom = useSelector((store) => store.room.currentRoom); // useSelector - доступ к состоянию Redux-хранилища
  //  Извлечение всех постов из Reduxs
  const allPosts = useSelector((store) => store.post.allPosts);

  //  Состояние для управления отображением модального окна для создания поста
  const [openModalPost, setOpenModalPost] = useState(false);
  // Состояние для создания или изменения поста
  const [editPost, setEditPost] = useState(null);

  // Состояние для открытия формы для создания комменатрия
  const [openReplyPostId, setOpenReplyPostId] = useState(null);

  // Состояние для отображения полного текста поста
  const [expanded, setExpanded] = useState(() => new Set());

  // Состояние для открытия  комментариев
  const [showReplyPostId, setShowReplyPostId] = useState(null);

  // Забираем комментарии из store
  const commentsByPostId = useSelector((store) => store.comment.byPostId);

  // Забираем счетчики коммнетриев  из store
  const countsByPostId = useSelector((store) => store.comment.countsByPostId);

  // -------------------- Создание комментария ----------------------
  // Функция которая следит за состоянием showReplyPostId при нажатии открывается форма для добалвения комментария
  const toggleReplyForPost = (postID) => {
    setOpenReplyPostId((prev) => (prev === postID ? null : postID));
    setOpenModalPost(false);
  };
  // ------------------- Создание и изменение поста -------------------------------------

  //  Если пользователь не авторизован, редирект на /signin
  //  Иначе переключение отображения модального окна
  const handleAddPostClick = () => {
    if (!userID) {
      navigate("/signin", {
        state: { from: location },
      });
      return;
    }
    setEditPost(null);
    setOpenReplyPostId(null);
    setOpenModalPost(true);
  };

  // Функция которая следжит за состоянием измнения поста
  const handleEditPostClick = (post) => {
    if (!userID || userID !== post.user_id) return;
    setEditPost(post);
    setOpenReplyPostId(null);
    setOpenModalPost(true);
  };

  // ------------------- Отображение полного поста ---------------------

  // Функция которая следит за отображением полного текста (поста/кооментария)
  const toggleExpand = (postID) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(postID)) {
        next.delete(postID);
      } else {
        next.add(postID);
      }
      return next;
    });
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

  // Забираем все реакции на посты из store
  const allReactionPosts = useSelector(
    (store) => store.reactionsPosts.allReactionPosts
  );

  useEffect(() => {
    if (Array.isArray(allPosts) && allPosts.length) {
      allPosts.forEach((post) => dispatch(fetchAllReactionPosts(post.id)));
    }
  }, [dispatch, allPosts]);

  // -------------------- Отображение всех коммнетриев для определенного поста ----------------------
  // после загрузки allPosts подгружаем *счётчики* одним батчем
  // важно добавить commentsByPostId, чтобы не дёргать повторно уже загруженные
  // Не важны log
  // useEffect(() => {
  //   if (Array.isArray(allPosts) && allPosts.length) {
  //     allPosts.forEach((post) => dispatch(fetchComments(post.id)));
  //     const ids = allPosts.map((post) => post.id);
  //     dispatch(fetchCommentCounts(ids)); // <- МАССИВ чисел [1,2,3,4]
  //   }
  // }, [dispatch, allPosts]);

  // Promise.all
  // useEffect(() => {
  //   if (!Array.isArray(allPosts) || allPosts.length === 0) return;
  //   // 1) грузим комментарии параллельно
  //   Promise.all(allPosts.map((post) => dispatch(fetchComments(post.id))))
  //     .then((commentsResults) => {
  //       const ids = allPosts.map((p) => p.id);
  //       return dispatch(fetchCommentCounts(ids));
  //     })
  //     .then((counts) => console.log("counts", counts).unwrap())
  //     .catch((err) => console.log(err));
  // }, [dispatch, allPosts]);

  // Функция которая следит за состоянием отображения комментариев
  const toggleShowForPost = (postID) => {
    setShowReplyPostId((prev) => (prev === postID ? null : postID));
    if (!commentsByPostId?.[postID]) {
      dispatch(fetchComments(postID));
    }
  };

  // async
  useEffect(() => {
    if (!Array.isArray(allPosts) || allPosts.length === 0) return;
    (async () => {
      try {
        // 1) грузим комментарии для всех постов параллельно
        await Promise.all(allPosts.map((p) => dispatch(fetchComments(p.id))));
        // 2) одним запросом получаем счётчики
        const ids = allPosts.map((p) => p.id);
        await dispatch(fetchCommentCounts(ids)).unwrap(); // можно ловить ошибки детальнее
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch, allPosts]);

  // !openModalPost && openReplyPostId
  console.log("openModalPost", openModalPost);
  console.log("openReplyPostId", openReplyPostId);

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Для аватара */}
            {currentRoom?.owner?.avatar ? (
              <img
                src={`${process.env.REACT_APP_BASEURL}${currentRoom?.owner?.avatar}`}
                alt="user"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Avatar
                alt="user"
                style={{
                  width: "70px",
                  height: "70px",
                }}
              />
            )}
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
              {currentRoom?.nameroom}
            </Typography>
            <Box />
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
        {/* Модальное окно для создания поста */}
        {openModalPost && (
          <Box sx={{ mt: 2 }}>
            <ModalPostCreate
              openModalPost={openModalPost}
              setOpenModalPost={setOpenModalPost}
              closeModalPost={() => setOpenModalPost(false)}
              roomID={id}
              mode={editPost ? "edit" : "create"}
              editPost={editPost}
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
          >
            <AnimatePresence>
              <Stack spacing={1.5}>
                {allPosts.map((post) => {
                  // Фильтрируем ко-во лайков для данного поста
                  const likePost = allReactionPosts.filter(
                    (like) =>
                      like.post_id === post.id && like.reaction_type === "like"
                  ).length;
                  // Фильтрируем ко-во дизлайков для данного поста
                  const dislikePost = allReactionPosts.filter(
                    (dislike) =>
                      dislike.post_id === post.id &&
                      dislike.reaction_type === "dislike"
                  ).length;

                  // Массив всех комментариев по postID
                  const comments = commentsByPostId?.[post.id] || [];
                  return (
                    <Paper
                      key={post.id}
                      component={motion.div}
                      variants={itemVariants}
                      elevation={0}
                      sx={{
                        display: { xs: "block", sm: "grid" }, // на мобиле — одна колонка, на sm+ — grid
                        cursor: "pointer",
                        gridTemplateColumns: showReplyPostId // gridTemplateColumns  без grid он не работает
                          ? "1fr"
                          : { xs: "128px 1fr", sm: "168px 1fr" },
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "rgba(255, 238, 244, 0.80)", // нежно-розовые карточки на твоём фоне
                        border: "1px solid rgba(161,19,74,0.08)",
                        transition:
                          "transform .18s ease, box-shadow .18s ease, background .18s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 22px rgba(161,19,74,0.12)",
                          bgcolor: "rgba(255, 238, 244, 0.92)",
                        },
                      }}
                    >
                      {/* превью 16:9 слева (как у YouTube) */}
                      {!showReplyPostId && (
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #fde4ec 0%, #fff0f5 100%)",
                            // трюк для соотношения сторон 16:9
                            "&::before": {
                              content: '""',
                              display: "block",
                              paddingTop: "56.25%", // 16:9
                            },
                            // display: "flex",
                            display: { xs: "none", sm: "flex" },
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {post?.User?.avatar ? (
                            <Box
                              component="img"
                              src={`${process.env.REACT_APP_BASEURL}${post?.User?.avatar}`}
                              alt="user"
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                flex: "0 0 auto",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Avatar sx={{ width: 50, height: 50 }} />
                          )}
                        </Box>
                      )}

                      {/* контент справа */}
                      <Box sx={{ minWidth: 0, display: "grid", gap: 0.5 }}>
                        {/* шапка: аватар + автор + дата */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(122,26,80,0.9)",
                              fontWeight: 600,
                              letterSpacing: 0.2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                            title={post?.User?.name}
                          >
                            {post?.User?.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(122,26,80,0.65)", ml: "auto" }}
                          >
                            {new Date(
                              Date.parse(post.createdAt)
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>

                        {/* заголовок  */}
                        <Typography
                          className="yt-title"
                          sx={{
                            mt: 0.25,
                            color: "#7a1a50",
                            fontSize: { xs: "0.98rem", sm: "1.05rem" },
                            fontWeight: 700,
                            fontFamily:
                              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                            lineHeight: 1.25,
                            cursor: "pointer",
                            transition: "color .2s ease",
                            "&:hover": { color: "#a1134a" },
                          }}
                        >
                          {(() => {
                            const full = post.postTitle || "";
                            const isLong = full.length > 150;
                            const isOpen = expanded.has(post.id);

                            if (!isLong) {
                              return (
                                <span className="line-clamp-2">{full}</span>
                              );
                            }

                            return (
                              <>
                                <span className="line-clamp-2">
                                  {isOpen ? full : `${full.slice(0, 80)}`}
                                </span>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => toggleExpand(post.id)}
                                  sx={{
                                    minWidth: "unset", // убирает минимальную ширину MUI-кнопки
                                    p: 0, // убирает внутренние отступы
                                    ml: 0.6,
                                    lineHeight: 1,
                                    fontWeight: "bold",
                                    fontSize: "1rem", // можно увеличить/уменьшить размер точек
                                    color: "#a1134a", // цвет точек
                                    "&:hover": {
                                      backgroundColor: "transparent", // чтобы при ховере не было серого фона
                                      color: "#7a1a50", // можно добавить эффект смены цвета
                                    },
                                  }}
                                >
                                  {isOpen ? (
                                    <Typography sx={{ color: "#999" }}>
                                      {" "}
                                      Свернуть
                                    </Typography>
                                  ) : (
                                    " ..."
                                  )}
                                </Button>
                              </>
                            );
                          })()}
                        </Typography>

                        <Box
                          // className="post-actions"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.5,
                            opacity: 0.75,
                            transition: "opacity .2s ease",
                            "& .MuiButton-startIcon": { mr: 0.5 },
                            "&:hover": { opacity: 1 },
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
                              onClick={() =>
                                dispatch(
                                  createReactionPostSubmit(post.id, "like")
                                )
                              }
                            >
                              {`${likePost}`}
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
                              onClick={() =>
                                dispatch(
                                  createReactionPostSubmit(post.id, "dislike")
                                )
                              }
                            >
                              {`${dislikePost}`}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Комментарии">
                            <Button
                              size="small"
                              sx={{
                                color: "#d81b60",
                                fontWeight: 700,
                                minWidth: 0,
                                px: 1,
                              }}
                              startIcon={<VisibilityIcon />}
                              onClick={() => {
                                toggleShowForPost(post.id);
                              }}
                            >
                              {countsByPostId[post.id] ?? 0}
                            </Button>
                          </Tooltip>
                          {/* Если пользователь не яв-ся автором поста показываем кнопку "Ответить" */}
                          {userID !== post?.user_id ? (
                            <Box
                              sx={{
                                ml: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Tooltip title="Ответить">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#7a1a50" }}
                                  onClick={() => toggleReplyForPost(post.id)}
                                >
                                  <SendIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                ml: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {/* Если пользователь  яв-ся автором поста показываем все  кнопки */}
                              <Tooltip title="Редактировать">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#7a1a50" }}
                                  onClick={() => {
                                    handleEditPostClick(post);
                                    // Scroll к верху
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Удалить">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#7a1a50" }}
                                  onClick={() =>
                                    dispatch(deletePostHandler(post.id))
                                  }
                                >
                                  <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Ответить">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#7a1a50" }}
                                  onClick={() => toggleReplyForPost(post.id)}
                                >
                                  <SendIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                        {/* Страховка  */}
                        {!openModalPost && openReplyPostId === post.id && (
                          <CommentEditor
                            postID={post.id}
                            onClose={() => setOpenReplyPostId(null)}
                            parentID={null}
                          />
                        )}
                        {showReplyPostId === post.id && (
                          <CommentsCard
                            comments={comments}
                            postID={post.id}
                            post={post}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                            userID={userID}
                            toggleReplyForPost={() => toggleReplyForPost(null)}
                            setOpenReplyPostId={setOpenReplyPostId}
                            setOpenModalPost={setOpenModalPost}
                            openModalPost={openModalPost}
                          />
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </AnimatePresence>
          </Box>
        ) : (
          ""
        )}
      </Paper>
    </Box>
  );
}
