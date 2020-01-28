import React from 'react';
import PropTypes from 'prop-types';

import AsyncPopup from '../Popup/AsyncPopup.jsx';
const Ccard = React.lazy(() => import(/* webpackPreload: true */ './ContactCard'));

const AsyncCcardPopup = (props) => {
  const commonPopupProps = {
    isOpen: props.modalProps.isOpen,
    handleClose: props.modalProps.handleClose,
  };
  const ccardProps = { ...props };
  delete ccardProps.modalProps;
  return (
    <AsyncPopup modalProps={{ ...commonPopupProps }} fallbackModalProps={{ ...commonPopupProps }}>
      <Ccard {...ccardProps} handleClose={commonPopupProps.handleClose} />
    </AsyncPopup>
  );
};
AsyncCcardPopup.propTypes = {
  modalProps: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default AsyncCcardPopup;
