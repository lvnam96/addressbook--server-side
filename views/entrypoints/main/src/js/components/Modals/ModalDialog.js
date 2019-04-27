import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../HOCs/Popup';

const ModalDialog = (props) => {
    const cancelAction = () => {
        props.closeModalDialog(false);
    }, allowToDoAction = () => {
        props.closeModalDialog(true);
    };

    return (
        <Popup onCloseHandler={cancelAction}>
            <div className="dialog" style={{
                backgroundColor: '#fff',
                padding: '20px 30px',
                borderRadius: '15px',
                boxShadow: '0 0 25px 10px rgba(0, 0, 0, .5)',
            }}>
                <h3 className="modal-dialog__header">{props.header}</h3>
                <p className="modal-dialog__body">{props.body}</p>
                <p className="text-right">
                    <button onClick={allowToDoAction}>{props.labelYES}</button>
                    <button onClick={cancelAction}>{props.labelNO}</button>
                </p>
            </div>
        </Popup>
    );
};

const defaultLabelYES = 'Yes';
ModalDialog.defaultProps = {
    labelYES: defaultLabelYES,
    labelNO: 'No',
    header: 'Are you sure?',
    body: `This cannot be undone. Press ${defaultLabelYES} to confirm to do it.`
};

ModalDialog.propTypes = {
    closeModalDialog: PropTypes.func.isRequired,
    labelYES: PropTypes.string,
    labelNO: PropTypes.string,
    header: PropTypes.string,
    body: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    isConfirming: PropTypes.bool.isRequired
};

export default ModalDialog;
