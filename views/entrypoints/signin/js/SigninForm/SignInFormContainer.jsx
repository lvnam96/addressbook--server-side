import React from 'react';
import PropTypes from 'prop-types';
import SHA from 'jssha';
// import debounce from 'lodash/debounce';
// import Timeout from '../../../../core/js/models/Timeout';
import _isEmpty from 'lodash/isEmpty';
import { withFormik } from 'formik';
import getSigninFormSchema from './schemas/signinForm';
import { yup as yupHelper } from '../../../main/src/js/helpers/packageHelper';
import { formatUname } from '../../../../core/js/helpers/format';

import SignInForm from './SignInForm.jsx';

const isBrowser = typeof window !== 'undefined';

const WrappedForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ values }) => ({ ...values }),
  // validationSchema: getSigninFormSchema({}), // not used this b/c of using custom schema based on current values
  validate: async (values, props) => {
    // returned value from this method will be props.errors in child element
    const copyVal = {
      ...values,
      uname: formatUname(values.uname),
    };
    const signupSchema = getSigninFormSchema(copyVal, props.checkEmailUsed, props.checkUnameUsed);

    return yupHelper
      .validate(signupSchema, copyVal)
      .then((copyVal) => ({}))
      .catch((err) => {
        // eslint-disable-next-line no-console
        if (core.status.isDev) console.error('Error in form validation!', err);
        return yupHelper.getErrorsFromValidationError(err);
      });
  },
  handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const copyVal = {
      ...values,
      uname: formatUname(values.uname),
    };
    const signupSchema = getSigninFormSchema(copyVal);

    let err;
    try {
      // signupSchema.validateSync(copyVal, { abortEarly: false });
      yupHelper
        .validate(signupSchema, copyVal)
        .then((copyVal) => ({}))
        .catch((err) => {
          // eslint-disable-next-line no-console
          if (core.status.isDev) console.error('Error in form validation!', err);
          return yupHelper.getErrorsFromValidationError(err);
        });
      err = {};
    } catch (e) {
      err = e;
    }

    if (!_isEmpty(err) && err.name === 'ValidationError') {
      setErrors(err);
    } else {
      return props.onSubmit(copyVal).then(() => {
        setSubmitting(false);
        resetForm();
        return null;
      });
    }
  },
})(SignInForm);

class SignInFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWrongUnameOrPasswd: false,
      isSignedIn: false,
    };
    this.submitingTimes = 0; // for feature: limit the submitting times, write this number to permanent storage (cookie?, localStorage?)
  }

  static get propTypes() {
    return {
      defaultUname: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      defaultUname: '',
    };
  }

  handleSubmit = (values) => {
    const sha512Hash = new SHA('SHA-512', 'TEXT');
    sha512Hash.update(values.passwd);
    const sha512HashedPasswd = sha512Hash.getHash('HEX');
    this.submitingTimes = this.submitingTimes + 1;
    return core
      .postRequest('/signin', {
        // core.alo.get('http://localhost:2004/signin')
        uname: values.uname,
        passwd: sha512HashedPasswd,
      })
      .then((res) => {
        if (res.isSuccess) {
          this.setState({ isSignedIn: true }, () => {
            const t = setTimeout(() => {
              clearTimeout(t);
              if (isBrowser) window.location = '/';
            }, 500);
          });
        } else {
          this.setState({ isWrongUnameOrPasswd: true });
        }
        return res;
      })
      .catch((err) => {
        if (isBrowser) window.alert('Sorry, something is wrong on our server.');
        throw err;
      });
  };

  render() {
    const { isWrongUnameOrPasswd, isSignedIn } = this.state;
    return (
      <WrappedForm
        values={{
          uname: this.props.defaultUname,
          passwd: '',
        }}
        isWrongUnameOrPasswd={isWrongUnameOrPasswd}
        isSignedIn={isSignedIn}
        submitingTimes={this.submitingTimes}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default SignInFormContainer;
