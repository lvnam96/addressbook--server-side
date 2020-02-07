import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { Form } from 'formik';

import TextField from '../../../main/src/js/components/form/fields/TextField';

const SignInForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    // handleSubmit,
    // handleReset,
    isSubmitting,
    // resetForm,
    // setFieldValue,
  } = props; // extract props from Formik
  return (
    <Form className="signin-form">
      <div>
        <TextField
          msg={touched.email && errors.email ? errors.email : ''}
          type="text"
          id="signin-form__uname-input"
          name="uname"
          value={values.uname}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-control signin-form__uname"
          autoComplete="username"
          placeholder="johndoe123">
          <label className="form__input-label" htmlFor="signin-form__uname-input">
            <span className="form__input-label__text">Username</span>
          </label>
        </TextField>
      </div>
      <div>
        <TextField
          msg={touched.passwd && errors.passwd ? errors.passwd : ''}
          id="signin-form__passwd-input"
          type="password"
          name="passwd"
          value={values.passwd}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-control signin-form__passwd"
          autoComplete="current-password"
          placeholder="v!he^pD%LUn#3w">
          <label className="form__input-label" htmlFor="signin-form__passwd-input">
            <span className="form__input-label__text">Password</span>
          </label>
        </TextField>
      </div>
      <div className="">
        {props.submitingTimes >= 1 &&
          (props.isSignedIn ? (
            <div className="border border-success text-success px-2 py-2 mb-3">
              <i className="fas fa-check" /> Signed in! Opening the app...
            </div>
          ) : (
            props.isWrongUnameOrPasswd && (
              <div className="border border-danger text-danger px-2 py-2 mb-3">
                <i className="fas fa-exclamation-circle" /> Hmm.. Wrong username and/or password.
              </div>
            )
          ))}
      </div>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 px-0 text-right">
            <button
              className="btn btn-dark rounded-pill signin-form__submit-btn"
              type="submit"
              disabled={isSubmitting || props.submitingTimes > 10 || props.isSignedIn || !_isEmpty(errors)}>
              <span className={isSubmitting === true ? 'd-none' : ''}>Sign in</span>
              <span className={isSubmitting === true ? '' : 'd-none'}>
                <i className="fas fa-spinner fa-pulse" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
};

SignInForm.propTypes = {
  values: PropTypes.shape({
    uname: PropTypes.string.isRequired,
    passwd: PropTypes.string.isRequired,
  }),
  isWrongUnameOrPasswd: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  submitingTimes: PropTypes.number.isRequired,

  touched: PropTypes.objectOf(PropTypes.bool).isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // handleReset: PropTypes.func.isRequired,
  // setFieldValue: PropTypes.func.isRequired,
};

export default memo(SignInForm);
