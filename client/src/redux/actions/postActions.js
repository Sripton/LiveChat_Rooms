import axios from "axios";
import { SET_CREATE_POST, GET_ROOM_POSTS } from "../types/types"; //  константы типов Redux-действий

// создание нового поста
export const createPostSubmit = (roomID, inputs) => async (dispatch) => {
  try {
    // POST-запрос на создание поста внутри конкретной комнаты
    const response = await axios.post(`/api/posts/${roomID}`, inputs); // inputs — данные поста (например: postTitle, content, user_id и т.д.)
    // roomID — ID комнаты, к которой относится пост
    if (response.status === 200) {
      const { data } = response; // data содержит созданный пост
      dispatch({ type: SET_CREATE_POST, payload: data }); // dispatch обновляет Redux-состояние, добавляя новый пост в state.post.allPosts
    }
  } catch (error) {
    console.error("Ошибка при создании   поста:", error);
  }
};

// получение всех постов комнаты
export const fetchAllPosts = (roomID) => async (dispatch) => {
  try {
    // GET-запрос к API, который возвращает массив постов комнаты по roomID
    const response = await axios.get(`/api/posts/${roomID}`);
    if (response.status === 200) {
      const { data } = response;
      // Загруженные посты сохраняются в Redux в state.post.allPosts
      dispatch({ type: GET_ROOM_POSTS, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении всех постов:", error);
  }
};
