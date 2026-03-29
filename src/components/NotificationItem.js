import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryIcons";

const styles = (theme) => ({
  item: {
    cursor: "pointer",
    "&:hover": { backgroundColor: theme.palette.action.hover },
  },
  unread: {
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
  categoryIcon: {
    minWidth: 36,
  },
  title: {
    fontWeight: 500,
    fontSize: "0.85rem",
  },
  titleUnread: {
    fontWeight: 700,
  },
  time: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  unreadDot: {
    fontSize: 8,
    marginLeft: 4,
    color: theme.palette.primary.main,
  },
});

function formatTimeAgo(dateStr, intl) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return intl.formatMessage({ id: "notification.timeAgo.justNow" });
  if (diffMin < 60) return intl.formatMessage({ id: "notification.timeAgo.minutesAgo" }, { count: diffMin });
  if (diffHrs < 24) return intl.formatMessage({ id: "notification.timeAgo.hoursAgo" }, { count: diffHrs });
  return intl.formatMessage({ id: "notification.timeAgo.daysAgo" }, { count: diffDays });
}

function NotificationItem({ classes, intl, notification, onClick }) {
  const CategoryIcon = getCategoryIcon(notification.category);
  const color = getCategoryColor(notification.category);
  const isUnread = !notification.is_read;

  return (
    <ListItem
      className={`${classes.item} ${isUnread ? classes.unread : ""}`}
      onClick={() => onClick(notification)}
      dense
    >
      <ListItemIcon className={classes.categoryIcon}>
        <CategoryIcon style={{ color, fontSize: 20 }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className={`${classes.title} ${isUnread ? classes.titleUnread : ""}`}>
            {notification.title}
            {isUnread && <FiberManualRecordIcon className={classes.unreadDot} />}
          </Typography>
        }
        secondary={
          <Typography className={classes.time}>
            {formatTimeAgo(notification.created_at, intl)}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default injectIntl(withStyles(styles)(NotificationItem));
