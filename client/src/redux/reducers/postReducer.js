// Импорт типов действий (action types), которые редьюсер будет обрабатывать
import { SET_CREATE_POST, GET_ROOM_POSTS } from "../types/types";

// Начальное состояние пользовательского редьюсера
const initialState = {
  postTitle: null,
  user_id: null,
  room_id: null,
  allPosts: [],
};

// Редьюсер, отвечающий за изменения состояния, связанные с созданием поста
export default function postReducer(state = initialState, action) {
  // Деструктуризация типа действия и полезной нагрузки
  const { type, payload } = action;
  // Обработка различных типов действий
  switch (type) {
    case SET_CREATE_POST:
      return {
        ...state,
        postTitle: payload.postTitle,
        user_id: payload.user_id,
        room_id: payload.room_id,
        allPosts: [...state.allPosts, payload],
      };
    case GET_ROOM_POSTS:
      return { ...state, allPosts: payload };
    default:
      return state;
  }
}
