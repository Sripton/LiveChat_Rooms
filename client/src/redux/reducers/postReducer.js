// Импорт типов действий (action types), которые редьюсер будет обрабатывать
import { SET_CREATE_POST, GET_ROOM_POSTS, SET_EDIT_POST } from "../types/types";

// Начальное состояние пользовательского редьюсера
const initialState = {
  postTitle: null, // заголовок последнего созданного поста
  user_id: null, // ID пользователя, создавшего пост
  room_id: null, // ID комнаты, к которой относится пост
  allPosts: [], // список всех постов текущей комнаты
};

// Редьюсер, отвечающий за изменения состояния, связанные с созданием поста
export default function postReducer(state = initialState, action) {
  // Деструктуризация типа действия и полезной нагрузки
  const { type, payload } = action;
  // Обработка различных типов действий
  switch (type) {
    //  Когда создаётся новый пост:
    case SET_CREATE_POST:
      // обновляются поля postTitle, user_id, room_id
      return {
        ...state,
        postTitle: payload.postTitle,
        user_id: payload.user_id,
        room_id: payload.room_id,
        allPosts: [...state.allPosts, payload], // старый массив не мутируется, а копируется (...state.allPosts) — соблюдаем иммутабельность
      };
    // Загрузка всех постов для комнаты
    case GET_ROOM_POSTS:
      return { ...state, allPosts: payload };

    // Изменение поста
    case SET_EDIT_POST:
      return {
        ...state,
        allPosts: state.allPosts.map((post) =>
          post.id === payload.id ? { ...post, ...payload } : post
        ),
      };
    default:
      return state;
  }
}
