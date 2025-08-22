import axios from "axios";
import {
  ROOM_REQUESTS_FETCH_START,
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUEST_UPDATE_SUCCESS,
} from "../types/types";
// Асинхронный экшен для загрузки входящих/исходящих запросов пользователя
export const fetchUserRequestsStatus = (userID) => async (dispatch) => {
  //  dispatch({ type: ROOM_REQUESTS_FETCH_START });
  try {
    // Делаем запрос к API, чтобы получить все запросы (и входящие, и исходящие) для текущего пользователя
    const response = await axios.get(
      `/api/room-requests/userRequest/${userID}`
    );
    if (response.status === 200) {
      const { data } = response; // в data лежат { incoming: [], outgoing: [] }
      dispatch({ type: ROOM_REQUESTS_FETCH_SUCCESS, payload: data });
    }
  } catch (error) {
    // Если произошла ошибка → отправляем её в стор
    dispatch({
      type: ROOM_REQUESTS_FETCH_ERROR,
      payload: error.response?.data?.messageError,
    });
  }
};

// Экшен для очистки состояния запросов (например, при logout пользователя)
// Пока не использую.
export const clearUserRequests = () => async (dispatch) => {};

// Экшен для  обновления статуса конкретного запроса
export const updateRoomRequestStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: ROOM_REQUEST_UPDATE_START, payload: { id } });
    const response = await axios.patch(
      `/api/room-requests/changeRequestStatus/${id}`,
      { status }
    );

    if (response.status === 200) {
      const { data } = response;
      dispatch({
        type: ROOM_REQUEST_UPDATE_SUCCESS,
        payload: {
          id: data.request.id,
          status: data.request.status,
          message: data.request.message,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
