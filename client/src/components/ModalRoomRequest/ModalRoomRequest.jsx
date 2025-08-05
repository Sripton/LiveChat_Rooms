import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import KeyIcon from "@mui/icons-material/Key";
import {
  Box,
  Button,
  fabClasses,
  Fade,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { keyframes } from "@emotion/react";
import sendRoomRequest from "../../redux/actions/roomRequestActions";
import { CLEAR_ROOM_REQUEST_STATE } from "../../redux/types/types";
export default function ModalRoomRequest({
  openRequestModal,
  closeModalRequest,
  roomID,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { status, error, request } = useSelector((store) => store.roomRequest);

  const handleSubmitRequest = () => {
    if (!roomID) return;
    dispatch(sendRoomRequest(roomID));
    closeModalRequest();
  };

  // Очищаем состояние при каждом открытии модалки
  useEffect(() => {
    if (openRequestModal) {
      dispatch({ type: CLEAR_ROOM_REQUEST_STATE });
    }
  }, [openRequestModal, dispatch]);

  useEffect(() => {
    if (request) {
      setOpenSnackbar(true);
    }
  }, [request]);

  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);
  useEffect(() => {
    if (!openRequestModal) {
      setOpenSnackbar(false);
    }
  }, [openRequestModal]);

  const handleCloseModalRequest = () => {
    closeModalRequest();
  };
  console.log("status", status);
  return ReactDOM.createPortal(
    <>
      <Box>
        {openRequestModal && (
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
      {/* Snackbar на запрос  */}
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
      {/* Вывод сообщения если   запрос был отправлен  */}
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
