import axios from "axios";
import { SET_CREATE_POST, GET_ROOM_POSTS } from "../types/types";

// export default function createPostSubmit(roomID, inputs) {
//   return async (dispatch) => {
//     try {
//       const response = await axios.post(`/api/posts/${roomID}`, inputs);
//       if (response.status === 200) {
//         const { data } = response;
//         dispatch({ type: SET_CREATE_POST, payload: data });
//       }
//     } catch (error) {
//       console.error("Ошибка при создании   поста:", error);
//     }
//   };
// }
export const createPostSubmit = (roomID, inputs) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/posts/${roomID}`, inputs);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_CREATE_POST, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при создании   поста:", error);
  }
};

export const fetchAllPosts = (roomID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/posts/${roomID}`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: GET_ROOM_POSTS, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении всех постов:", error);
  }
};
