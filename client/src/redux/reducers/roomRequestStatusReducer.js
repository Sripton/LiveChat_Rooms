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
  // updatingIds: [], // спиннер только на одной кнопки
  updatingById: {}, //  НОВОЕ: id -> 'accepted' | 'rejected'
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
    case ROOM_REQUEST_UPDATE_START: {
      // используется в редьюсере, когда завершается обновление конкретного запроса.
      const { id, nextStatus } = payload;
      const idStr = String(id);
      return {
        ...state,
        // updatingIds: [...state.updatingIds, numericId],
        // updatingById: { ...state.updatingById, [id]: nextStatus },
        // updatingIds: state.updatingIds.includes(idStr)
        //   ? state.updatingIds
        //   : [...state.updatingIds, idStr],
        updatingById: { ...state.updatingById, [idStr]: nextStatus },
        error: null,
      }; //  добавляем id текущего запроса в список
    }

    case ROOM_REQUEST_UPDATE_SUCCESS: {
      const { id, status } = payload; // только данные о том, что поменялось в одной сущности, а полный список остаётся в state
      // полный список входящих/исходящих запросов  хранится в state.
      // мы берём текущие массивы incoming и outgoing из state;
      const idStr = String(id);
      const incoming = state.incoming.map((req) =>
        String(req.id) === idStr ? { ...req, status } : req
      );
      const outgoing = state.outgoing.map((req) =>
        String(req.id) === idStr ? { ...req, status } : req
      );

      // Обновляем элементы в текущих массивах стора
      const counters = {
        incomingPending: incoming.filter((req) => req.status === "pending")
          .length,
        outgoingPending: outgoing.filter((req) => req.status === "pending")
          .length,
      };

      const restUpdatingById = { ...state.updatingById };
      delete restUpdatingById[idStr];
      return {
        ...state,
        incoming,
        outgoing,
        counters,
        // Нужно удалить  id из массива, потому что этот запрос больше не обновляется.
        // updatingIds: state.updatingIds.filter((reqID) => reqID !== idStr), // новый список активных обновлений без текущего.
        updatingById: restUpdatingById,
      };
    }

    case ROOM_REQUEST_UPDATE_ERROR: {
      const { id, error } = payload;
      const idStr = String(id);
      const restUpdatingById = { ...state.updatingById };
      delete restUpdatingById[idStr];
      return {
        ...state,
        // updatingIds: state.updatingIds.filter((reqID) => reqID !== idStr),
        updatingById: restUpdatingById,
        error,
      };
    }
    // По умолчанию возвращаем текущее состояние
    default:
      return state;
  }
}
