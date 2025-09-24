// Импорт функции configureStore из Redux Toolkit — упрощает настройку Redux store
import { configureStore } from "@reduxjs/toolkit";
// Импорт редьюсера для пользователя, который обрабатывает действия, связанные с аутентификацией и данными пользователя
import userReducer from "../reducers/userReducer";

// Импорт редьюсера для комнат, который обрабатывает действия, связанные с созданием  открытых или приватных комнат пользователем
import roomReducer from "../reducers/roomReducer";

// Импорт редьюсера, который обрабатывает действия, связанные с созданием  постов пользователем
import postReducer from "../reducers/postReducer";

// Импорт редьюсера, который обрабатывает действия, связанные с запросами на приватные комнаты
import roomRequestReducer from "../reducers/roomRequestReducer";

// Импорт редьюсера, который обрабатывает действия, связанные с отображением  запросов
import roomRequestStatusReducer from "../reducers/roomRequestStatusReducer";

// Импорт редьюсера, который обрабатывает действия, связанные с реакциями на посты
import reactionPostReducer from "../reducers/reactionPostReducer";

// Импорт редьюсера, который обрабатывает действия, связанные с реакциями на посты
import commentReducer from "../reducers/commentReducer";

// Экспорт конфигурированного хранилища (store)
export default configureStore({
  // Объект всех редьюсеров приложения
  reducer: {
    user: userReducer, // Ключ `user` определяет ветку состояния Redux: state.user будет обрабатываться userReducer'ом
    room: roomReducer, // Ключ `room` определяет ветку состояния Redux: state.room будет обрабатываться roomReducer'ом
    roomRequest: roomRequestReducer, // Ключ `roomRequest` определяет ветку состояния Redux: state.roomRequest будет обрабатываться roomRequestReducer'ом
    roomRequestStatus: roomRequestStatusReducer,
    post: postReducer, // Ключ `post` определяет ветку состояния Redux: state.post будет обрабатываться postReducer'ом
    reactionsPosts: reactionPostReducer,
    comment: commentReducer,
  },
});
