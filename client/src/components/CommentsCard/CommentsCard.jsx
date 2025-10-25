import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Paper,
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
  expanded,
  toggleExpand, // функция для отображения полного текста коммнетрия
  userID,
  setOpenModalPost, // Функция состояния при  открытии PostEditor для создания поста
  openModalPost,
}) {
  const accent = "#7a1a50"; // бордовый
  const accentSoft = "rgba(161,19,74,0.08)";
  const cardBg = "rgba(255, 238, 244, 0.85)"; // светло-розово-бордовый фон

  const dispatch = useDispatch();

  // Состояние для изменения коммнетрия по ID
  const [editComment, setEditComment] = useState(null);

  // Состояние для создания дочернего комментария по ID родительсокго комментария
  const [replyForID, setReplyForID] = useState(null);

  // хранит DOM-узлы комментариев по их id
  const itemRefs = useRef({}); // пустой объект
  const [highlightId, setHighlightId] = useState(null);
  const clearTimerRef = useRef(null);
  const focusComment = (id) => {
    if (!id) return;
    const el = itemRefs.current[id];
    if (!el) return; // родитель может быть не в текущем списке

    // подсветка
    setHighlightId(id);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setHighlightId(null), 1500);

    // скролл к центру
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // дать фокус для доступности
    el.focus?.();
  };

  //  Микро-защита от утечек таймеров если использовать setTimeout для подсветки
  useEffect(() => {
    if (clearTimerRef?.current) {
      clearTimeout(clearTimerRef?.current);
    }
  }, []);

  // Забираем все реакции на комментарии из store
  const allReactionComments = useSelector(
    (store) => store?.reactionsComments?.allReactionComments
  );

  useEffect(() => {
    if (Array.isArray(comments) && comments.length) {
      comments.forEach((comment) =>
        dispatch(fetchAllCommentReactions(comment.id))
      );
    }
  }, [dispatch, comments]);

  // Если открыто PostEditor
  useEffect(() => {
    if (openModalPost) {
      setReplyForID(null); // Закрываем CommentEditor для создания комментария
      setEditComment(null); // Закрываем CommentEditor для изменения комментария
    }
  }, [openModalPost]); // Зависимоость от openModalPost
  console.log("openModalPost", openModalPost);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: cardBg,
        border: `1px solid ${accentSoft}`,
        boxShadow:
          "0 10px 30px rgba(161,19,74,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        overflow: "hidden",
      }}
    >
      {comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: "rgba(122,26,80,0.6)", fontStyle: "italic" }}
        >
          Пока нет комментариев.
        </Typography>
      ) : (
        <Stack
          divider={<Divider sx={{ borderColor: accentSoft }} />}
          spacing={1.5}
        >
          {comments?.map((comment) => {
            const name = comment?.User?.name;
            const avatarUrl = comment?.User?.avatar;
            const text = comment?.commentTitle || "";
            const when = new Date(comment.createdAt).toLocaleString();
            const postAuthor = post?.User?.name ?? "автору поста";
            const commentAuthor = comment?.User?.name ?? "Пользователь";
            const parentAuthor =
              comment?.ParentComment?.User?.name ??
              "автору удалённого комментария";

            const likeComments = allReactionComments.filter(
              (like) =>
                like.comment_id === comment.id && like.reaction_type === "like"
            ).length;
            const disLikeComments = allReactionComments.filter(
              (dislike) =>
                dislike.comment_id === comment.id &&
                dislike.reaction_type === "dislike"
            ).length;
            return (
              <Box
                key={comment.id ?? `${name}-${when}-${text.slice(0, 10)}`}
                ref={(el) => {
                  if (el) itemRefs.current[comment.id] = el;
                }}
                sx={{
                  display: "flex",
                  gap: 1.25,
                  // Подсчетка по parent_id
                  outlineOffset: 2,
                  borderRadius: 2,
                  transition:
                    "outline-color .2s ease, box-shadow .2s ease, background .2s ease",
                  boxShadow:
                    comment.id === highlightId
                      ? "0 0 0 4px rgba(161,19,74,0.15)"
                      : "none",
                  background:
                    comment.id === highlightId
                      ? "rgba(161,19,74,0.06)"
                      : "transparent",
                }}
              >
                {!avatarUrl ? (
                  <Avatar />
                ) : (
                  <Avatar
                    src={`${process.env.REACT_APP_BASEURL}${avatarUrl}`}
                    alt={name}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: avatarUrl ? undefined : "rgba(161,19,74,0.15)",
                      color: accent,
                      border: `1px solid ${accentSoft}`,
                      fontWeight: 700,
                    }}
                  />
                )}

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: accent,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={name}
                    >
                      {name}
                    </Typography>
                    {when && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(122,26,80,0.65)" }}
                      >
                        {when}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
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
                      const full = comment?.commentTitle;
                      const isLong = full?.length > 150;
                      const isOpen = expanded.has(comment.id);
                      if (!isLong) {
                        return <span className="line-clamp-2">{full}</span>;
                      }

                      return (
                        <>
                          <span className="line-clamp-2">
                            {isOpen ? full : `${full.slice(0, 50)}`}
                          </span>
                          <Button
                            size="small"
                            variant="text"
                            sx={{
                              minWidth: "unset",
                              p: 0, // убирает внутренние отступы
                              ml: 0.6,
                              lineHeight: 1,
                              fontWeight: "bold",
                              fontSize: "1rem",
                              color: "#a1134a",
                              "&:hover": {
                                backgroundColor: "transparent", // чтобы при ховере не было серого фона
                                color: "#7a1a50", // можно добавить эффект смены цвета
                              },
                            }}
                            onClick={() => toggleExpand(comment.id)}
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
                  {/* При создании комментрия скрываем его действия */}
                  {replyForID !== comment.id && (
                    <Box
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
                              createReactionCommentSubmit(comment.id, "like")
                            )
                          }
                        >
                          {likeComments}
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
                              createReactionCommentSubmit(comment.id, "dislike")
                            )
                          }
                        >
                          {disLikeComments}
                        </Button>
                      </Tooltip>
                      {comment?.parent_id === null ? (
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(122,26,80,0.65)" }}
                        >
                          {`${commentAuthor} ответил ${postAuthor}`}
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(122,26,80,0.65)" }}
                          onClick={() => focusComment(comment.parent_id)}
                        >
                          {`${comment?.User?.name} ответил ${parentAuthor}`}
                        </Typography>
                      )}

                      {/* Если пользователь не яв-ся автором комментария показываем кнопку "Ответить" */}
                      {userID !== comment.user_id ? (
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
                              onClick={() => {
                                setReplyForID(
                                  replyForID === comment.id ? null : comment.id
                                );
                                setEditComment(null); // Если форма для редактирования поста закрыта, закрываем ее
                                setOpenModalPost(false); // Если форма для создания поста открыта, закрываем ее
                              }}
                            >
                              <SendIcon sx={{ fontSize: "1rem" }} />
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
                          {/* Если пользователь  яв-ся автором комментария показываем все  кнопки */}
                          <Tooltip title="Редактировать">
                            <IconButton
                              size="small"
                              sx={{ color: "#7a1a50" }}
                              onClick={() => {
                                setReplyForID(null);
                                setEditComment({
                                  id: comment.id,
                                  commentTitle: comment.commentTitle,
                                });
                              }}
                            >
                              <EditIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton
                              size="small"
                              sx={{ color: "#7a1a50" }}
                              onClick={() =>
                                dispatch(deleteComment(postID, comment.id))
                              }
                            >
                              <DeleteIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Ответить">
                            <IconButton
                              size="small"
                              sx={{ color: "#7a1a50" }}
                              onClick={() => {
                                setReplyForID(
                                  replyForID === comment?.id
                                    ? null
                                    : comment?.id
                                );
                                setEditComment(null);
                                setOpenModalPost(false);
                              }}
                            >
                              <SendIcon sx={{ fontSize: "1rem" }} />
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
                      postID={postID} // ВАЖНО
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
    </Paper>
  );
}
