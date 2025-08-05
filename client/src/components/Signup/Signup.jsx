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
} from "@mui/material"; // Компоненты из библиотеки Material UI
import LockOpenIcon from "@mui/icons-material/LockOpen"; // Иконка замка (логин)
import KeyIcon from "@mui/icons-material/Key"; // Иконка ключа (пароль)
import PersonIcon from "@mui/icons-material/Person"; // Иконка пользователя (имя)
import "./signup.css"; // CSS-стили
import { useDispatch, useSelector } from "react-redux"; // Хуки из Redux
import { SET_REGISTER_ERROR } from "../../redux/types/types"; // Тип действия Redux

export default function Signup({ userPropsData }) {
  // Получаем пропсы из компонента App.jsx
  const { inputs, inputsUsersHandler, signupSubmitHandler } = userPropsData;

  // Инициализация dispatch для отправки действий в Redux
  const dispatch = useDispatch();

  // Получение ошибки из состояния Redux
  const errorMessage = useSelector((store) => store.user.error);

  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);

  console.log("errorMessage", errorMessage);
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    // предотвращение выполнение кода внутри эффекта, если ошибки нет.
    // 1. Если errorMessage пустой — выходим из эффекта, ничего не делаем.
    if (!errorMessage) return;

    // Если пользователь начал править логин — очистить ошибку
    // 2. Создаём функцию handler, которая очищает ошибку из Redux
    const handler = () => {
      dispatch({ type: SET_REGISTER_ERROR, payload: "" });
    };
    // 3. Возвращаем функцию очистки как "чистильщик" эффекта
    // вызывается перед следующим срабатыванием эффекта или при размонтировании компонента.
    // В нашем случае: как только пользователь начал вводить что-то в поле login — inputs.login изменился →
    // useEffect сработал → сначала выполнился return → ошибка сбросилась.
    return () => {
      handler(); // при следующем изменении login — ошибка исчезнет
    };
    // useEffect будет срабатывать только когда меняется inputs.login (ввод логина).
  }, [inputs.login]); // слушаем только логин

  return (
    // Обертка всей формы регистрации
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
        {/* Форма */}
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
            {/* Сообщение об ошибке, если оно есть */}
            <Collapse in={Boolean(errorMessage) && !isAuthenticated}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            </Collapse>

            {/* Поле логина */}
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

          {/* Поле пароля */}
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

          {/* Поле имени */}
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

          {/* Кнопка отправки формы */}
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
