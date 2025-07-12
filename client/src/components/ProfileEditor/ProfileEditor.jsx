import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";

import "./profileeditor.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editUser } from "../../redux/actions/userActions";
export default function ProfileEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, userAvatar } = useSelector((store) => store.user);

  const [editName, setEditName] = useState(userName || "");
  const [addFile, setAddFile] = useState(null);
  const [editAvatar, setEditAvatar] = useState(userAvatar || "");

  const handleFileChange = (e) => {
    // Поле e.target.files — это FileList, а не просто один файл. Даже если ты разрешаешь выбрать один файл,
    // браузер всегда возвращает массив файлов, потому что: <input type="file"> по умолчанию поддерживает выбор нескольких файлов
    // <input type="file" multiple /> multiple - выбор нескольких файлов.
    //     FileList {
    //   0: File { name: "file1.png", ... },
    //   1: File { name: "file2.jpg", ... },
    //   length: 2
    // }
    // можно обрабатывать их в цикле:
    // Array.from(e.target.files).forEach((file) => {
    //   console.log(file.name);
    // });
    const file = e.target.files[0];
    setAddFile(file);
    if (file) {
      // URL.createObjectURL(file)
      // 📌 Создаёт временный URL, ссылающийся на переданный файл (в памяти браузера).
      // можно использовать этот URL как значение для src в <img>, чтобы отобразить файл локально — не отправляя его на сервер.
      setEditAvatar(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (editName.trim()) formData.append("name", editName);
    if (addFile) formData.append("avatar", addFile);
    await dispatch(editUser(formData, navigate));
  };
  return (
    <Container maxWidth="false" className="wrapper__register">
      <Box className="form">
        {/* <Button className="avatar-edit">
          <img
            className="avatar-eidt-img"
            src={editAvatar || "/default-avatar.png"}
            alt=""
          />
        </Button> */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <TextField
            name="name"
            value={editName}
            onChange={handleNameChange}
            variant="outlined"
            placeholder="Имя"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockOpenIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "transparent",
              input: {
                outline: "none",
                border: "none",
                borderBottom: "2px solid rgba(139, 78, 196, 0.37)",
                color: "rgb(78, 75, 75)",
                marginBottom: "25px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              marginBottom: "20px",
            }}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 1, marginBottom: "25px" }}
          >
            Загрузить аватар
            <input
              name="avatar"
              onChange={handleFileChange}
              type="file"
              hidden
              accept="image/*"
            />
          </Button>
          <Button
            type="submit"
            sx={{
              "&:hover": { color: "#60a5fa", background: "transparent" },
            }}
          >
            Сохранить изменения
          </Button>
        </form>
      </Box>
    </Container>
  );
}
