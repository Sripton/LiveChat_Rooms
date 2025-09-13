import axios from "axios";
import {
  SET_CREATE_POST,
  GET_ROOM_POSTS,
  SET_EDIT_POST,
  DELETE_POST,
} from "../types/types"; //  константы типов Redux-действий

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

export const editPostSubmit = (postID, inputs) => async (dispatch) => {
  try {
    // patch - запрос на изменение конкретного  поста
    const response = await axios.patch(`/api/posts/${postID}`, inputs);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_EDIT_POST, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении всех постов:", error);
  }
};

export const deletePostHandler = (postID) => async (dispatch) => {
  try {
    // delete - запрос на изменение конкретного  поста
    const response = await axios.delete(`/api/posts/${postID}`);
    if (response.status === 200) {
      const { data } = response;
      return dispatch({
        type: DELETE_POST,
        payload: { id: postID }, // передаём, какой именно пост удалить
      });
    }
  } catch (error) {
    console.error("Ошибка при удалении поста", error);
  }
};
