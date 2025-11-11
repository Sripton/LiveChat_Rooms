import axios from "axios";
import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_COMMENT_COUNTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
  REPLIES_SET,
} from "../types/types";
// postID — id поста,
// inputs — объект с полем commentTitle,
// parentID — id родительского комментария или null, если пишем к посту
export const createComments =
  (postID, inputs, parentID) => async (dispatch, getState) => {
    const response = await axios.post(`/api/comments/${postID}`, {
      commentTitle: inputs.commentTitle,
      parentID, // отправляем на сервер
    });
    if (response.status === 201) {
      const { data } = response;
      const { userName, userAvatar } = getState().user;
      const payload = {
        ...data,
        // post_id: data?.post_id ?? postID,
        // parent_id: data?.parent_id ?? parentID,
        // createdAt: data?.createdAt,
        User: data?.User ?? { name: userName, avatar: userAvatar },
      };
      dispatch({ type: SET_CREATE_COMMENT, payload });
    }
  };

export const fetchComments = (postID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/comments/${postID}`);
    if (response.status === 200) {
      const { data } = response;
      // если сервер отдаёт массив, берём как есть
      const comments = Array.isArray(data) ? data : data.comments;
      dispatch({ type: GET_POST_COMMENTS, payload: { postID, comments } });
    }
  } catch (error) {
    console.log(error);
  }
};

// NEW: получить счётчики для набора постов
export const fetchCommentCounts = (postIds) => async (dispatch) => {
  try {
    if (!Array.isArray(postIds) || postIds.length === 0) return;
    // на всякий случай убераем дубли и приведём к числам
    const uniqueIds = [...new Set(postIds.map(Number).filter(Number.isFinite))]; // [1,2,3,4]
    const response = await axios.post(`/api/comments/counts`, {
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

export const editCommentSubmit =
  (postID, commentID, commentTitle) => async (dispatch) => {
    try {
      const response = await axios.patch(`/api/comments/${commentID}`, {
        commentTitle,
      });
      if (response.status === 200) {
        const { data } = response;
        dispatch({ type: SET_EDIT_COMMENT, payload: { postID, ...data } });
      }
    } catch (error) {
      console.log(error);
    }
  };

export const deleteComment = (postID, commentID) => async (dispatch) => {
  try {
    const response = await axios.delete(`/api/comments/${commentID}`);
    if (response.status === 200) {
      const id = Number(response.data?.id) ?? Number(commentID);
      dispatch({
        type: DELETE_COMMENT,
        payload: { postID, id },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// первая загрузка для компонента UserDashboard где отображаются ответы к комм/постам пользователя
export const fetchUserReplies =
  ({ limit = 20 } = {}, userID) =>
  async (dispatch) => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      const response = await axios.get(
        `/api/comments/notifications/replies?${params.toString()}`
      );

      // сервер возвращает: { items, nextBefore }
      const { data } = response;
      dispatch({
        type: REPLIES_SET,
        payload: {
          userID,
          items: data.items,
          nextBefore: data.nextBefore,
          append: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

// загрузить ещё (append = true)
export const fetchMoreUserReplies =
  ({ limit = 20, before } = {}, userID) =>
  async (dispatch) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set("before", before);
    const response = await axios.get(
      `/api/comments/notifications/replies?${params.toString()}`
    );
    const { data } = response;
    dispatch({
      type: REPLIES_SET,
      payload: {
        userID,
        items: data.items,
        nextBefore: data.nextBefore,
        append: true,
      },
    });
  };
