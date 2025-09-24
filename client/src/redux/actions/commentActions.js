import axios from "axios";
import { SET_CREATE_COMMENT, GET_POST_COMMENTS } from "../types/types";
// postID — id поста,
// inputs — объект с полем commentTitle,
// parentID — id родительского комментария или null, если пишем к посту
export const createComments =
  (postID, inputs, parentID) => async (dispatch) => {
    const response = await axios.post(`/api/comments/${postID}`, {
      commentTitle: inputs.commentTitle,
      parentID, // отправляем на сервер
    });
    if (response.status === 201) {
      const { data } = response;
      dispatch({ type: SET_CREATE_COMMENT, payload: data });
    }
  };

export const fetchComments = (postID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/comments/${postID}`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({
        type: GET_POST_COMMENTS,
        payload: { postID, comments: data },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
