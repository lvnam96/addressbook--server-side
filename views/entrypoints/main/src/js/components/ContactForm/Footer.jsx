import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CFormFooter = (props) => {
  return (
    <footer className="cform__footer">
      <div className="mr-auto">
        <button className="btn btn-secondary" type="reset">
          Reset
        </button>
      </div>
      <div className="mx-2">
        <button className="btn btn-primary" type="submit" disabled={props.isSubmitBtnDisabled}>
          Submit
        </button>
      </div>
      <div className="ml-2">
        <button className="btn btn-gray" type="button" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </footer>
  );
};

CFormFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  isSubmitBtnDisabled: PropTypes.bool.isRequired,
};

export default memo(CFormFooter);
