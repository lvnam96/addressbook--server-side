import React from 'react';
import PropTypes from 'prop-types';

import AsyncPopup from '../Popup/AsyncPopup.jsx';
const FormContainer = React.lazy(() => import(/* webpackPreload: true */ './containers/FormContainer.jsx'));

const AsyncCFormPopup = (props) => {
  const commonPopupProps = {
    isOpen: props.modalProps.isOpen,
    handleClose: props.modalProps.handleClose,
  };
  const ccardProps = { ...props };
  delete ccardProps.modalProps;
  return (
    <AsyncPopup modalProps={{ ...commonPopupProps }} fallbackModalProps={{ ...commonPopupProps }}>
      <FormContainer {...ccardProps} handleClose={props.modalProps.handleClose} />
    </AsyncPopup>
  );
};
AsyncCFormPopup.propTypes = {
  modalProps: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default AsyncCFormPopup;
