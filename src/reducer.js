/* eslint-disable default-param-last */
import { ACTION_TYPE } from "./actions";

const REQUEST = (actionType) => `${actionType}_REQ`;
const SUCCESS = (actionType) => `${actionType}_RESP`;
const ERROR = (actionType) => `${actionType}_ERR`;

const INITIAL_STATE = {
  unreadCount: 0,
  notifications: [],
  fetchingNotifications: false,
  sseConnected: false,
  preferences: [],
  fetchingPreferences: false,
};

function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.FETCH_NOTIFICATIONS):
      return { ...state, fetchingNotifications: true };
    case SUCCESS(ACTION_TYPE.FETCH_NOTIFICATIONS):
      return {
        ...state,
        fetchingNotifications: false,
        notifications: action.payload.notifications || [],
      };
    case ERROR(ACTION_TYPE.FETCH_NOTIFICATIONS):
      return { ...state, fetchingNotifications: false };

    case SUCCESS(ACTION_TYPE.FETCH_UNREAD_COUNT):
      return { ...state, unreadCount: action.payload.count || 0 };

    case SUCCESS(ACTION_TYPE.MARK_AS_READ): {
      const id = action.meta.notificationId;
      return {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1),
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
      };
    }

    case SUCCESS(ACTION_TYPE.MARK_ALL_AS_READ):
      return {
        ...state,
        unreadCount: 0,
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
      };

    case ACTION_TYPE.SSE_NOTIFICATION_RECEIVED: {
      const newNotif = action.payload;
      const updated = [newNotif, ...state.notifications].slice(0, 15);
      return {
        ...state,
        notifications: updated,
        unreadCount: state.unreadCount + 1,
      };
    }
    case ACTION_TYPE.SSE_CONNECTED:
      return { ...state, sseConnected: true };
    case ACTION_TYPE.SSE_DISCONNECTED:
      return { ...state, sseConnected: false };

    case REQUEST(ACTION_TYPE.FETCH_PREFERENCES):
      return { ...state, fetchingPreferences: true };
    case SUCCESS(ACTION_TYPE.FETCH_PREFERENCES):
      return {
        ...state,
        fetchingPreferences: false,
        preferences: action.payload.preferences || [],
      };
    case ERROR(ACTION_TYPE.FETCH_PREFERENCES):
      return { ...state, fetchingPreferences: false };

    default:
      return state;
  }
}

export default reducer;
