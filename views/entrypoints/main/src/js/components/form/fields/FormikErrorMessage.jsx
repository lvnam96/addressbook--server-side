import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import InputFeedback from './InputFeedback';

const FormikErrorMessage = (props) => {
  return <ErrorMessage render={(errMsg) => <InputFeedback msg={errMsg} />} {...props} />;
};

FormikErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
};

export default memo(FormikErrorMessage);
