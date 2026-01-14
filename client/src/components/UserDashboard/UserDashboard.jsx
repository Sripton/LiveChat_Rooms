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
  useMediaQuery,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  fetchUserRequestsStatus,
  updateRoomRequestStatus,
} from "../../redux/actions/roomRequestStatusActions";
import { fetchUserRooms } from "../../redux/actions/roomActions";
import {
  fetchUserReplies,
  fetchMoreUserReplies,
} from "../../redux/actions/commentActions";
import { REPLIES_SET } from "../../redux/types/types";

function TabPanel(props) {
  const { index, value, children } = props;
  return <div role="tabpanel">{value === index && <Box>{children}</Box>}</div>;
}

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

  const { incoming, outgoing, updatingById } = useSelector(
    (store) => store.roomRequestStatus
  );

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userRooms = useSelector((store) => store.room.userRooms);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const canEnterRoom = (request, user_id) => {
    const isOwner = request?.Room?.ownerID === user_id;
    const isAccepted = request?.status === "accepted";
    return Boolean(isOwner || isAccepted);
  };

  const allRequests = [...outgoing, ...incoming];

  useEffect(() => {
    if (userID) {
      dispatch(fetchUserRooms(userID));
      dispatch(fetchUserRequestsStatus(userID));
    }
  }, [userID, dispatch]);

  const [arrowRequest, setArrowRequest] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);

  const roomWrapRef = useRef(null);
  const requestWrapRef = useRef(null);
  const repliesWrapRef = useRef(null);

  // const handleArraowRequest = () => setArrowRequest((prev) => !prev);

  const goToProfileEditor = () => {
    navigate("/profileeditor", {
      state: { from: location },
    });
  };

  const items = useSelector(
    (store) => store.comment.repliesByUserId[userID]?.items || []
  );
  // const nextBefore =
  //   useSelector((store) => store.comment.repliesByUserId[userID]?.nextBefore) ||
  //   null;

  useEffect(() => {
    if (!userID) return;
    dispatch({
      type: REPLIES_SET,
      payload: { userID, items: [], nextBefore: null, append: false },
    });
    dispatch(fetchUserReplies({ limit: 20 }, userID));
  }, [userID, dispatch]);

  useEffect(() => {
    const element =
      tabIndex === 0
        ? roomWrapRef.current
        : tabIndex === 1
        ? requestWrapRef.current
        : tabIndex === 2
        ? repliesWrapRef.current
        : null;
    if (!element) return;

    // для скролинга если элементов много
    const compute = () => {
      setNeedsExpand(element.scrollHeight > element.clientHeight + 1);
    };
    compute();

    const res = new ResizeObserver(compute);
    res.observe(element);

    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    return () => {
      res.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [tabIndex, allRequests.length, items.length]);

  const mainColor = "#11071c";
  const pageBg = "#1d102f";
  const cardBg = "#231433";
  const cardSoftBg = "#2b183c";
  const accentColor = "#b794f4";
  const accentColorStrong = "#c4b5fd";
  const textMuted = "#9ca3af";

  const commonPanelBoxSx = {
    p: 2,
    backgroundColor: cardBg,
    borderRadius: 3,
    border: "1px solid rgba(255,255,255,0.06)",
    maxHeight: "65vh",
    overflowY: needsExpand ? "auto" : "hidden",
    pr: 1,
    boxShadow: "0 14px 30px rgba(0,0,0,0.85)",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "95vh",
        background:
          "radial-gradient(1200px 800px at 0% -20%, #3b1d5e 0%, transparent 60%), radial-gradient(1100px 700px at 110% 0%, #4c1d95 0%, transparent 55%), linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)",
        overflow: arrowRequest ? "auto" : "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          p: 3,
          color: "#e5e7eb",
        }}
      >
        {/* Header: имя и кнопка редактирования */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {userAvatar ? (
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  p: 0.5,
                  background:
                    "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
                }}
              >
                <img
                  src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                  alt="user"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ) : (
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#3b0764",
                  color: "#e5e7eb",
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </Avatar>
            )}

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  color: accentColorStrong,
                  letterSpacing: 0.4,
                }}
              >
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: textMuted, fontSize: "0.75rem" }}
              >
                Личный кабинет
              </Typography>
            </Box>
          </Box>

          {isSmall ? (
            <Fab
              color="primary"
              sx={{
                position: "fixed",
                bottom: 24,
                right: 32,
                bgcolor: accentColor,
                color: "#0b0615",
                "&:hover": { bgcolor: accentColorStrong },
                boxShadow: "0 14px 32px rgba(0,0,0,0.9)",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0 rgba(183,148,244, 0.7)",
                  },
                  "50%": {
                    boxShadow: "0 0 0 20px rgba(183,148,244, 0)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 0 rgba(183,148,244, 0)",
                  },
                },
              }}
              onClick={goToProfileEditor}
            >
              <BorderColorIcon />
            </Fab>
          ) : (
            <Button
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                color: "#0b0615",
                fontWeight: 600,
                borderRadius: 999,
                px: 2.8,
                height: 40,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.9)",
                },
              }}
              onClick={goToProfileEditor}
            >
              Редактировать профиль
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          sx={{
            mb: 3,
            borderBottom: "1px solid rgba(148,163,184,0.35)",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.9rem",
              color: textMuted,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              minHeight: 40,
            },
            "& .Mui-selected": {
              color: accentColor,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: accentColor,
              height: 3,
            },
          }}
          onChange={handleChangeTab}
          allowScrollButtonsMobile
          scrollButtons={isMobile ? "auto" : false}
          variant={isMobile ? "scrollable" : "standard"}
        >
          <Tab label="Мои комнаты" />
          <Tab label="Запросы" />
          <Tab label="Ответы к комментариям" />
        </Tabs>

        {/* Panel: Мои комнаты */}
        <TabPanel value={tabIndex} index={0}>
          <Box ref={roomWrapRef} sx={commonPanelBoxSx}>
            <Grid container spacing={2} mb={2}>
              {userRooms.length <= 0 ? (
                <Typography sx={{ mt: 1, color: textMuted }}>
                  У вас пока нет комнат.
                </Typography>
              ) : (
                userRooms.map((room) => (
                  <Grid key={room.id} item xs={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: cardSoftBg,
                        p: 2,
                        borderRadius: 3,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.7)",
                        border: "1px solid rgba(148,163,184,0.35)",
                        transition:
                          "transform .2s ease, box-shadow .2s ease, border-color .2s ease, background-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 14px 30px rgba(0,0,0,0.95)",
                          borderColor: "rgba(183,148,244,0.7)",
                          backgroundColor: "#311b43",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{ color: accentColorStrong, fontSize: "0.95rem" }}
                        >
                          {room.name}
                        </Typography>
                        {room.isPrivate === true ? (
                          <Typography
                            variant="body2"
                            sx={{ color: "#e5e7eb", ml: 1 }}
                          >
                            🔒
                            <Link
                              component={NavLink}
                              to={`/chatcards/${room.id}`}
                              sx={{
                                textDecoration: "none",
                                color: accentColor,
                                ml: 0.5,
                                "&:hover": { color: accentColorStrong },
                              }}
                            >
                              {room.nameroom}
                            </Link>
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: "#e5e7eb", ml: 1 }}
                          >
                            🌐
                            <Link
                              component={NavLink}
                              to={`/chatcards/${room.id}`}
                              sx={{
                                textDecoration: "none",
                                color: accentColor,
                                ml: 0.5,
                                "&:hover": { color: accentColorStrong },
                              }}
                            >
                              {room.nameroom}
                            </Link>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </TabPanel>

        {/* Panel: Запросы */}
        <TabPanel value={tabIndex} index={1}>
          <Box
            ref={requestWrapRef}
            sx={{
              ...commonPanelBoxSx,
              maxHeight: "60vh",
              overflowY: needsExpand ? "auto" : "hidden", // нужен ли этот код ???????
            }}
          >
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(allRequests || []).map((request) => {
                const isOutgoing = request.user_id === userID;
                const rid = String(request.id);
                const isUpdating = Boolean(updatingById?.[rid]);
                const isPending = request.status === "pending";

                // логика для отображения аватар
                let avatarSrc;
                // если запрос исходящий от самого пользователя (свой аватар)
                if (isOutgoing) {
                  avatarSrc = userAvatar
                    ? `${process.env.REACT_APP_BASEURL}${userAvatar}`
                    : undefined;
                } else {
                  // если запрос входящий от другого пользователя (аватар пользователя который отправил запрос)
                  avatarSrc = request?.requester?.avatar
                    ? `${process.env.REACT_APP_BASEURL}${request?.requester?.avatar}`
                    : undefined;
                }

                const altText = isOutgoing
                  ? "Вы отправили запрос"
                  : `${request?.requester?.name}` || "Пользователь";

                const primaryText = isOutgoing
                  ? `${request?.Room?.nameroom}`
                  : `${request?.requester?.name} отправил вам запрос, ${request?.Room?.nameroom}`;

                return (
                  <ListItem
                    key={request.id}
                    sx={{
                      backgroundColor: cardSoftBg,
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.85)",
                      borderRadius: 3,
                      border: "1px solid rgba(148,163,184,0.35)",
                      "&:hover": {
                        boxShadow: "0 16px 34px rgba(0,0,0,1)",
                        transform: "translateY(-2px)",
                        transition: "0.2s",
                        borderColor: "rgba(183,148,244,0.7)",
                        backgroundColor: "#331c47",
                      },
                    }}
                    secondaryAction={
                      isUpdating ? (
                        <ActionSpinner intent={updatingById[rid]} />
                      ) : isOutgoing ? (
                        request?.status === "accepted" ? (
                          <CheckCircleIcon sx={{ color: "#22c55e" }} />
                        ) : request?.status === "rejected" ? (
                          <CancelIcon sx={{ color: "#f97373" }} />
                        ) : (
                          <HourglassEmptyIcon sx={{ color: "#eab308" }} />
                        )
                      ) : isPending ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#22c55e",
                              color: "#0f172a",
                              textTransform: "none",
                              "&:hover": {
                                backgroundColor: "#4ade80",
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
                              color: "#f97373",
                              borderColor: "#f97373",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#fca5a5",
                                backgroundColor: "rgba(248,113,113,0.08)",
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
                        <CheckCircleIcon sx={{ color: "#22c55e" }} />
                      ) : request.status === "rejected" ? (
                        <CancelIcon sx={{ color: "#f97373" }} />
                      ) : (
                        <HourglassEmptyIcon sx={{ color: "#eab308" }} />
                      )
                    }
                  >
                    {(() => {
                      const enterAllowed = canEnterRoom(request, userID);
                      return (
                        <ListItemButton
                          disableRipple
                          disableTouchRipple
                          sx={{
                            bgcolor: "transparent",
                            "&:hover": { bgcolor: "transparent" },
                            "&.Mui-focusVisible": { bgcolor: "transparent" },
                            "&.Mui-selected": { bgcolor: "transparent" },
                            "&.Mui-selected:hover": { bgcolor: "transparent" },
                            transition: "none",
                            p: 0,
                            cursor: enterAllowed ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (!enterAllowed) return;
                            navigate(`/chatcards/${request?.Room?.id}`);
                          }}
                        >
                          {/* Аватар пользовтаеля */}
                          <ListItemAvatar>
                            <Avatar src={avatarSrc} alt={altText} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={altText}
                            primaryTypographyProps={{
                              sx: {
                                color: accentColorStrong,
                                fontSize: "0.95rem",
                                fontFamily:
                                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                              },
                            }}
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  fontFamily:
                                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                  color: textMuted,
                                  fontSize: "0.85rem",
                                }}
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

        {/* Panel: Ответы на комментарии */}
        <TabPanel value={tabIndex} index={2}>
          <Box ref={repliesWrapRef} sx={commonPanelBoxSx}>
            {!items || items.length === 0 ? (
              <Box>
                <Typography sx={{ color: textMuted }}>
                  Пока нет ответов.
                </Typography>
                <Typography
                  sx={{ color: textMuted, fontSize: "0.85rem", mt: 0.5 }}
                >
                  Здесь будут появляться ответы на ваши посты и комментарии.
                </Typography>
              </Box>
            ) : (
              <List>
                {items.map((comment) => {
                  const created = comment?.createdAt
                    ? new Date(comment?.createdAt).toLocaleString()
                    : "";
                  return (
                    <ListItem
                      key={comment.id}
                      alignItems="flex-start"
                      sx={{
                        border: "1px solid rgba(148,163,184,0.35)",
                        py: 1.5,
                        px: 2,
                        cursor: "pointer",
                        borderRadius: 3,
                        bgcolor: cardSoftBg,
                        boxShadow: "0 10px 24px rgba(0,0,0,0.85)",
                        transition:
                          "transform .2s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 16px 36px rgba(0,0,0,1)",
                          bgcolor: "#341d49",
                          borderColor: "rgba(183,148,244,0.7)",
                        },
                        position: "relative",
                      }}
                      onClick={() => {
                        navigate(`/chatcards/${comment?.Post?.room_id}`);
                      }}
                    >
                      <ListItemAvatar>
                        {comment?.User?.avatar ? (
                          <Avatar
                            src={`${process.env.REACT_APP_BASEURL}${comment?.User?.avatar}`}
                            sx={{
                              width: 48,
                              height: 48,
                              border: "2px solid rgba(183,148,244,0.7)",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              bgcolor: "#4c1d95",
                              color: "#e5e7eb",
                              width: 48,
                              height: 48,
                            }}
                          />
                        )}
                      </ListItemAvatar>
                      <ListItemText
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
                                color: accentColorStrong,
                                fontWeight: 600,
                                fontFamily:
                                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
                              sx={{
                                color: "#e5e7eb",
                                fontSize: "0.88rem",
                                mb: 0.3,
                              }}
                            >
                              {comment?.commentTitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: textMuted, opacity: 0.8 }}
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
