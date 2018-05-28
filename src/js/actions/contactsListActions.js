import * as ActionTypes from './actionTypes/contactsListActionTypes';

export const addContact = data => ({
    type: ActionTypes.ADD,
    data
});

export const editContact = data => ({
    type: ActionTypes.EDIT,
    id: data.id,
    data
});

export const markContact = data => ({
    type: ActionTypes.MARK,
    id: data.id,
    data
});

export const unmarkContact = data => ({
    type: ActionTypes.UNMARK,
    id: data.id,
    data
});

export const toggleMarkedItem = data => ({
    type: ActionTypes.TOGGLE_MARKER,
    id: data.id,
    data
});

export const removeContact = id => ({
    type: ActionTypes.REMOVE,
    id
});

export const removeMarkedContacts = () => ({
    type: ActionTypes.MULTI_REMOVE
});

export const removeAllContacts = () => ({
    type: ActionTypes.REMOVE_ALL
});

export const replaceAllContacts = data => ({
    type: ActionTypes.REPLACE_ALL,
    data
});
