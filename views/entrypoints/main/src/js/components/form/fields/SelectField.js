import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SelectInput from './SelectInput';
import FormikErrorMessage from './FormikErrorMessage.jsx';

const SelectField = (props) => {
  const inputProps = { ...props };
  delete inputProps.children;
  delete inputProps.msg;
  inputProps.className = classNames('form-control', inputProps.className);
  return (
    <>
      {props.children}
      <SelectInput {...inputProps} />
      {/* {props.msg && <InputFeedback msg={props.msg} color="pink" />} */}
      <FormikErrorMessage name={props.name} />
    </>
  );
};

SelectField.propTypes = {
  children: PropTypes.element, // label element
  msg: PropTypes.string,
  name: PropTypes.string.isRequired,
};

SelectField.defaultProps = {
  msg: '',
};

export default memo(SelectField);
