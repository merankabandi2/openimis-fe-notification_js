import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  List,
  Divider,
  Link,
} from "@material-ui/core";
import { withHistory } from "@openimis/fe-core";
import NotificationItem from "./NotificationItem";
import { markAsRead, markAllAsRead } from "../actions";

const styles = (theme) => ({
  root: {
    position: "absolute",
    right: 0,
    top: "100%",
    width: 380,
    maxHeight: 480,
    overflowY: "auto",
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[8],
    borderRadius: 8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
  },
  title: {
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  markAllRead: {
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  empty: {
    padding: "24px 16px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  sectionLabel: {
    padding: "8px 16px 4px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
  },
});

function NotificationDropdown({
  classes,
  intl,
  history,
  notifications,
  dispatch,
}) {
  const handleClick = (notification) => {
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.entity_url) {
      history.push(notification.entity_url);
    }
  };

  const handleMarkAllRead = (e) => {
    e.preventDefault();
    dispatch(markAllAsRead());
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
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>
          {intl.formatMessage({ id: "notification.dropdown.title" })}
        </Typography>
        {hasNotifications && (
          <Link className={classes.markAllRead} onClick={handleMarkAllRead}>
            {intl.formatMessage({ id: "notification.dropdown.markAllRead" })}
          </Link>
        )}
      </div>
      <Divider />
      {!hasNotifications ? (
        <Typography className={classes.empty}>
          {intl.formatMessage({ id: "notification.dropdown.empty" })}
        </Typography>
      ) : (
        <>
          {todayNotifs.length > 0 && (
            <>
              <Typography className={classes.sectionLabel}>
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
              <Typography className={classes.sectionLabel}>
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
    </Paper>
  );
}

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
});

export default withHistory(
  connect(mapStateToProps)(injectIntl(withStyles(styles)(NotificationDropdown)))
);
