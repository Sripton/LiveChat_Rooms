import axios from "axios";

import {
  SET_REACTION_POST_CREATE,
  GET_REACTION_POST_LIST,
} from "../types/types";

// создание новой реакции на  пост
export const createReactionPostSubmit =
  (postID, reaction_type) => async (dispatch) => {
    try {
      const response = await axios.post(`/api/reaction-post/${postID}`, {
        reaction_type,
      });
      if (response.status === 200) {
        const { data } = response;
        console.log("WILL_DISPATCH_REACTION", data, response.status);

        dispatch({ type: SET_REACTION_POST_CREATE, payload: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

export const fetchAllReactionPosts = (postID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/reaction-post/${postID}`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({
        type: GET_REACTION_POST_LIST,
        payload: { postID, reactions: data },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
