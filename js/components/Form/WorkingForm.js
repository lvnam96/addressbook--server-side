import API from '../../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRandomStr as getRandomId } from '../../helpers/utilsHelper';

import FormContainer from './containers/FormContainer';

const WorkingForm = props => {
    if (props.isEditing) {
        const saveEditedContact = editedContact => {
            const curryingEditDataFunc = API.editContact.bind(API, editedContact);
            API.find(editedContact.id, curryingEditDataFunc);
            props.refresh();
            props.changeContactIndex(editedContact.id);
            props.onClose();
            props.showNoti('success', `Saved.`);
        };
        return (
            <FormContainer title="Edit Contact"
                {...props.editingContact}
                onClose={props.onClose}
                showNoti={props.showNoti}
                handlerSubmit={saveEditedContact}
                refresh={props.refresh}
                changeContactIndex={props.changeContactIndex} />
        );
    } else {
        const addNewContact = newContact => {
            newContact.id = getRandomId(4);
            API.addContact(newContact);
            props.refresh();
            props.onClose();
            props.showNoti('success', `New contact: "${newContact.name}" was created.`);
        };
        return (
            <FormContainer title="Add new contact"
                {...props.newContact}
                onClose={props.onClose}
                showNoti={props.showNoti}
                refresh={props.refresh}
                handlerSubmit={addNewContact} />
        );
    }
};

WorkingForm.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    newContact: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired
};

export default WorkingForm;
