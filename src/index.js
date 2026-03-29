import NotificationBell from "./components/NotificationBell";
import NotificationPreferencesPage from "./components/NotificationPreferencesPanel";
import NotificationStreamProvider from "./components/NotificationStreamProvider";
import reducer from "./reducer";
import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";

const ROUTE_NOTIFICATION_PREFERENCES = "notification/preferences";

const DEFAULT_CONFIG = {
  translations: [
    { key: "en", messages: messages_en },
    { key: "fr", messages: messages_fr },
  ],
  reducers: [{ key: "notification", reducer }],
  "core.AppBar": [NotificationBell],
  "core.Boot": [NotificationStreamProvider],
  "core.Router": [
    { path: ROUTE_NOTIFICATION_PREFERENCES, component: NotificationPreferencesPage },
  ],
  "profile.MainMenu": [
    {
      text: { id: "notification.preferences.title" },
      icon: null,
      route: "/" + ROUTE_NOTIFICATION_PREFERENCES,
      id: "notification.preferences",
    },
  ],
};

export const NotificationModule = (cfg) => ({
  ...DEFAULT_CONFIG,
  ...((cfg && cfg["fe-notification"]) || {}),
});

export default NotificationModule;
