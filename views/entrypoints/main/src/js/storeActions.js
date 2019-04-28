// contains general redux-bound functions used in components
const boundActions = adbk.redux.action;

export const showNoti = (type, msg) => {
    boundActions.notifications.pushNoti({
        type,
        msg,
        id: Math.random()
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
    showNoti('alert', customMsg || 'Sorry! Something is wrong on our server :(');
};
