import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

// http://reactcommunity.org/react-modal/accessibility/
ReactModal.setAppElement(document.body);
function getModalParentElem () {
  return document.body; // default
}

const Modal = (props) => {
  const modalProps = { ...props };
  delete modalProps.children;
  return (
    <ReactModal parentSelector={getModalParentElem} {...modalProps}>
      {props.children}
    </ReactModal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
};

export default Modal;
