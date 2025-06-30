import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import "./signup.css";

export default function Signup({ userPropsData }) {
  const { inputs, inputsUsersHandler, signupSubmitHandler } = userPropsData;

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
