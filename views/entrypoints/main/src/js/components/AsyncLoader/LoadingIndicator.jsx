import React, { memo } from 'react';
import Spinner from '../Spinner/Spinner.jsx';

const LoadingIndicator = () => (
  <div className="flex-fill d-flex justify-content-center align-items-center h-100">
    <Spinner colorClass="text-cyan" />
  </div>
);

export default memo(LoadingIndicator);
