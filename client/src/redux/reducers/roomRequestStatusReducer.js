import {
  ROOM_REQUESTS_FETCH_START,
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUEST_UPDATE_SUCCESS,
  ROOM_REQUEST_UPDATE_ERROR,
} from "../types/types";

// Начальное состояние редьюсера
const initialState = {
  outgoing: [], // исходящие запросы (пользователь сам отправил)
  incoming: [], // входящие запросы (другие пользователи отправили)
  loading: false, // индикатор загрузки (фетчинг запросов)
  // массив, в котором храним id запросов, которые прямо сейчас обновляются (меняется их статус на сервере).
  // Чтобы при нажатии, например, "Одобрить" или "Отклонить", показать спиннер только на этой кнопке, а не блокировать всё.
  // Чтобы не перезагружать весь список запросов и при этом дать пользователю чёткий визуальный отклик: “именно этот запрос сейчас в обработке”.
  updatingIds: [], // спиннер только на одной кнопке
  error: null, // ошибка при загрузке
  counters: {
    incomingPending: 0, // количество входящих запросов в статусе "pending"
    outgoingPending: 0, // количество исходящих запросов в статусе "pending"
  },
};

// Редьюсер для работы с запросами в комнаты
export default function roomRequestStatus(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    // Начало загрузки запросов
    case ROOM_REQUESTS_FETCH_START:
      return { ...state, loading: true, error: null };

    // Успешная загрузка входящих и исходящих запросов
    case ROOM_REQUESTS_FETCH_SUCCESS: {
      const { incoming, outgoing } = payload;

      // Считаем  количество запросов в ожидании
      const counters = {
        incomingPending: incoming.filter((room) => room.status === "pending")
          .length,
        outgoingPending: outgoing.filter((room) => room.status === "pending")
          .length,
      };
      return {
        ...state,
        loading: false,
        incoming,
        outgoing,
        counters,
        error: null,
      };
    }

    // Ошибка при загрузке
    case ROOM_REQUESTS_FETCH_ERROR:
      return { ...state, loading: false, error: payload };

    // Сброс состояния ( при logout)
    case ROOM_REQUESTS_CLEAR:
      return initialState;

    // Состояние для спинера обновляющегося статуса запроса
    case ROOM_REQUEST_UPDATE_START:
      // используется в редьюсере, когда завершается обновление конкретного запроса.
      return { ...state, updatingIds: [...state.updatingIds, payload.id] }; //  добавляем id текущего запроса в список

    case ROOM_REQUEST_UPDATE_SUCCESS: {
      const { id, status } = payload;
      const updateList = (list) =>
        list.map((request) =>
          request.id === id ? { ...request, status } : request
        );

      const incoming = updateList(payload.incoming);
      const outgoing = updateList(payload.outgoing);
      const counters = updateList(incoming, outgoing);

      return {
        ...state,
        incoming,
        outgoing,
        counters,
        // Нужно удалить  id из массива, потому что этот запрос больше не обновляется.
        updatingIds: state.updatingIds.filter((reqID) => reqID !== id), // новый список активных обновлений без текущего.
      };
    }

    // По умолчанию возвращаем текущее состояние
    default:
      return state;
  }
}
