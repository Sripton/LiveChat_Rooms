// Импортируются строковые константы (типы экшенов), чтобы избежать опечаток и упростить сопровождение.
import {
  SET_CREATE_ROOM,
  GET_ALL_ROOMS,
  GET_USER_ROOM,
  GET_ONE_ROOM,
} from "../types/types";

// структура состояния room, которую будет использовать редьюсер.
const initialState = {
  nameroom: null, // имя создаваемой комнаты
  description: null, // описание
  isPrivate: false, // приватность комнаты
  allRooms: [], // массив всех комнат
  userRooms: [], // массив всех комнат пользователя
  currentRoom: null, // данные текущей выбранной комнаты
};

export default function roomReducer(state = initialState, action) {
  // action-объект. У этого объекта есть как минимум два поля:
  // type - строка, которая указывает, что нужно сделать (switch-case)
  // payload - данные, которые нужно положить в состояние Redux
  // через payload передаются данные, которые нужно записать в store.
  const { type, payload } = action; // Деструктуризация для удобства.
  switch (type) {
    case SET_CREATE_ROOM:
      // Обновляется информация о новой комнате и добавляется она в список allRooms.
      return {
        ...state,
        nameroom: payload.nameroom,
        description: payload.description,
        isPrivate: payload.isPrivate,
        allRooms: [...state.allRooms, payload], // добавляем новую
      };
    // Обновление списка комнат (например, при получении всех комнат пользователя с сервера).
    case GET_ALL_ROOMS:
      return {
        ...state,
        allRooms: payload, //  массив комнат. allRooms теперь содержит эти данные.
      };
    // Получение списка комнат для определенного пользоветля
    case GET_USER_ROOM:
      return {
        ...state,
        userRooms: payload,
      };
    // Установка данных о одной выбранной комнате.
    case GET_ONE_ROOM:
      return {
        ...state,
        currentRoom: payload,
      };
    default:
      return state;
  }
}
