export const MODULE_NAME = "notification";

export const API_NOTIFICATION_LIST = "/notification/";
export const API_NOTIFICATION_UNREAD_COUNT = "/notification/unread_count/";
export const API_NOTIFICATION_MARK_READ = "/notification/{id}/read/";
export const API_NOTIFICATION_MARK_ALL_READ = "/notification/read_all/";
export const API_NOTIFICATION_STREAM = "/notification/stream/";
export const API_NOTIFICATION_PREFERENCES = "/notification/preferences/";
export const API_NOTIFICATION_PREFERENCES_UPDATE = "/notification/preferences/update/";

export const APPBAR_RIGHT_CONTRIBUTION_KEY = "core.AppBar.right";
export const USER_PROFILE_PANELS_CONTRIBUTION_KEY = "core.UserProfile.panels";
export const BOOT_CONTRIBUTION_KEY = "core.Boot";

export const CATEGORY_COLORS = {
  payment: "#1565c0",
  grievance: "#e65100",
  activity: "#2e7d32",
  selection: "#6a1b9a",
  task: "#4527a0",
};

export const CATEGORY_LABELS = {
  payment: "notification.category.payment",
  grievance: "notification.category.grievance",
  activity: "notification.category.activity",
  selection: "notification.category.selection",
  task: "notification.category.task",
};
