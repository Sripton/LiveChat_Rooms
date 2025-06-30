// Импорт типов действий (action types), которые редьюсер будет обрабатывать
import {
  SET_REGISTER_USER,
  SET_LOGIN_USER,
  SET_EDIT_USER,
  LOGOUT_USER,
} from "../types/types";

// Начальное состояние пользовательского редьюсера
const initialState = {
  userID: null, // Идентификатор пользователя
  userName: null, // Имя пользователя
  userAvatar: null,
  isAuthenticated: false, // Флаг, указывающий, вошёл ли пользователь в систему
};

// Редьюсер, отвечающий за изменения состояния, связанные с пользователем
export default function userReducer(state = initialState, action) {
  // Деструктуризация типа действия и полезной нагрузки
  const { type, payload } = action;

  // Обработка различных типов действий
  switch (type) {
    // Обрабатываем как регистрацию, так и вход — логика одинаковая: устанавливаем данные пользователя
    case SET_REGISTER_USER:
    case SET_LOGIN_USER:
      return {
        ...state, // Сохраняем остальную часть состояния (если добавятся поля)
        userID: payload.userID, // Устанавливаем userID из action.payload
        userName: payload.userName, // Устанавливаем userName из action.payload
        userAvatar: payload.userAvatar || null, // можно получить сразу после логина
        isAuthenticated: true, // Отмечаем, что пользователь авторизован
      };
    // Изменяем данные польователя. Меняем имя и добаляем аватар
    case SET_EDIT_USER:
      return {
        ...state,
        userName: payload.userName ?? state.userName, // если имя не передано, оставляем текущее
        userAvatar: payload.userAvatar ?? state.userAvatar, // если аватар не передан, оставляем текущий
      };

    // При выходе из системы возвращаем состояние к начальному (все данные сбрасываются)
    case LOGOUT_USER:
      return initialState;
    // Если тип действия не распознан — возвращаем текущее состояние без изменений
    default:
      return state;
  }
}
