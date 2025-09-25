import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_COMMENT_COUNTS,
} from "../types/types";

const initialState = {
  byPostId: {}, // { [postId]: Comment[] }
  countsByPostId: {}, //  { [postId]: number }
};
export default function commentReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_CREATE_COMMENT: {
      const data = payload;
      const list = state.byPostId[data.post_id] || []; // масив из комментариев
      const prevCounts = state.countsByPostId[data.post_id] ?? list.length ?? 0;
      return {
        ...state,
        byPostId: { ...state.byPostId, [data.post_id]: [...list, data] },
        // при создании комментария сразу инкрементим счётчик
        countsByPostId: {
          ...state.countsByPostId,
          [data.post_id]: prevCounts + 1,
        },
      };
    }
    case GET_POST_COMMENTS: {
      const { postID, comments } = payload;
      return {
        ...state,
        byPostId: { ...state.byPostId, [postID]: comments },
        // если пришёл полный список комментов — синхронизируем счётчик
        countsByPostId: {
          ...state.countsByPostId,
          [postID]: Array.isArray(comments) ? comments.length : 0,
        },
      };
    }
    case SET_COMMENT_COUNTS: {
      // payload: { [postId]: count }
      return {
        ...state,
        countsByPostId: { ...state.countsByPostId, ...payload },
      };
    }
    default:
      return state;
  }
}
