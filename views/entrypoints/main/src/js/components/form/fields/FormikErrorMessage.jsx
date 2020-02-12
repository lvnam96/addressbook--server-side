import React, { memo, useEffect } from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import InputFeedback from './InputFeedback.jsx';

const onRender = memoize((errMsg) => <InputFeedback msg={errMsg} />); // this func has been moved outside of the component to avoid re-defining while component is being re-rendered
const FormikErrorMessage = (props) => {
  return <ErrorMessage render={onRender} {...props} />;
};

FormikErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
};

export default memo(FormikErrorMessage);
