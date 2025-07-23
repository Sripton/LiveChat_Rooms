import { SET_CREATE_ROOM, GET_USER_ROOM, GET_ONE_ROOM } from "../types/types";

const initialState = {
  nameroom: null,
  description: null,
  isPrivate: false,
  allRooms: [], // сюда сохраняем все комнаты
  currentRoom: null,
};

export default function roomReducer(state = initialState, action) {
  // action-объект. У этого объекта есть как минимум два поля:
  // type - строка, которая указывает, что нужно сделать (switch-case)
  // payload - данные, которые нужно положить в состояние Redux
  // через payload передаются данные, которые нужно записать в store.
  const { type, payload } = action;
  switch (type) {
    case SET_CREATE_ROOM:
      return {
        ...state,
        nameroom: payload.nameroom,
        description: payload.description,
        isPrivate: payload.isPrivate,
        allRooms: [...state.allRooms, action.payload], // добавляем новую
      };
    case GET_USER_ROOM:
      return {
        ...state,
        allRooms: payload, //  массив комнат. allRooms теперь содержит эти данные.
      };
    case GET_ONE_ROOM:
      return {
        ...state,
        currentRoom: payload,
      };
    default:
      return state;
  }
}
