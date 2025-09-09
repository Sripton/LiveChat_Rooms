import axios from "axios";
import {
  ROOM_REQUESTS_FETCH_START,
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUEST_UPDATE_SUCCESS,
  ROOM_REQUEST_UPDATE_ERROR,
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
export const updateRoomRequestStatus = (id, nextStatus) => async (dispatch) => {
  const idStr = String(id);
  const MIN_SHOW = 350; // мс
  const start = Date.now(); // фиксируем старт
  dispatch({
    type: ROOM_REQUEST_UPDATE_START,
    payload: { id: idStr, nextStatus },
  });

  try {
    const response = await axios.patch(
      `/api/room-requests/changeRequestStatus/${idStr}`,
      { status: nextStatus }
    );
    if (response.status === 200) {
      const { data } = response;
      const timeHassPassed = Date.now() - start;
      const wait = Math.max(0, MIN_SHOW - timeHassPassed);
      setTimeout(() => {
        dispatch({
          type: ROOM_REQUEST_UPDATE_SUCCESS,
          payload: {
            id: String(data.request.id),
            status: data.request.status,
            message: data.request.message,
          },
        });
      }, wait);
    }
  } catch (error) {
    dispatch({
      type: ROOM_REQUEST_UPDATE_ERROR,
      payload: { id: idStr, error: error?.response?.data?.message },
    });
  }
};
