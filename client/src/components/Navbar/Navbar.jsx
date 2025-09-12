import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
export default function Navbar({ userPropsData }) {
  // Компонент Navbar получает данные о пользователе через компонент App.jsx
  const { userID, userName, userAvatar } = userPropsData;

  const [openMenu, setOpenMenu] = useState(false); // Состояние бокового меню
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Открытие/закрытие бокового меню
  const toggleDrawerMenu = () => {
    setOpenMenu(!openMenu);
  };

  // Обработка кликов по пунктам меню
  const handleMenuClick = (text) => {
    if (text === "Войти") {
      navigate("/signin");
    } else if (text === "Выход") {
      dispatch(logoutUser(navigate)); // Выход с вызовом action logoutUser
    } else if (text === "Мой профиль") {
      navigate("/userdashboard");
    } else {
      navigate("/");
    }
    setOpenMenu(false); // Закрываем меню
  };

  // Вынесение логики определения иконки для меню
  const getStartIcon = (text) => {
    switch (text) {
      case "Войти":
        return <AppRegistrationRoundedIcon />;
      case "Главная":
        return <HomeRoundedIcon />;
      case "Мой профиль":
        return <AccountBoxIcon />;
      default:
        return <LogoutIcon />;
    }
  };

  return (
    <>
      {/* Сброс стандартных стилей браузера */}
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        {/* Верхняя панель навигации */}
        <Box
          sx={{
            px: 3,
            background:
              "linear-gradient(0deg,rgba(232, 232, 232, 1) 0%,rgba(250, 230, 250, 1) 100%);",
            height: "64px",
            width: "100%",
            zIndex: 1201,
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Иконка-гамбургер для мобильного меню */}
          <div
            className={`menu-icon ${openMenu ? "iconActive" : ""}`}
            onClick={() => toggleDrawerMenu(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleDrawerMenu(true);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Открыть меню"
          >
            <span />
          </div>

          {/* Блок с именем пользователя и аватаром */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              widtH: "500px",
            }}
          >
            {/* Имя пользователя */}
            <Typography
              // variant="h6"
              sx={{
                color: "#000",
                fontFamily: "monospace",
                letterSpacing: 1,
                fontSize: "1rem",
              }}
            >
              {userName}
            </Typography>

            {/* Кнопка-аватар  */}
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "inherit", // Убираем цвет при наведении
                  cursor: "pointer",
                },
              }}
            >
              {/* Аватар пользователя */}
              {userAvatar ? (
                <>
                  <img
                    className="avatar"
                    src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                    alt=""
                  />
                  <i className="fa-solid fa-circle-img" />
                </>
              ) : (
                <Avatar />
              )}
            </Button>
          </Box>
        </Box>

        {/* Боковая панель Drawer */}
        <Drawer
          anchor="left"
          open={openMenu}
          sx={{
            background:
              "linear-gradient(0deg,rgb(238, 216, 237) 0%,rgb(238, 201, 238) 100%);",
            opacity: "1",
          }}
          PaperProps={{
            sx: {
              background:
                "linear-gradient(0deg,rgba(232, 232, 232, 1) 0%,rgba(250, 230, 250, 1) 100%);",
              color: "#676565",
              width: 280,
              pt: 8,
              px: 2,
              opacity: "1",
            },
          }}
          onClose={() => toggleDrawerMenu(false)}
        >
          <List>
            {["Войти", "Главная", "Мой профиль", "Выход"].map((text) => (
              <ListItem
                key={text}
                className="menu-list"
                onClick={() => toggleDrawerMenu(false)}
              >
                {/* Кнопки "Войти", "Мои комнаты" и "Выход" */}
                <Button
                  onClick={() => handleMenuClick(text)}
                  // startIcon - проп компонента Button из MUI, который добавляет иконку слева от текста кнопки.
                  startIcon={getStartIcon(text)}
                  sx={{
                    fontSize: "1rem",
                    fontFamily: "Tinos, serif",
                    textTransform: "uppercase",
                    justifyContent: "flex-start",
                    width: "100%",
                    color: "#676565",
                    "&:hover": { color: "#60a5fa", background: "transparent" },
                  }}
                >
                  {text}
                </Button>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Container>
    </>
  );
}
