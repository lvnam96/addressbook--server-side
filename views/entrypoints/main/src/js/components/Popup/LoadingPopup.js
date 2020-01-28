import React from 'react';
import PropTypes from 'prop-types';

import Popup from './Popup';
import Spinner from '../Spinner/Spinner.jsx';

const LoadingPopup = (props) => (
  <Popup handleClose={(e) => props.handleClose(props.closeFuncArgs)}>
    <Spinner colorClass="text-light" />
  </Popup>
);

LoadingPopup.propTypes = {
  handleClose: PropTypes.func.isRequired,
  closeFuncArgs: PropTypes.any,
};

export default LoadingPopup;
