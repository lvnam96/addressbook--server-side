import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import * as Sentry from '@sentry/browser';

// models
import Account from '../models/Account';
import Cbook from '../models/ContactsBook';
import ContactsList from '../models/ContactsList';
import Contact from '../models/Contact';
import NotificationsList from '../models/NotificationsList';
import User from '../models/User';
import BooleanTogglers from '../models/BooleanTogglers';
import Stack from '../models/Stack';

// things related to redux
import { ReactReduxContext } from 'react-redux';
import reduxStore, { history as routerHistory } from '../redux/store';
import * as storeActions from '../redux/storeActions';

// other controllers
// import contactCtrler from './contactsController';
// import cbookCtrler from './cbookController';

// helpers
import * as ls from '../services/localStorageService';
import alo, { handleServerResponse, handleFailedRequest } from '../services/httpServices';
const isCbookExist = (cbookId, cbooks) => {
  const existedCbook = cbooks.find((cbook) => cbook.id === cbookId);
  return existedCbook instanceof Cbook;
};
const isContactExist = (contactId, contacts) => {
  const existedCbook = contacts.find((contact) => contact.id === contactId);
  return existedCbook instanceof Contact;
};

class Adbk {
  _status = {
    isDataLoaded: false,
    isDev: process.env.NODE_ENV === 'development',
  };

  get status() {
    return this._status;
  }

  classes = {
    Account,
    Contact,
    Adrsbook: Cbook,
    Cbook,
    ContactsList,
    NotificationsList,
    User,
    BooleanTogglers,
    Stack,
  };

  extAPI = {};
  alo = alo;
  inst = {};
  redux = {
    store: reduxStore,
    history: routerHistory,
    context: ReactReduxContext,
    action: storeActions,
  };

  // find a way to have namespaces for methods for better organized controller:
  // contactCtrler = contactCtrler;
  // cbookCtrler = cbookCtrler;
  sampleData = {
    emptyFunc: () => {},
    emptyArr: Object.freeze([]),
    emptyObj: Object.freeze({}),
  };

  _handleSuccessResWithDefaultFailCallback = (cb) => {
    if (typeof cb !== 'function') {
      throw new Error('_handleSuccessResWithDefaultFailCallback need to be passed a callback');
    }
    return (res) => {
      if (res.isSuccess) {
        cb();
      } else this.notifyServerFailed(res.errMsg);
    };
  };

