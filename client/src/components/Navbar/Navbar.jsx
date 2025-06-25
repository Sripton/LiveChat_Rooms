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
} from "@mui/material";
import AddHomeIcon from "@mui/icons-material/AddHome";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleDrawerMenu = () => {
    setOpenMenu(!openMenu);
  };

  const navigate = useNavigate();

  const handleMenuClick = (text) => {
    if (text === "Войти") {
      navigate("/signup");
    } else if (text === "Выход") {
      navigate("/");
    }
  };

  // const handleMenuClick = (text) => {
  //   if (text === "Войти") {
  //     navigate("/signup"); // ⬅️ переход на /signup
  //   }
  //   if (text === "Выход") {
  //     // можно добавить логику logout
  //     console.log("Выход");
  //   }
  //   setOpenMenu(false); // закрыть меню
  // };
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
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontWeight: "bold",
              fontFamily: "Tinos, serif",
              letterSpacing: 1,
            }}
          >
            Live chat rooms
          </Typography>

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
        </Box>

        <Drawer
          anchor="left"
          open={openMenu}
          sx={{
            background:
              "linear-gradient(0deg,rgba(232, 232, 232, 1) 0%,rgba(250, 230, 250, 1) 100%);",
          }}
          PaperProps={{
            sx: {
              background:
                "linear-gradient(0deg,rgba(232, 232, 232, 1) 0%,rgba(250, 230, 250, 1) 100%);",
              color: "#676565",
              width: 280,
              pt: 8,
              px: 2,
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
