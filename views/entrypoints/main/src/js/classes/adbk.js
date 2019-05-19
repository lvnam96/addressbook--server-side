// other classes
import Account from './Account';
import Adrsbook from './Addressbook';
import ContactsList from './ContactsList';
import Contact from './Contact';
import NotificationsList from './NotificationsList';
import User from './User';
import BooleanTogglers from './BooleanTogglers';
import Stack from './Stack';

// services
import axios from '../services/requestServices';

// things related to redux
import { bindActionCreators } from 'redux';
import store from '../store';
import * as contactsListActions from '../actions/contactsListActions';
import * as filterStateActions from '../actions/filterStateActions';
import * as notiListActions from '../actions/notiListActions';

class Adbk {
  constructor () {
    this.classes = {
      Account,
      Contact,
      Adrsbook,
      ContactsList,
      NotificationsList,
      User,
      BooleanTogglers,
      Stack,
    };
    this.inst = {};
    this.status = {
      _isDataLoaded: false,
    };
    this.redux = {
      store,
      action: {
        contacts: bindActionCreators(contactsListActions, store.dispatch),
        notifications: bindActionCreators(notiListActions, store.dispatch),
        filterState: bindActionCreators(filterStateActions, store.dispatch),
      },
    };

    this._setupReduxStore = this._setupReduxStore.bind(this);
  }

  _setupReduxStore () {
    if (this.status._isDataLoaded) {
      this.redux.action.contacts.replaceAllContacts(this.inst.adrsbook.contacts.data);
    }
  }

  _loadAndSetupData (cb) {
    if (!this.status._isDataLoaded) {
      axios
        .get('/backdoor/get-all-data')
        .then((res) => {
          // console.log('THE FIRST DATA LOADING TIME. DATA: ', res);
          this.inst.user = User.fromJSON(res.data.data.user);
          this.inst.adrsbook = Adrsbook.fromJSON(res.data.data.adrsbook);

          this.status._isDataLoaded = true;
        })
        .then(this._setupReduxStore.bind(this))
        .then(() => {
          cb(this);
        })
        .catch((err) => console.error(err));
    }
    return this;
  }

  init (cb) {
    this._loadAndSetupData(cb);
    return this;
  }

  get adrsbook () {
    return this.inst.adrsbook;
  }

  get contactsList () {
    return this.inst.adrsbook.contactsList;
  }

  newContact (rawContact) {
    rawContact.adrsbookId = this.inst.adrsbook.id;
    rawContact.accountId = this.inst.user.id;
    return new Contact(rawContact);
  }
}

const adbk = new Adbk();

export default adbk;
