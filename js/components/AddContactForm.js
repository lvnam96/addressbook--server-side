import API from '../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

const AddContactForm = props => {
    const addNewContact = newContact => {
        newContact.id = API.getRandomId(4);
        API.addContact(newContact);
        props.refresh();
        props.onClose();
        props.showNoti('success', `New contact: "${newContact.name}" was created.`);
    };
    return (
        <Form title="Add new contact"
            handlerSubmit={addNewContact}
            {...props} />
    );
};

AddContactForm.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    getRandomColor: PropTypes.func.isRequired
};

export default AddContactForm;
