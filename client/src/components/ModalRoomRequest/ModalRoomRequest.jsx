import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import KeyIcon from "@mui/icons-material/Key";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import sendRoomRequest from "../../redux/actions/roomRequestActions";
import { CLEAR_ROOM_REQUEST_STATE } from "../../redux/types/types";

export default function ModalRoomRequest({
  openRequestModal,
  closeModalRequest,
  selectedRoomID,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();

  const { status, error, request } = useSelector((store) => store.roomRequest);

  // Отправка запроса
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!selectedRoomID) return;
    dispatch(sendRoomRequest(selectedRoomID));
    closeModalRequest();
  };

  // Сброс состояния запроса при открытии модалки
  useEffect(() => {
    if (openRequestModal) {
      dispatch({ type: CLEAR_ROOM_REQUEST_STATE });
    }
  }, [openRequestModal, dispatch]);

  // Показ Snackbar при успехе
  useEffect(() => {
    if (request) {
      setOpenSnackbar(true);
    }
  }, [request]);

  // Показ Snackbar при ошибке
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  // Закрытие Snackbar при закрытии модалки
  useEffect(() => {
    if (!openRequestModal) {
      setOpenSnackbar(false);
    }
  }, [openRequestModal]);

  const cardBg = "#231433";
  const cardSoftBg = "#2b183c";
  const accentColor = "#b794f4";
  const accentColorStrong = "#c4b5fd";

  return ReactDOM.createPortal(
    <>
      {openRequestModal && (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            zIndex: 10030,
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(3,1,14,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Карточка модалки */}
          <Box
            sx={{
              backgroundColor: cardBg,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              maxWidth: 420,
              width: "100%",
              position: "relative",
              boxShadow: "0 22px 50px rgba(0,0,0,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#e5e7eb",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2.5,
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: cardSoftBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.9)",
                }}
              >
                <KeyIcon sx={{ color: accentColorStrong, fontSize: 22 }} />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Запрос на доступ к комнате
              </Typography>
            </Box>

            {/* Текст-пояснение (можно убрать, если не нужно) */}
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: "#9ca3af",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              Мы отправим владельцу комнаты запрос на доступ. После одобрения вы
              сможете войти в приватную комнату.
            </Typography>

            {/* Форма с кнопками */}
            <Box
              component="form"
              onSubmit={handleSubmitRequest}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                onClick={closeModalRequest}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.9,
                  borderColor: "rgba(148,163,184,0.7)",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderColor: accentColorStrong,
                    backgroundColor: "rgba(148,163,184,0.12)",
                  },
                }}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 3,
                  py: 0.9,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                  color: "#0b0615",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.9)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                    boxShadow: "0 14px 32px rgba(0,0,0,1)",
                    transform: "translateY(-1px)",
                  },
                  transition:
                    "all .2s cubic-bezier(0.3, 1.4, 0.3, 1), transform .2s ease",
                }}
              >
                Отправить запрос
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar при успешном запросе */}
      {request && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
              fontWeight: 500,
            }}
          >
            {`${status}`}
          </Alert>
        </Snackbar>
      )}

      {/* Snackbar при ошибке */}
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            variant="filled"
            sx={{
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
              fontWeight: 500,
            }}
          >
            {`${error}`}
          </Alert>
        </Snackbar>
      )}
    </>,
    document.getElementById("modal-request") || document.body
  );
}
