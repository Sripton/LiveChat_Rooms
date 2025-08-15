import axios from "axios";
import {
  ROOM_REQUESTS_FETCH_START,
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
} from "../types/types";
// Загрузка входящих/исходящих запросов
export const fetchUserRequestsStatus = (userID) => async (dispatch) => {
  //  dispatch({ type: ROOM_REQUESTS_FETCH_START });
  try {
    const response = await axios.get(
      `/api/room-requests/userRequest/${userID}`
    );
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: ROOM_REQUESTS_FETCH_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ROOM_REQUESTS_FETCH_ERROR,
      payload: error.response?.data?.messageError,
    });
  }
};

export const clearUserRequests = () => async (dispatch) => {};
