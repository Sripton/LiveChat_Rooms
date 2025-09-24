import { SET_CREATE_COMMENT, GET_POST_COMMENTS } from "../types/types";

const initialState = {
  byPostId: {}, // { [postId]: Comment[] }
};
export default function commentReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_CREATE_COMMENT: {
      const data = payload;
      const list = state.byPostId[data.post_id] || []; // масив из комментариев
      return {
        ...state,
        byPostId: { ...state.byPostId, [data.post_id]: [...list, data] },
      };
    }

    case GET_POST_COMMENTS: {
      const { postID, comments } = payload;
      return {
        ...state,
        byPostId: { ...state.byPostId, [postID]: comments },
      };
    }

    default:
      return state;
  }
}
