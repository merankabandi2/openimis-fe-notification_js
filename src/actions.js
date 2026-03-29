import { baseApiUrl } from "@openimis/fe-core";

const REQUEST = (actionType) => `${actionType}_REQ`;
const SUCCESS = (actionType) => `${actionType}_RESP`;
const ERROR = (actionType) => `${actionType}_ERR`;

export const ACTION_TYPE = {
  FETCH_NOTIFICATIONS: "NOTIFICATION_FETCH_NOTIFICATIONS",
  FETCH_UNREAD_COUNT: "NOTIFICATION_FETCH_UNREAD_COUNT",
  MARK_AS_READ: "NOTIFICATION_MARK_AS_READ",
  MARK_ALL_AS_READ: "NOTIFICATION_MARK_ALL_AS_READ",
  SSE_NOTIFICATION_RECEIVED: "NOTIFICATION_SSE_RECEIVED",
  SSE_CONNECTED: "NOTIFICATION_SSE_CONNECTED",
  SSE_DISCONNECTED: "NOTIFICATION_SSE_DISCONNECTED",
  FETCH_PREFERENCES: "NOTIFICATION_FETCH_PREFERENCES",
  UPDATE_PREFERENCES: "NOTIFICATION_UPDATE_PREFERENCES",
};

function apiHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export function fetchNotifications(params = {}) {
  const { limit = 15, offset = 0, category, is_read } = params;
  let url = `${baseApiUrl}/notification/?limit=${limit}&offset=${offset}`;
  if (category) url += `&category=${category}`;
  if (is_read !== undefined) url += `&is_read=${is_read}`;

  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.FETCH_NOTIFICATIONS) });
    return fetch(url, { credentials: "same-origin", headers: apiHeaders() })
      .then((resp) => resp.json())
      .then((data) =>
        dispatch({
          type: SUCCESS(ACTION_TYPE.FETCH_NOTIFICATIONS),
          payload: data,
        })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.FETCH_NOTIFICATIONS), payload: err })
      );
  };
}

export function fetchUnreadCount() {
  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.FETCH_UNREAD_COUNT) });
    return fetch(`${baseApiUrl}/notification/unread_count/`, {
      credentials: "same-origin",
      headers: apiHeaders(),
    })
      .then((resp) => resp.json())
      .then((data) =>
        dispatch({
          type: SUCCESS(ACTION_TYPE.FETCH_UNREAD_COUNT),
          payload: data,
        })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.FETCH_UNREAD_COUNT), payload: err })
      );
  };
}

export function markAsRead(notificationId) {
  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.MARK_AS_READ), meta: { notificationId } });
    return fetch(`${baseApiUrl}/notification/${notificationId}/read/`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: apiHeaders(),
    })
      .then((resp) => resp.json())
      .then(() =>
        dispatch({
          type: SUCCESS(ACTION_TYPE.MARK_AS_READ),
          meta: { notificationId },
        })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.MARK_AS_READ), payload: err })
      );
  };
}

export function markAllAsRead() {
  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.MARK_ALL_AS_READ) });
    return fetch(`${baseApiUrl}/notification/read_all/`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: apiHeaders(),
    })
      .then((resp) => resp.json())
      .then(() =>
        dispatch({ type: SUCCESS(ACTION_TYPE.MARK_ALL_AS_READ) })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.MARK_ALL_AS_READ), payload: err })
      );
  };
}

export function sseNotificationReceived(notification) {
  return { type: ACTION_TYPE.SSE_NOTIFICATION_RECEIVED, payload: notification };
}

export function sseConnected() {
  return { type: ACTION_TYPE.SSE_CONNECTED };
}

export function sseDisconnected() {
  return { type: ACTION_TYPE.SSE_DISCONNECTED };
}

export function fetchPreferences() {
  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.FETCH_PREFERENCES) });
    return fetch(`${baseApiUrl}/notification/preferences/`, {
      credentials: "same-origin",
      headers: apiHeaders(),
    })
      .then((resp) => resp.json())
      .then((data) =>
        dispatch({
          type: SUCCESS(ACTION_TYPE.FETCH_PREFERENCES),
          payload: data,
        })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.FETCH_PREFERENCES), payload: err })
      );
  };
}

export function updatePreferences(preferences) {
  return (dispatch) => {
    dispatch({ type: REQUEST(ACTION_TYPE.UPDATE_PREFERENCES) });
    return fetch(`${baseApiUrl}/notification/preferences/update/`, {
      method: "PUT",
      credentials: "same-origin",
      headers: apiHeaders(),
      body: JSON.stringify(preferences),
    })
      .then((resp) => resp.json())
      .then((data) =>
        dispatch({
          type: SUCCESS(ACTION_TYPE.UPDATE_PREFERENCES),
          payload: data,
        })
      )
      .catch((err) =>
        dispatch({ type: ERROR(ACTION_TYPE.UPDATE_PREFERENCES), payload: err })
      );
  };
}
