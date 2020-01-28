import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfirmDialogPopup from './ConfirmDialogPopup';

const GlobalConfirmDialogPopup = (props) => (
  <ConfirmDialogPopup
    modalProps={{
      isOpen: props.isOpenDialog,
      handleClose: adbk.closeConfirmDialog,
    }}
    {...props.content}
    callback={props.callback}
  />
);

GlobalConfirmDialogPopup.propTypes = {
  isOpenDialog: PropTypes.bool.isRequired,
  callback: PropTypes.func,
  content: PropTypes.object,
};

const mapStateToProps = ({ confirm }) => ({
  isOpenDialog: confirm.isOpenDialog,
  callback: confirm.callback,
  content: confirm.content,
});
export default connect(mapStateToProps)(GlobalConfirmDialogPopup);
