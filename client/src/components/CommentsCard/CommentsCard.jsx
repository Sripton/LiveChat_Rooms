import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import CommentEditor from "../CommentEditor";
import { deleteComment } from "../../redux/actions/commentActions";
import {
  createReactionCommentSubmit,
  fetchAllCommentReactions,
} from "../../redux/actions/reactionCommentActions";

export default function CommentsCard({
  comments,
  postID,
  post,
  expandedComment,
  toggleExpanded, // функция для отображения полного текста коммнетрия
  userID,
  setOpenModalPost, // Функция состояния при  открытии PostEditor для создания поста
  openModalPost,
}) {
  // Цветовая палитра в стиле ChatCards
  const accentColor = "#7c3aed";
  const accentLight = "#a78bfa";
  const dangerColor = "#ef4444";
  const bgSecondary = "rgba(31, 41, 55, 0.6)";
  const borderColor = "rgba(107, 114, 128, 0.2)";
  const textPrimary = "#f9fafb";
  const textSecondary = "#9ca3af";

  const dispatch = useDispatch();

  // Состояние для изменения коммнетрия по ID
  const [editComment, setEditComment] = useState(null);

  // Состояние для создания дочернего комментария по ID родительсокго комментария
  const [replyForID, setReplyForID] = useState(null);

  // хранит DOM-узлы комментариев по их id
  const itemRefs = useRef({});
  const [highlightId, setHighlightId] = useState(null);
  const clearTimerRef = useRef(null);

  const allReactionComments =
    useSelector((store) => store?.reactionsComments?.allReactionComments) || [];

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString("ru-RU", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const focusComment = (id) => {
    if (!id) return;
    const el = itemRefs.current[id];
    if (!el) return; // родитель может быть не в текущем списке

    setHighlightId(id);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setHighlightId(null), 1500);

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus?.();
  };

  const renderCommentBody = (comment) => {
    const content = comment?.commentTitle || "";
    const isLong = content.length > 220;
    const isExpanded = expandedComment.has(comment.id);

    if (!isLong) return content;

    return (
      <>
        {isExpanded ? content : `${content.slice(0, 220)}...`}
        <Button
          size="small"
          onClick={() => toggleExpanded("comment", comment.id)}
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
          {isExpanded ? "Свернуть" : "Читать далее"}
        </Button>
      </>
    );
  };

  const handleToggleReply = (commentID) => {
    setReplyForID((prev) => (prev === commentID ? null : commentID));
    setEditComment(null);
    if (typeof setOpenModalPost === "function") setOpenModalPost(false);
  };

  const handleEditComment = (comment) => {
    setReplyForID(null);
    setEditComment({
      id: comment.id,
      commentTitle: comment.commentTitle,
    });
  };

  // Микро-защита от утечек таймеров если использовать setTimeout для подсветки
  useEffect(
    () => () => {
      if (clearTimerRef?.current) {
        clearTimeout(clearTimerRef?.current);
      }
    },
    [],
  );

  // Забираем все реакции на комментарии из store
  useEffect(() => {
    if (Array.isArray(comments) && comments.length) {
      comments.forEach((comment) =>
        dispatch(fetchAllCommentReactions(comment.id)),
      );
    }
  }, [dispatch, comments]);

  // Если открыто PostEditor
  useEffect(() => {
    if (openModalPost) {
      setReplyForID(null); // Закрываем CommentEditor для создания комментария
      setEditComment(null); // Закрываем CommentEditor для изменения комментария
    }
  }, [openModalPost]);

  // Если комментариев еще нет
  const isEmpty = !Array.isArray(comments) || comments.length === 0;

  return (
    <Box sx={{ p: 1 }}>
      {isEmpty ? (
        <Typography
          variant="body2"
          sx={{ color: textSecondary, fontStyle: "italic" }}
        >
          Пока нет комментариев.
        </Typography>
      ) : (
        <Stack divider={<Divider sx={{ borderColor }} />} spacing={1.5}>
          {comments.map((comment) => {
            const name = comment?.User?.name || "Аноним";
            const avatarUrl = comment?.User?.avatar;
            const when = formatDate(comment?.createdAt);
            const commentAuthor = comment?.User?.name ?? "Пользователь";
            const postAuthor = post?.User?.name ?? "автору поста";
            const parentAuthor =
              comment?.ParentComment?.User?.name ??
              "автору удалённого комментария";

            const likeComments = allReactionComments.filter(
              (like) =>
                like.comment_id === comment.id && like.reaction_type === "like",
            ).length;
            const disLikeComments = allReactionComments.filter(
              (dislike) =>
                dislike.comment_id === comment.id &&
                dislike.reaction_type === "dislike",
            ).length;

            const isHighlighted = comment.id === highlightId;

            return (
              <Box
                key={comment.id ?? `${name}-${when}`}
                ref={(el) => {
                  if (el) itemRefs.current[comment.id] = el;
                }}
                sx={{
                  display: "flex",
                  gap: 1.25,
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${borderColor}`,
                  bgcolor: isHighlighted
                    ? "rgba(124, 58, 237, 0.12)"
                    : bgSecondary,
                  boxShadow: isHighlighted
                    ? `0 0 0 1px ${accentLight}`
                    : "none",
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
              >
                <Avatar
                  src={
                    avatarUrl
                      ? `${process.env.REACT_APP_BASEURL}${avatarUrl}`
                      : undefined
                  }
                  alt={name}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: avatarUrl ? undefined : accentColor,
                    border: `2px solid ${accentLight}`,
                    color: textPrimary,
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: textPrimary,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {name}
                    </Typography>
                    {when && (
                      <Typography
                        variant="caption"
                        sx={{ color: textSecondary }}
                      >
                        {when}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: textPrimary,
                      lineHeight: 1.5,
                      fontSize: "0.95rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {renderCommentBody(comment)}
                  </Typography>

                  {/* При создании комментрия скрываем его действия */}
                  {replyForID !== comment.id && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 1,
                        pt: 1,
                        borderTop: `1px solid ${borderColor}`,
                        "& .MuiButton-startIcon": { mr: 0.5 },
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<ThumbUpIcon />}
                        onClick={() =>
                          dispatch(
                            createReactionCommentSubmit(comment.id, "like"),
                          )
                        }
                        sx={{
                          color: textSecondary,
                          minWidth: "auto",
                          px: 1,
                          fontSize: "0.8rem",
                        }}
                      >
                        {likeComments}
                      </Button>

                      <Button
                        size="small"
                        startIcon={<ThumbDownIcon />}
                        onClick={() =>
                          dispatch(
                            createReactionCommentSubmit(comment.id, "dislike"),
                          )
                        }
                        sx={{
                          color: textSecondary,
                          minWidth: "auto",
                          px: 1,
                          fontSize: "0.8rem",
                        }}
                      >
                        {disLikeComments}
                      </Button>

                      {comment?.parent_id === null ? (
                        <Typography
                          variant="caption"
                          sx={{ color: textSecondary }}
                        >
                          {`${commentAuthor} ответил ${postAuthor}`}
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: accentLight,
                            cursor: "pointer",
                            "&:hover": { color: accentColor },
                          }}
                          onClick={() => focusComment(comment.parent_id)}
                        >
                          {`${comment?.User?.name} ответил ${parentAuthor}`}
                        </Typography>
                      )}

                      {userID !== comment.user_id ? (
                        <Box sx={{ ml: "auto" }}>
                          <Tooltip title="Ответить">
                            <Button
                              size="small"
                              startIcon={<SendIcon />}
                              onClick={() => handleToggleReply(comment.id)}
                              sx={{
                                color: accentLight,
                                minWidth: "auto",
                                px: 1,
                                fontSize: "0.8rem",
                              }}
                            >
                              Ответить
                            </Button>
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
                          <Tooltip title="Редактировать">
                            <IconButton
                              size="small"
                              sx={{ color: accentLight }}
                              onClick={() => handleEditComment(comment)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Удалить">
                            <IconButton
                              size="small"
                              sx={{ color: dangerColor }}
                              onClick={() =>
                                dispatch(deleteComment(postID, comment.id))
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Ответить">
                            <IconButton
                              size="small"
                              sx={{ color: accentLight }}
                              onClick={() => handleToggleReply(comment.id)}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* ФОРМА ОТВЕТА */}
                  {replyForID === comment?.id && (
                    <CommentEditor
                      postID={postID}
                      parentID={comment.id}
                      onClose={() => setReplyForID(null)}
                      mode="create"
                    />
                  )}

                  {/* ФОРМА РЕДАКТИРОВАНИЯ */}
                  {editComment?.id === comment.id && (
                    <CommentEditor
                      postID={postID}
                      editComment={editComment}
                      onClose={() => setEditComment(null)}
                      mode="edit"
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
