// -------------------- User -------------------
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

// -------------------- Room ----------------------
// Тип экшена для создания комнаты пользователем
export const SET_CREATE_ROOM = "SET_CREATE_ROOM";

// Тип экшена для получения всех комнат
export const GET_ALL_ROOMS = "GET_ALL_ROOMS";

// Тип экшена для получения всех комнат пользователя
export const GET_USER_ROOM = "GET_USER_ROOM";

// Тип экшена для получения одной  комнаты
export const GET_ONE_ROOM = "GET_ONE_ROOM";

// ----------------- RoomRequest -------------------
// Тип экшена если  статус запроса - положительный
export const ROOM_REQUEST_SUCCESS = "ROOM_REQUEST_SUCCESS";

// Тип экшена если  статус запроса - отрицательный
export const ROOM_REQUEST_ERROR = "ROOM_REQUEST_ERROR";

// Тип экшена. Очистить статус после закрытия модалки
export const CLEAR_ROOM_REQUEST_STATE = "CLEAR_ROOM_REQUEST_STATE";

// ------------------ RoomRequestStatus -----------------
// Тип экшена. Для загрузки входящих и исходящих запросов пользователя. Типа спиннера
export const ROOM_REQUESTS_FETCH_START = "ROOM_REQUESTS_FETCH_START";

// Тип экшена. Для получения запросов  с сервера”.
export const ROOM_REQUESTS_FETCH_SUCCESS = "ROOM_REQUESTS_FETCH_SUCCESS";

// Тип экшена. Для Ошибки при получении запросов
export const ROOM_REQUESTS_FETCH_ERROR = "ROOM_REQUESTS_FETCH_ERROR";

// Тип экшена. Полностью очистить состояние списка запросов. Например при выходе пользователя
export const ROOM_REQUESTS_CLEAR = "ROOM_REQUESTS_CLEAR";

// Тип экшена. loading - обновлять статус запроса
export const ROOM_REQUEST_UPDATE_START = "ROOM_REQUEST_UPDATE_START";

// Тип экшена. Запрос успешно обновлён на сервере
export const ROOM_REQUEST_UPDATE_SUCCESS = "ROOM_REQUEST_UPDATE_SUCCESS";

// Тип экшена. Ошибка при попытке обновить запрос
export const ROOM_REQUEST_UPDATE_ERROR = "ROOM_REQUEST_UPDATE_ERROR";

// ----------------------- Post ------------------------
// Тип экшена для создания поста пользователем
export const SET_CREATE_POST = "SET_CREATE_POST";

// Тип экшена для получения всех постов
export const GET_ROOM_POSTS = "GET_ROOM_POSTS";

// Тип экшена для изменения  поста
export const SET_EDIT_POST = "SET_EDIT_POST";

// Тип экшена для удаления  поста
export const DELETE_POST = "DELETE_POST";

// ----------------------- Reaction Posts ------------------------
// Тип экшена для создания реакций на  посты  пользователем
export const SET_REACTION_POST_CREATE = "SET_REACTION_POST_CREATE";

// Тип экшена для получения реакций на  посты  пользователем
export const GET_REACTION_POST_LIST = "GET_REACTION_POST_LIST";

// -----------------------  Comments ------------------------
// Тип экшена для создания комментария к посту пользователем
export const SET_CREATE_COMMENT = "SET_CREATE_COMMENT";

// Тип экшена для получения комментариув к посту
export const GET_POST_COMMENTS = "GET_POST_COMMENTS";

// Тип экшена для получения ко-ва комментариев к посту
export const SET_COMMENT_COUNTS = "SET_COMMENT_COUNTS";

// Тип экшена для изменения  комментария
export const SET_EDIT_COMMENT = "SET_EDIT_COMMENT";

// Тип экшена для удаления  комментария
export const DELETE_COMMENT = "DELETE_COMMENT";

// Тип экшена для получения  комментариев к посту и комментариям
export const REPLIES_SET = "REPLIES_SET";

// ----------------------- Reaction Comments ------------------------
// Тип экшена для создания реакций на  комментарии  пользователем
export const SET_REACTION_COMMENT_CREATE = "SET_REACTION_COMMENT_CREATE";

// Тип экшена для получения реакций на  посты  пользователем
export const GET_REACTION_COMMENT_LIST = "GET_REACTION_COMMENT_LIST";
