import axios from "axios";
import {
  SET_REGISTER_USER,
  SET_AUTH_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/types";

// Проверяет, авторизован ли пользователь при загрузке страницы (например, при обновлении).
export const checkUserSession = () => async (dispatch) => {
  try {
    // GET-запрос на сервер для проверки, авторизован ли пользователь (например, по куки или сессии)
    const response = await axios.get(`/api/users/checkuser`);
    // Если сессия активна, диспатчим данные пользователя в Redux
    if (response.status === 200) {
      const { data } = response;
      dispatch({ type: SET_AUTH_USER, payload: data }); // записываем пользователя в state
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
      dispatch({ type: SET_AUTH_USER, payload: data });
      // Перенаправляем на главную страницу
      navigate("/");
    }
  } catch (error) {
    // Если логин не удался (неверный пароль и т.п.)
    console.log(error);
  }
};

//  Обновление профиля пользователя (например, имя и аватар)
export const editUser = (inputs) => async (dispatch) => {
  try {
    // PATCH-запрос для частичного обновления данных
    const response = await axios.patch("/api/users/uploadprofile", inputs);
    if (response.status === 200) {
      const { data } = response;
      // Обновляем Redux-состояние с новыми данными пользователя
      dispatch({
        type: SET_EDIT_USER,
        payload: {
          userName: data.userName,
          userAvatar: data.userAvatar,
        },
      });
    }
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
  }
};

// Выход пользователя из аккаунта
export const logoutUser = (navigate) => async (dispatch) => {
  try {
    // GET-запрос на выход из системы (очистка куки или сессии)
    const response = await axios.get("/api/users/logout");
    if (response.status === 200) {
      // Очищаем Redux-состояние и отправляем пользователя на главную страницу
      dispatch({ type: LOGOUT_USER }); // Сброс состояния
      navigate("/"); // Перенаправление
    }
  } catch (error) {
    console.error("Ошибка при выходе", error);
  }
};
