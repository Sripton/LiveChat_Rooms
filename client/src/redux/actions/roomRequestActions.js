import axios from "axios";
import { ROOM_REQUEST_SUCCESS, ROOM_REQUEST_ERROR } from "../types/types";
// Отправка запроса к приватной комнате
export default function sendRoomRequest(roomID) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/room-requests`, { roomID });
      if (response.status === 200) {
        const { message, request } = response.data;
        dispatch({ type: ROOM_REQUEST_SUCCESS, payload: { message, request } }); // request -  можно не использовать, если не нужен
      }
    } catch (error) {
      dispatch({
        type: ROOM_REQUEST_ERROR,
        payload: error.response?.data?.message || "Ошибка запроса",
      });
    }
  };
}