  _reportToSentry = (errorInfo) => {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
    });
  };

  reportError = (error, errorInfo) => {
    this._reportToSentry(errorInfo || error);
    this.logErrorToConsole(error);
  };

  logErrorToConsole = (...args) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  };

  openConfirmDialog = (...args) => {
    this.redux.action.confirm.openConfirmDialog(...args);
  };

  closeConfirmDialog = (...args) => {
    this.redux.action.confirm.closeConfirmDialog(...args);
  };

  showNoti = (type, msg, displayTimeDuration) => {
    this.redux.action.notifications.pushNoti({
      type,
      msg,
      displayTimeDuration,
      id: Math.random(),
    });
  };

  notifyServerFailed = (customMsg) => {
    this.showNoti('alert', customMsg || 'Sorry, something on our server is wrong!');
  };

  _setupReduxStore = (jsonDataFromDB) => {
    if (this._status.isDataLoaded) {
      this.redux.store.dispatch((dispatch, getState) => {
        dispatch(this.redux.action.user.replaceUser(this.inst.user));
        dispatch(this.redux.action.contacts.replaceAllContacts(this.inst.contactsList.data));
        dispatch(this.redux.action.cbooks.replaceAllCbooks(this.inst.cbooks));
      });
      delete this.inst; // force all components can only use data in store, this controler does NOT store any data
    }
  };

  _loadAndSetupData = () => {
    if (this._status.isDataLoaded) {
      return Promise.resolve();
    }

    return this.alo
      .get('/backdoor/get-all-data')
      .then(handleServerResponse)
      .catch(handleFailedRequest)
      .then((res) => {
        const jsonDataFromDB = res.data.data;
        if (typeof this.inst !== 'object') this.inst = {};
        this.inst.user = User.fromJSON(jsonDataFromDB.user);
        this.inst.cbooks = jsonDataFromDB.user.cbooks.map((cbook) => Cbook.fromJSON(cbook));
        this.inst.contactsList = ContactsList.fromInstanceJSON(jsonDataFromDB.contacts);

        this._status.isDataLoaded = true;
        return jsonDataFromDB;
      })
      .then(this._setupReduxStore)
      .catch((err) => {
        if (err.response) {
          this.logErrorToConsole(err.response);
        } else this.logErrorToConsole(err);
        // throw new Error('Data fetching was failed!');
      });
  };

  init = () => {
    const locationPromise = this.alo
      .get('https://api.ipgeolocation.io/ipgeo?apiKey=881001c60ada4c4fbc82479d4de6b39d')
      .then((res) => {
        this.extAPI.geolocation = res.data;
        return res.data;
      })
      .catch((err) => {
        this.logErrorToConsole(err);
      });
    const dataPromise = this._loadAndSetupData();
    return Promise.all([locationPromise, dataPromise]);
  };

  // use this method to make sure the data is loaded before doing anything: place your tasks in callback of then() of the returned Promise
  checkDataLoaded = () => {
    return new Promise((resolve) => {
      const checkDataLoadedInterval = setInterval(() => {
        if (this._status.isDataLoaded) {
          resolve();
          clearInterval(checkDataLoadedInterval);
        }
      }, 200);
    });
  };

  getDefaultCbookId = () => {
    const reduxState = this.redux.store.getState();
    return _get(reduxState, 'user.meta.lastActivatedCbookId');
  };

  getDefaultCbook = () => {
    const reduxStore = this.redux.store;
    const reduxState = reduxStore.getState();
    const defaultCbookId = this.getDefaultCbookId();
    return reduxState.cbooks.find((cbook) => cbook.id === defaultCbookId);
  };

  setDefaultCbook = (cbookId) => {
    const reduxStore = this.redux.store;
    const reduxState = reduxStore.getState();
    if (isCbookExist(cbookId, reduxState.cbooks)) {
      const defaultCbookId = this.getDefaultCbookId();
      if (defaultCbookId !== cbookId) {
        return this.redux.action.user
          .asyncSetDefaultCbook(cbookId)
          .then(() => {
            return this.redux.action.contacts.asyncGetContactsOfCbook(cbookId);
          })
          .then(
            // this then() belongs to asyncGetContactsOfCbook promise
            this._handleSuccessResWithDefaultFailCallback(() => {
              this.showNoti('success', 'Your default Contacts Book has been changed!');
            })
          );
      }
      this.showNoti('alert', 'This Contacts Book is default already');
      return Promise.reject(new Error(`Contacts Book ${cbookId} is default already`));
    }
    // show default from client OR does nothing
    this.showNoti('alert', 'We do not recognize this Contacts Book! Please refresh the app then try again :)');
    return Promise.reject(new Error(`Contacts Book ${cbookId} does not exist`));
  };

  deleteCbook = (cbook) => {
    if (cbook instanceof adbk.classes.Cbook) {
      const defaultCbookId = this.getDefaultCbookId();
      if (cbook.id === defaultCbookId) {
        this.showNoti('alert', "I'm sorry, your default Contacts Book cannot be deleted.", 5000);
        return Promise.reject(new Error('Cannot delete default cbook'));
      }
      return this.redux.action.cbooks.asyncDeleteCbook(cbook).then(
        this._handleSuccessResWithDefaultFailCallback(() => {
          this.showNoti('success', `Contacts Book "${cbook.name}" is deleted.`);
        })
      );
    } else throw new Error('First argument is not instance of Cbook');
  };

  handleSaveCbookForm = (values) => {
    // check values.id belongs to existing cbook
    const reduxState = this.redux.store.getState();
    const newCbook = new Cbook({ ...values, accId: reduxState.user.id });
    if (isCbookExist(_get(values, 'id'), reduxState.cbooks)) {
      return this.redux.action.cbooks.asyncEditCbook(newCbook).then(
        this._handleSuccessResWithDefaultFailCallback(() => {
          this.showNoti('success', 'Updated!');
        })
      );
    } else {
      return this.redux.action.cbooks.asyncAddCbook(newCbook).then(
        this._handleSuccessResWithDefaultFailCallback(() => {
          this.showNoti('success', 'Your new Contacts Book has been created!');
        })
      );
    }
  };

  deleteContact = (contact) => {
    adbk.showNoti('chat', 'Delete? Sure...');
    return this.redux.action.contacts.asyncRemoveContact(contact).then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        this.showNoti('success', 'Deleted!');
      })
    );
  };

  deleteSelectedContacts = () => {
    return this.redux.action.contacts.asyncRemoveMarkedContacts().then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        this.showNoti('success', 'Deleted marked contacts!');
      })
    );
  };

  deleteAllContacts = () => {
    const defaultCbookId = this.getDefaultCbookId();
    return this.redux.action.contacts.asyncRemoveAllContacts(defaultCbookId).then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        this.showNoti('success', 'All your contacts are deleted.');
      })
    );
  };

  replaceAllContacts = (json) => {
    const contactsList = this.classes.ContactsList.fromJSON(json);
    return this.redux.action.contacts.asyncReplaceAllContacts(contactsList).then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        ls.save(json);
        this.redux.action.filterState.changeStateToAll();
        this.showNoti('success', 'Your data is restored successfully!');
      })
    );
  };

  addNewContact = (newContact) => {
    return this.redux.action.contacts.asyncAddContact(newContact).then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        this.showNoti('success', `Created new contact: ${newContact.name}`);
      })
    );
  };

  editContact = (contact) => {
    const reduxState = this.redux.store.getState();
    if (!isContactExist(contact.id, reduxState.contacts)) {
      return Promise.reject(new Error("This contact's ID does not exist!"));
    }
    return this.redux.action.contacts.asyncEditContact(contact).then(
      this._handleSuccessResWithDefaultFailCallback(() => {
        this.showNoti('success', `Updated contact: ${contact.name}`);
      })
    );
  };

  handleSaveContactForm = (values) => {
    const reduxState = this.redux.store.getState();
    values.cbookId = reduxState.user.meta.lastActivatedCbookId;
    values.accId = reduxState.user.id;
    values.birth instanceof Date && values.birth.setHours(12); // IMPORTANT, see https://stackoverflow.com/questions/2532729/daylight-saving-time-and-time-zone-best-practices/2532962#2532962
    if (isContactExist(_get(values, 'id'), reduxState.contacts)) {
      return this.editContact(values);
    } else {
      return this.addNewContact(values);
    }
  };

  getProfilerCallback = () => {
    let counter = 0;
    return (
      id, // the "id" prop of the Profiler tree that has just committed
      phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
      actualDuration, // time spent rendering the committed update
      baseDuration, // estimated time to render the entire subtree without memoization
      startTime, // when React began rendering this update
      commitTime, // when React committed this update
      interactions // the Set of interactions belonging to this update
    ) => {
      if (phase === 'update') {
        console.group(id);
        const diffTime = actualDuration - baseDuration;
        if (diffTime > 0) console.log('Possible time improvement: ', diffTime);
        if (interactions.size) console.log('Interactions: ', interactions);
        if (interactions.size) console.log('Amount of re-rendering times: ', counter);
        console.groupEnd();
      }
      counter += 1;
    };
  };
}

const adbk = new Adbk();

export default adbk;
