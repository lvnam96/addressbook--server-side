import React from 'react';
import PropTypes from 'prop-types';

// import AsyncModal from '../Modals/AsyncModal.jsx';
import Popup from '../Popup/Popup';
import ConfirmDialog from './ConfirmDialog.jsx';

const ConfirmDialogPopup = (props) => {
  const dialogProps = { ...props };
  delete dialogProps.modalProps;
  return (
    <Popup {...props.modalProps}>
      <ConfirmDialog {...dialogProps} />
    </Popup>
  );
};

ConfirmDialogPopup.propTypes = {
  modalProps: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default ConfirmDialogPopup;
