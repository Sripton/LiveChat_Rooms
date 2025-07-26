import axios from "axios";
import { SET_CREATE_ROOM, GET_USER_ROOM, GET_ONE_ROOM } from "../types/types";

// Асинхронная функция для отправки формы создания комнаты на сервер
export const createRoomsSubmit = (roomCreate) => async (dispatch) => {
  // roomCreate — объект с данными формы
  try {
    //  POST-запрос на backend API, чтобы создать комнату
    const response = await axios.post(`/api/rooms`, roomCreate);
    // При успешном ответе (200): извлекаются данные новой комнаты
    if (response.status === 200) {
      const { data } = response;
      // dispatch обновляет Redux-состояние (добавляется новая комната)
      dispatch({ type: SET_CREATE_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при создании  комнат:", error);
  }
};

//  Асинхронная функция для получения всех комнат (открытых и закрытых)
export const fetchAllRooms = () => async (dispatch) => {
  try {
    //  GET-запрос к API — получает массив всех комнат
    const response = await axios.get(`/api/rooms`);
    if (response.status === 200) {
      const { data } = response;
      //  Сохраняем полученные данные в Redux (в roomReducer.allRooms)
      dispatch({ type: GET_USER_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении всех комнат:", error);
  }
};

// получить комнату по ID
export const getRoomById = (roomID) => async (dispatch) => {
  try {
    // GET-запрос с roomID в URL
    const response = await axios.get(`/api/rooms/${roomID}`);
    if (response.status === 200) {
      const { data } = response;
      // Сохраняем конкретную комнату в Redux (в roomReducer.currentRoom)
      dispatch({ type: GET_ONE_ROOM, payload: data });
    }
  } catch (error) {
    console.error("Ошибка при получении  комнаты:", error);
  }
};
