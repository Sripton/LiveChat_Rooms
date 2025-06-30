// Импорт функции configureStore из Redux Toolkit — упрощает настройку Redux store
import { configureStore } from "@reduxjs/toolkit";
// Импорт редьюсера для пользователя, который обрабатывает действия, связанные с аутентификацией и данными пользователя
import userReducer from "../reducers/userReducer";
// Экспорт конфигурированного хранилища (store)
export default configureStore({
  // Объект всех редьюсеров приложения
  reducer: {
    user: userReducer, // Ключ `user` определяет ветку состояния Redux: state.user будет обрабатываться userReducer'ом
  },
});
