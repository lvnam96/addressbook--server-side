import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner.jsx';

const AsyncLoader = ({ children, fallback }) => {
  return (
    <React.Suspense
      fallback={
        fallback || (
          <div className="flex-fill d-flex justify-content-center align-items-center h-100">
            <Spinner colorClass="text-cyan" />
          </div>
        )
      }>
      {children}
    </React.Suspense>
  );
};
AsyncLoader.propTypes = {
  children: PropTypes.element.isRequired,
  fallback: PropTypes.element,
};

export default AsyncLoader;
