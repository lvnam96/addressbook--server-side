import React from 'react';
import PropTypes from 'prop-types';

import AsyncLoader from '../AsyncLoader/AsyncLoader.jsx';
import LoadingModal from './LoadingModal.jsx';
import Modal from './Modal.jsx';

const AsyncModal = (props) => {
  const modalProps = { ...props.modalProps };
  const fallbackModalProps = { ...props.fallbackModalProps };
  return (
    <AsyncLoader fallback={<LoadingModal {...fallbackModalProps} />}>
      <Modal {...modalProps}>{props.children}</Modal>
    </AsyncLoader>
  );
};

AsyncModal.propTypes = {
  children: PropTypes.element,
  modalProps: PropTypes.object,
  fallbackModalProps: PropTypes.object,
};

export default AsyncModal;
