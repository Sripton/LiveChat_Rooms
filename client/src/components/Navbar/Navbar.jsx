import React, { useState } from "react";
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
  const { userID, userName, userAvatar } = userPropsData;
  const menuItems = userID
    ? ["Главная", "Мой профиль", "Выход"]
    : ["Войти", "Главная"];

  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawerMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleMenuClick = (text) => {
    if (text === "Войти") {
      navigate("/signin");
    } else if (text === "Выход") {
      dispatch(logoutUser(navigate));
    } else if (text === "Мой профиль") {
      navigate("/userdashboard");
    } else {
      navigate("/");
    }
    setOpenMenu(false);
  };

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

  const isActivePath = (text) => {
    if (text === "Главная") return location.pathname === "/";
    if (text === "Мой профиль") return location.pathname === "/userdashboard";
    if (text === "Войти") return location.pathname === "/signin";
    return false;
  };

  const mainColor = "#1d102f"; // тёмный фиолетовый
  const mainColorLight = "#3a214f";
  const accentColor = "#b794f4";

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        {/* Верхняя панель навигации */}
        <Box
          sx={{
            px: 3,
            backgroundColor: mainColor,
            height: "64px",
            width: "100%",
            zIndex: 1201,
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Иконка-гамбургер */}
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
              gap: 2,
              ml: "auto",
            }}
          >
            <Typography
              sx={{
                color: "#f5f5f5",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "0.95rem",
                letterSpacing: 0.5,
                textTransform: "none",
                maxWidth: "220px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right",
              }}
            >
              {userName}
            </Typography>

            <Button
              sx={{
                minWidth: "auto",
                p: 0,
                borderRadius: "999px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {userAvatar ? (
                <Box
                  sx={{
                    borderRadius: "999px",
                    padding: "2px",
                    background:
                      "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    className="avatar"
                    src={`${process.env.REACT_APP_BASEURL}${userAvatar}`}
                    alt="avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                </Box>
              ) : (
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    backgroundColor: mainColorLight,
                    color: "#fff",
                    fontSize: "0.9rem",
                  }}
                />
              )}
            </Button>
          </Box>
        </Box>

        {/* Боковая панель меню */}
        <Drawer
          anchor="left"
          open={openMenu}
          onClose={() => toggleDrawerMenu(false)}
          PaperProps={{
            sx: {
              backgroundColor: mainColor,
              color: "#e5e7eb",
              width: 280,
              pt: 8,
              px: 2,
              borderRight: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        >
          <List sx={{ mt: 1 }}>
            {menuItems.map((text) => {
              const active = isActivePath(text);
              return (
                <ListItem
                  key={text}
                  className="menu-list"
                  disableGutters
                  sx={{ mb: 0.5 }}
                >
                  <Button
                    onClick={() => handleMenuClick(text)}
                    startIcon={getStartIcon(text)}
                    sx={{
                      fontSize: "0.95rem",
                      fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      width: "100%",
                      borderRadius: "10px",
                      px: 1.5,
                      py: 1,
                      color: active ? accentColor : "#e5e7eb",
                      backgroundColor: active ? mainColorLight : "transparent",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },
                      "&:hover": {
                        backgroundColor: mainColorLight,
                        color: accentColor,
                      },
                    }}
                  >
                    {text}
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </Container>
    </>
  );
}
