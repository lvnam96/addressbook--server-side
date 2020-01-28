import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import * as ActionTypes from './actionTypes/contactsListActionTypes';
import alo, { handleServerResponse, handleFailedRequest } from '../services/httpServices';
import ContactsList from '../classes/ContactsList';
import Contact from '../classes/Contact';

export const asyncGetContactsOfCbook = (cbookId) => (dispatch, getState) => {
  if (_isEmpty(cbookId)) {
    cbookId = _get(getState(), 'user.meta.lastActivatedCbookId');
  }
  return alo
    .get('/backdoor/contacts', {
      params: {
        cbookId,
      },
    })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        // const contacts = json.data.map((elem) => new Contact(elem));
        // OR:
        const contactsList = ContactsList.fromJSON(json.data.contacts.data);
        dispatch(replaceAllContacts(contactsList.data));
      }
      return json;
    });
};

export const addContact = (contact) => ({
  type: ActionTypes.ADD,
  contact,
});

export const asyncAddContact = (rawInfo) => (dispatch, getState) => {
  const contact = new Contact(rawInfo).toJSON();
  return alo
    .post('/backdoor/contacts/add', { contact })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        dispatch(addContact(json.data.contact));
      }
      return json;
    });
};

export const editContact = (contact) => ({
  type: ActionTypes.EDIT,
  contact,
});

export const asyncEditContact = (rawInfo) => (dispatch, getState) => {
  const contact = new Contact(rawInfo).toJSON();
  return alo
    .post('/backdoor/contacts/edit', { contact })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        dispatch(editContact(new Contact(json.data.contact)));
      }
      return json;
    });
};

export const markContact = (contact) => ({
  type: ActionTypes.MARK,
  contact,
});

export const unmarkContact = (contact) => ({
  type: ActionTypes.UNMARK,
  contact,
});

export const markAllContact = () => ({
  type: ActionTypes.MARK_ALL,
});

export const unmarkAllContact = () => ({
  type: ActionTypes.UNMARK_ALL,
});

export const toggleMarkedItem = (contact) => ({
  type: ActionTypes.TOGGLE_MARKER,
  contact,
});

export const removeContact = (id) => ({
  type: ActionTypes.REMOVE,
  id,
});

export const asyncRemoveContact = (contact) => (dispatch, getState) => {
  contact = contact instanceof Contact ? contact : new Contact(contact);
  return alo
    .post('/backdoor/contacts/delete', { contact: contact.toJSON() })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        dispatch(removeContact(contact.id));
      }
      return json;
    });
};

export const removeMarkedContacts = () => ({
  type: ActionTypes.MULTI_REMOVE,
});

export const asyncRemoveMarkedContacts = () => (dispatch, getState) => {
  const markedContacts = getState()
    .contacts.filter((contact) => contact.isMarked)
    .map((contact) => contact.toJSON());
  return alo
    .post('/backdoor/contacts/delete-multiple', { contacts: markedContacts })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        dispatch(removeMarkedContacts());
      }
      return json;
    });
};

export const removeAllContacts = () => ({
  type: ActionTypes.REMOVE_ALL,
});

export const asyncRemoveAllContacts = (cbookId) => (dispatch, getState) => {
  return alo
    .post('/backdoor/contacts/delete-all', { cbookId })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        dispatch(removeAllContacts());
      }
      return json;
    });
};

export const replaceAllContacts = (data) => ({
  type: ActionTypes.REPLACE_ALL,
  data,
});

export const asyncReplaceAllContacts = (contactsList, cbookId) => (dispatch, getState) => {
  cbookId = cbookId || _get(getState(), 'user.meta.lastActivatedCbookId');
  const contacts = contactsList.toJSON().data;
  return alo
    .post('/backdoor/contacts/replace-all', {
      contacts,
      cbookId,
    })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        const contactsList = ContactsList.fromJSON(json.data.contacts);
        dispatch(replaceAllContacts(contactsList.data));
      }
      return json;
    });
};
