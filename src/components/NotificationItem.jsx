import React from "react";
import { injectIntl } from "react-intl";
import { styled } from "@mui/material/styles";
import { ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryIcons";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": { backgroundColor: theme.palette.action.hover },
  "&.unread": { backgroundColor: "rgba(25, 118, 210, 0.04)" },
  "& .categoryIcon": { minWidth: 36 },
  "& .itemTitle": { fontWeight: 500, fontSize: "0.85rem" },
  "& .itemTitleUnread": { fontWeight: 700 },
  "& .itemTime": { fontSize: "0.75rem", color: theme.palette.text.secondary },
  "& .unreadDot": { fontSize: 8, marginLeft: 4, color: theme.palette.primary.main },
}));

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

function NotificationItem({ intl, notification, onClick }) {
  const CategoryIcon = getCategoryIcon(notification.category);
  const color = getCategoryColor(notification.category);
  const isUnread = !notification.is_read;

  return (
    <StyledListItem
      className={isUnread ? "unread" : undefined}
      onClick={() => onClick(notification)}
      dense
    >
      <ListItemIcon className="categoryIcon">
        <CategoryIcon style={{ color, fontSize: 20 }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className={isUnread ? "itemTitle itemTitleUnread" : "itemTitle"}>
            {notification.title}
            {isUnread && <FiberManualRecordIcon className="unreadDot" />}
          </Typography>
        }
        secondary={
          <Typography className="itemTime">
            {formatTimeAgo(notification.created_at, intl)}
          </Typography>
        }
      />
    </StyledListItem>
  );
}

export default injectIntl(NotificationItem);
