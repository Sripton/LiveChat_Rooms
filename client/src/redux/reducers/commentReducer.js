import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_COMMENT_COUNTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
} from "../types/types";

const initialState = {
  byPostId: {}, // { [postId]: Comment[] }
  countsByPostId: {}, //  { [postId]: number }
};

function commentDescendants(list, rootId) {
  const target = Number(rootId); // id
  const toDelete = new Set([target]); // {[id]}
  let change = true;
  while (change) {
    change = false;
    // Перебираем все комментарии
    for (const comment of list) {
      const commentID = Number(comment.id);
      const parentID =
        comment.parent_id === null ? null : Number(comment.parent_id);

      if (
        parentID !== null &&
        toDelete.has(parentID) &&
        !toDelete.has(commentID)
      ) {
        toDelete.add(commentID);
        change = true;
      }
    }
  }
  return toDelete;
}
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
    case SET_EDIT_COMMENT: {
      // поля (postID, id используется только для сравнения)
      // оставляем в patch то, что должно оказаться внутри комментария: commentTitle, updatedAt...
      const { postID, id, ...patch } = payload;
      const list = state.byPostId[postID] || [];
      const nextList = list.map((comment) =>
        comment.id === id ? { ...comment, ...patch } : comment
      );
      return {
        ...state,
        byPostId: { ...state.byPostId, [postID]: nextList },
      };
    }

    case DELETE_COMMENT: {
      const { postID, id } = payload;
      const key = String(postID);
      const list = state.byPostId[key] || [];
      const prevCounts = state.countsByPostId[key] ?? list.length ?? 0;

      const toDelete = commentDescendants(list, id);
      const nextList = list.filter((comment) => !toDelete.has(comment.id));
      const removed = list.length - nextList.length;
      return {
        ...state,
        byPostId: {
          ...state.byPostId, // сохраняем остальные посты
          [key]: nextList, // обновляем массив только для этого поста
        },
        countsByPostId: {
          ...state.countsByPostId,
          [key]: Math.max(0, prevCounts - removed),
        },
      };
    }
    default:
      return state;
  }
}
