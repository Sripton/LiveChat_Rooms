import axios from "axios";
import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
} from "../types/types";

export const createReactionCommentSubmit =
  (commentID, reaction_type) => async (dispatch) => {
    try {
      const response = await axios.post(`/api/reaction-comment/${commentID}`, {
        reaction_type,
      });
      if (response.status === 201 || response.status === 200) {
        const { data } = response;
        dispatch({ type: SET_REACTION_COMMENT_CREATE, payload: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

export const fetchAllCommentReactions = (commentID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/reaction-comment/${commentID}`);
    if (response.status === 200) {
      const { data } = response;
      // { commentID, reactions: data } - редьюсер получает именно то, что он ожидает, и корректно обновляет стейт.
      dispatch({
        type: GET_REACTION_COMMENT_LIST,
        payload: { commentID, reactions: data },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
