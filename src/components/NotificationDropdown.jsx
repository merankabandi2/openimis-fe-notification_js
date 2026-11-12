import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Typography,
  List,
  Divider,
  Link,
} from "@mui/material";
import { withHistory } from "@openimis/fe-core";
import NotificationItem from "./NotificationItem";
import { gqlMarkAsRead, gqlMarkAllAsRead } from "../actions";

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 380,
  maxHeight: 480,
  overflowY: "auto",
  boxShadow: theme.shadows[8],
  borderRadius: 8,
  "& .header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
  },
  "& .title": {
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  "& .markAllRead": {
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  "& .empty": {
    padding: "24px 16px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  "& .sectionLabel": {
    padding: "8px 16px 4px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
  },
}));

function NotificationDropdown({
  intl,
  history,
  notifications,
  dispatch,
}) {
  const handleClick = (notification) => {
    if (!notification.is_read) {
      dispatch(gqlMarkAsRead(notification.id));
    }
    if (notification.entity_url) {
      history.push(notification.entity_url);
    }
  };

  const handleMarkAllRead = (e) => {
    e.preventDefault();
    dispatch(gqlMarkAllAsRead());
  };

  const today = new Date().toDateString();
  const todayNotifs = [];
  const earlierNotifs = [];
  (notifications || []).forEach((n) => {
    if (new Date(n.created_at).toDateString() === today) {
      todayNotifs.push(n);
    } else {
      earlierNotifs.push(n);
    }
  });

  const hasNotifications = todayNotifs.length > 0 || earlierNotifs.length > 0;

  return (
    <StyledPaper>
      <div className="header">
        <Typography className="title">
          {intl.formatMessage({ id: "notification.dropdown.title" })}
        </Typography>
        {hasNotifications && (
          <Link
            className="markAllRead"
            onClick={handleMarkAllRead}
            underline="hover">
            {intl.formatMessage({ id: "notification.dropdown.markAllRead" })}
          </Link>
        )}
      </div>
      <Divider />
      {!hasNotifications ? (
        <Typography className="empty">
          {intl.formatMessage({ id: "notification.dropdown.empty" })}
        </Typography>
      ) : (
        <>
          {todayNotifs.length > 0 && (
            <>
              <Typography className="sectionLabel">
                {intl.formatMessage({ id: "notification.dropdown.today" })}
              </Typography>
              <List disablePadding>
                {todayNotifs.map((n) => (
                  <NotificationItem key={n.id} notification={n} onClick={handleClick} />
                ))}
              </List>
            </>
          )}
          {earlierNotifs.length > 0 && (
            <>
              <Typography className="sectionLabel">
                {intl.formatMessage({ id: "notification.dropdown.earlier" })}
              </Typography>
              <List disablePadding>
                {earlierNotifs.map((n) => (
                  <NotificationItem key={n.id} notification={n} onClick={handleClick} />
                ))}
              </List>
            </>
          )}
        </>
      )}
    </StyledPaper>
  );
}

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
});

export default withHistory(
  connect(mapStateToProps)(injectIntl(NotificationDropdown))
);
