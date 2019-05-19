import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextField from '../../main/src/js/components/Form/fields/TextField';

const SignUpForm = (props) => {
  return (
    <form action="/signin" method="post" className="signin-form" onSubmit={props.onSubmit}>
      <p
        className={classNames('input-wrapper', {
          'input-wrapper--error': props.isUnameUsed === true,
        })}>
        <TextField
          type="text"
          id="uname-input"
          autoFocus
          value={props.unameVal}
          handlerChangeInput={props.onUnameChange}
          className="form-control signup-form__uname"
          autoComplete="username"
          placeholder="johndoe123">
          <label className="form__input-label" htmlFor="uname-input">
            <span className="form__input-label__text">Username</span>
          </label>
        </TextField>
      </p>
      <p className="input-wrapper">
        <TextField
          type="password"
          id="passwd-input"
          value={props.passwdVal}
          handlerChangeInput={props.onPasswdChange}
          className="form-control signup-form__passwd"
          autoComplete="current-password"
          placeholder="v!he^pD%LUn#3w">
          <label className="form__input-label" htmlFor="passwd-input">
            <span className="form__input-label__text">Password</span>
          </label>
        </TextField>
      </p>
      <p className="input-wrapper">
        <TextField
          type="password"
          id="confirm-passwd-input"
          value={props.cfPasswdVal}
          handlerChangeInput={props.onCfPasswdChange}
          className="form-control signup-form__cnfrm-passwd"
          autoComplete="current-password"
          placeholder="v!he^pD%LUn#3w">
          <label className="form__input-label" htmlFor="confirm-passwd-input">
            <span className="form__input-label__text">Confirm Password</span>
          </label>
        </TextField>
      </p>
      {props.isSignedUp ? (
        <div className={'border border-success text-success px-2 py-2 mb-3'}>
          <i className="fas fa-check" /> Signed up successfully! Redirecting to sign in...
        </div>
      ) : (
        <div>
          <div
            className={
              'border border-success text-success px-2 py-2 mb-3' + (props.isUnameUsed === false ? '' : ' d-none')
            }>
            <i className="fas fa-check" /> Great! You can use this username.
          </div>
          <div
            className={
              'border border-warning text-warning px-2 py-2 mb-3' + (props.isSigningUpFailed ? '' : ' d-none')
            }>
            <i className="fas fa-exclamation-circle" /> Someone chose this username, please try another one.
          </div>
          <div
            className={
              'border border-warning text-warning px-2 py-2 mb-3' + (props.isUnameUsed === true ? '' : ' d-none')
            }>
            <i className="fas fa-exclamation-circle" /> Username exists. Please choose another one.
          </div>
          <div
            className={
              'border border-warning text-warning px-2 py-2 mb-3' + (props.isPasswdMatched === false ? '' : ' d-none')
            }>
            <i className="fas fa-exclamation-circle" /> Passwords need to be matched.
          </div>
          <div
            className={
              'border border-success text-success px-2 py-2 mb-3' + (props.isPasswdMatched === true ? '' : ' d-none')
            }>
            <i className="fas fa-check" /> Passwords look good.
          </div>
        </div>
      )}
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 px-0 text-right">
            <button
              className="btn btn-dark rounded-0 signin-form__submit-btn"
              type="submit"
              disabled={!props.isReadyToSubmit || props.isSubmitting || props.isSignedUp ? 'disabled' : ''}>
              <span className={props.isSubmitting === true ? 'd-none' : ''}>Sign up</span>
              <span className={props.isSubmitting === true ? '' : 'd-none'}>
                <i className="fas fa-spinner fa-pulse" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const stringOrNull = [PropTypes.bool, PropTypes.object];
SignUpForm.propTypes = {
  unameVal: PropTypes.string.isRequired,
  passwdVal: PropTypes.string.isRequired,
  cfPasswdVal: PropTypes.string.isRequired,
  isUnameUsed: PropTypes.oneOfType(stringOrNull),
  isPasswdMatched: PropTypes.oneOfType(stringOrNull),
  onUnameChange: PropTypes.func.isRequired,
  onPasswdChange: PropTypes.func.isRequired,
  onCfPasswdChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.oneOfType(stringOrNull),
  isReadyToSubmit: PropTypes.bool.isRequired,
  isSignedUp: PropTypes.bool.isRequired,
  isSigningUpFailed: PropTypes.bool.isRequired,
};

export default SignUpForm;
