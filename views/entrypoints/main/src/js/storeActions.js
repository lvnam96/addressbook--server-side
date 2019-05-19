// contains general redux-bound functions used in components
const store = adbk.redux.store;
const boundActions = adbk.redux.action;

export const showNoti = (type, msg, displayTimeDuration) => {
  boundActions.notifications.pushNoti({
    type,
    msg,
    displayTimeDuration,
    id: Math.random(),
  });
};

export const changeStateToWeek = boundActions.filterState.changeStateToWeek;

export const changeStateToMonth = boundActions.filterState.changeStateToMonth;

export const changeStateToAll = boundActions.filterState.changeStateToAll;

export const asyncReplaceAllContacts = (jsonContacts, adrsbookId = adbk.inst.adrsbook.id) => {
  return boundActions.contacts.asyncReplaceAllContacts(jsonContacts, adrsbookId);
};

export const asyncRemoveAllContacts = (adrsbookId = adbk.inst.adrsbook.id) => {
  return boundActions.contacts.asyncRemoveAllContacts(adrsbookId);
};

export const asyncRemoveMarkedContacts = boundActions.contacts.asyncRemoveMarkedContacts;
export const asyncAddContact = boundActions.contacts.asyncAddContact;
export const asyncEditContact = boundActions.contacts.asyncEditContact;
export const toggleMarkedItem = boundActions.contacts.toggleMarkedItem;

export const asyncRemoveContact = boundActions.contacts.asyncRemoveContact;

export const notifyServerFailed = (customMsg) => {
  showNoti('alert', customMsg || 'Sorry, something is wrong!');
};

export const findContact = (contactId) => {
  return store.getState().contacts.find((contact) => contact.id === contactId);
};

export const findContactIndex = (contactId) => {
  return store.getState().contacts.findIndex((contact) => contact.id === contactId);
};
