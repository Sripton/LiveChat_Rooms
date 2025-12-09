import React, { useState } from "react";
import {
  Avatar,
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
import { useNavigate, useLocation } from "react-router-dom";
import { editUser } from "../../redux/actions/userActions";

export default function ProfileEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userAvatar } = useSelector((store) => store.user);

  const [editName, setEditName] = useState(userName || "");
  const [addFile, setAddFile] = useState(null);
  const [editAvatar, setEditAvatar] = useState(
    userAvatar ? `${process.env.REACT_APP_BASEURL}${userAvatar}` : ""
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAddFile(file);
    if (file) {
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
    await dispatch(editUser(formData));

    const backTo = location.state?.from?.pathname || "/userdashboard";
    navigate(backTo);
  };

  const mainColor = "#11071c";
  const pageBg = "#1d102f";
  const cardBg = "#231433";
  const accentColor = "#b794f4";
  const accentSoft = "rgba(183,148,244,0.15)";
  const textMuted = "#9ca3af";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 800px at 0% -20%, #3b1d5e 0%, transparent 60%), radial-gradient(1100px 700px at 110% 0%, #4c1d95 0%, transparent 55%), linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            backgroundColor: cardBg,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Заголовок */}
          <Typography
            variant="h6"
            sx={{
              color: accentColor,
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
            Изменение профиля
          </Typography>

          {/* Аватар + превью */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            {editAvatar ? (
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  p: 0.7,
                  background:
                    "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
                  mb: 0.5,
                }}
              >
                <img
                  src={editAvatar}
                  alt="avatar"
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
                  width: 96,
                  height: 96,
                  bgcolor: "#3b0764",
                  color: "#e5e7eb",
                  mb: 0.5,
                }}
              >
                <PersonIcon sx={{ fontSize: 42 }} />
              </Avatar>
            )}

            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{
                mt: 1,
                textTransform: "none",
                borderRadius: 999,
                fontSize: "0.85rem",
                backgroundColor: accentColor,
                color: "#0b0615",
                "&:hover": {
                  backgroundColor: "#c4b5fd",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.9)",
                },
              }}
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
          </Box>

          {/* Форма */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              mt: 1,
            }}
          >
            <TextField
              name="name"
              value={editName}
              onChange={handleNameChange}
              variant="outlined"
              placeholder="Имя"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                },
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#1f112f",
                  border: "1px solid rgba(148,163,184,0.35)",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: accentColor,
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 1px rgba(183,148,244,0.7)",
                  },
                },
                "& .MuiInputBase-input": {
                  paddingY: 1.3,
                  paddingX: 1.5,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
                py: 1.2,
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                color: "#0b0615",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.9)",
                },
              }}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
