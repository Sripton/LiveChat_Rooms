// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Paper,
//   Divider,
//   Tooltip,
//   IconButton,
//   Avatar,
//   Stack,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// // Иконки
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import SendIcon from "@mui/icons-material/Send";

// import { motion, AnimatePresence } from "framer-motion";
// import { getRoomById } from "../../redux/actions/roomActions";
// import PostEditor from "../PostEditor";
// import CommentEditor from "../CommentEditor";
// import CommentsCard from "../CommentsCard";
// import {
//   fetchAllPosts,
//   deletePostHandler,
// } from "../../redux/actions/postActions";
// import {
//   createReactionPostSubmit,
//   fetchAllReactionPosts,
// } from "../../redux/actions/reactionPostActions";

// import {
//   fetchComments,
//   fetchCommentCounts,
// } from "../../redux/actions/commentActions";
// import "./chatcards.css";

// const easing = [0.2, 0.8, 0.2, 1];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1, delayChildren: 0.2 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 12, scale: 0.98 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.35, ease: easing },
//   },
// };

// export default function ChatCards() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();

//   // ------------ Данные user ------------
//   const { userID } = useSelector((store) => store.user);

//   // --------------- Данные Room ------------------
//   const currentRoom = useSelector((store) => store.room.currentRoom);

//   // забираем все комнаты из store
//   const allPosts = useSelector((store) => store.post.allPosts);

//   // Модальное окно для создания поста
//   const [openModalPost, setOpenModalPost] = useState(false);

//   // состояние для изменения поста
//   const [editPost, setEditPost] = useState(null);

//   // состояние для создания ответов к посту (комментарии)
//   const [openReplyPostId, setOpenReplyPostId] = useState(null);

//   // ?
//   const [expanded, setExpanded] = useState(() => new Set());

//   // состояние для отображения коммнетриев к определенному посту
//   const [showReplyPostId, setShowReplyPostId] = useState(null);

//   // фокус к коммнетриям, для выделения к какому комментарию был ответ
//   const [focusedPostID, setFocusedPostID] = useState(null);

//   const commentsByPostId = useSelector((store) => store.comment.byPostId);
//   const countsByPostId = useSelector((store) => store.comment.countsByPostId);
//   const allReactionPosts = useSelector(
//     (store) => store.reactionsPosts.allReactionPosts,
//   );

//   const mainColor = "#11071c";
//   const pageBg = "#1d102f";
//   const cardBg = "#231433";
//   const cardSoftBg = "#2b183c";
//   const accentColor = "#b794f4";
//   const accentColorStrong = "#c4b5fd";
//   const dangerColor = "#f97373";
//   const textMuted = "#9ca3af";

//   // -------------------- Создание комментария ----------------------
//   const toggleReplyForPost = (postID) => {
//     setOpenReplyPostId((prev) => (prev === postID ? null : postID));
//     setShowReplyPostId(null);
//     setOpenModalPost(false);
//   };

//   // ------------------- Создание и изменение поста -----------------
//   const handleAddPostClick = () => {
//     if (!userID) {
//       navigate("/signin", { state: { from: location } });
//       return;
//     }
//     setEditPost(null);
//     setOpenReplyPostId(null);
//     setOpenModalPost(true);
//   };

//   const handleEditPostClick = (post) => {
//     if (!userID || userID !== post.user_id) return;
//     setEditPost(post);
//     setOpenReplyPostId(null);
//     setOpenModalPost(true);
//   };

//   // ------------------- Отображение полного поста -----------------
//   const toggleExpand = (postID) => {
//     setExpanded((prev) => {
//       const next = new Set(prev);
//       if (next.has(postID)) {
//         next.delete(postID);
//       } else {
//         next.add(postID);
//       }
//       return next;
//     });
//   };

//   // ------------------- Загрузка данных ---------------------------
//   useEffect(() => {
//     dispatch(getRoomById(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     dispatch(fetchAllPosts(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (Array.isArray(allPosts) && allPosts.length) {
//       allPosts.forEach((post) => dispatch(fetchAllReactionPosts(post.id)));
//     }
//   }, [dispatch, allPosts]);

//   // -------------------- Отображение комментариев -----------------
//   const toggleShowCommentToPost = (postID) => {
//     setShowReplyPostId((prev) => {
//       const next = prev === postID ? null : postID;
//       setFocusedPostID(next ? postID : null);
//       return next;
//     });

