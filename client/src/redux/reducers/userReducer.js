import { SET_REGISTER_USER, SET_LOGIN_USER, LOGOUT_USER } from "../types/types";

// Начальное состояние
const initialState = {
  userID: null,
  userName: null,
  isAuthenticated: false,
};
export default function userReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_REGISTER_USER:
    case SET_LOGIN_USER:
      return {
        ...state,
        userID: payload.userID,
        userName: payload.userName,
        isAuthenticated: true,
      };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
