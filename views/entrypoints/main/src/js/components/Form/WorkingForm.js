import React from 'react';
import PropTypes from 'prop-types';

import * as storeActions from '../../storeActions';

// import FormContainer from './containers/FormContainer';
// import EditForm from './containers/EditFormContainer';
import LoadingPopup from '../Popup/LoadingPopup';
const FormContainer = React.lazy(() => import(/* webpackPreload: true */ './containers/FormContainer'));

const WorkingForm = props => {
    const store = adbk.redux.store;
    const loadingPopupComp = (<LoadingPopup
        handleClose={props.closeForm}
        closeFuncArgs={props.contactId}
    />);
    if (props.isEditing) {
        const saveEditedContact = editedContact => {
            storeActions.asyncEditContact(editedContact).then(res => {
                if (res.isSuccess) {
                    // props.refresh();
                    props.changeContactIndex(editedContact.id, () => {
                        props.closeForm(editedContact.id);
                        storeActions.showNoti('success', `Saved.`);
                    });
                } else {
                    storeActions.notifyServerFailed(res.errMsg);
                }
            });
        };
        return (
            <React.Suspense fallback={loadingPopupComp}>
                <FormContainer
                    title="Edit Contact"
                    contact={store.getState().contacts.find(contact => contact.id === props.contactId)}
                    closeForm={props.closeForm}
                    showNoti={storeActions.showNoti}
                    handlerSubmit={saveEditedContact}
                />
            </React.Suspense>
        );
    } else {
        const addNewContact = newContact => {
            storeActions.asyncAddContact(newContact).then(res => {
                if (res.isSuccess) {
                    props.closeForm(newContact.id);
                    storeActions.showNoti('success', `New contact: "${newContact.name}" was created.`);
                } else {
                    storeActions.notifyServerFailed(res.errMsg);
                }
            });
        };
        return (
            <React.Suspense fallback={loadingPopupComp}>
                <FormContainer
                    title="Add new contact"
                    contact={adbk.classes.Contact.fromScratch()}
                    closeForm={props.closeForm}
                    showNoti={storeActions.showNoti}
                    handlerSubmit={addNewContact}
                />
            </React.Suspense>
        );
    }
};

WorkingForm.propTypes = {
    // contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
    contactId: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    closeForm: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
};

export default WorkingForm;
