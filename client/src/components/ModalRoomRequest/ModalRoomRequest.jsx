import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import KeyIcon from "@mui/icons-material/Key";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import sendRoomRequest from "../../redux/actions/roomRequestActions";
import { CLEAR_ROOM_REQUEST_STATE } from "../../redux/types/types";
export default function ModalRoomRequest({
  openRequestModal, // флаг открытия модалки
  closeModalRequest, // функция закрытия модалки
  selectedRoomID, // id комнаты для запроса
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false); //  показ уведомлений (Snackbar)
  const dispatch = useDispatch();

  // получаем данные из Redux стора
  const { status, error, request } = useSelector((store) => store.roomRequest);

  // обработчик отправки запроса
  const handleSubmitRequest = () => {
    if (!selectedRoomID) return; // если нет id комнаты, ничего не делаем
    dispatch(sendRoomRequest(selectedRoomID)); // диспатчим action отправки запроса
    closeModalRequest(); // закрываем модалку
  };

  // при каждом открытии модалки — сбрасываем состояние запроса в Redux
  useEffect(() => {
    if (openRequestModal) {
      dispatch({ type: CLEAR_ROOM_REQUEST_STATE });
    }
  }, [openRequestModal, dispatch]);

  // если запрос успешно отправлен — показываем Snackbar
  useEffect(() => {
    if (request) {
      setOpenSnackbar(true);
    }
  }, [request]);

  // если при запросе возникла ошибка — показываем Snackbar
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  // при закрытии модалки — сразу скрываем Snackbar
  useEffect(() => {
    if (!openRequestModal) {
      setOpenSnackbar(false);
    }
  }, [openRequestModal]);

  // обработчик закрытия модалки
  const handleCloseModalRequest = () => {
    closeModalRequest();
  };

  return ReactDOM.createPortal(
    <>
      <Box>
        {openRequestModal && (
          // фон и контейнер модалки
          <Box
            sx={{
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(207, 128, 163, 0.5)",
              zIndex: 1300,
              position: "fixed",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center ",
            }}
          >
            {/* сама модалка */}
            <Box
              sx={{
                background: "rgb(252, 240, 245)",
                p: 6,
                borderRadius: 4,
                maxWidth: "90%",
                minWidth: 300,
                position: "relative",
                boxShadow: 6,
              }}
            >
              {/* заголовок модалки */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <KeyIcon sx={{ mr: 1, color: "red" }} />
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                >
                  Запрос на доступ
                </Typography>
              </Box>
              {/* форма с кнопками */}
              <form onSubmit={handleSubmitRequest}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#d81b60", mr: 2 }}
                  type="submit"
                >
                  Отправить
                </Button>
                <Button
                  variant="outlined"
                  sx={{ backgroundColor: "#d81b60", color: "#fff" }}
                  onClick={handleCloseModalRequest}
                >
                  Отмена
                </Button>
              </form>
            </Box>
          </Box>
        )}
      </Box>
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
            sx={{ fontFamily: "monospace", fontWeight: 500 }}
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
            sx={{ fontFamily: "monospace", fontWeight: 500 }}
          >
            {`${error}`}
          </Alert>
        </Snackbar>
      )}
    </>,
    document.getElementById("modal-request") || document.body
  );
}
