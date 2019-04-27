import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__ButtonsContainer = props => {
    const handlerClickEdit = e => {
            props.onEditContact(props.contactId);
        },
        handlerClickRemove = e => {
            props.openModalDialog({
                header: 'Delete this contact? Are you sure?'
            }, (res) => {
                if (res) {
                    props.onRemoveContact(props.contactId);
                    props.onClose();
                }
            });
        };

    return (
        <div className="contact-card__btns-container">
            <div className="contact-card__btn contact-card__close-btn" title="Close Contact Details" onClick={props.onClose}>
                <i className="contact-card__btn-ico fas fa-chevron-left"></i>
            </div>
            <div className="contact-card__btn contact-card__edit-btn" title="Edit this contact" onClick={handlerClickEdit}>
                <i className="contact-card__btn-ico fas fa-pen"></i>
            </div>
            <div className="contact-card__btn contact-card__remove-btn" title="Delete this contact" onClick={handlerClickRemove}>
                <i className="contact-card__btn-ico fas fa-user-times"></i>
            </div>
        </div>
    );
};

ContactCard__ButtonsContainer.propTypes = {
    contactId: PropTypes.string.isRequired,
    contactIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onEditContact: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    onRemoveContact: PropTypes.func.isRequired
};

export default ContactCard__ButtonsContainer;
