import React from 'react';
import Modal from './Modal';
import PropTypes from 'prop-types';

const ConfirmDialog = (props) => {
    const onRequestClose = () => {
        props.closeModal();
    };

    return (
        <Modal
            isOpen={props.isConfirming}
            onRequestClose={onRequestClose}
            contentLabel="Example Modal"
            style={{
                overlay: {
                    zIndex: 2
                },
                content: {}
            }}
        >
            <h3>Hello</h3>
            <h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet sit asperiores, eaque, cumque accusamus iusto. Voluptatum commodi omnis quasi repellendus voluptate ipsum molestias saepe dolorum praesentium temporibus, nulla adipisci eligendi!</h4>
            <button onClick={props.handleAfterYes}>OK</button>
            <button onClick={props.handleAfterNo}>Cancel</button>
        </Modal>
    );
};

ConfirmDialog.propTypes = {
    closeModal: PropTypes.func.isRequired,
    handleAfterYes: PropTypes.func.isRequired,
    handleAfterNo: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    isConfirming: PropTypes.bool.isRequired
};

export default ConfirmDialog;
