import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Иконки
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

import { motion, AnimatePresence } from "framer-motion";
import { getRoomById } from "../../redux/actions/roomActions";
import PostEditor from "../PostEditor";
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
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing },
  },
};

export default function ChatCards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // ------------------ redux store -----------------
  // Забираем id пользовтаеля из store
  const { userID } = useSelector((store) => store.user);

  // Забираем текущую комнату из store
  const currentRoom = useSelector((store) => store.room.currentRoom);

  // Забираем все посты из store
  const allPosts = useSelector((store) => store.post.allPosts);

  // Забираем комментарии по ключу postId  из store
  const {
    commentsByPostId, // Забираем комментарии по ключу postId  из store
    countsByPostId, // Забираем  ко-во комментариев по ключу postId  из store
  } = useSelector((store) => store.comment);

  // Забираем все реакции к данному посту из store
  const allReactionPosts = useSelector(
    (store) => store.reactionsPosts.allReactionPosts,
  );

  // -------------- useState -------------------------
  // состояние для открытия формы cоздания поста
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // состояние  ввода данных для  cоздания поста
  const [postToEdit, setPostToEdit] = useState(null);

  // состояние   для cоздания ответа на  постыa
  const [postForReply, setPostForReply] = useState(null);

  // состояние для свернуть/развернуть  текст поста
  const [expandedPost, setExpandedPost] = useState(() => new Set());

  // состояние для свернуть/развернуть  текст комментария
  const [expandedComment, setExpandedComment] = useState(() => new Set());

  // состояние для отображения всех коммнетриев
  const [postWithVisibleComments, setPostWithVisibleComments] = useState(null);

  // состояние для отображения коммнетриев  одного только поста и скрытия других постов
  const [focusedPostID, setFocusedPostID] = useState(null);

  // Цветовая палитра (упрощенная)
  const accentColor = "#7c3aed";
  const accentLight = "#a78bfa";
  const dangerColor = "#ef4444";
  const bgPrimary = "rgba(17, 24, 39, 0.8)";
  const bgSecondary = "rgba(31, 41, 55, 0.6)";
  const borderColor = "rgba(107, 114, 128, 0.2)";
  const textPrimary = "#f9fafb";
  const textSecondary = "#9ca3af";

  // Обработчики
  const handleOpenPostModal = (post = null) => {
    if (!userID) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    setPostToEdit(post);
    setIsPostModalOpen(true); // открываем форму создания поста
    setPostForReply(null); // закрываем форму ответа на пост
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false); // закрываем форму создания поста
    setPostToEdit(null); // сбрасыввем postEditor
  };

  // функция создания ответа на пост
  const handleReplyToPost = (postID) => {
    if (!userID) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    // Явно закрываем создание/редактирование поста
    setIsPostModalOpen(false); // закрываем форму создания поста
    setPostToEdit(null); // сбрасыввем postEditor

    // Открываем/закрываем форму ответа
    setPostForReply((prev) => (prev === postID ? null : postID));

    // скрыть блок комментариев
    setPostWithVisibleComments(null);
  };

  // useEffect(() => {
  //   console.log("postForReply =", postForReply);
  // }, [postForReply]);

  const handleToggleComments = (postID) => {
    setPostWithVisibleComments((prev) => {
      const next = prev === postID ? null : postID;
      setFocusedPostID(next ? postID : null);
      return next;
    });

    console.log("TOGGLE COMMENTS -> setPostForReply(null)", postID);
    setPostForReply(null);
  };

  // функция скрыть/показать полный текст поста/комменатрия
  const toggleExpanded = (type, ids) => {
    const toggle = (prev) => {
      const next = new Set(prev); // новое состояние
      if (next.has(ids)) {
        next.delete(ids);
      } else {
        next.add(ids);
      }
      return next;
    };

    if (type === "post") setExpandedPost(toggle);
    if (type === "comment") setExpandedComment(toggle);
  };

  // Загрузка данных
  useEffect(() => {
    dispatch(getRoomById(id));
    dispatch(fetchAllPosts(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Array.isArray(allPosts) && allPosts.length) {
      allPosts.forEach((post) => dispatch(fetchAllReactionPosts(post.id)));
    }
  }, [dispatch, allPosts]);

  const postRender = Array.isArray(allPosts)
    ? focusedPostID
      ? allPosts.filter((post) => post.id === focusedPostID)
      : allPosts
    : [];

  useEffect(() => {
    if (!Array.isArray(allPosts) || allPosts.length === 0) return;
    (async () => {
      try {
        await Promise.all(
          allPosts.map((post) => dispatch(fetchComments(post.id))),
        );
        const ids = allPosts.map((p) => p.id);
        await dispatch(fetchCommentCounts(ids));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [allPosts, dispatch]);

  // console.log("currentRoom", currentRoom);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mt: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Хедер комнаты */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            p: 2,
            bgcolor: bgPrimary,
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={
                currentRoom?.owner?.avatar
                  ? `${process.env.REACT_APP_BASEURL}${currentRoom.owner.avatar}`
                  : undefined
              }
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#4f46e5",
                border: `2px solid ${accentLight}`,
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: textPrimary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {currentRoom?.nameroom}
              </Typography>
              {currentRoom?.owner?.name && (
                <Typography
                  variant="body2"
                  sx={{ color: textSecondary, fontSize: "0.875rem" }}
                >
                  {` Владелец: ${currentRoom.owner.name}`}
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            onClick={() => handleOpenPostModal()}
            variant="contained"
            disabled={isPostModalOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: accentColor,
              color: "white",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                bgcolor: accentLight,
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(124, 58, 237, 0.5)",
              },
            }}
          >
            {isPostModalOpen ? "Создание..." : "Новый пост"}
          </Button>
        </Box>

        {/* Модалка поста */}
        {isPostModalOpen && (
          <Box sx={{ mb: 3 }}>
            <PostEditor
              onCancel={handleClosePostModal}
              setIsPostModalOpen={setIsPostModalOpen}
              roomId={id}
              mode={postToEdit ? "edit" : "create"}
              postToEdit={postToEdit}
            />
          </Box>
        )}

        <Divider sx={{ borderColor, mb: 3 }} />

        {/* Список постов */}
        {Array.isArray(postRender) && postRender.length > 0 ? (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              <Stack spacing={2}>
                {postRender.map((post) => {
                  const likeCount = allReactionPosts.filter(
                    (r) => r.post_id === post.id && r.reaction_type === "like",
                  ).length;

                  const dislikeCount = allReactionPosts.filter(
                    (r) =>
                      r.post_id === post.id && r.reaction_type === "dislike",
                  ).length;

                  const comments = commentsByPostId?.[post.id] || [];
                  const commentCount = countsByPostId[post.id] || 0;
                  const isExpandedPost = expandedPost.has(post.id);
                  const showComments = postWithVisibleComments === post.id;
                  const showReplyForm = postForReply === post.id;

                  return (
                    <Box
                      key={post.id}
                      component={motion.div}
                      variants={itemVariants}
                      sx={{
                        p: 2,
                        bgcolor: bgSecondary,
                        borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        transition: "border-color 0.2s ease",
                        "&:hover": {
                          borderColor: accentLight,
                        },
                      }}
                    >
                      {/* Заголовок и автор */}
                      <Box sx={{ mb: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <Avatar
                            src={
                              post?.User?.avatar
                                ? `${process.env.REACT_APP_BASEURL}${post.User.avatar}`
                                : undefined
                            }
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: textPrimary,
                                fontWeight: 600,
                                lineHeight: 1.2,
                              }}
                            >
                              {post?.User?.name || "Аноним"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: textSecondary }}
                            >
                              {new Date(
                                Date.parse(post.createdAt),
                              ).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Текст поста */}
                        <Typography
                          sx={{
                            color: textPrimary,
                            lineHeight: 1.5,
                            fontSize: "0.95rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {/* Более понятное условие для отображения длинного поста  */}
                          {post.postTitle ? (
                            post.postTitle.length > 200 ? (
                              <>
                                {isExpandedPost
                                  ? post.postTitle
                                  : `${post.postTitle.substring(0, 200)}...`}
                                <Button
                                  size="small"
                                  onClick={() =>
                                    toggleExpanded("post", post.id)
                                  }
                                  sx={{
                                    ml: 0.5,
                                    minWidth: "auto",
                                    p: 0,
                                    color: accentLight,
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    textTransform: "none",
                                  }}
                                >
                                  {isExpandedPost ? "Свернуть" : "Читать далее"}
                                </Button>
                              </>
                            ) : (
                              post.postTitle
                            )
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Box>

                      {/* Панель действий */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                          pt: 1,
                          borderTop: `1px solid ${borderColor}`,
                        }}
                      >
                        {/* Реакции */}
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() =>
                            dispatch(createReactionPostSubmit(post.id, "like"))
                          }
                          sx={{
                            color: textSecondary,
                            minWidth: "auto",
                            px: 1,
                            fontSize: "0.8rem",
                            "& .MuiButton-startIcon": { mr: 0.5 },
                          }}
                        >
                          {likeCount}
                        </Button>

                        <Button
                          size="small"
                          startIcon={<ThumbDownIcon />}
                          onClick={() =>
                            dispatch(
                              createReactionPostSubmit(post.id, "dislike"),
                            )
                          }
                          sx={{
                            color: textSecondary,
                            minWidth: "auto",
                            px: 1,
                            fontSize: "0.8rem",
                            "& .MuiButton-startIcon": { mr: 0.5 },
                          }}
                        >
                          {dislikeCount}
                        </Button>

                        {/* Комментарии */}
                        <Button
                          size="small"
                          startIcon={<CommentIcon />}
                          onClick={() => handleToggleComments(post.id)}
                          sx={{
                            color: textSecondary,
                            minWidth: "auto",
                            px: 1,
                            fontSize: "0.8rem",
                            "& .MuiButton-startIcon": { mr: 0.5 },
                          }}
                        >
                          {commentCount}
                        </Button>

                        {/* Ответить */}
                        <Button
                          size="small"
                          startIcon={<ReplyIcon />}
                          onClick={() => {
                            handleReplyToPost(post.id);
                          }}
                          sx={{
                            color: accentLight,
                            minWidth: "auto",
                            px: 1,
                            fontSize: "0.8rem",
                            "& .MuiButton-startIcon": { mr: 0.5 },
                          }}
                        >
                          Ответить
                        </Button>

                        {/* Действия автора */}
                        {userID === post?.user_id && (
                          <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenPostModal(post)}
                              sx={{ color: accentLight }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch(deletePostHandler(post.id))
                              }
                              sx={{ color: dangerColor }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      {/* Форма ответа */}
                      {showReplyForm && (
                        <Box sx={{ mt: 2 }}>
                          <CommentEditor
                            postID={post.id}
                            onClose={() => setPostForReply(null)}
                            parentID={null}
                          />
                        </Box>
                      )}

                      {/* Комментарии */}
                      {showComments && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: `1px solid ${borderColor}`,
                          }}
                        >
                          <CommentsCard
                            comments={comments}
                            postID={post.id}
                            post={post}
                            expandedComment={expandedComment}
                            toggleExpanded={toggleExpanded}
                            userID={userID}
                            setOpenModalPost={setIsPostModalOpen}
                            openModalPost={isPostModalOpen}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </AnimatePresence>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: textSecondary,
            }}
          >
            <Typography variant="body1">
              Пока нет постов. Будьте первым!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
