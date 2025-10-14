import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Fade,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  createPostSubmit,
  editPostSubmit,
} from "../../redux/actions/postActions";
export default function ModalPostCreate({
  openModalPost,
  setOpenModalPost,
  closeModalPost,
  roomID, // roomId
  mode, // "create" | "edit"
  editPost, // объект поста при редактировании
}) {
  const dispatch = useDispatch();
  // Состояние для запси поста
  const [inputs, setInputs] = useState({
    postTitle: "",
  });

  // При открытии модалки — заполняем поля если режим edit
  useEffect(() => {
    if (mode === "edit" && editPost) {
      setInputs({ postTitle: editPost.postTitle ?? "" });
    } else {
      setInputs({ postTitle: "" });
    }
  }, [mode, editPost, openModalPost]);
  const postInputsHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const postSubmitHandler = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      await dispatch(createPostSubmit(roomID, inputs));
    } else {
      await dispatch(editPostSubmit(editPost.id, inputs));
    }
    setOpenModalPost(false);
  };

  return (
    <Fade in={openModalPost}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            maxWidth: 700,
            width: "100%",
            backgroundColor: "#ffe4e9",
            borderRadius: 4,
            p: 2,
          }}
        >
          <IconButton
            onClick={closeModalPost} // чтобы реально закрывала
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              minWidth: 0,
              p: 0.2,
              color: "#d81b60",
              borderRadius: "50%",
              background: "#f8bbd0",
              "&:hover": { background: "#fde4ec" },
              zIndex: 1,
            }}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
          <Typography
            variant="h6"
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
                rows={3}
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
