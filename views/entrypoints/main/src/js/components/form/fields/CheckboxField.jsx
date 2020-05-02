import React, { memo, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _merge from 'lodash/merge';

import CheckboxInput from './CheckboxInput.jsx';
import InputFeedback from './InputFeedback.jsx';

const CheckboxField = (props) => {
  const { inputProps, children, msg, label, smallLabel, size, ...htmlAttrs } = _merge({}, props.inputProps, props);
  let labelElem;
  if (isValidElement(label)) {
    labelElem = label;
  } else if (typeof label === 'string') {
    labelElem = (
      <label
        title={htmlAttrs.title}
        className={classnames('mb-0 form__cb-label', {
          'disabled text-gray': htmlAttrs.disabled,
        })}
        htmlFor={htmlAttrs.id}
        style={{
          fontSize: smallLabel ? `calc(${size} * 0.9)` : size,
        }}>
        {label}
      </label>
    );
  }
  return (
    <div className="form-group d-flex align-items-center">
      <CheckboxInput {...htmlAttrs} className={classnames('form-control', htmlAttrs.className)} />
      {labelElem}
      {msg && <InputFeedback msg={msg} />}
      {children}
    </div>
  );
};

// CheckboxField.contextType = ContactFormContext;

CheckboxField.propTypes = {
  smallLabel: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
  msg: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // set to a string to add default label, or an React element to override the default label
  children: PropTypes.element, // custom input feeback,...
  onChange: PropTypes.func,
  checked: PropTypes.bool.isRequired,
  inputProps: PropTypes.object,
};
CheckboxField.defaultProps = {
  size: '1rem',
  smallLabel: false,
};

export default memo(CheckboxField);
