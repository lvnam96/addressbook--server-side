import React from 'react';
import PropTypes from 'prop-types';

const ConfirmDialog = (props) => {
  const onClickAllowAction = (e) => {
    props.callback(true);
  };
  const onClickCloseDialog = (e) => {
    props.callback(false);
  };

  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog__header">
        <h3 className="">{props.header}</h3>
      </div>
      <div className="confirm-dialog__body">
        {typeof props.body === 'string' ? <p className="">{props.body}</p> : props.body}
      </div>
      <div className="confirm-dialog__footer">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <p className="mb-0">
              <button
                className="btn btn-primary rounded-sm confirm-dialog__btn confirm-dialog__btn--yes"
                onClick={onClickAllowAction}>
                {props.labelYES}
              </button>
            </p>
          </div>
          <div className="col-auto">
            <p className="mb-0">
              <button
                className="btn btn-danger rounded-sm confirm-dialog__btn confirm-dialog__btn--no"
                onClick={onClickCloseDialog}>
                {props.labelNO}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultLabelYES = 'Yes';
ConfirmDialog.defaultProps = {
  labelYES: defaultLabelYES,
  labelNO: 'No',
  header: 'Are you sure?',
  body: `This cannot be undone. Press ${defaultLabelYES} to confirm to do it.`,
  callback: adbk.sampleData.emptyFunc,
};

ConfirmDialog.propTypes = {
  labelYES: PropTypes.string,
  labelNO: PropTypes.string,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element.isRequired), PropTypes.string, PropTypes.element]),
  callback: PropTypes.func, // callback receives a boolean parameter from confirmation, logic is implemented in callback, this component does NOT take care or know about it
};

export default ConfirmDialog;
