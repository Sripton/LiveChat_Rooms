import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Collapse,
  Alert,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import "./signup.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_REGISTER_ERROR } from "../../redux/types/types";

export default function Signup({ userPropsData }) {
  const { inputs, inputsUsersHandler, signupSubmitHandler } = userPropsData;

  const dispatch = useDispatch();
  const errorMessage = useSelector((store) => store.user.error);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);

  useEffect(() => {
    if (!errorMessage) return;
    const handler = () => {
      dispatch({ type: SET_REGISTER_ERROR, payload: "" });
    };
    return () => {
      handler();
    };
  }, [inputs.login, dispatch, errorMessage]);

  const mainColor = "#11071c";
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
      <Container maxWidth="xs">
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
            gap: 2.5,
          }}
        >
          {/* Заголовок */}
          <Typography
            sx={{
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: 1,
              letterSpacing: 2,
              color: accentColor,
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Регистрация
          </Typography>

          {/* Ошибка */}
          <Collapse
            in={Boolean(errorMessage) && !isAuthenticated}
            sx={{ width: "100%" }}
          >
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {errorMessage}
            </Alert>
          </Collapse>

          {/* Форма */}
          <Box
            component="form"
            onSubmit={signupSubmitHandler}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            {/* Логин */}
            <TextField
              name="login"
              value={inputs.login || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите логин"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon sx={{ color: textMuted, fontSize: 20 }} />
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

            {/* Пароль */}
            <TextField
              name="password"
              type="password"
              value={inputs.password || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите пароль"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: textMuted, fontSize: 20 }} />
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

            {/* Имя */}
            <TextField
              name="name"
              value={inputs.name || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите имя"
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

            {/* Кнопка регистрации */}
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
              Зарегистрироваться
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
