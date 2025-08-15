import {
  ROOM_REQUESTS_FETCH_START,
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
} from "../types/types";

const initialState = {
  outgoing: [],
  incoming: [],
  loading: false,
  // массив, в котором храним id запросов, которые прямо сейчас обновляются (меняется их статус на сервере).
  // Чтобы при нажатии, например, "Одобрить" или "Отклонить", показать спиннер только на этой кнопке, а не блокировать всё.
  // Чтобы не перезагружать весь список запросов и при этом дать пользователю чёткий визуальный отклик: “именно этот запрос сейчас в обработке”.
  updatingIds: [],
  error: null,
  counters: { incomingPending: 0, outgoingPending: 0 }, // производные данные
};

export default function roomRequestStatus(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ROOM_REQUESTS_FETCH_START:
      return { ...state, loading: true, error: null };
    case ROOM_REQUESTS_FETCH_SUCCESS: {
      const { incoming, outgoing } = payload;
      const counters = {
        incomingPending: incoming.filter(
          (room) => (room.status === "pending").length
        ),
        outgoingPending: outgoing.filter((room) => room.status === "pending")
          .length,
      };
      return { ...state, incoming, outgoing, counters };
    }
    case ROOM_REQUESTS_FETCH_ERROR:
      return { ...state, loading: false, error: payload };

    case ROOM_REQUESTS_CLEAR:
      return initialState;

    default:
      return state;
  }
}
