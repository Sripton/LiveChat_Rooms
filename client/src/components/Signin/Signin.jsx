import React, { useContext } from "react";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import { NavLink } from "react-router-dom";

import "./signin.css";
export default function Signin({ userPropsData }) {
  const { inputs, inputsUsersHandler, signinSubmitHandler } = userPropsData;

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
          Вход
        </Typography>
        <form
          onSubmit={signinSubmitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <TextField
            name="login"
            value={inputs.login || ""}
            onChange={inputsUsersHandler}
            variant="outlined"
            placeholder="Введите логин"
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

          <Button
            type="submit"
            sx={{
              fontSize: "1.1em",
              "&:hover": {
                color: "#60a5fa",
                background: "transparent",
                fontWeight: "bold",
              },
            }}
          >
            Войти
          </Button>
        </form>
        <Link
          component={NavLink}
          to="/signup"
          sx={{
            textDecoration: "none",
            textTransform: "uppercase",
            "&:hover": {
              bgcolor: "transparent",
              color: "#60a5fa",
              fontWeight: "bold",
            },
          }}
        >
          Зарегистрироваться
        </Link>
      </Box>
    </Container>
  );
}
