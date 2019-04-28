import React from 'react';
import PropTypes from 'prop-types';

import * as storeActions from '../../storeActions';

import FormContainer from './containers/FormContainer';
// import EditForm from './containers/EditFormContainer';

const WorkingForm = props => {
    if (props.isEditing) {
        const saveEditedContact = editedContact => {
            storeActions.asyncEditContact(editedContact).then(() => {
                // props.refresh();
                props.changeContactIndex(editedContact.id);
                props.closeForm(editedContact.id);
                storeActions.showNoti('success', `Saved.`);
            });
        };
        return (
            <FormContainer
                title="Edit Contact"
                contact={props.contact}
                closeForm={props.closeForm}
                showNoti={storeActions.showNoti}
                handlerSubmit={saveEditedContact}
            />
        );
    } else {
        const addNewContact = newContact => {
            newContact.adrsbookId = adbk.inst.adrsbook.id;
            newContact.accountId = adbk.inst.user.id;

            storeActions.asyncAddContact(newContact).then(() => {
                props.closeForm();
                storeActions.showNoti('success', `New contact: "${newContact.name}" was created.`);
            });
        };
        return (
            <FormContainer
                title="Add new contact"
                contact={props.contact}
                closeForm={props.closeForm}
                showNoti={storeActions.showNoti}
                handlerSubmit={addNewContact}
            />
        );
    }
};

WorkingForm.propTypes = {
    contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
    isEditing: PropTypes.bool.isRequired,
    closeForm: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
};

export default WorkingForm;
