import axios from "axios";
import {
  SET_REGISTER_USER,
  SET_LOGIN_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/types";

//  Проверка сессии пользователя при старте приложения или обновлении страницы
export const checkUserSession = () => async (dispatch) => {
  try {
    // GET-запрос на сервер для проверки, авторизован ли пользователь (например, по куки или сессии)
    const response = await axios.get(`/api/users/checkuser`);
    // Если сессия активна, диспатчим данные пользователя в Redux
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_LOGIN_USER, payload: data }); // записываем пользователя в state
    }
  } catch (error) {
    console.log(error);
  }
};

// Регистрация нового пользователя
export const registersUser = (inputs, navigate) => async (dispatch) => {
  try {
    // POST-запрос с данными формы (например: email, пароль, имя)
    const response = await axios.post(`/api/users/signup`, inputs);
    // Если регистрация прошла успешно
    if (response.status === 200) {
      const { data } = response;
      // Сохраняем пользователя в Redux
      dispatch({ type: SET_REGISTER_USER, payload: data });
      // Перенаправляем на главную страницу после успешной регистрации
      navigate("/");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      "Пользователь с таким логином уже существует";
    //  Сохраняем ошибку в Redux
    dispatch({ type: SET_REGISTER_ERROR, payload: errorMessage });
  }
};

// Вход пользователя (логин)
export const loginUser = (inputs, navigate) => async (dispatch) => {
  try {
    // POST-запрос с логином и паролем
    const response = await axios.post(`/api/users/signin`, inputs);
    // Если логин успешен
    if (response.status === 200) {
      const { data } = response;
      // Записываем пользователя в Redux
      dispatch({ type: SET_LOGIN_USER, payload: data });
      // Перенаправляем на главную страницу
      navigate("/");
    }
  } catch (error) {
    // Если логин не удался (неверный пароль и т.п.)
    console.log(error);
  }
};

export const editUser = (inputs, navigate) => async (dispatch) => {
  try {
    const response = await axios.patch("/api/users/uploadprofile", inputs);
    if (response.status === 200) {
      const { data } = response;
      dispatch({
        type: SET_EDIT_USER,
        payload: {
          userName: data.userName,
          userAvatar: data.userAvatar,
        },
      });
      navigate("/");
    }
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  try {
    const response = await axios.get("/api/users/logout");
    if (response.status === 200) {
      dispatch({ type: LOGOUT_USER }); // Сброс состояния
      navigate("/"); // Перенаправление
    }
  } catch (error) {
    console.error("Ошибка при выходе", error);
  }
};
