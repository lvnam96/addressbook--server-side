import React from 'react';
import PropTypes from 'prop-types';

import Popup from './Popup';

const LoadingPopup = (props) => (
  <Popup onCloseHandler={(e) => props.handleClose(props.closeFuncArgs)}>
    <div className="spinner-grow text-light align-self-center" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </Popup>
);

LoadingPopup.propTypes = {
  handleClose: PropTypes.func.isRequired,
  closeFuncArgs: PropTypes.any,
};

export default LoadingPopup;
