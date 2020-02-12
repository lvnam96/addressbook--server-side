import React, { memo } from 'react';
import PropTypes from 'prop-types';

import IconBtn from '../buttons/IconBtn.jsx';

const CFormHeader = (props) => {
  return (
    <header className="mb-3 cform__header">
      <div className="row justify-content-between align-items-center">
        <div className="col">
          <h3 className="font-weight-bold form-popup__title">{props.title}</h3>
        </div>
        <div className="col-auto">
          <IconBtn className="d-flex align-items-center justify-content-center" onClick={props.onClose}>
            <i className="fa fa-times" />
          </IconBtn>
        </div>
      </div>
      <div className="divider" />
    </header>
  );
};

CFormHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(CFormHeader);
