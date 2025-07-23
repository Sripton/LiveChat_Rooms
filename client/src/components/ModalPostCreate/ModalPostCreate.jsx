import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Fade,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostSubmit,
  fetchAllPosts,
} from "../../redux/actions/postActions";
export default function ModalPostCreate({
  openModalPost,
  setOpenModalPost,
  id,
}) {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    postTitle: "",
  });
  const postInputsHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const postSubmitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createPostSubmit(id, inputs));
    setOpenModalPost(false);
  };

  return (
    <Fade in={openModalPost}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 700,
            width: "100%",
            backgroundColor: "#ffe4e9",
            borderRadius: 4,
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#c2185b",
              fontFamily: "monospace",
              mb: 3,
            }}
          >
            Добавить пост
          </Typography>
          <Box sx={{ mb: 3 }}>
            <form onSubmit={postSubmitHandler}>
              <TextField
                name="postTitle"
                value={inputs.postTitle || ""}
                onChange={postInputsHandler}
                multiline
                fullWidth
                rows={4}
                label="Заголовок поста..."
                // variant="outlined"
                sx={{
                  backgroundColor: "#fff0f6",
                  mb: 2,
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#f8bbd0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#f06292",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#f06292",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#f06292",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#ec407a",
                  },
                }}
              >
                {" "}
                Опубликовать
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
