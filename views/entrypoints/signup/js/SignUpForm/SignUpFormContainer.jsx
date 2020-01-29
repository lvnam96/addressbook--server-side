import React from 'react';
import SHA from 'jssha/src/sha512';
import _debounce from 'lodash/debounce'; // used for queries (should be used for production)
import memoize from 'memoize-one';
// import Timeout from '../../../../core/js/models/Timeout'; // used for not important tasks: check passwords match (implemented from scratch, used for fun)
import _isEmpty from 'lodash/isEmpty';
import { withFormik } from 'formik';
import getSignupFormSchema from './schemas/signupForm';
import { yup as yupHelper } from '../../../main/src/js/helpers/packageHelper';
import { formatUname } from '../../../../core/js/helpers/format';

import SignUpForm from './SignUpForm.jsx';

const isBrowser = typeof window !== 'undefined';

// basic implementation from Underscore.js
// Used for checking uname available
// checkPasswdMatch is using debounce-way manually
// function debounce(func, wait, immediate) {
//     var timeout;
//     return function() {
//         var args = arguments;
//         var later = () => {
//             timeout = null;
//             if (!immediate) func.apply(this, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(this, args);
//     };
// };

const WrappedForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ values }) => {
    return {
      ...values,
      email: values.emailVal,
      uname: values.useEmailAsUname ? values.emailVal : values.unameVal,
      passwd: values.passwdVal,
      cfPasswd: values.cfPasswdVal,
    };
  },
  // validationSchema: getSignupFormSchema({}), // not used this b/c of using custom schema based on current values
  validate: async (values, props) => {
    // returned value from this method will be props.errors in child element
    const copyVal = { ...values };
    const signupSchema = getSignupFormSchema(copyVal, props.checkEmailUsed, props.checkUnameUsed);

    copyVal.name = formatUname(copyVal.name);
    return yupHelper
      .validate(signupSchema, copyVal)
      .then((copyVal) => ({}))
      .catch((err) => {
        console.error('Error in form validation!', err);
        return yupHelper.getErrorsFromValidationError(err);
      });
  },
  handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const copyVal = { ...values };
    const signupSchema = getSignupFormSchema(copyVal, props.checkEmailUsed, props.checkUnameUsed);
    let err;
    try {
      signupSchema.validateSync(copyVal, { abortEarly: false });
      err = {};
    } catch (e) {
      err = e;
    }

    if (!_isEmpty(err)) {
      setErrors(err);
    } else {
      return props.onSubmit(copyVal).then(() => {
        setSubmitting(false);
        resetForm();
        // props.handleClose();
        return null;
      });
    }
  },
})(SignUpForm);

class SignUpFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedUp: false,
    };
    this.submitingTimes = 0;
  }

  // shouldComponentUpdate () {}
  // componentDidUpdate (prevProps, prevState, snapshot) {}

  _requestEmailUsed = (email) => {
    return core.alo.get('/backdoor/is-email-used', {
      params: { email },
    });
  };

  checkEmailUsedDebounced = _debounce(
    memoize(async (email) => {
      try {
        const json = await this._requestEmailUsed(email);
        this.setState({ isEmailUsed: json.data.res });
        return json.data.res;
      } catch (e) {
        console.error(e); // CREATE UI FOR ERROR, SUCCESS,...
      }
    }),
    1000
  );

  _requestUnameUsed = (uname) => {
    return core.alo.get('/backdoor/is-uname-used', {
      params: { uname },
    });
  };

  checkUnameUsedDebounced = _debounce(
    memoize(async (uname) => {
      // async/await version:
      try {
        const json = await this._requestUnameUsed(uname);
        this.setState({ isUnameUsed: json.data.res });
        return json.data.res;
      } catch (e) {
        console.error(e); // CREATE UI FOR ERROR, SUCCESS,...
      }
    }),
    1000
  );

  handleSubmit = (values) => {
    const sha512Hash = new SHA('SHA-512', 'TEXT');
    sha512Hash.update(values.passwd);
    const sha512HashedPasswd = sha512Hash.getHash('HEX');
    this.submitingTimes = this.submitingTimes + 1;
    return core
      .postRequest('/signup', {
        // core.alo.get('http://localhost:2004/signup')
        email: values.email,
        uname: values.uname,
        passwd: sha512HashedPasswd,
      })
      .then((res) => {
        if (res.isSuccess) {
          this.setState({ isSignedUp: true }, () => {
            const t = setTimeout(() => {
              clearTimeout(t); // could be removed because this page will be redirected anyway
              if (isBrowser) {
                window.location = res.data.redirectLocation;
              }
            }, 500);
          });
        } else {
          this.setState({ isSignedUp: false });
        }
        return res;
      })
      .catch((err) => {
        if (isBrowser) window.alert('Sorry, something is wrong on our server.');
        throw err;
      });
  };

  render() {
    const { isSignedUp } = this.state;
    // this.submitingTimes
    return (
      <WrappedForm
        values={{
          emailVal: '',
          unameVal: '',
          passwdVal: '',
          cfPasswdVal: '',
          useEmailAsUname: false,
        }}
        isSignedUp={isSignedUp}
        submitingTimes={this.submitingTimes}
        onSubmit={this.handleSubmit}
        checkEmailUsed={this.checkEmailUsedDebounced}
        checkUnameUsed={this.checkUnameUsedDebounced}
      />
    );
  }
}

export default SignUpFormContainer;
