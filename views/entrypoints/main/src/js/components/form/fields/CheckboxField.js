import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CheckboxInput from './CheckboxInput';
import FormikErrorMessage from './FormikErrorMessage.jsx';

const CheckboxField = (props) => {
  props.inputHTMLProps.className = classnames('form-control', props.inputHTMLProps.className);
  return (
    <div className="form-group d-flex align-items-center">
      <CheckboxInput {...props.inputHTMLProps} onChange={props.onChange} size={props.size} title={props.title} />
      {props.children ? (
        props.children
      ) : (
        <label
          title={props.title}
          className={classnames('mb-0 form__cb-label', {
            'disabled text-gray': props.inputHTMLProps.disabled,
          })}
          htmlFor={props.inputHTMLProps.id}
          style={{
            fontSize: props.smallLabel ? `calc(${props.size} * 0.9)` : props.size,
          }}>
          {props.label}
        </label>
      )}
      {/* {props.msg && <InputFeedback msg={props.msg} color="pink" />} */}
      <FormikErrorMessage name={props.inputHTMLProps.name} />
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
  label: PropTypes.string,
  children: PropTypes.element, // label element
  onChange: PropTypes.func,
  inputHTMLProps: PropTypes.shape({
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    ref: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
  }),
};
CheckboxField.defaultProps = {
  size: '1rem',
  smallLabel: false,
};

export default CheckboxField;
