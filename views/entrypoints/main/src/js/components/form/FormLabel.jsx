import React from 'react';
import PropTypes from 'prop-types';

const FormLabel = (props) => {
  return (
    <label className={props.labelClass} htmlFor={props.htmlFor}>
      <span className={props.textClass}>{props.children}</span>
    </label>
  );
};

FormLabel.propTypes = {
  htmlFor: PropTypes.string,
  labelClass: PropTypes.string,
  textClass: PropTypes.string,
  children: PropTypes.string.isRequired,
};

FormLabel.defaultProps = {
  labelClass: '',
  textClass: '',
};

export default FormLabel;
