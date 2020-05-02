import React from 'react';
import PropTypes from 'prop-types';
import { captureException, showReportDialog } from '@sentry/browser';

class AppErrorCatcher extends React.Component {
  state = { eventId: null, hasError: false };

  static get propTypes() {
    return {
      children: PropTypes.element.isRequired,
    };
  }

  componentDidCatch(error, errorInfo) {
    adbk.showNoti('error', 'There is a problem! Please refresh the app.');
    // report to error reporting service
    adbk.reportError(error, errorInfo);
    adbk.status.isDev && adbk.logErrorToConsole(errorInfo);
  }

  static getDerivedStateFromError(error) {
    // handle UI
    const eventId = captureException(error);
    return { hasError: true, eventId };
  }

  render() {
    if (this.state.hasError) {
      // render fallback UI
      return <button onClick={() => showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>;
    }

    return this.props.children;
  }
}

export default AppErrorCatcher;
