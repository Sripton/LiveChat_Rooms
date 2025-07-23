import axios from "axios";
import { SET_CREATE_ROOM, GET_USER_ROOM, GET_ONE_ROOM } from "../types/types";

export const createRoomsSubmit = (roomCreate) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/rooms`, roomCreate);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_CREATE_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при создании  комнат:", error);
  }
};

export const fetchAllRooms = () => async (dispatch) => {
  try {
    const response = await axios.get(`/api/rooms`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: GET_USER_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении всех комнат:", error);
  }
};

export const getRoomById = (roomID) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/rooms/${roomID}`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: GET_ONE_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении  комнаты:", error);
  }
};
