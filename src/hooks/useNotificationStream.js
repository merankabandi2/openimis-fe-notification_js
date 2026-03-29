import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { baseApiUrl } from "@openimis/fe-core";
import {
  sseNotificationReceived,
  sseConnected,
  sseDisconnected,
  fetchNotifications,
  fetchUnreadCount,
} from "../actions";

const SSE_URL = `${baseApiUrl}/notification/stream/`;

export function useNotificationStream() {
  const dispatch = useDispatch();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    const es = new EventSource(SSE_URL, { withCredentials: true });
    eventSourceRef.current = es;

    es.onopen = () => {
      dispatch(sseConnected());
    };

    es.addEventListener("unread_count", (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch({
          type: "NOTIFICATION_FETCH_UNREAD_COUNT_RESP",
          payload: data,
        });
      } catch (e) {
        // ignore parse errors
      }
    });

    es.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        dispatch(sseNotificationReceived(notification));
      } catch (e) {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      dispatch(sseDisconnected());
    };

    return () => {
      es.close();
      dispatch(sseDisconnected());
    };
  }, [dispatch]);
}
