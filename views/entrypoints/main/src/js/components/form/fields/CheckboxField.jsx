import React, { memo, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _merge from 'lodash/merge';

import CheckboxInput from './CheckboxInput.jsx';
import InputFeedback from './InputFeedback.jsx';

const CheckboxField = (props) => {
  const htmlInputProps = _merge({}, props.inputProps, props);
  delete htmlInputProps.inputProps;
  delete htmlInputProps.children;
  delete htmlInputProps.msg;
  delete htmlInputProps.label;
  let labelElem;
  if (isValidElement(props.label)) {
    labelElem = props.label;
  } else if (typeof props.label === 'string') {
    labelElem = (
      <label
        title={props.title}
        className={classnames('mb-0 form__cb-label', {
          'disabled text-gray': htmlInputProps.disabled,
        })}
        htmlFor={htmlInputProps.id}
        style={{
          fontSize: props.smallLabel ? `calc(${props.size} * 0.9)` : props.size,
        }}>
        {props.label}
      </label>
    );
  }
  return (
    <div className="form-group d-flex align-items-center">
      <CheckboxInput {...htmlInputProps} className={classnames('form-control', htmlInputProps.className)} />
      {labelElem}
      {props.msg && <InputFeedback msg={props.msg} />}
      {props.children}
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
  children: PropTypes.element, // label element
  onChange: PropTypes.func,
  checked: PropTypes.bool.isRequired,
  inputProps: PropTypes.object,
};
CheckboxField.defaultProps = {
  size: '1rem',
  smallLabel: false,
};

export default memo(CheckboxField);
