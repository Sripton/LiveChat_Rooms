import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MailIcon from "@mui/icons-material/Mail";
import { display } from "@mui/system";
import { fetchUserRooms } from "../../redux/actions/roomActions";
import { fetchUserRequestsStatus } from "../../redux/actions/roomRequestStatus";

function TabPanel(props) {
  const { index, value, children } = props;
  return <div role="tabpanel">{value === index && <Box>{children}</Box>}</div>;
}
export default function UserDashboard({ userPropsData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const { userAvatar, userName, userID } = userPropsData;
  const userRooms = useSelector((store) => store.room.userRooms);
  const { incoming, outgoing } = useSelector(
    (store) => store.roomRequestStatus
  );

  const dispatch = useDispatch();
  const handleChangeTab = (event, newValue) => {
    // MUI Tabs  вызывает onChange с двумя аргументами
    setTabIndex(newValue);
  };

  const [arrowReauest, setArrowRequest] = useState(false);

  const handleArraowRequest = () => {
    setArrowRequest(!arrowReauest);
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

  return (
    <div
      style={{
        width: "100%",
        height: "95vh",
        backgroundColor: "#fff5f7",
        overflow: arrowReauest ? "auto" : "hidden",
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
            {userRooms.map((room) => (
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
            ))}
          </Grid>
        </TabPanel>

        {/* Panel: Запросы */}
        <TabPanel value={tabIndex} index={1}>
          <Button onClick={handleArraowRequest}>
            <span
              className="arrow-request"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "12px solid #880e4f",
                cursor: "pointer",
                display: "inline-block",
                transform: arrowReauest ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            />
          </Button>
          <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(allRequests || []).map((request) => {
              // Если запрос отправил сам пользователь
              const isOutgoing = request.user_id === userID;
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
                : `${request?.requester?.name} отправил Вам запрос к ${request?.Room?.nameroom}`;

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
                      >
                        Отклонить
                      </Button>
                    </Box>
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
