import React from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';

const ModalDialog = (props) => {
  const cancelAction = () => {
    props.closeModalDialog(false);
  };
  const allowToDoAction = () => {
    props.closeModalDialog(true);
  };

  return (
    <Popup handleClose={cancelAction}>
      <div
        className="dialog"
        style={{
          backgroundColor: '#fff',
          padding: '20px 30px',
          boxShadow: '0 0 25px 10px rgba(0, 0, 0, .5)',
        }}>
        <div className="modal-dialog__header">
          <h3>{props.header}</h3>
        </div>
        <div className="modal-dialog__body">{props.body}</div>
        <div className="modal-dialog__footer">
          <p className="text-right mb-0">
            <button onClick={allowToDoAction}>{props.labelYES}</button>
            <button onClick={cancelAction}>{props.labelNO}</button>
          </p>
        </div>
      </div>
    </Popup>
  );
};

const defaultLabelYES = 'Yes';
ModalDialog.defaultProps = {
  labelYES: defaultLabelYES,
  labelNO: 'No',
  header: 'Are you sure?',
  body: `This cannot be undone. Press ${defaultLabelYES} to confirm to do it.`,
};

ModalDialog.propTypes = {
  closeModalDialog: PropTypes.func.isRequired,
  labelYES: PropTypes.string,
  labelNO: PropTypes.string,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default ModalDialog;
