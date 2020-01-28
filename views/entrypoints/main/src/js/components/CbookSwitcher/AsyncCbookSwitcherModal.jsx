import React from 'react';
import PropTypes from 'prop-types';

// import AsyncModal from '../Modals/AsyncModal.jsx';
import AsyncPopup from '../Popup/AsyncPopup.jsx';
const CbookSwitcherContainer = React.lazy(() => import(/* webpackPreload: true */ './CbookSwitcherContainer.jsx'));

const AsyncCbookSwitcherModal = (props) => {
  // const commonModalProps = {
  //   // closeTimeoutMS: 200,
  //   isOpen: props.modalProps.isOpen,
  //   shouldCloseOnOverlayClick: false,
  //   onRequestClose: props.modalProps.handleClose,
  //   handleClose: props.modalProps.handleClose,
  //   contentLabel: 'aaaaa',
  //   overlayClassName: 'popup-backdrop',
  //   className: 'popup cbooks-switcher-ctner',
  //   bodyOpenClassName: 'popup-open',
  //   htmlOpenClassName: 'popup-open',
  // };
  const commonPopupProps = {
    isOpen: props.modalProps.isOpen,
    handleClose: props.modalProps.handleClose,
  };
  const switcherProps = { ...props };
  delete switcherProps.modalProps;
  return (
    <AsyncPopup modalProps={{ ...commonPopupProps }} fallbackModalProps={{ ...commonPopupProps }}>
      <CbookSwitcherContainer {...switcherProps} handleClose={props.modalProps.handleClose} />
    </AsyncPopup>
  );
};

AsyncCbookSwitcherModal.propTypes = {
  modalProps: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default AsyncCbookSwitcherModal;
