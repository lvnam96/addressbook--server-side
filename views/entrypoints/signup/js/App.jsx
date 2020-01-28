import { hot } from 'react-hot-loader/root';
import React, { memo } from 'react';
import SignUpFormContainer from './SignUpForm/SignUpFormContainer.jsx';

import '../scss/styles.scss';

const App = () => <SignUpFormContainer />;

export default hot(memo(App));
