import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Fade,
  TextField,
  Typography,
} from "@mui/material";
import ReactDOM from "react-dom"; // для создания портала
import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import { createRoomsSubmit } from "../../redux/actions/roomActions";
export default function ModalRoomCreate({
  openModalRoomCreate, // флаг — открыто ли модальное окно
  closeModalRoomCreate, // функция для закрытия окна
  setOpenModalRoomCreate, // сеттер состояния для модального окна
}) {
  const dispatch = useDispatch();
  const [roomCreate, setRoomCreate] = useState({
    nameroom: "", // название комнаты
    description: "", // описание
    isPrivate: false, // приватность
  });

  const roomInputsHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomCreate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // обрабатываем чекбокс отдельно
      // [e.target.name]: type === "checkbox" ? checked : value,
    }));
  };

  const roomSubmitHandler = async (e) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы
    await dispatch(createRoomsSubmit(roomCreate)); // отправляем данные через Redux action
    setOpenModalRoomCreate(false); // закрываем модалку
  };

  return ReactDOM.createPortal(
    // Обёртка модального окна с полупрозрачным фоном
    <Fade in={openModalRoomCreate}>
      <Box
        sx={{
          zIndex: 10001,
          position: "fixed", // используется в сочетании с position: absolute или position: fixed
          inset: 0, // устанавливает нулевое расстояние от всех сторон родительского контейнера
          bgcolor: "rgba(41, 36, 37, 0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 2,
        }}
        onClick={closeModalRoomCreate} // закрытие при клике вне модалки
      >
        {/* Контейнер самой модалки */}
        <Box
          sx={{
            // адаптивную минимальную ширину компонента, которая меняется в зависимости от размера экрана
            //  ключи (xs, sm, md) -  минимальная ширина для каждого брейкпоинта.
            minWidth: { xs: "90vw", sm: 370, md: 440 },
            maxWidth: 520,
            width: "100%",
            bgcolor: "#fff0f6",
            boxShadow:
              "0 16px 48px 0 rgba(230,30,99,0.19), 0 1.5px 6px 0 #fff1f7",
            p: { xs: 2, sm: 3.5 },
            pb: 2,
            position: "relative",
            transition: "box-shadow .3s",
            borderRadius: "10px",
          }}
          onClick={(e) => e.stopPropagation()} // чтобы внутренний клик не закрыл окно
        >
          {/* Кнопка закрытия */}
          <Button
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              minWidth: 0,
              p: 0.8,
              color: "#d81b60",
              borderRadius: "50%",
              background: "#f8bbd0",
              "&:hover": { background: "#fde4ec" },
              zIndex: 1,
            }}
            aria-label="Закрыть"
            onClick={closeModalRoomCreate}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </Button>

          {/* Форма создания комнаты */}
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
            onSubmit={roomSubmitHandler}
          >
            {/* Поле "Название комнаты" */}
            <TextField
              name="nameroom"
              value={roomCreate.nameroom}
              onChange={roomInputsHandler}
              label="Название комнаты"
              variant="outlined"
              // fullWidth // Растягивает поле на 100% ширины родительского контейнера.
              required // Добавляет звёздочку (*) к лейблу, указывая, что поле обязательно для заполнения.
              autoFocus // Автоматически устанавливает фокус на это поле при загрузке компонента.
              sx={{
                background: "#fff",
                borderRadius: 2,
                input: { fontWeight: 500 },
                label: { color: "#d81b60" },
                width: "95%",
              }}
            />
            {/* Поле Описание комнаты */}
            <TextField
              name="description"
              value={roomCreate.description}
              onChange={roomInputsHandler}
              label="Описание комнаты"
              variant="outlined"
              // fullWidth // Растягивает поле на 100% ширины родительского контейнера.
              required // Добавляет звёздочку (*) к лейблу, указывая, что поле обязательно для заполнения.
              multiline // Превращает TextField в многострочное поле ввода (<textarea> вместо <input>).
              minRows={2} // Задаёт минимальное количество строк, которые будут видны изначально. Аналог CSS min-height.
              maxRows={4} // Определяет максимальное количество строк перед появлением скролла. Аналог CSS max-height.
              sx={{
                background: "#fff",
                borderRadius: 2,
                input: { fontWeight: 500 },
                label: { color: "#d81b60" },
                width: "95%",
              }}
            />
            {/* Чекбокс приватности + подпись */}
            <Fade in timeout={450}>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Checkbox
                  name="isPrivate"
                  checked={roomCreate.isPrivate}
                  onChange={roomInputsHandler}
                  icon={<MeetingRoomIcon />}
                  checkedIcon={<LockIcon />}
                  sx={{
                    mr: 1,
                    "&.Mui-checked": { color: "#d81b60" },
                  }}
                />
                <Typography
                  sx={{ color: "#d81b60", fontWeight: 500 }}
                  // onClick={() => setIsPrivate(true)}
                  onClick={() =>
                    setRoomCreate((prev) => ({
                      ...prev,
                      isPrivate: !roomCreate.isPrivate,
                    }))
                  }
                >
                  Приватная комната
                </Typography>
              </Box>
            </Fade>
            {/* Кнопка Создать */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: "linear-gradient(90deg,#f8bbd0 10%,#ffe3e3 90%)",
                  color: "#d81b60",
                  fontWeight: 700,
                  borderRadius: 3,
                  width: "40%",
                  px: 3,
                  py: 1.1,
                  boxShadow: "0 2px 12px 0 #ffd6e6",
                  fontSize: 17,
                  letterSpacing: 0.6,
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#f06292 20%,#fff0f6 100%)",
                    color: "#fff",
                  },
                  transition: "all .23s cubic-bezier(.3,1.4,.3,1)",
                }}
              >
                Создать
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Fade>,
    // Завершение портала
    document.getElementById("modal-root") || document.body // если нет modal-root — fallback в body
  );
}
