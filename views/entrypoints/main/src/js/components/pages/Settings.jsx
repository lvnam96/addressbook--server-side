import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  return (
    <>
      <h2>Settings page</h2>
      {/* <Link to={{ pathname: '/cc360855-4cfa-40e6-94e3-dc3531c8386f/', search: '?show=births-in-week' }}>Main app</Link> */}
      <Link to={{ pathname: '/', search: '?show=births-in-week' }}>Main app</Link>
    </>
  );
};

export default SettingsPage;
