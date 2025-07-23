import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { getRoomById } from "../../redux/actions/roomActions";
import ModalPostCreate from "../ModalPostCreate";
import { fetchAllPosts } from "../../redux/actions/postActions";
import "./chatcards.css";

export default function ChatCards() {
  const [openModalPost, setOpenModalPost] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentRoom = useSelector((store) => store.room.currentRoom);
  const allPosts = useSelector((store) => store.post.allPosts);
  const userID = useSelector((store) => store.user.userID);

  const handleAddPostClick = () => {
    if (!userID) {
      navigate("/signin");
    }
    setOpenModalPost((prev) => !prev);
  };

  useEffect(() => {
    dispatch(getRoomById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchAllPosts(id));
  }, [dispatch, id]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1200,
          borderRadius: 4,
          mt: 2,
          p: 4,
          backgroundColor: "#ffe4e9", // светло-розовый фон
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#c2185b",
                mb: 1,
                fontFamily: "monospace",
              }}
            >
              {" "}
              {currentRoom?.nameroom || "Название комнаты"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6a1b9a",
                fontSize: "1.5rem",
                fontFamily: "monospace",
              }}
            >
              {" "}
              {currentRoom?.description || "Описание комнаты"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f06292",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ec407a",
              },
              height: "40px",
              mt: { xs: 2, sm: 0 },
              display: openModalPost ? "none" : "",
            }}
            onClick={handleAddPostClick}
          >
            Добавить пост
          </Button>
        </Box>
        {openModalPost ? (
          <>
            <Box>
              <ModalPostCreate
                openModalPost={openModalPost}
                setOpenModalPost={setOpenModalPost}
                id={id}
              />
            </Box>
            <Box className="post-list">
              {allPosts.map((post) => (
                <Box className="post" key={post.id} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#6a1b9a",
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {post.postTitle}
                  </Typography>
                  <Box className="post-action">
                    <Button sx={{ color: "#ec407a" }}>
                      <ThumbUpIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                      {0}
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <ThumbDownIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                      {0}
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <EditIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                    <Button sx={{ color: "#ec407a" }}>
                      <SendIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box className="post-list">
            {allPosts.map((post) => (
              <Box className="post" sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: "#6a1b9a",
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                  }}
                >
                  {post.postTitle}
                </Typography>
                <Box className="post-action">
                  <Button sx={{ color: "#ec407a" }}>
                    <ThumbUpIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                    {0}
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <ThumbDownIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                    {0}
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <EditIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                  <Button sx={{ color: "#ec407a" }}>
                    <SendIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
