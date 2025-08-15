import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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
                width: "120px",
                height: "120px",
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
            }}
          >
            {userName}
          </Typography>
        </Box>

        <Button variant="contained">Редактировать</Button>
      </Box>

      {/* Tabs */}
      <Tabs sx={{ mb: 4 }}>
        <Tab label="Мои комнаты" />
        <Tab label="Запросы" />
        <Tab label="Ответы на посты" />
        <Tab label="Ответы на комментарии" />
      </Tabs>

      {/* Panel: Мои комнаты */}
      <TabPanel value={tabIndex} index={0}>
        <Grid container spacing={2} mb={4}>
          {userRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
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
                    {` ${room.nameroom}`}
                  </Typography>
                ) : (
                  <Typography variant="h6" color="primary">
                    🌐
                    {` ${room.nameroom}`}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}
