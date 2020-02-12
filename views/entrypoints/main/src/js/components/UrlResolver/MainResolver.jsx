import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';

class MainPageURLResolver extends React.PureComponent {
  updatePropCurrentCbookId = () => {
    const reduxState = adbk.redux.store.getState();
    this.currentCbookId = _get(reduxState, 'user.meta.lastActivatedCbookId') || null;
  };

  handleSwitchingCbook = (cbookIdFromURL) => {
    console.log('HANDLE CHANGING DEFAULT CBOOK BY CHANGING URL', cbookIdFromURL, this.props);

    adbk.setDefaultCbook(cbookIdFromURL);

    this.currentCbookId = cbookIdFromURL;
  };

  constructor(props) {
    super(props);
    this.currentCbookId = null;

    this.updatePropCurrentCbookId();
  }

  static get propTypes() {
    return {
      // location: PropTypes.object.isRequired,
      // history: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
    };
  }

  componentDidMount() {
    const cbookIdFromURL = _get(this.props.match, 'params.cbookId');
    adbk
      .checkDataLoaded()
      .then(() => {
        this.updatePropCurrentCbookId();
        if (!cbookIdFromURL && this.currentCbookId) {
          adbk.redux.store.dispatch(push(`/cbooks/${this.currentCbookId}/`));
        }
        return null;
      })
      .catch(() => {});
  }

  componentDidUpdate(prevProps, prevState) {
    const cbookIdFromURL = _get(this.props.match, 'params.cbookId');
    if (this.currentCbookId !== cbookIdFromURL) this.handleSwitchingCbook(cbookIdFromURL);
  }

  render() {
    return null;
  }
}

export default withRouter(MainPageURLResolver);
