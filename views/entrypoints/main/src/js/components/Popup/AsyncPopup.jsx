import React from 'react';
import PropTypes from 'prop-types';

import AsyncLoader from '../AsyncLoader/AsyncLoader.jsx';
import LoadingPopup from './LoadingPopup.jsx';
import Popup from './Popup.jsx';

const AsyncPopup = (props) => {
  const modalProps = { ...props.modalProps };
  const fallbackModalProps = { ...props.fallbackModalProps };
  return (
    <AsyncLoader fallback={<LoadingPopup {...fallbackModalProps} />}>
      <Popup {...modalProps}>{props.children}</Popup>
    </AsyncLoader>
  );
};

AsyncPopup.propTypes = {
  children: PropTypes.element,
  modalProps: PropTypes.object,
  fallbackModalProps: PropTypes.object,
};

export default AsyncPopup;
