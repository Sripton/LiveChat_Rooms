import axios from "axios";
import { SET_REGISTER_USER, SET_LOGIN_USER, LOGOUT_USER } from "../types/types";

//
export const checkUserSession = () => async (dispatch) => {
  try {
    const response = await axios.get(`/api/users/checkuser`);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_LOGIN_USER, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
};
// Регистрация
export const registersUser = (inputs, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/users/signup`, inputs);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_REGISTER_USER, payload: data });
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = (inputs, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/users/signin`, inputs);
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_LOGIN_USER, payload: data });
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
};
