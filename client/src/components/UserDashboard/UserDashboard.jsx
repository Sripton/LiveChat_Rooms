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

  console.log("outgoing", outgoing);
  console.log("incoming", incoming);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff5f7",
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
                alt=""
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
                  sx={{ cursor: "pointer" }}
                >
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
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Panel: Запросы */}
        <TabPanel value={tabIndex} index={1}>
          <List>
            {allRequests.map((request) => (
              <ListItem
                key={request.id}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" color="success" size="small">
                      Принять
                    </Button>
                    <Button variant="outlined" color="error" size="small">
                      Отклонить
                    </Button>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <MailIcon />
                  </Avatar>
                </ListItemAvatar>
                {request.user_id === userID ? (
                  <ListItemText
                    primary={`Вы отправили запрос (${request?.Room?.nameroom})`}
                    secondary="2 часа назад"
                  />
                ) : (
                  <ListItemText
                    primary={`${request?.requester?.name} отправил Вам запрос (${request?.Room?.nameroom})`}
                    secondary="2 часа назад"
                  />
                )}
              </ListItem>
            ))}
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
