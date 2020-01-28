import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { Form } from 'formik';

import TextField from '../../../main/src/js/components/form/fields/TextField';
import CheckboxField from '../../../main/src/js/components/form/fields/CheckboxField';

const SignUpForm = (props) => {
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
    setFieldValue,
  } = props; // extract props from Formik
  const onChangeCboxEmailForUname = (e) => {
    const isChecked = !values.useEmailAsUname;
    setFieldValue('useEmailAsUname', isChecked);

    if (isChecked && values.email.length) {
      setFieldValue('uname', values.email);
    }
  };
  const onChangeEmail = (e) => {
    setFieldValue('email', e.target.value);
    if (values.useEmailAsUname) {
      setFieldValue('uname', e.target.value);
    }
  };

  return (
    <Form className="signup-form">
      <div className="input-wrapper">
        <TextField
          msg={touched.email && errors.email ? errors.email : ''}
          type="email"
          id="email-input"
          name="email"
          value={values.email}
          onChange={onChangeEmail}
          onBlur={handleBlur}
          className="form-control signup-form__uname"
          autoComplete="email"
          placeholder="abc@xyz.com">
          <label className="form__input-label" htmlFor="email-input">
            <span className="form__input-label__text">Email</span>
          </label>
        </TextField>
      </div>
      <div className="input-wrapper">
        <CheckboxField
          msg={touched.useEmailAsUname && errors.useEmailAsUname ? errors.useEmailAsUname : ''}
          smallLabel
          title="Check this to use your email as your username when logging in"
          label="Use email as username"
          onChange={onChangeCboxEmailForUname}
          inputHTMLProps={{
            id: 'cbox--email-for-uname',
            onChange: handleChange,
            name: 'useEmailAsUname',
            checked: values.useEmailAsUname,
            // disabled: _isEmpty(values.email) || !touched.email || (touched.email && !_isEmpty(errors.email)),
          }}
        />
      </div>
      <div className="input-wrapper">
        <TextField
          msg={touched.uname && errors.uname ? errors.uname : ''}
          type="text"
          id="uname-input"
          name="uname"
          value={values.uname}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={values.useEmailAsUname}
          className="form-control signup-form__uname"
          autoComplete="username"
          placeholder="johndoe123">
          <label className="form__input-label" htmlFor="uname-input">
            <span className="form__input-label__text">Username</span>
          </label>
        </TextField>
      </div>
      <div className="input-wrapper">
        <TextField
          msg={touched.passwd && errors.passwd ? errors.passwd : ''}
          type="password"
          id="passwd-input"
          name="passwd"
          value={values.passwd}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-control signup-form__passwd"
          autoComplete="current-password"
          placeholder="v!he^pD%LUn#3w">
          <label className="form__input-label" htmlFor="passwd-input">
            <span className="form__input-label__text">Password</span>
          </label>
        </TextField>
      </div>
      <div className="input-wrapper">
        <TextField
          msg={touched.cfPasswd && errors.cfPasswd ? errors.cfPasswd : ''}
          type="password"
          id="confirm-passwd-input"
          name="cfPasswd"
          value={values.cfPasswd}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-control signup-form__cnfrm-passwd"
          autoComplete="current-password"
          placeholder="v!he^pD%LUn#3w">
          <label className="form__input-label" htmlFor="confirm-passwd-input">
            <span className="form__input-label__text">Confirm Password</span>
          </label>
        </TextField>
      </div>
      <div className="">
        {props.submitingTimes >= 1 &&
          (props.isSignedUp ? (
            <div className="border border-success text-success px-2 py-2 mb-3">
              <i className="fas fa-check" /> Signed up successfully! Redirecting to sign in...
            </div>
          ) : (
            <div className="border border-warning text-warning px-2 py-2 mb-3">
              <i className="fas fa-exclamation-circle" /> Something&apos;s wrong on our server.
            </div>
          ))}
      </div>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 px-0 text-right">
            <button
              className="btn btn-dark rounded-0 signup-form__submit-btn"
              type="submit"
              disabled={isSubmitting || props.isSignedUp || !_isEmpty(errors)}>
              <span className={isSubmitting === true ? 'd-none' : ''}>Sign up</span>
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

SignUpForm.propTypes = {
  values: PropTypes.shape({
    email: PropTypes.string.isRequired,
    uname: PropTypes.string.isRequired,
    passwd: PropTypes.string.isRequired,
    cfPasswd: PropTypes.string.isRequired,
    useEmailAsUname: PropTypes.bool.isRequired,
  }).isRequired,
  isSignedUp: PropTypes.bool.isRequired,
  submitingTimes: PropTypes.number.isRequired,

  touched: PropTypes.objectOf(PropTypes.bool).isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // handleReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default memo(SignUpForm);
