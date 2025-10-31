import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_COMMENT_COUNTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
  REPLIES_SET,
} from "../types/types";

const initialState = {
  byPostId: {}, // { [postId]: Comment[] }
  countsByPostId: {}, //  { [postId]: number }
  replies: {
    items: [],
    nextBefore: null,
  },
};

function commentDescendants(list, rootId) {
  const target = Number(rootId);
  const byParent = new Map();

  for (let i = 0; i < list.length; i += 1) {
    const comment = list[i];
    const commentID = Number(comment.id);
    const parentID = comment.parent_id === null ? null : comment.parent_id;
    if (!byParent.has(parentID)) byParent.set(parentID, []);
    byParent.get(parentID).push(commentID);
  }

  const toDelete = new Set([target]);
  const stack = [target];
  while (stack.length) {
    const kids = byParent.get(stack.pop());
    if (!kids) continue;
    for (let i = 0; i < kids.length; i += 1) {
      if (!toDelete.has(kids[i])) {
        toDelete.add(kids[i]);
        stack.push(kids[i]);
      }
    }
  }
  return toDelete;
}

// сортировка по времени убыв.
const dedupeAndSortDesc = (list) => {
  const map = new Map();
  for (let i = 0; i < list.length; i += 1) {
    const comment = list[i];
    map.set(comment.id, comment);
  }
  const array = Array.from(map.values());
  array.sort((a, b) => {
    const t = new Date(b.createdAt) - new Date(a.createdAt);
    return t;
  });
  return array;
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
      const nextList = list.filter(
        (comment) => !toDelete.has(Number(comment.id))
      );
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

    case REPLIES_SET: {
      const { items = [], nextBefore = null, apend = false } = payload || {};
      const base = apend ? state.replies.items : [];
      const merged = dedupeAndSortDesc([...base, ...items]);
      return {
        ...state,
        replies: { items: merged, nextBefore },
      };
    }
    default:
      return state;
  }
}
