import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__ButtonsContainer = props => (
    <div className="contact-card__buttons">
        <div className="contact-card__buttons__close" title="Close Contact Details" onClick={props.onClose}>
            <i className="fa fa-arrow-left"></i>
        </div>
        <div className="contact-card__buttons__edit" title="Edit this contact" onClick={props.onEditContact}>
            <i className="fa fa-pencil"></i>
        </div>
        <div className="contact-card__buttons__remove" title="Delete this contact" onClick={props.onRemoveContact}>
            <i className="fa fa-user-times"></i>
        </div>
    </div>
);

ContactCard__ButtonsContainer.propTypes = {
    onClose: PropTypes.func.isRequired,
    onEditContact: PropTypes.func.isRequired,
    onRemoveContact: PropTypes.func.isRequired
};

export default ContactCard__ButtonsContainer;
