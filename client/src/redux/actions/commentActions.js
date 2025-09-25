import axios from "axios";
import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_COMMENT_COUNTS,
} from "../types/types";
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
      // если сервер отдаёт массив, берём как есть
      const comments = Array.isArray(response.data)
        ? response.data
        : response.data.comments;
      dispatch({ type: GET_POST_COMMENTS, payload: { postID, comments } });
    }
  } catch (error) {
    console.log(error);
  }
};

// NEW: получить счётчики для набора постов
export const fetchCommentCounts = (postIds) => async (dispatch) => {
  try {
    if (!Array.isArray(postIds) && postIds.length === 0) return;
    // на всякий случай уберём дубли и приведём к числам
    const uniqueIds = [...new Set(postIds.map(Number).filter(Number.isFinite))];

    const response = await axios.post(`/counts`, {
      postIds: uniqueIds,
    });

    if (response.status === 200) {
      const counts =
        response?.data?.counts && typeof response?.data?.counts === "object"
          ? response?.data?.counts
          : {};
      dispatch({ type: SET_COMMENT_COUNTS, payload: counts });
    }
  } catch (error) {
    console.log(error);
  }
};
