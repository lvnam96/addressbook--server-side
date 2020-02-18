// contains general redux-bound functions used in components
import { bindActionCreators } from 'redux';
import * as userActions from './actions/userActions';
import * as confirmationActions from './actions/confirmationActions';
import * as cbookActions from './actions/cbooksActions';
import * as contactsListActions from './actions/contactsListActions';
import * as filterStateActions from './actions/filterStateActions';
import * as notiListActions from './actions/notiListActions';
import store from './store';

export const user = bindActionCreators(userActions, store.dispatch);
export const confirm = bindActionCreators(confirmationActions, store.dispatch);
export const cbooks = bindActionCreators(cbookActions, store.dispatch);
export const filterState = bindActionCreators(filterStateActions, store.dispatch);
export const contacts = bindActionCreators(contactsListActions, store.dispatch);
export const notifications = bindActionCreators(notiListActions, store.dispatch);

export const findContact = (contactId) => {
  return store.getState().contacts.find((contact) => contact.id === contactId);
};

export const findContactIndex = (contactId) => {
  return store.getState().contacts.findIndex((contact) => contact.id === contactId);
};