//     if (!commentsByPostId?.[postID]) {
//       dispatch(fetchComments(postID));
//     }
//   };

//   const postRender = Array.isArray(allPosts)
//     ? focusedPostID
//       ? allPosts.filter((post) => post.id === focusedPostID)
//       : allPosts
//     : [];

//   useEffect(() => {
//     if (!Array.isArray(allPosts) || allPosts.length === 0) return;
//     (async () => {
//       try {
//         await Promise.all(allPosts.map((p) => dispatch(fetchComments(p.id))));
//         const ids = allPosts.map((p) => p.id);
//         await dispatch(fetchCommentCounts(ids)).unwrap();
//       } catch (error) {
//         console.log(error);
//       }
//     })();
//   }, [dispatch, allPosts]);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "flex-start",
//         justifyContent: "center",
//         px: { xs: 1.5, sm: 2, md: 3 },
//         py: { xs: 1.5, sm: 2 },
//         background: `
//           radial-gradient(1200px 800px at 0% -20%, #3b1d5e 0%, transparent 60%),
//           radial-gradient(1100px 700px at 110% 0%, #4c1d95 0%, transparent 55%),
//           linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)
//         `,
//       }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           width: "100%",
//           maxWidth: 1200,
//           borderRadius: 5,
//           mt: { xs: 1, sm: 2 },
//           p: { xs: 2, sm: 3, md: 4 },
//           background: cardBg,
//           border: "1px solid rgba(255,255,255,0.06)",
//           boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: { xs: "stretch", sm: "flex-start" },
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             {currentRoom?.owner?.avatar ? (
//               <Box
//                 sx={{
//                   width: 70,
//                   height: 70,
//                   borderRadius: "50%",
//                   p: 0.5,
//                   background:
//                     "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
//                 }}
//               >
//                 <img
//                   src={`${process.env.REACT_APP_BASEURL}${currentRoom?.owner?.avatar}`}
//                   alt="user"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                     display: "block",
//                   }}
//                 />
//               </Box>
//             ) : (
//               <Avatar
//                 alt="user"
//                 sx={{
//                   width: 70,
//                   height: 70,
//                   bgcolor: "#3b0764",
//                   color: "#e5e7eb",
//                 }}
//               />
//             )}

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: accentColor,
//                   fontSize: { xs: "1.05rem", sm: "1.15rem" },
//                   fontFamily:
//                     "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
//                   letterSpacing: 0.4,
//                 }}
//               >
//                 {currentRoom?.nameroom}
//               </Typography>
//               {currentRoom?.owner?.name && (
//                 <Typography
//                   variant="caption"
//                   sx={{ color: textMuted, fontSize: "0.75rem" }}
//                 >
//                   Владелец:
//                   {currentRoom.owner.name}
//                 </Typography>
//               )}
//             </Box>
//           </Box>

//           {!openModalPost && (
//             <Button
//               onClick={handleAddPostClick}
//               variant="contained"
//               // disabled={openModalPost}
//               sx={{
//                 alignSelf: { xs: "stretch", sm: "initial" },
//                 background:
//                   "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
//                 color: "#0b0615",
//                 fontWeight: 700,
//                 borderRadius: 999,
//                 px: 2.8,
//                 height: 44,
//                 boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
//                 textTransform: "none",
//                 fontSize: "0.9rem",
//                 "&:hover": {
//                   background:
//                     "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
//                   boxShadow: "0 16px 40px rgba(0,0,0,0.9)",
//                   transform: "translateY(-1px)",
//                 },
//                 transition: "all .2s ease",
//               }}
//             >
//               Добавить пост
//             </Button>
//           )}
//         </Box>

//         {/* Модальное окно для создания/редактирования поста */}
//         {openModalPost && (
//           <Box sx={{ mt: 2 }}>
//             <PostEditor
//               openModalPost={openModalPost}
//               setOpenModalPost={setOpenModalPost}
//               closeModalPost={() => setOpenModalPost(false)}
//               roomID={id}
//               mode={editPost ? "edit" : "create"}
//               editPost={editPost}
//             />
//           </Box>
//         )}

//         <Divider
//           sx={{
//             my: 3,
//             borderColor: "rgba(148,163,184,0.35)",
//           }}
//         />

//         {/* Список постов */}
//         {Array.isArray(postRender) && postRender.length > 0 ? (
//           <Box
//             component={motion.div}
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <AnimatePresence>
//               <Stack spacing={1.5}>
//                 {postRender.map((post) => {
//                   const likePost = allReactionPosts.filter(
//                     (like) =>
//                       like.post_id === post.id && like.reaction_type === "like",
//                   ).length;

//                   const dislikePost = allReactionPosts.filter(
//                     (dislike) =>
//                       dislike.post_id === post.id &&
//                       dislike.reaction_type === "dislike",
//                   ).length;

//                   const comments = commentsByPostId?.[post.id] || [];

//                   return (
//                     <Paper
//                       key={post.id}
//                       component={motion.div}
//                       variants={itemVariants}
//                       elevation={0}
//                       sx={{
//                         display: { xs: "block", sm: "grid" },
//                         cursor: "pointer",
//                         gridTemplateColumns: showReplyPostId
//                           ? "1fr"
//                           : { xs: "128px 1fr", sm: "168px 1fr" },
//                         gap: 1.5,
//                         p: 1.5,
//                         borderRadius: 3,
//                         bgcolor: cardSoftBg,
//                         border: "1px solid rgba(148,163,184,0.25)",
//                         boxShadow: "0 10px 26px rgba(0,0,0,0.85)",
//                         transition:
//                           "transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease",
//                         "&:hover": {
//                           transform: "translateY(-2px)",
//                           boxShadow: "0 16px 40px rgba(0,0,0,1)",
//                           borderColor: "rgba(183,148,244,0.7)",
//                           bgcolor: "#2f1943",
//                         },
//                       }}
//                     >
//                       {/* Левая колонка с аватаром / превью (desktop) */}
//                       {!showReplyPostId && (
//                         <Box
//                           sx={{
//                             position: "relative",
//                             borderRadius: 2,
//                             overflow: "hidden",
//                             background:
//                               "radial-gradient(circle at 0% 0%, #4c1d95 0%, transparent 60%), radial-gradient(circle at 100% 0%, #7c3aed 0%, transparent 55%), #111827",
//                             "&::before": {
//                               content: '""',
//                               display: "block",
//                               paddingTop: "56.25%", // 16:9
//                             },
//                             display: { xs: "none", sm: "flex" },
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               position: "absolute",
//                               inset: 0,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             {post?.User?.avatar ? (
//                               <Box
//                                 component="img"
//                                 src={`${process.env.REACT_APP_BASEURL}${post?.User?.avatar}`}
//                                 alt="user"
//                                 sx={{
//                                   width: 56,
//                                   height: 56,
//                                   borderRadius: "50%",
//                                   objectFit: "cover",
//                                   boxShadow:
//                                     "0 8px 22px rgba(0,0,0,0.85), 0 0 0 2px rgba(249,250,251,0.4)",
//                                 }}
//                               />
//                             ) : (
//                               <Avatar
//                                 sx={{
//                                   width: 56,
//                                   height: 56,
//                                   bgcolor: "#4b5563",
//                                   color: "#e5e7eb",
//                                 }}
//                               />
//                             )}
//                           </Box>
//                         </Box>
//                       )}

//                       {/* Правая колонка — контент поста */}
//                       <Box sx={{ minWidth: 0, display: "grid", gap: 0.5 }}>
//                         {/* Автор + дата */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                           }}
//                         >
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               color: accentColorStrong,
//                               fontWeight: 600,
//                               letterSpacing: 0.2,
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               maxWidth: "100%",
//                             }}
//                             title={post?.User?.name}
//                           >
//                             {post?.User?.name}
//                           </Typography>

//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: textMuted,
//                               ml: "auto",
//                               fontSize: "0.72rem",
//                             }}
//                           >
//                             {new Date(
//                               Date.parse(post.createdAt),
//                             ).toLocaleDateString()}
//                           </Typography>
//                         </Box>

//                         {/* Заголовок поста */}
//                         <Typography
//                           className="yt-title"
//                           sx={{
//                             mt: 0.25,
//                             color: "#e5e7eb",
//                             fontSize: { xs: "0.98rem", sm: "1.05rem" },
//                             fontWeight: 600,
//                             fontFamily:
//                               "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
//                             lineHeight: 1.25,
//                             cursor: "default",
//                           }}
//                         >
//                           {(() => {
//                             const full = post.postTitle || "";
//                             const isLong = full.length > 150;
//                             const isOpen = expanded.has(post.id);

//                             if (!isLong) {
//                               return (
//                                 <span className="line-clamp-2">{full}</span>
//                               );
//                             }

//                             return (
//                               <>
//                                 <span className="line-clamp-2">
//                                   {isOpen ? full : `${full.slice(0, 80)}`}
//                                 </span>
//                                 <Button
//                                   size="small"
//                                   variant="text"
//                                   onClick={() => toggleExpand(post.id)}
//                                   sx={{
//                                     minWidth: "unset",
//                                     p: 0,
//                                     ml: 0.6,
//                                     lineHeight: 1,
//                                     fontWeight: "bold",
//                                     fontSize: "0.9rem",
//                                     color: accentColor,
//                                     textTransform: "none",
//                                     "&:hover": {
//                                       backgroundColor: "transparent",
//                                       color: accentColorStrong,
//                                     },
//                                   }}
//                                 >
//                                   {isOpen ? (
//                                     <Typography
//                                       sx={{
//                                         color: textMuted,
//                                         fontSize: "0.8rem",
//                                       }}
//                                     >
//                                       Свернуть
//                                     </Typography>
//                                   ) : (
//                                     "..."
//                                   )}
//                                 </Button>
//                               </>
//                             );
//                           })()}
//                         </Typography>

//                         {/* Панель действий */}
//                         <Box
//                           sx={{
//                             display:
//                               openReplyPostId === post.id ? "none" : "flex",
//                             alignItems: "center",
//                             gap: 0.5,
//                             mt: 0.5,
//                             opacity: 0.85,
//                             transition: "opacity .2s ease",
//                             "& .MuiButton-startIcon": { mr: 0.5 },
//                             "&:hover": { opacity: 1 },
//                           }}
//                         >
//                           <Tooltip title="Нравится">
//                             <Button
//                               size="small"
//                               sx={{
//                                 color: accentColorStrong,
//                                 fontWeight: 700,
//                                 minWidth: 0,
//                                 px: 1,
//                                 fontSize: "0.8rem",
//                               }}
//                               startIcon={
//                                 <ThumbUpIcon sx={{ fontSize: "1rem" }} />
//                               }
//                               onClick={() =>
//                                 dispatch(
//                                   createReactionPostSubmit(post.id, "like"),
//                                 )
//                               }
//                             >
//                               {likePost}
//                             </Button>
//                           </Tooltip>
//                           <Tooltip title="Не нравится">
//                             <Button
//                               size="small"
//                               sx={{
//                                 color: dangerColor,
//                                 fontWeight: 700,
//                                 minWidth: 0,
//                                 px: 1,
//                                 fontSize: "0.8rem",
//                               }}
//                               startIcon={
//                                 <ThumbDownIcon sx={{ fontSize: "1rem" }} />
//                               }
//                               onClick={() =>
//                                 dispatch(
//                                   createReactionPostSubmit(post.id, "dislike"),
//                                 )
//                               }
//                             >
//                               {dislikePost}
//                             </Button>
//                           </Tooltip>
//                           <Tooltip title="Комментарии">
//                             <Button
//                               size="small"
//                               sx={{
//                                 color: textMuted,
//                                 fontWeight: 700,
//                                 minWidth: 0,
//                                 px: 1,
//                                 fontSize: "0.8rem",
//                               }}
//                               startIcon={
//                                 focusedPostID === post.id ? (
//                                   <VisibilityIcon sx={{ fontSize: "1rem" }} />
//                                 ) : (
//                                   <VisibilityOffIcon
//                                     sx={{ fontSize: "1rem" }}
//                                   />
//                                 )
//                               }
//                               onClick={() => {
//                                 toggleShowCommentToPost(post.id);
//                               }}
//                             >
//                               {countsByPostId[post.id] ?? 0}
//                             </Button>
//                           </Tooltip>

//                           {/* Справа — действия автора / ответ */}
//                           {userID !== post?.user_id ? (
//                             <Box
//                               sx={{
//                                 ml: "auto",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 0.5,
//                               }}
//                             >
//                               <Tooltip title="Ответить">
//                                 <IconButton
//                                   size="small"
//                                   sx={{ color: accentColor }}
//                                   onClick={() => toggleReplyForPost(post.id)}
//                                 >
//                                   <SendIcon sx={{ fontSize: "1.1rem" }} />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           ) : (
//                             <Box
//                               sx={{
//                                 ml: "auto",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 0.5,
//                               }}
//                             >
//                               <Tooltip title="Редактировать">
//                                 <IconButton
//                                   size="small"
//                                   sx={{ color: accentColorStrong }}
//                                   onClick={() => {
//                                     handleEditPostClick(post);
//                                     window.scrollTo({
//                                       top: 0,
//                                       behavior: "smooth",
//                                     });
//                                   }}
//                                 >
//                                   <EditIcon sx={{ fontSize: "1.1rem" }} />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Удалить">
//                                 <IconButton
//                                   size="small"
//                                   sx={{ color: dangerColor }}
//                                   onClick={() =>
//                                     dispatch(deletePostHandler(post.id))
//                                   }
//                                 >
//                                   <DeleteIcon sx={{ fontSize: "1.1rem" }} />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Ответить">
//                                 <IconButton
//                                   size="small"
//                                   sx={{ color: accentColor }}
//                                   onClick={() => toggleReplyForPost(post.id)}
//                                 >
//                                   <SendIcon sx={{ fontSize: "1.1rem" }} />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           )}
//                         </Box>

//                         {/* Форма комментария */}
//                         {!openModalPost && openReplyPostId === post.id && (
//                           <CommentEditor
//                             postID={post.id}
//                             onClose={() => setOpenReplyPostId(null)}
//                             parentID={null}
//                           />
//                         )}

//                         {/* Список комментариев */}
//                         {showReplyPostId === post.id && (
//                           <CommentsCard
//                             comments={comments}
//                             postID={post.id}
//                             post={post}
//                             expanded={expanded}
//                             toggleExpand={toggleExpand}
//                             userID={userID}
//                             openReplyPostId={openReplyPostId}
//                             setOpenModalPost={setOpenModalPost}
//                             openModalPost={openModalPost}
//                           />
//                         )}
//                       </Box>
//                     </Paper>
//                   );
//                 })}
//               </Stack>
//             </AnimatePresence>
//           </Box>
//         ) : null}
//       </Paper>
//     </Box>
//   );
// }

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

  const { userID } = useSelector((store) => store.user);
  const currentRoom = useSelector((store) => store.room.currentRoom);
  const allPosts = useSelector((store) => store.post.allPosts);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [postForReply, setPostForReply] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(() => new Set());
  const [postWithVisibleComments, setPostWithVisibleComments] = useState(null);
  const [focusedPostID, setFocusedPostID] = useState(null);

  const commentsByPostId = useSelector((store) => store.comment.byPostId);
  const countsByPostId = useSelector((store) => store.comment.countsByPostId);
  const allReactionPosts = useSelector(
    (store) => store.reactionsPosts.allReactionPosts,
  );

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
    setPostForReply(null);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setPostToEdit(null);
  };

  const handleReplyToPost = (postID) => {
    if (!userID) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    setPostForReply((prev) => (prev === postID ? null : postID));
    setPostWithVisibleComments(null);
  };

  const handleToggleComments = (postID) => {
    setPostWithVisibleComments((prev) => {
      const next = prev === postID ? null : postID;
      setFocusedPostID(next ? postID : null);
      return next;
    });
    setPostForReply(null);
  };

  const handleToggleExpand = (postID) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postID)) {
        next.delete(postID);
      } else {
        next.add(postID);
      }
      return next;
    });
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
                  Владелец:
                  {currentRoom.owner.name}
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
              roomID={id}
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
                  const isExpanded = expandedPosts.has(post.id);
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
                          }}
                        >
                          {post.postTitle &&
                          post.postTitle.length > 200 &&
                          !isExpanded
                            ? `${post.postTitle.substring(0, 200)}...`
                            : post.postTitle}
                          {post.postTitle && post.postTitle.length > 200 && (
                            <Button
                              size="small"
                              onClick={() => handleToggleExpand(post.id)}
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
                          onClick={() => handleReplyToPost(post.id)}
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
                            expanded={expandedPosts}
                            toggleExpand={handleToggleExpand}
                            userID={userID}
                            openReplyPostId={postForReply}
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
