import API from '../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

const EditContactForm = props => {
    const saveEditedContact = editedContact => {
        const curryingEditDataFunc = API.editContact.bind(API, editedContact);
        API.find(editedContact.id, curryingEditDataFunc);
        props.refresh();
        props.changeContactIndex(editedContact.id);
        props.onClose();
        props.showNoti('success', `Saved.`);
    };

    return (
        <Form title="Edit Contact"
            handlerSubmit={saveEditedContact}
            {...props} />
    );
};

EditContactForm.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    getRandomColor: PropTypes.func.isRequired
};

export default EditContactForm;
