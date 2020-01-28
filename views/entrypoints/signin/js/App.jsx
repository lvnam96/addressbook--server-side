import { hot } from 'react-hot-loader/root';
import React, { memo } from 'react';
import SigninFormContainer from './SigninForm/SignInFormContainer.jsx';

import '../scss/styles.scss';

const isBrowser = typeof window !== 'undefined';
const App = () => {
  let defaultUname = '';
  if (isBrowser) {
    defaultUname = window.returnedUser || new window.URL(window.location).searchParams.get('returnedUser') || '';
  }
  return <SigninFormContainer defaultUname={defaultUname} />;
};

export default hot(memo(App));
