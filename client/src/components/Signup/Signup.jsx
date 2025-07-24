import React, { useEffect, useRef, useState } from "react";
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
  const prevErrorRef = useRef("");
  console.log("errorMessage", errorMessage);
  useEffect(() => {
    // сохраняем предыдущее значение errorMessage, которое хранится в ref (prevErrorRef.current).
    // Это значение было запомнено при предыдущем вызове useEffect
    const prevError = prevErrorRef.current; // null

    // // обновляем ref новым значением errorMessage, чтобы оно стало "предыдущим" на следующий вызов useEffect.
    prevErrorRef.current = errorMessage;

    // // условие "не выполнять сброс", если:
    // // !errorMessage — т.е. ошибки нет (она пустая, null, undefined и т.п.).
    // // errorMessage === prevError — т.е. ошибка не изменилась с прошлого раза.
    if (!errorMessage || errorMessage === prevError) return;

    const timer = setTimeout(() => {
      // Cбрасываем форму:
      dispatch({ type: SET_REGISTER_ERROR, payload: "" }); // очищаем ошибку
      // если все поля заполнены. Во избежание принудительного сбрасывания поля преждевременно
      if (inputs.login || inputs.password || inputs.name) {
        inputsUsersHandler({ target: { name: "reset_all", reset: true } });
      }
    }, 2000);
    return () => clearTimeout(timer); // чистим таймер
  }, [errorMessage]);

  return (
    <Container maxWidth="false" className="wrapper__register">
      <Box className="form">
        <Typography
          sx={{
            fontSize: "2em",
            textAlign: "center",
            marginBottom: "20px",
            letterSpacing: "2px",
            color: "rgb(128, 128, 128)",
          }}
        >
          Регистрация
        </Typography>
        <form
          onSubmit={signupSubmitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box>
            <Collapse in={Boolean(errorMessage)}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            </Collapse>
            <TextField
              name="login"
              value={inputs.login || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите логин"
              // error={Boolean(errorMessage)}
              // helperText={errorMessage || ""}
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
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                marginBottom: "20px",
              }}
            />
          </Box>

          <TextField
            name="password"
            value={inputs.password || ""}
            onChange={inputsUsersHandler}
            variant="outlined"
            placeholder="Введите пароль"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyIcon />
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
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              marginBottom: "20px",
            }}
          />
          <TextField
            name="name"
            value={inputs.name || ""}
            onChange={inputsUsersHandler}
            variant="outlined"
            placeholder="Введите имя"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonIcon />
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
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              marginBottom: "20px",
            }}
          />
          <Button
            type="submit"
            sx={{
              "&:hover": { color: "#60a5fa", background: "transparent" },
            }}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Box>
    </Container>
  );
}
