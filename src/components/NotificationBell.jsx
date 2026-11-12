import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { styled } from "@mui/material/styles";
import { IconButton, Badge, Tooltip, ClickAwayListener, Popper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationDropdown from "./NotificationDropdown";

const StyledRoot = styled("div")({
  display: "inline-block",
});

class NotificationBell extends Component {
  state = {
    open: false,
  };

  anchorRef = React.createRef();

  handleToggle = () => {
    this.setState((prev) => ({ open: !prev.open }));
  };

  handleClose = (event) => {
    if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) return;
    this.setState({ open: false });
  };

  render() {
    const { intl, unreadCount } = this.props;
    const { open } = this.state;

    return (
      <StyledRoot ref={this.anchorRef}>
        <Tooltip
          title={intl.formatMessage({ id: "notification.bell.tooltip" })}
        >
          <IconButton color="inherit" onClick={this.handleToggle} size="large">
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem" } }}
              max={99}
              invisible={unreadCount === 0}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={this.anchorRef.current}
          placement="bottom-end"
          sx={(theme) => ({ zIndex: theme.zIndex.modal })}
        >
          <ClickAwayListener onClickAway={this.handleClose}>
            <div>
              <NotificationDropdown />
            </div>
          </ClickAwayListener>
        </Popper>
      </StyledRoot>
    );
  }
}

const mapStateToProps = (state) => ({
  unreadCount: state.notification.unreadCount,
});

export default connect(mapStateToProps)(
  injectIntl(NotificationBell)
);
