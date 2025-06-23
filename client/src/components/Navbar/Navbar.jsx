import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import "./navbar.css";
export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleDrawerMenu = () => {
    setOpenMenu(!openMenu);
  };
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Box
          sx={{
            px: 3,
            height: "64px",
            bgcolor: "#111827",
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
              color: "#ffF",
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
          PaperProps={{
            sx: {
              bgcolor: "#1f2937",
              color: "#fff",
              width: 280,
              pt: 8,
              px: 2,
            },
          }}
          onClose={() => toggleDrawerMenu(false)}
        >
          <List>
            {["Регистрация", "Войти", "Выход"].map((text) => (
              <ListItem
                key={text}
                className="menu-list"
                sx={{
                  fontSize: "1.3rem",
                  fontFamily: "Tinos, serif",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  py: 1.5,
                  transition: "color 0.3s",
                  "&:hover": { color: "#60a5fa" },
                }}
                onClick={() => toggleDrawerMenu(false)}
              >
                <Typography>{text}</Typography>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Container>
    </>
  );
}
