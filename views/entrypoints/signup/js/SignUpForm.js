import React from 'react';
import PropTypes from 'prop-types';

const SignUpForm = (props) => {
    return (
        <form action="/signin" method="post" className="signin-form" onSubmit={props.onSubmit}>
            <p className={"input-wrapper" + (props.isUnameUsed === true ? ' input-wrapper--error' : '')}>
                <input type="text"
                    value={props.unameVal} onChange={props.onUnameChange} className="form-control signin-form__uname" autoComplete="username" placeholder="username"/>
            </p>
            <p className={"input-wrapper" + (props.isUnameUsed === true ? ' input-wrapper--error' : '')}>
                <input type="password" value={props.passwdVal} onChange={props.onPasswdChange} className="form-control signin-form__passwd" autoComplete="current-password" placeholder="password"/>
            </p>
            <p className="input-wrapper">
                <input type="password" value={props.cfPasswdVal} onChange={props.onCfPasswdChange} className="form-control signin-form__passwd" placeholder="confirm password"/>
            </p>
            {
                props.isSignedUp ? (
                    <div className={"border border-success text-success px-2 py-2 mb-3"}><i className="fas fa-check"></i> Signed up successfully! Redirecting to sign in...</div>
                ) : (
                    <div>
                        <div className={"border border-success text-success px-2 py-2 mb-3" + (props.isUnameUsed === false ? '' : ' d-none')}><i className="fas fa-check"></i> Great! You can use this username.</div>
                        <div className={"border border-warning text-warning px-2 py-2 mb-3" + (props.isSigningUpFailed ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Someone chose this username, please try another one.</div>
                        <div className={"border border-warning text-warning px-2 py-2 mb-3" + (props.isUnameUsed === true ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Username exists. Please choose another one.</div>
                        <div className={"border border-warning text-warning px-2 py-2 mb-3" + (props.isPasswdMatched === false ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Passwords need to be matched.</div>
                        <div className={"border border-success text-success px-2 py-2 mb-3" + (props.isPasswdMatched === true ? '' : ' d-none')}><i className="fas fa-check"></i> Passwords look good.</div>
                    </div>
                )
            }
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-12 px-0 text-right">
                        <button className="btn btn-dark rounded-0 signin-form__submit-btn" type="submit" disabled={!props.isReadyToSubmit || props.isSubmitting || props.isSignedUp ? "disabled" : ""}>
                            <span className={props.isSubmitting === true ? 'd-none' : ''}>Sign up</span>
                            <span className={props.isSubmitting === true ? '' : 'd-none'}><i className="fas fa-spinner fa-pulse"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

const stringOrNull = [
    PropTypes.bool,
    PropTypes.object
];
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
