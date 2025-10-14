import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
} from "../types/types";

const initialState = {
  user_id: null,
  comment_id: null,
  reaction_type: null,
  allReactionComments: [],
};

export default function reactionCommentReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_REACTION_COMMENT_CREATE: {
      const reaction = payload;
      // Проверяем существует ли такая реакция
      // const existingReaction = state.allReactionComments.some(
      //   (req) => req.id === reaction.id
      // );
      const match = (req) =>
        req.user_id === reaction.user_id &&
        req.comment_id === reaction.comment_id;
      const existingReaction = state.allReactionComments.some(match);
      return {
        ...state,
        user_id: payload.user_id,
        comment_id: payload.comment_id,
        reaction_type: payload.reaction_type,
        allReactionComments: existingReaction
          ? state.allReactionComments.map((req) =>
              req.id === reaction.id ? reaction : req
            )
          : [...state.allReactionComments, reaction],
      };
    }

    case GET_REACTION_COMMENT_LIST: {
      const { commentID, reactions } = payload; // reactions - массив реакций для конкретного commentID

      // убираем старые реакции для этого комментария и добавляем свежие
      const others = state.allReactionComments.filter(
        (reaqtion) => reaqtion.comment_id !== commentID
      );
      return {
        ...state,
        allReactionComments: [...others, ...reactions],
      };
    }
    default:
      return state;
  }
}
