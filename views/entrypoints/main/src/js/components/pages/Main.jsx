import React, { memo } from 'react';

import MainNav from '../MainNav/containers/MainNavContainer.jsx';
import MainContent from '../MainContent/containers/MainContentContainer.jsx';
import adbk from '../../controllers/adbk.js';

const MainPage = () => {
  adbk.doTaskAfterDataLoaded(() => {
    if (adbk.redux.history.location.pathname === '/') {
      const cbookId = adbk.getDefaultCbookId();
      adbk.url.switchCbook(cbookId);
    }
  });

  return (
    <>
      <MainContent />
      <MainNav />
    </>
  );
};

export default memo(MainPage);
