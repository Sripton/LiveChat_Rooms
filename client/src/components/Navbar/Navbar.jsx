import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  Typography,
  Button,
  Link,
} from "@mui/material";
import AddHomeIcon from "@mui/icons-material/AddHome";
import EditIcon from "@mui/icons-material/Edit";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import "./navbar.css";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
export default function Navbar({ userPropsData }) {
  // Компонент Navbar получает данные о пользователе через компонент App.jsx
  const { userID, userName, userAvatar } = userPropsData;

  const [openMenu, setOpenMenu] = useState(false); // Состояние бокового меню
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    }
    setOpenMenu(false); // Закрываем меню
  };

  // Состояние, определяющее, активно ли выпадающее меню профиля
  const [profileDropActive, setProfileDropActive] = useState(false);

  // Реф для кнопки, открывающей выпадающее меню профиля
  const profileDropDownBtn = useRef(null);

  // Функция для переключения состояния выпадающего меню профиля
  const handleProfileDropDown = () => {
    setProfileDropActive(!profileDropActive);
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
                fontWeight: "bold",
                fontFamily: "Tinos, serif",
                letterSpacing: 1,
                fontSize: "1rem",
              }}
            >
              {userName}
            </Typography>

            {/* Кнопка-аватар с выпадающим меню */}
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "inherit", // Убираем цвет при наведении
                  cursor: "pointer",
                },
              }}
              className="avatar-button"
              ref={profileDropDownBtn}
              onClick={handleProfileDropDown}
            >
              {/* Аватар пользователя */}
              <img
                className="avatar"
                src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                alt=""
              />
              <i className="fa-solid fa-circle" />
              {/* Выпадающее меню */}
              <ul
                className={`profile-dropdown-list ${
                  profileDropActive ? "active-dropmenu" : ""
                }`}
              >
                {/* Ссылка на редактирование профиля */}
                <li className="profile-dropdown-item">
                  <Link component={NavLink} to="/profileeditor">
                    <EditIcon sx={{ color: "#4685df" }} />
                  </Link>
                </li>
                {/* Ко-во ответов на комменатрии */}
                <li className="profile-dropdown-item">
                  <ContactMailIcon sx={{ color: "#4685df" }} />
                </li>
                {/* Ко-во лайков на действия пользователя */}
                <li className="profile-dropdown-item">
                  <FavoriteIcon sx={{ color: "#4685df" }} />
                </li>
                {/* Ко-во комнат */}
                <li className="profile-dropdown-item">
                  <MeetingRoomIcon sx={{ color: "#4685df" }} />
                </li>
              </ul>
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
            {["Войти", "Выход"].map((text) => (
              <ListItem
                key={text}
                className="menu-list"
                onClick={() => toggleDrawerMenu(false)}
              >
                {/* Кнопки "Войти" и "Выход" */}
                <Button
                  onClick={() => handleMenuClick(text)}
                  // startIcon - проп компонента Button из MUI, который добавляет иконку слева от текста кнопки.
                  startIcon={
                    text === "Войти" ? <AddHomeIcon /> : <LogoutIcon />
                  }
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
