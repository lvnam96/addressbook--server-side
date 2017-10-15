import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__ButtonsContainer = props => {
    const handlerClickEdit = e => {
            props.onEditContact(props.contactId);
        },
        handlerClickRemove = e => {
            if (confirm('Delete this contact? Are you sure?')) {
                props.onRemoveContact(props.contactId);
                props.onClose();
            }
    };
    return (
        <div className="contact-card__buttons">
            <div className="contact-card__buttons__close" title="Close Contact Details" onClick={props.onClose}>
                <i className="fa fa-arrow-left"></i>
            </div>
            <div className="contact-card__buttons__edit" title="Edit this contact" onClick={handlerClickEdit}>
                <i className="fa fa-pencil"></i>
            </div>
            <div className="contact-card__buttons__remove" title="Delete this contact" onClick={handlerClickRemove}>
                <i className="fa fa-user-times"></i>
            </div>
        </div>
    );
};

ContactCard__ButtonsContainer.propTypes = {
    contactId: PropTypes.string.isRequired,
    contactIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onEditContact: PropTypes.func.isRequired,
    onRemoveContact: PropTypes.func.isRequired
};

export default ContactCard__ButtonsContainer;
