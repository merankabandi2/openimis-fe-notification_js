import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Badge, Tooltip, ClickAwayListener } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationDropdown from "./NotificationDropdown";

const styles = () => ({
  root: {
    position: "relative",
    display: "inline-block",
  },
  bellButton: {
    color: "inherit",
  },
  badge: {
    fontSize: "0.65rem",
  },
});

class NotificationBell extends Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState((prev) => ({ open: !prev.open }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, intl, unreadCount } = this.props;
    const { open } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <div className={classes.root}>
          <Tooltip
            title={intl.formatMessage({ id: "notification.bell.tooltip" })}
          >
            <IconButton className={classes.bellButton} onClick={this.handleToggle}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                classes={{ badge: classes.badge }}
                max={99}
                invisible={unreadCount === 0}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {open && <NotificationDropdown />}
        </div>
      </ClickAwayListener>
    );
  }
}

const mapStateToProps = (state) => ({
  unreadCount: state.notification.unreadCount,
});

export default connect(mapStateToProps)(
  injectIntl(withStyles(styles)(NotificationBell))
);
