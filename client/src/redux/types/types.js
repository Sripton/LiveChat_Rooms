// Редьюсер корректно обрабатывает типы экшенов и возвращает новое состояние.

// ------- User -------
// Тип экшена для установки данных пользователя после регистрации
export const SET_REGISTER_USER = "SET_REGISTER_USER";

// Тип экшена для установки данных пользователя после входа в систему
export const SET_LOGIN_USER = "SET_LOGIN_USER";

// Тип экшена для установки данных пользователя после изменения профиля
export const SET_EDIT_USER = "SET_EDIT_USER";

// Тип экшена для получения error при регистарции
export const SET_REGISTER_ERROR = "SET_REGISTER_ERROR";

// Тип экшена для выхода пользователя (очистка пользовательских данных из хранилища)
export const LOGOUT_USER = "LOGOUT_USER";

// ------- Room -------
// Тип экшена для создания комнаты пользователем
export const SET_CREATE_ROOM = "SET_CREATE_ROOM";

// Тип экшена для получения всех комнат
export const GET_USER_ROOM = "GET_USER_ROOM";

// Тип экшена для получения одной  комнаты
export const GET_ONE_ROOM = "GET_ONE_ROOM";

// ------- Post -------
// Тип экшена для создания поста пользователем
export const SET_CREATE_POST = "SET_CREATE_POST";

// Тип экшена для получения всех постов
export const GET_ROOM_POSTS = "GET_ROOM_POSTS";
