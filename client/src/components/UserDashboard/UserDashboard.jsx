import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  ListItemButton,
  Chip,
} from "@mui/material";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  fetchUserRequestsStatus,
  updateRoomRequestStatus,
} from "../../redux/actions/roomRequestStatusActions";
import { fetchUserRooms } from "../../redux/actions/roomActions";
import { fetchUserReplies } from "../../redux/actions/commentActions";
import { REPLIES_SET } from "../../redux/types/types";

function TabPanel(props) {
  const { index, value, children } = props;
  return <div role="tabpanel">{value === index && <Box>{children}</Box>}</div>;
}

// Функция для спинера
function ActionSpinner({ intent }) {
  const isAccept = intent === "accepted";
  const Icon = isAccept ? CheckCircleIcon : CancelIcon;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
      }}
    >
      <CircularProgress
        size={32}
        thickness={4}
        sx={{
          color: isAccept ? "success.main" : "error.main",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          sx={{
            fontSize: 20,
            color: isAccept ? "success.main" : "error.main",
            opacity: 0.9,
          }}
        />
      </Box>
    </Box>
  );
}
export default function UserDashboard({ userPropsData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const { userAvatar, userName, userID } = userPropsData;

  const { incoming, outgoing, updatingIds, updatingById } = useSelector(
    (store) => store.roomRequestStatus
  );

  // Забираем все комнаты пользователя  из  store
  const userRooms = useSelector((store) => store.room.userRooms);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleChangeTab = (event, newValue) => {
    // MUI Tabs  вызывает onChange с двумя аргументами
    setTabIndex(newValue);
  };

  // Функция определения доступа
  const canEnterRoom = (request, user_id) => {
    const isOwner = request?.Room?.ownerID === user_id;
    const isAccepted = request?.status === "accepted";
    return Boolean(isOwner || isAccepted);
  };

  // Слияние вех запросов в один массив
  const allRequests = [...outgoing, ...incoming];
  useEffect(() => {
    if (userID) {
      dispatch(fetchUserRooms(userID));
    }
  }, [userID, dispatch]);
  useEffect(() => {
    if (userID) {
      dispatch(fetchUserRequestsStatus(userID));
    }
  }, [userID, dispatch]);

  const [arrowRequest, setArrowRequest] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false); // показывать кнопку?
  const listWrapRef = useRef(null);

  const handleArraowRequest = () => setArrowRequest((prev) => !prev);

  // Эффект, который вычисляет «переполнен ли список»
  useEffect(() => {
    const element = listWrapRef.current;
    if (!element) return;

    const compute = () => {
      // на 1px запас, чтобы избежать дрожания из-за округления
      // scrollHeight - полная высота содержимого (включая скрытое)
      // clientHeight - видимая высота контейнера
      setNeedsExpand(element.scrollHeight > element.clientHeight + 1);
    };
    compute(); // первичный расчёт

    const res = new ResizeObserver(compute);
    res.observe(element);

    window.addEventListener("resize", compute);
    return () => {
      res.disconnect();
      window.removeEventListener("resize", compute);
    };
    // зависим от длины данных и активной вкладки
  }, [allRequests.length, tabIndex]);

  // Функция для направления в компонент по редатированию профиля
  const goToProfileEditor = () => {
    navigate("/profileeditor", {
      state: { from: location }, //  сохраняем текущий путь
    });
  };

  const items = useSelector(
    (store) => store.comment.repliesByUserId[userID]?.items || [] // чтобы рендер не падал, когда данных ещё нет:
  );
  // первая загрузка
  // очищаем и грузим заново при смене userID
  useEffect(() => {
    if (!userID) return;
    dispatch({
      type: REPLIES_SET,
      payload: { userID, items: [], nextBefore: null, append: false },
    });
    dispatch(fetchUserReplies({ limit: 20 }, userID));
  }, [userID, dispatch]); // ← зависим от userID

  return (
    <div
      style={{
        width: "100%",
        height: "95vh",
        backgroundColor: "#fff5f7",
        overflow: arrowRequest ? "auto" : "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          p: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {userAvatar ? (
              <img
                className="avatar"
                src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                alt="user"
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />
            ) : (
              <AccountCircleIcon
                alt="user"
                sx={{
                  width: 70,
                  height: 70,
                }}
              />
            )}

            <Typography
              variant="h6"
              sx={{
                fontFamily: "monospace",
                color: "#880e4f",
              }}
            >
              {userName}
            </Typography>
          </Box>

          <Button
            sx={{
              background: "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
              color: "#d81b60",
            }}
            variant="contained"
            onClick={goToProfileEditor}
          >
            Редактировать
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs value={tabIndex} sx={{ mb: 4 }} onChange={handleChangeTab}>
          <Tab sx={{ color: "#880e4f" }} label="Мои комнаты" />
          <Tab sx={{ color: "#880e4f" }} label="Запросы" />
          <Tab sx={{ color: "#880e4f" }} label="Ответы к комментариям" />
        </Tabs>

        {/* Panel: Мои комнаты */}
        <TabPanel value={tabIndex} index={0}>
          <Grid container spacing={2} mb={4}>
            {userRooms.length <= 0 ? (
              <Typography sx={{ mt: 2, color: "#999" }}>
                У Вас нет комнат
              </Typography>
            ) : (
              userRooms.map((room) => (
                <Grid key={room.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={1}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#fff0f5",
                      p: 2,
                      borderRadius: 3,
                      boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transition: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
                        backgroundColor: "#ffe4ec",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight="bold">{room.name}</Typography>
                      {room.isPrivate === true ? (
                        <Typography variant="h6" color="text.secondary">
                          🔒
                          <Link
                            component={NavLink}
                            to={`/chatcards/${room.id}`}
                            sx={{ textDecoration: "none" }}
                          >
                            {` ${room.nameroom}`}
                          </Link>
                        </Typography>
                      ) : (
                        <Typography variant="h6" color="primary">
                          🌐
                          <Link
                            component={NavLink}
                            to={`/chatcards/${room.id}`}
                            sx={{ textDecoration: "none" }}
                          >
                            {` ${room.nameroom}`}
                          </Link>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        {/* Panel: Запросы */}
        <TabPanel value={tabIndex} index={1}>
          <Box
            ref={listWrapRef}
            sx={{
              maxHeight: "58vh",
              overflowY: needsExpand ? "auto" : "hidden",
              pr: 1, // чтобы скроллбар не ел текст
            }}
          >
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(allRequests || []).map((request) => {
                // Если запрос отправил сам пользователь
                const isOutgoing = request.user_id === userID;
                // Для спинера в момент когда статус обновляется
                /* const isUpdating = updatingIds.includes(request.id); */
                const rid = String(request.id);
                const isUpdating = Boolean(updatingById?.[rid]);
                // Когда запрос в статусе оюидания
                const isPending = request.status === "pending";

                let avatarSrc;
                if (isOutgoing) {
                  avatarSrc = userAvatar
                    ? `${process.env.REACT_APP_BASEURL}${userAvatar}`
                    : undefined;
                } else {
                  avatarSrc = request?.requester?.avatar
                    ? `${process.env.REACT_APP_BASEURL}${request?.requester?.avatar}`
                    : undefined;
                }

                const altText = isOutgoing
                  ? "Вы отправили запрос "
                  : `${request?.requester?.name}` || "Пользователь";

                const primaryText = isOutgoing
                  ? `${request?.Room?.nameroom}`
                  : `${request?.requester?.name} отправил Вам запрос, ${request?.Room?.nameroom}`;

                return (
                  <ListItem
                    key={request.id}
                    sx={{
                      backgroundColor: "#fff0f5",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(255, 182, 193, 0.2)",
                      borderRadius: 3,
                      "&:hover": {
                        boxShadow: "0 6px 14px rgba(255, 105, 180, 0.35)",
                        transform: "translateY(-2px)",
                        transition: "0.3s",
                      },
                    }}
                    secondaryAction={
                      isUpdating ? (
                        <ActionSpinner intent={updatingById[rid]} />
                      ) : isOutgoing ? (
                        request?.status === "accepted" ? (
                          <CheckCircleIcon sx={{ color: "green" }} />
                        ) : request?.status === "rejected" ? (
                          <CancelIcon sx={{ color: "red" }} />
                        ) : (
                          <HourglassEmptyIcon sx={{ color: "orange" }} />
                        )
                      ) : isPending ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            sx={{
                              background:
                                "linear-gradient(90deg, #f8bbd0, #f48fb1)",
                              color: "#fff",
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg,rgb(209, 243, 173),rgb(200, 239, 166))",
                                color: "gray",
                              },
                            }}
                            onClick={() =>
                              dispatch(
                                updateRoomRequestStatus(request.id, "accepted")
                              )
                            }
                          >
                            Принять
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              color: "#d81b60",
                              borderColor: "#f48fb1",
                              "&:hover": {
                                borderColor: "#d81b60",
                                backgroundColor: "#fff0f6",
                              },
                            }}
                            onClick={() => {
                              dispatch(
                                updateRoomRequestStatus(request.id, "rejected")
                              );
                            }}
                          >
                            Отклонить
                          </Button>
                        </Box>
                      ) : request.status === "accepted" ? (
                        <CheckCircleIcon sx={{ color: "green" }} />
                      ) : request.status === "rejected" ? (
                        <CancelIcon sx={{ color: "red" }} />
                      ) : (
                        <HourglassEmptyIcon sx={{ color: "orange" }} />
                      )
                    }
                  >
                    {(() => {
                      const enterAllowed = canEnterRoom(request, userID);
                      return (
                        <ListItemButton
                          // disabled={!enterAllowed}
                          disableRipple
                          disableTouchRipple
                          sx={{
                            bgcolor: "transparent",
                            "&:hover": { bgcolor: "transparent" },
                            "&.Mui-focusVisible": { bgcolor: "transparent" },
                            "&.Mui-selected": { bgcolor: "transparent" },
                            "&.Mui-selected:hover": { bgcolor: "transparent" },
                            // убираем анимации, отступы и курсор
                            transition: "none",
                            p: 0,
                            cursor: enterAllowed ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (!enterAllowed) return;
                            navigate(`/chatcards/${request?.Room?.id}`);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={avatarSrc} alt={`${altText}`} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={altText}
                            primaryTypographyProps={{
                              sx: {
                                color: " #1976d2",
                                fontSize: "1.2rem",
                                fontFamily: "monospace",
                              },
                            }}
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontFamily: "monospace" }}
                              >
                                {primaryText}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      );
                    })()}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </TabPanel>

        {/* Panel: Ответы на комменатарии */}
        <TabPanel value={tabIndex} index={2}>
          <Box
            sx={{
              p: 2,
              background:
                "linear-gradient(135deg, rgba(248,187,208,0.25) 0%, rgba(255,240,245,0.45) 100%)",
              borderRadius: 3,
              border: "1px solid #f8bbd0",
            }}
          >
            {!items || items.length === 0 ? (
              <Box>
                <Typography> Пока нет ответов</Typography>
                <Typography>
                  {" "}
                  Здесь появятся ответы на ваши посты и комментарии
                </Typography>
              </Box>
            ) : (
              <List>
                {items.map((comment) => {
                  const isReplyToComment = Boolean(comment?.ParentComment);
                  const replyTypeLabel = isReplyToComment
                    ? " на ваш коммнетрий"
                    : " на ваш пост";
                  const created = comment?.createdAt
                    ? new Date(comment?.createdAt).toLocaleString()
                    : "";

                  return (
                    <ListItem
                      key={comment.id}
                      alignItems="flex-start"
                      sx={{
                        border: "1px solid #f8bbd0",
                        py: 1.5,
                        px: 2,
                        cursor: "pointer",
                        borderRadius: 3,
                        bgcolor: "#fff0f5",
                        boxShadow: "0 6px 14px rgba(216,27,96,0.08)",
                        transition:
                          "transform .2s ease, box-shadow .2s ease, background-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 10px 20px rgba(216,27,96,0.16)",
                          bgcolor: "#ffe6ee",
                        },

                        // левый акцент
                        position: "relative",
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          width: 4,
                          left: 0,
                          top: 8,
                          bottom: 8,
                          borderRadius: "8px",
                          background:
                            "linear-gradient(180deg, #d81b60 0%, #f48fb1 100%)",
                        },
                      }}
                      secondaryAction={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={replyTypeLabel}
                            size="small"
                            sx={{
                              bgcolor: isReplyToComment ? "#f8bbd0" : "#fce4ec",
                              color: "#880e4f",
                              borderRadius: 2,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        {comment?.User?.avatar ? (
                          <Avatar
                            src={`${process.env.REACT_APP_BASEURL}${comment?.User?.avatar}`}
                            sx={{
                              width: "48px",
                              height: "48px",
                              border: "2px solid  #f8bbd0",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{ bgcolor: "#f8bbd0", color: "#880e4f" }}
                          />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        // UserDashboard.jsx:596 In HTML, <p> cannot be a descendant of <p>.
                        // This will cause a hydration error.
                        primaryTypographyProps={{ component: "div" }}
                        secondaryTypographyProps={{ component: "div" }}
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: "#ad1457",
                                fontWeight: 700,
                                fontFamily: "monospace",
                              }}
                            >
                              {comment?.User?.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#5e2750" }}
                            >
                              {comment?.commentTitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#8e245f", opacity: 0.7 }}
                            >
                              {created}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}
