import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './containers/FormContainer';
// import EditForm from './containers/EditFormContainer';

const WorkingForm = props => {
    if (props.isEditing) {
        const saveEditedContact = editedContact => {
            props.editContact(editedContact).then(() => {
                // props.refresh();
                props.changeContactIndex(editedContact.id);
                props.closeForm(editedContact.id);
                props.showNoti('success', `Saved.`);
            });
        };
        return (
            <FormContainer
                title="Edit Contact"
                contact={props.contact}
                closeForm={props.closeForm}
                showNoti={props.showNoti}
                handlerSubmit={saveEditedContact}
            />
        );
    } else {
        const addNewContact = newContact => {
            newContact.adrsbookId = adbk.inst.adrsbook.id;
            newContact.accountId = adbk.inst.user.id;

            props.addContact(newContact);
            props.closeForm();
            props.showNoti('success', `New contact: "${newContact.name}" was created.`);
        };
        return (
            <FormContainer
                title="Add new contact"
                contact={props.contact}
                closeForm={props.closeForm}
                showNoti={props.showNoti}
                handlerSubmit={addNewContact}
            />
        );
    }
};

WorkingForm.propTypes = {
    contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
    addContact: PropTypes.func.isRequired,
    editContact: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    closeForm: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired
};

export default WorkingForm;
