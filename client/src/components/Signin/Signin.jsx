import React, { useContext } from "react";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import { NavLink } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

import "./signin.css";
export default function Signin() {
  const { inputs, signupInputsHandler, signinSubmitHandler } =
    useContext(UserContext);

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
            onChange={signupInputsHandler}
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
            onChange={signupInputsHandler}
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
              "&:hover": { color: "#60a5fa", background: "transparent" },
            }}
          >
            Войти
          </Button>
        </form>
        <NavLink to="/signup" type="submit" className="navlink-auth">
          Зарегистрироваться
        </NavLink>
      </Box>
    </Container>
  );
}
