import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

class AppErrorCatcher extends React.Component {
  state = { eventId: null };

  static get propTypes () {
    return {
      children: PropTypes.element.isRequired,
    };
  }

  componentDidCatch (error, errorInfo) {
    adbk.showNoti('error', 'There is a problem! Please refresh the app.');
    // report to error reporting service
    adbk.reportError(error, errorInfo);
    const eventId = Sentry.captureException(error);
    this.setState({ eventId });
    console.error(errorInfo);
  }

  // static getDerivedStateFromError () {
  //   // handle UI
  //   adbk.showNoti('error', 'There is a problem! Please refresh the app.');
  //   return { hasError: true };
  // }

  render () {
    if (this.state.hasError) {
      // render fallback UI
      return <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>;
    }

    return this.props.children;
  }
}

export default AppErrorCatcher;
