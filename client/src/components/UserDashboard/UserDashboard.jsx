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
} from "@mui/material";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  fetchUserRequestsStatus,
  updateRoomRequestStatus,
} from "../../redux/actions/roomRequestStatusActions";
import { fetchUserRooms } from "../../redux/actions/roomActions";

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
  const userRooms = useSelector((store) => store.room.userRooms);
  const { incoming, outgoing, updatingIds, updatingById } = useSelector(
    (store) => store.roomRequestStatus
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleChangeTab = (event, newValue) => {
    // MUI Tabs  вызывает onChange с двумя аргументами
    setTabIndex(newValue);
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
              <Avatar
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
                const isAccepted = request.status === "accepted";
                const isRejected = request.status === "rejected";
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
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </TabPanel>

        {/* Panel: Ответы на комменатарии */}
        <TabPanel value={tabIndex} index={2}>
          {/* <Typography variant="h6">Ответы на посты</Typography> */}
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary="Maria ответила на ваш пост"
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      В комнате: Frontend Room
                    </Typography>
                    {" — Согласна, React Query — хороший выбор."}
                  </>
                }
              />
            </ListItem>
          </List>
        </TabPanel>
      </Box>
    </div>
  );
}
