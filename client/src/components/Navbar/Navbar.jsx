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
} from "@mui/material";
import AddHomeIcon from "@mui/icons-material/AddHome";
import EditIcon from "@mui/icons-material/Edit";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navbar.css";
import { useNavigate, NavLink } from "react-router-dom";

export default function Navbar({ userPropsData }) {
  const { userID, userName, userAvatar } = userPropsData;
  const [openMenu, setOpenMenu] = useState(false);
  const toggleDrawerMenu = () => {
    setOpenMenu(!openMenu);
  };
  const navigate = useNavigate();
  const handleMenuClick = (text) => {
    if (text === "Войти") {
      navigate("/signin");
    } else if (text === "Выход") {
      navigate("/");
    }
    setOpenMenu(false);
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
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              widtH: "500px",
            }}
          >
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

            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "inherit", // Отключаем изменение фона
                  cursor: "pointer",
                },
              }}
              className="avatar-button"
              ref={profileDropDownBtn}
              onClick={handleProfileDropDown}
            >
              <img
                className="avatar"
                src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                alt=""
              />
              <i className="fa-solid fa-circle" />
              <ul
                className={`profile-dropdown-list ${profileDropActive ? "active-dropmenu" : ""}`}
              >
                <li className="profile-dropdown-item">
                  <NavLink to="/profileeditor">
                    <EditIcon sx={{ color: "gray" }} />
                  </NavLink>
                </li>
                <li className="profile-dropdown-item">
                  <ContactMailIcon sx={{ color: "gray" }} />
                </li>
                <li className="profile-dropdown-item">
                  <FavoriteIcon sx={{ color: "gray" }} />
                </li>
              </ul>
            </Button>
          </Box>
        </Box>

        <Drawer
          anchor="left"
          open={openMenu}
          sx={{
            background:
              "linear-gradient(0deg,rgb(233, 243, 201) 0%,rgb(240, 168, 240) 100%);",
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
