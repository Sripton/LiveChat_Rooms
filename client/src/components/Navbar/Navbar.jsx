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
import AddHomeIcon from "@mui/icons-material/AddHome";
import EditIcon from "@mui/icons-material/Edit";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import "./navbar.css";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
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
    }
    setOpenMenu(false); // Закрываем меню
  };

  // Состояние, определяющее, активно ли выпадающее меню профиля
  const [profileDropActive, setProfileDropActive] = useState(false);
  const goToProfileEditor = () => {
    navigate("/profileeditor", {
      state: { from: location }, //  сохраняем текущий путь
    });
    setProfileDropActive(false); // Закрываем выпалающее меню
  };

  // Реф для кнопки, открывающей выпадающее меню профиля
  const profileDropDownBtn = useRef(null);
  // Реф для списка, открывающей выпадающее меню профиля
  const profileDropDownMenu = useRef(null);

  // Функция для переключения состояния выпадающего меню профиля
  const handleProfileDropDown = () => {
    setProfileDropActive(!profileDropActive);
  };

  // Вынесение логики определения иконки для меню
  const getStartIcon = (text) => {
    switch (text) {
      case "Войти":
        return <AddHomeIcon />;
      case "Мой профиль":
        return <AccountBoxIcon />;
      default:
        return <LogoutIcon />;
    }
  };

  useEffect(() => {
    // Функция, которая обрабатывает клик вне элементов профиля
    const handleClickOutside = (event) => {
      // Проверяем:
      // 1. Меню открыто (profileDropActive)
      // 2. Есть ссылки на DOM-элементы кнопки и меню (ref.current)
      // 3. Клик был не по кнопке профиля и не по самому меню
      if (
        profileDropActive &&
        profileDropDownBtn.current &&
        !profileDropDownBtn.current.contains(event.target) &&
        !profileDropDownMenu.current.contains(event.target)
      ) {
        // Если всё условие выполняется — закрываем выпадающее меню
        setProfileDropActive(false);
      }
    };
    // Назначаем обработчик события на весь документ
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Очищаем обработчик при размонтировании компонента или изменении зависимости
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropActive]);

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

            {/* Кнопка-аватар с выпадающим меню */}
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "inherit", // Убираем цвет при наведении
                  cursor: "pointer",
                },
              }}
              className="avatar-button"
              // По спецификации HTML нельзя вкладывать <ul> внутрь <button>.
              // Это вызывает предупреждения и потенциально баги, особенно при серверной рендеризации
              // или гидрации (как в твоём случае, если ты это видел в консоли).
              // ref={profileDropDownBtn}
              onClick={handleProfileDropDown}
              ref={profileDropDownBtn}
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
            {/* Выпадающее меню */}
            {/* {profileDropActive && (
              <ul
                ref={profileDropDownMenu}
                className={`profile-dropdown-list ${"active-dropmenu"}`}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "48px",
                  zIndex: 1000,
                }}
              >
                <li className="profile-dropdown-item">
                  <Box
                    sx={{ minWidth: "auto", padding: 0, cursor: "pointer" }}
                    onClick={goToProfileEditor}
                  >
                    <EditIcon sx={{ color: "#4685df" }} />
                  </Box>
                </li>

                <li className="profile-dropdown-item">
                  <ContactMailIcon sx={{ color: "#4685df" }} />
                </li>

                <li className="profile-dropdown-item">
                  <FavoriteIcon sx={{ color: "#4685df" }} />
                </li>

                <li className="profile-dropdown-item">
                  <MeetingRoomIcon sx={{ color: "#4685df" }} />
                </li>
              </ul>
            )} */}
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
            {["Войти", "Мой профиль", "Выход"].map((text) => (
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
