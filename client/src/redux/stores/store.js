// Импорт функции configureStore из Redux Toolkit — упрощает настройку Redux store
import { configureStore } from "@reduxjs/toolkit";
// Импорт редьюсера для пользователя, который обрабатывает действия, связанные с аутентификацией и данными пользователя
import userReducer from "../reducers/userReducer";

// Импорт редьюсера для комнат, который обрабатывает действия, связанные с созданием  открытых или приватных комнат пользователем
import roomReducer from "../reducers/roomReducer";

// Экспорт конфигурированного хранилища (store)
export default configureStore({
  // Объект всех редьюсеров приложения
  reducer: {
    user: userReducer, // Ключ `user` определяет ветку состояния Redux: state.user будет обрабатываться userReducer'ом
    room: roomReducer, // Ключ `room` определяет ветку состояния Redux: state.room будет обрабатываться roomReducer'ом
  },
});
