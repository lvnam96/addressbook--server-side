import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { Form } from 'formik';
import memoizeOne from 'memoize-one';

import TextField from '../../../main/src/js/components/form/fields/TextField.jsx';
import CheckboxField from '../../../main/src/js/components/form/fields/CheckboxField.jsx';
import FormikErrorMessage from '../../../main/src/js/components/form/fields/FormikErrorMessage.jsx';

const inputProps = {
  email: {
    type: 'email',
    id: 'email-input',
    name: 'email',
    className: 'form-control signup-form__uname',
    autoComplete: 'email',
    placeholder: 'abc@xyz.com',
  },
  uname: {
    type: 'text',
    id: 'uname-input',
    name: 'uname',
    className: 'form-control signup-form__uname',
    autoComplete: 'username',
    placeholder: 'johndoe123',
  },
  passwd: {
    type: 'password',
    id: 'passwd-input',
    name: 'passwd',
    className: 'form-control signup-form__passwd',
    autoComplete: 'current-password',
    placeholder: 'v!he^pD%LUn#3w',
  },
  cfPasswd: {
    type: 'password',
    id: 'confirm-passwd-input',
    name: 'cfPasswd',
    className: 'form-control signup-form__cnfrm-passwd',
    autoComplete: 'current-password',
    placeholder: 'v!he^pD%LUn#3w',
  },
  useEmailAsUname: {
    id: 'cbox--email-for-uname',
    name: 'useEmailAsUname',
    // disabled: _isEmpty(values.email) || !touched.email || (touched.email && !_isEmpty(errors.email)),
  },
};
const emailLabel = (
  <label className="form__input-label" htmlFor="email-input">
    <span className="form__input-label__text">Email</span>
  </label>
);
const unameLabel = (
  <label className="form__input-label" htmlFor="uname-input">
    <span className="form__input-label__text">Username</span>
  </label>
);
const passwdLabel = (
  <label className="form__input-label" htmlFor="passwd-input">
    <span className="form__input-label__text">Password</span>
  </label>
);
const cfPasswdLabel = (
  <label className="form__input-label" htmlFor="confirm-passwd-input">
    <span className="form__input-label__text">Confirm Password</span>
  </label>
);

class SignUpForm extends Component {
  static get propTypes() {
    return {
      isSignedUp: PropTypes.bool.isRequired,
      submitingTimes: PropTypes.number.isRequired,
      // Formik's props:
      values: PropTypes.shape({
        email: PropTypes.string.isRequired,
        uname: PropTypes.string.isRequired,
        passwd: PropTypes.string.isRequired,
        cfPasswd: PropTypes.string.isRequired,
        useEmailAsUname: PropTypes.bool.isRequired,
      }).isRequired,
      touched: PropTypes.objectOf(PropTypes.bool).isRequired,
      errors: PropTypes.objectOf(PropTypes.string).isRequired,
      isSubmitting: PropTypes.bool.isRequired,
      handleChange: PropTypes.func.isRequired,
      handleBlur: PropTypes.func.isRequired,
      // handleSubmit: PropTypes.func.isRequired,
      // handleReset: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.submitingTimes !== nextProps.submitingTimes ||
      this.props.isSignedUp !== nextProps.isSignedUp ||
      this.props.isSubmitting !== nextProps.isSubmitting ||
      this.props.values !== nextProps.values ||
      this.props.touched !== nextProps.touched ||
      this.props.errors !== nextProps.errors
    ) {
      return true;
    }
    return false;
  }

  handleChangeCboxEmailForUname = (e) => {
    const isChecked = !this.props.values.useEmailAsUname;
    this.props.setFieldValue('useEmailAsUname', isChecked);

    const email = this.props.values.email;
    if (isChecked && email.length) {
      this.props.setFieldValue('uname', email);
    }
  };

  handleChangeEmail = memoizeOne((e) => {
    this.props.setFieldValue('email', e.target.value);
    if (this.props.values.useEmailAsUname) {
      this.props.setFieldValue('uname', e.target.value);
    }
  });

  render() {
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
    } = this.props; // extract props from Formik

    return (
      <Form className="signup-form">
        <div className="input-wrapper">
          <TextField
            inputProps={inputProps.email}
            value={values.email}
            onChange={this.handleChangeEmail}
            onBlur={handleBlur}
            label={emailLabel}>
            <FormikErrorMessage name="email" />
          </TextField>
        </div>
        <div className="input-wrapper">
          <CheckboxField
            smallLabel
            title="Check this to use your email as your username when logging in"
            label="Use email as username"
            onChange={this.handleChangeCboxEmailForUname}
            checked={values.useEmailAsUname}
            inputProps={inputProps.useEmailAsUname}
          />
        </div>
        <div className="input-wrapper">
          <TextField
            inputProps={inputProps.uname}
            value={values.uname}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={values.useEmailAsUname}
            label={unameLabel}>
            <FormikErrorMessage name="uname" />
          </TextField>
        </div>
        <div className="input-wrapper">
          <TextField
            inputProps={inputProps.passwd}
            value={values.passwd}
            onChange={handleChange}
            onBlur={handleBlur}
            label={passwdLabel}>
            <FormikErrorMessage name="passwd" />
          </TextField>
        </div>
        <div className="input-wrapper">
          <TextField
            inputProps={inputProps.cfPasswd}
            value={values.cfPasswd}
            onChange={handleChange}
            onBlur={handleBlur}
            label={cfPasswdLabel}>
            <FormikErrorMessage name="cfPasswd" />
          </TextField>
        </div>
        <div className="">
          {this.props.submitingTimes >= 1 &&
            (this.props.isSignedUp ? (
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
                className="btn btn-dark rounded-pill signup-form__submit-btn"
                type="submit"
                disabled={isSubmitting || this.props.isSignedUp || !_isEmpty(errors)}>
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
  }
}

export default SignUpForm;
