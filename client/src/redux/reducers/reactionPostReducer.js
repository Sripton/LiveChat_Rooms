// Импорт типов действий (action types), которые редьюсер будет обрабатывать
import {
  SET_REACTION_POST_CREATE,
  GET_REACTION_POST_LIST,
} from "../types/types";

// Начальное состояние пользовательского редьюсера
const initialState = {
  user_id: null,
  post_id: null,
  reaction_type: null,
  allReactionPosts: [], // реакции для всех постов
};

// Редьюсер, отвечающий за изменения состояния, связанные с созданием реакций на посты
export default function reactionPostReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_REACTION_POST_CREATE: {
      const reaction = payload;
      // Проверяем существует ли такая реакция
      const existingReaction = state.allReactionPosts.some(
        (req) => req.id === reaction.id,
      );
      return {
        ...state,
        user_id: payload.user_id,
        post_id: payload.post_id,
        reaction_type: payload.reaction_type,
        allReactionPosts: existingReaction
          ? // Подход порядрк реакции меняеется
            // ? [
            //     ...state.allReactionPosts.filter((req) => req.id !== payload.id),
            //     reaction,
            //   ]

            state.allReactionPosts.map((req) =>
              // Если у текущего элемента req.id совпадает с id новой/обновлённой реакции reaction,
              // подменяем его новым объектом reaction.
              // Если id не совпадает,
              //  оставляем req как есть.
              req.id === reaction.id ? reaction : req,
            )
          : [...state.allReactionPosts, reaction],
      };
    }

    case GET_REACTION_POST_LIST: {
      const {
        postID, // для какого поста  получаем реакции с сервера
        reactions, // полный список реакций этого поста
      } = payload;
      return {
        ...state,
        allReactionPosts: [
          ...state.allReactionPosts.filter(
            // удалить старые реакции этого postID из store (потому что они могли измениться)
            (reaction) => reaction.post_id !== postID,
          ),
          // добавить свежие реакции этого postID, которые пришли с сервера
          ...reactions,
        ],
      };
    }
    default:
      return state;
  }
}
