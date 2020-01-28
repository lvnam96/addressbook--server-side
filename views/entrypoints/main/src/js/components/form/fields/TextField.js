import React, { memo } from 'react';
import PropTypes, { number } from 'prop-types';
import classNames from 'classnames';

import TextInput from './TextInput';
import FormikErrorMessage from './FormikErrorMessage.jsx';

const TextField = (props) => {
  const inputProps = { ...props };
  delete inputProps.children;
  delete inputProps.msg;
  inputProps.className = classNames('form-control', inputProps.className);
  return (
    <div className="form-group">
      {props.children}
      <TextInput {...inputProps} />
      {/* {props.msg && <FormikErrorMessage name={props.name} />} */}
      <FormikErrorMessage name={props.name} />
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element, // label element
  msg: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'tel',
    'number',
    'date',
    'datetime-local',
    'search',
    'time',
    'url',
    'week',
  ]),
};
TextField.defaultProps = {
  type: 'text',
};

export default memo(TextField);
