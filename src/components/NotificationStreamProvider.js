import { useNotificationStream } from "../hooks/useNotificationStream";

function NotificationStreamProvider() {
  useNotificationStream();
  return null;
}

export default NotificationStreamProvider;
