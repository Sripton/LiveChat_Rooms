import {
  ROOM_REQUEST_SUCCESS,
  ROOM_REQUEST_ERROR,
  CLEAR_ROOM_REQUEST_STATE,
} from "../types/types";

const initialState = {
  status: null, // сообщение об успехе (например: "Запрос отправлен")
  error: null, // сообщение об ошибке
  request: null,
};

export default function roomRequestReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ROOM_REQUEST_SUCCESS:
      return {
        ...state,
        status: payload.message, // "Запрос на доступ отправлен"
        request: payload.request, // { id, user_id, room_id, status, ... }
        error: null,
      };

    case ROOM_REQUEST_ERROR:
      return { ...state, status: null, request: null, error: payload }; // "Запрос уже отправлен."

    case CLEAR_ROOM_REQUEST_STATE:
      return {
        status: null, // очищаем статус
        error: null, // очищаем сообшение об ошибке
        request: null, // очищаем сам request
      };
    default:
      return state;
  }
}
