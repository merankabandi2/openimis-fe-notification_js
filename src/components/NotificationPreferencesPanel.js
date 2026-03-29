import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Tooltip,
  Typography,
  Button,
} from "@material-ui/core";
import { CATEGORY_LABELS } from "../constants";
import { fetchPreferences, updatePreferences } from "../actions";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  categoryHeader: {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
  },
  smsCell: {
    opacity: 0.5,
  },
  resetButton: {
    marginTop: theme.spacing(2),
  },
});

class NotificationPreferencesPanel extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPreferences());
  }

  handleToggle = (eventType, channel, currentEnabled) => {
    this.props.dispatch(
      updatePreferences([
        { event_type: eventType, channel, is_enabled: !currentEnabled },
      ])
    );
    setTimeout(() => this.props.dispatch(fetchPreferences()), 500);
  };

  handleResetDefaults = () => {
    const { intl } = this.props;
    if (window.confirm(intl.formatMessage({ id: "notification.preferences.resetConfirm" }))) {
      const resets = [];
      (this.props.preferences || []).forEach((pref) => {
        Object.entries(pref.channels).forEach(([channel, config]) => {
          if (!config.is_default) {
            resets.push({
              event_type: pref.event_type,
              channel,
              is_enabled: true,
            });
          }
        });
      });
      if (resets.length > 0) {
        this.props.dispatch(updatePreferences(resets));
        setTimeout(() => this.props.dispatch(fetchPreferences()), 500);
      }
    }
  };

  render() {
    const { classes, intl, preferences, fetchingPreferences } = this.props;

    const grouped = {};
    (preferences || []).forEach((pref) => {
      if (!grouped[pref.category]) grouped[pref.category] = [];
      grouped[pref.category].push(pref);
    });

    return (
      <Paper className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          {intl.formatMessage({ id: "notification.preferences.title" })}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {intl.formatMessage({ id: "notification.preferences.event" })}
              </TableCell>
              <TableCell align="center">
                {intl.formatMessage({ id: "notification.preferences.inApp" })}
              </TableCell>
              <TableCell align="center">
                {intl.formatMessage({ id: "notification.preferences.email" })}
              </TableCell>
              <TableCell align="center">
                <Tooltip
                  title={intl.formatMessage({
                    id: "notification.preferences.smsComingSoon",
                  })}
                >
                  <span>
                    {intl.formatMessage({ id: "notification.preferences.sms" })}
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(grouped).map(([category, prefs]) => (
              <React.Fragment key={category}>
                <TableRow>
                  <TableCell colSpan={4} className={classes.categoryHeader}>
                    {intl.formatMessage({
                      id: CATEGORY_LABELS[category] || category,
                    })}
                  </TableCell>
                </TableRow>
                {prefs.map((pref) => (
                  <TableRow key={pref.event_type}>
                    <TableCell>{pref.label}</TableCell>
                    <TableCell align="center">
                      <Switch
                        size="small"
                        checked={pref.channels.in_app?.enabled ?? true}
                        onChange={() =>
                          this.handleToggle(
                            pref.event_type,
                            "in_app",
                            pref.channels.in_app?.enabled
                          )
                        }
                        disabled={fetchingPreferences}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        size="small"
                        checked={pref.channels.email?.enabled ?? true}
                        onChange={() =>
                          this.handleToggle(
                            pref.event_type,
                            "email",
                            pref.channels.email?.enabled
                          )
                        }
                        disabled={fetchingPreferences}
                      />
                    </TableCell>
                    <TableCell align="center" className={classes.smsCell}>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "notification.preferences.smsComingSoon",
                        })}
                      >
                        <span>
                          <Switch size="small" checked={false} disabled />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="outlined"
          size="small"
          className={classes.resetButton}
          onClick={this.handleResetDefaults}
        >
          {intl.formatMessage({ id: "notification.preferences.resetDefaults" })}
        </Button>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  preferences: state.notification.preferences,
  fetchingPreferences: state.notification.fetchingPreferences,
});

export default connect(mapStateToProps)(
  injectIntl(withStyles(styles)(NotificationPreferencesPanel))
);
