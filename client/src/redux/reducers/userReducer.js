import { SET_REGISTER_USER, SET_LOGIN_USER, LOGOUT_USER } from "../types/types";
export default function userReducer(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_REGISTER_USER:
      return payload;
    case SET_LOGIN_USER:
      return payload;
    case LOGOUT_USER:
      return {};
    default:
      return state;
  }
}
