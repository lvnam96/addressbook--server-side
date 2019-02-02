import React from 'react';
import PropTypes from 'prop-types';

class SignInForm extends React.PureComponent {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <form action="/signin" method="post" className="signin-form" onSubmit={this.props.onSubmit}>
                <p className="input-wrapper">
                    <input type="text" value={this.props.unameVal} onChange={this.props.onUnameChange} className="form-control signin-form__uname" autoComplete="username" placeholder="username"/>
                </p>
                <p className="input-wrapper">
                    <input type="password" value={this.props.passwdVal} onChange={this.props.onPasswdChange} className="form-control signin-form__passwd" autoComplete="current-password" placeholder="password" autoFocus={this.props.unameVal ? true : false}/>
                </p>
                {
                    this.props.isSignedIn ? (
                        <div className={"border border-success text-success px-2 py-2 mb-3"}><i className="fas fa-check"></i> Signed in successfully! Redirecting...</div>
                    ) : (
                        <div>
                            <div className={"border border-danger text-danger px-2 py-2 mb-3" + (this.props.submitingTimes && this.props.isWrongUnameOrPasswd ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Please re-check your username and/or password.</div>
                            <div className={"border border-warning text-warning px-2 py-2 mb-3" + (this.props.submitingTimes && !this.props.unameVal ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Username is required.</div>
                            <div className={"border border-warning text-warning px-2 py-2 mb-3" + (this.props.submitingTimes && !this.props.passwdVal ? '' : ' d-none')}><i className="fas fa-exclamation-circle"></i> Password is required.</div>
                        </div>
                    )
                }
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12 px-0 text-right">
                            <button className="btn btn-dark rounded-0 signin-form__submit-btn" type="submit" disabled={!this.props.isReadyToSubmit || this.props.isSubmitting || this.props.submitingTimes > 10 || this.props.isSignedIn ? "disabled" : ""}>
                                <span className={this.props.isSubmitting === true ? 'd-none' : ''}>Sign in</span>
                                <span className={this.props.isSubmitting === true ? '' : 'd-none'}><i className="fas fa-spinner fa-pulse"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
const stringOrNull = [
    PropTypes.bool,
    PropTypes.object
];
SignInForm.propTypes = {
    unameVal: PropTypes.string.isRequired,
    passwdVal: PropTypes.string.isRequired,
    isWrongUnameOrPasswd: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.oneOfType(stringOrNull),
    isReadyToSubmit: PropTypes.bool.isRequired,
    submitingTimes: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
