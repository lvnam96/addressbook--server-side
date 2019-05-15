import React from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';

const ConfirmDialog = (props) => {
    const cancelAction = () => {
        props.closeModalDialog(false);
    };
    const allowToDoAction = () => {
        props.closeModalDialog(true);
    };

    return (
        <Popup onCloseHandler={cancelAction}>
            <div className="confirm-dialog">
                <h3 className="confirm-dialog__header">{props.header}</h3>
                <p className="confirm-dialog__body">{props.body}</p>
                <div className="row align-items-center justify-content-between">
                    <div className="col-auto">
                        <p className="text-right">
                            <a href="#" className="rounded-sm confirm-dialog__btn confirm-dialog__btn--yes" onClick={allowToDoAction}>{props.labelYES}</a>
                        </p>
                    </div>
                    <div className="col-auto">
                        <p className="text-right">
                            <a href="#" className="rounded-sm confirm-dialog__btn confirm-dialog__btn--no" onClick={cancelAction}>{props.labelNO}</a>
                        </p>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

const defaultLabelYES = 'Yes';
ConfirmDialog.defaultProps = {
    labelYES: defaultLabelYES,
    labelNO: 'No',
    header: 'Are you sure?',
    body: `This cannot be undone. Press ${defaultLabelYES} to confirm to do it.`
};

ConfirmDialog.propTypes = {
    closeModalDialog: PropTypes.func.isRequired,
    labelYES: PropTypes.string,
    labelNO: PropTypes.string,
    header: PropTypes.string,
    body: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default ConfirmDialog;
