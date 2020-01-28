import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner.jsx';

// http://reactcommunity.org/react-modal/accessibility/
ReactModal.setAppElement(document.body);

const LoadingModal = (props) => {
  const modalProps = { ...props };
  delete modalProps.children;
  return (
    <ReactModal {...modalProps}>
      <div className="flex-fill d-flex justify-content-center align-items-center h-100">
        <Spinner colorClass="text-cyan" />
      </div>
    </ReactModal>
  );
};

LoadingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOf([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default LoadingModal;
