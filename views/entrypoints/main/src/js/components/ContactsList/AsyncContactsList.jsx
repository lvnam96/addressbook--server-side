import React from 'react';

import AsyncLoader from '../AsyncLoader/AsyncLoader.jsx';
const ContactsList = React.lazy(() => import(/* webpackPreload: true */ './ContactsList.jsx'));

const AsyncContactsList = (props) => (
  <AsyncLoader>
    <ContactsList {...props} />
  </AsyncLoader>
);

export default AsyncContactsList;
