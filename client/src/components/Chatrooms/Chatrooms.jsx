import React, { useEffect, useMemo, useRef, useState } from "react";

import { Box, Paper, Grid, styled, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

// Иконки
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../redux/actions/roomActions";

// Компоненты
import ModalRoomCreate from "../ModalRoomCreate";
import TooltipFloating from "../TooltipFloating";
import ChatMessage from "../ChatMessage";

import "./chatrooms.css";

export default function Chatrooms() {
  // Состояния раскрытия блоков с комнатами
  const [openRoomExpanded, setOpenRoomExpanded] = useState(false);
  const [privateRoomExpanded, setPrivateRoomExpanded] = useState(false);

  // Состояния сообщений и модального окна
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // -------------------- Tooltip для описания комнат ---------------
  const [tooltip, setToolTip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const showTimeoutRef = useRef(null);
  const hideTimeOutRef = useRef(null);

  // Обработка наведения мыши на комнату — позиционируем тултип и показываем его
  const handleMouseEnter = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    clearTimeout(hideTimeOutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      const newX = rect.left + rect.width / 2;
      const newY = rect.top - 10;

      // Только если данные изменились — обновляем стейт
      if (
        !tooltip.visible ||
        tooltip.text !== text ||
        tooltip.x !== newX ||
        tooltip.y !== newY
      ) {
        setToolTip({
          visible: true,
          text,
          x: newX,
          y: newY,
        });
      }
      setShowTooltip(true);
    }, 100); // Задержка перед появлением
  };

  // Убираем тултип при уходе мыши
  const handleMouseLeave = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeOutRef.current = setTimeout(() => {
      setShowTooltip(false); // Плавно скрываем
      setTimeout(() => {
        setToolTip({
          visible: false,
          text: "",
          x: 0,
          y: 0,
        });
      }, 300);
    }, 100); // После окончания анимации скрытия
    setToolTip({ ...tooltip, visible: false }); // Принудительно скрываем
  };

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeOutRef.current);
  }, []);

  // -------------------- Получение всех комнат из Redux -----------------------
  const allRooms = useSelector((store) => store.room.allRooms); // Извлечение всех комнат из хранилища Redux.
  const dispatch = useDispatch();

  // Redux: Загрузка всех комнат
  useEffect(() => {
    dispatch(fetchAllRooms()); // Запрашиваем комнаты при монтировании
  }, [dispatch]);

  // Разделение комнат по типу: открытые и приватные.
  const openRooms = allRooms.filter((rooms) => rooms.isPrivate === false);
  const privateRooms = allRooms.filter((rooms) => rooms.isPrivate === true);

  // Переключение блоков: открытые / закрытые комнаты
  const handlerIsExpanded = (state) => {
    if (state === "open") {
      setOpenRoomExpanded((prev) => !prev);
    }
    if (state === "private") {
      setPrivateRoomExpanded((prev) => !prev);
    }
  };
  // ------------------------------------- Данные для чата --------------------------
  const messages = [
    {
      id: 1,
      sender: "user",
      text: "Привет. Я Мария. Ты когда-нибудь задумывался, что наш выбор еды влияет на климат сильнее, чем кажется?",
    },
    {
      id: 2,
      sender: "bot",
      text: "Привет Мария. Я Джон. Да, особенно когда читаешь, сколько воды уходит на килограмм говядины — пугает.",
    },
    {
      id: 3,
      sender: "user",
      text: "Вот почему я отказалась от мяса — не из моды, а ради планеты и будущего детей",
    },
    {
      id: 4,
      sender: "bot",
      text: "Звучит честно… Я давно хотел начать с малого — может, ты мне подскажешь?",
    },
  ];

  // -------------------------------- Анимация сообщений -----------------------------
  // Старая логика для анимации
  // const animationPlayed = useRef(false);
  // useEffect(() => {
  //   if (!animationPlayed.current) {
  //     let i = 0;
  //     const interval = setInterval(() => {
  //       if (i < messages.length) {
  //         setVisibleMessages((prev) => [...prev, messages[i]]);
  //         i += 1;
  //       } else {
  //         clearInterval(interval);
  //       }
  //     }, 1100);
  //     // После первого запуска эффекта  реф всегда остаётся true (пока компонент не размонтируется),
  //     //  и анимация больше не проигрывается повторно, даже если произойдёт ререндер по другим причинам.
  //     animationPlayed.current = true;

  //     return () => clearInterval(interval);
  //   }
  //   return undefined;
  // }, []);

  // Новая логика для анимации
  const intervalRef = useRef();

  useEffect(() => {
    // Останавливаем анимацию, если открыта модалка
    if (openModal) {
      // Если ранее был создан setInterval — очищаем его,
      // чтобы анимация сообщений остановилась на паузе.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return; // Выходим из эффекта — не запускаем новый интервал.
    }
    // Если не все сообщения показаны — продолжаем анимацию
    // Добавляем сообщения по одному
    if (visibleMessages.length < messages.length) {
      // i — индекс следующего сообщения, начинаем с уже показанного количества
      let i = visibleMessages.length;
      // Запускаем setInterval — каждую 1.2 сек добавляем следующее сообщение
      intervalRef.current = setInterval(() => {
        setVisibleMessages((prev) => {
          if (i < messages.length) {
            const next = [...prev, messages[i]]; // добавляем следующее сообщение
            i += 1;
            return next;
          }

          // Если все сообщения показаны — очищаем интервал
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 1200);
    }
    //  Когда  эффект создаёт “асинхронные” вещи (setInterval, setTimeout, подписки, слушатели событий),
    // Надо обязательно их удалить или “отписаться”, чтобы не было утечек памяти и багов.
    // Если не почистить setInterval, он будет продолжать тикать даже когда компонент уже не нужен!
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [openModal, visibleMessages.length]);

  // -------------------- Мемоизированный рендер  сообщений для анимации --------------------
  const renderedMessages = useMemo(
    () =>
      visibleMessages.map((msg) => (
        <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
      )),
    [visibleMessages]
  );

  // -------------------- Стили через styled --------------------
  const Root = styled(Box)({
    minHeight: "100vh",
    background: "#fde4ec",
    padding: "40px 0",
  });

  const RoomList = styled(Paper)({
    background: "#fff0f6",
    padding: "24px",
    borderRadius: 20,
    marginBottom: 24,
    boxShadow: "0 4px 16px 0 rgba(230, 30, 99, 0.04)",
  });

  return (
    <Root>
      {/* Кнопка для создания новой комнаты */}
      <Grid
        container
        spacing={4}
        sx={{
          position: "relative",
          mt: 6,
          ml: 14,
          display: "flex",
        }}
      >
        <Grid item>
          <Box>
            <Button
              sx={{
                color: "#d81b60",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
              onClick={() => setOpenModal(true)}
            >
              Создать комнату
            </Button>
            {/* Модальное окно */}
            <ModalRoomCreate
              openModal={openModal}
              setOpenModal={setOpenModal}
              closeModal={() => setOpenModal(false)}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Основной контент: комнаты и чат */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 10 }}>
        <Grid item>
          <div className="filter">
            <table>
              <thead>
                <tr>
                  <th>
                    Открытые комнаты
                    <span className="arrow" />
                  </th>
                  <th>
                    Закрытые комнаты
                    <span className="arrow" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Math.max(openRooms.length, privateRooms.length) > 0 &&
                  Array.from({
                    length: Math.max(openRooms.length, privateRooms.length),
                  }).map((_, index) => (
                    <tr key={index}>
                      <td>
                        {openRooms[index] ? (
                          <span className="room-cell">
                            <MeetingRoomIcon
                              sx={{
                                mr: 2,
                                color: "#76ce7e",
                              }}
                            />
                            {openRooms[index]?.nameroom || ""}
                          </span>
                        ) : (
                          <span className="room-cell" />
                        )}
                      </td>

                      <td>
                        {privateRooms[index] ? (
                          <span className="room-cell">
                            <LockIcon
                              sx={{
                                mr: 2,
                                color: "#f26f6f",
                              }}
                            />
                            {privateRooms[index]?.nameroom || ""}
                          </span>
                        ) : (
                          <span className="room-cell" />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>

        {/* Блок анимации/чата */}
        <Grid item>
          <Paper
            sx={{
              padding: "10px 15px",
              boxShadow: "0 8px 32px 0 rgba(230, 30, 99, 0.10)",
              borderRadius: 6,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "400px",
              }}
            >
              {renderedMessages}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {tooltip.visible && (
        <TooltipFloating
          tooltipVisible={tooltip.visible}
          showTooltip={showTooltip}
          tooltipX={tooltip.x}
          tooltipY={tooltip.y}
          tooltipText={tooltip.text}
        />
      )}
    </Root>
  );
}
