import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

// http://reactcommunity.org/react-modal/accessibility/
ReactModal.setAppElement(document.getElementsByClassName('body-wrapper')[0]);

const Modal = (props) => {
    return (
        <ReactModal {...props}>
            {props.children}
        </ReactModal>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default Modal;
