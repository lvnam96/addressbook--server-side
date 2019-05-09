import * as ActionTypes from './actionTypes/contactsListActionTypes';
import axios, { handleServerResponse, handleFailedRequest } from '../services/requestServices';
import ContactsList from '../classes/ContactsList';
import Contact from '../classes/Contact';

export const asyncGetAllContacts = () => (dispatch, getState) => {
    return axios.get('/backdoor/contacts')
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                // const contacts = json.data.map((elem) => new Contact(elem));
                // OR:
                const contactsList = ContactsList.fromJSON(json.data.contacts);
                dispatch(replaceAllContacts(contactsList.data));
            }
            return json;
        }).catch(handleFailedRequest);
};

export const addContact = (contact) => ({
    type: ActionTypes.ADD,
    contact
});

export const asyncAddContact = (rawInfo) => (dispatch, getState) => {
    const contact = new Contact(rawInfo).toJSON();
    // return axios.get('/backdoor/addContact')
    return axios.post('/backdoor/contacts/add', { contact })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                dispatch(addContact(json.data.contact));
            }
            return json;
        }).catch(handleFailedRequest);
};

export const editContact = (contact) => ({
    type: ActionTypes.EDIT,
    contact
});

export const asyncEditContact = (rawInfo) => (dispatch, getState) => {
    const contact = new Contact(rawInfo).toJSON();
    // return axios.get('/backdoor/editContact')
    return axios.post('/backdoor/contacts/edit', { contact })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                dispatch(editContact(new Contact(json.data.contact)));
            }
            return json;
        }).catch(handleFailedRequest);
};

export const markContact = (contact) => ({
    type: ActionTypes.MARK,
    contact
});

export const unmarkContact = (contact) => ({
    type: ActionTypes.UNMARK,
    contact
});

export const toggleMarkedItem = (contact) => ({
    type: ActionTypes.TOGGLE_MARKER,
    contact
});

export const removeContact = (id) => ({
    type: ActionTypes.REMOVE,
    id
});

export const asyncRemoveContact = (contact) => (dispatch, getState) => {
    // return axios.get('/backdoor/removeContact')
    return axios.post('/backdoor/contacts/delete', { contact: contact.toJSON() })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                dispatch(removeContact(contact.id));
            }
            return json;
        }).catch(handleFailedRequest);
};

export const removeMarkedContacts = () => ({
    type: ActionTypes.MULTI_REMOVE
});

export const asyncRemoveMarkedContacts = () => (dispatch, getState) => {
    const markedContacts = getState().contacts.filter((contact) => contact.isMarked).map(contact => contact.toJSON());
    // return axios.get('/backdoor/removeMultipleContacts')
    return axios.post('/backdoor/contacts/delete-multiple', { contacts: markedContacts })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                dispatch(removeMarkedContacts());
            }
            return json;
        }).catch(handleFailedRequest);
};

export const removeAllContacts = () => ({
    type: ActionTypes.REMOVE_ALL
});

export const asyncRemoveAllContacts = (adrsbookId) => (dispatch, getState) => {
    // return axios.get('/backdoor/removeAllContacts')
    return axios.post('/backdoor/contacts/delete-all', { adrsbookId })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                dispatch(removeAllContacts());
            }
            return json;
        }).catch(handleFailedRequest);
};

export const replaceAllContacts = (data) => ({
    type: ActionTypes.REPLACE_ALL,
    data
});

export const asyncReplaceAllContacts = (jsonContacts, adrsbookId) => (dispatch, getState) => {
    // return axios.get('/backdoor/replaceAllContacts')
    const contacts = jsonContacts.map(json => Contact.fromJSON(json).toJSON());
    return axios.post('/backdoor/contacts/replace-all', {
        contacts,
        adrsbookId
    })
        .then(handleServerResponse)
        .then(json => {
            if (json.data.res) {
                // const contacts = json.data.map((elem) => new Contact(elem));
                // OR:
                const contactsList = ContactsList.fromJSON(json.data.contacts);
                dispatch(replaceAllContacts(contactsList.data));
            }
            return json;
        }).catch(handleFailedRequest);
};
