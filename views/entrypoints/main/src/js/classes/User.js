import _get from 'lodash/get';
import Account from './Account';
import Adrsbook from './Addressbook';
import ContactsList from './ContactsList';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//   // Account's input requirement,
//   isActive: bool.isRequired,
//   nicename: string.default(null),
//   birth: string.default(null),
//   phone: string.default(null),
//   meta: object(
//     lastActivatedCbookId: string.default(null),
//     lastLogin: date.default(null),
//   ).defaut({});
// }

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     isActive: bool.jsonizable,
//     nicename: string.jsonizable,
//     birth: string.jsonizable,
//     phone: string.jsonizable,
//     lastLogin: date.jsonizable,
// }

class User extends Account {
  constructor (data) {
    super(data);
    this._data = data;
    this.nicename = data.nicename || null;
    this.birth = data.birth || null;
    this.phone = data.phone || null;
    this._meta = data.meta
      ? {
        lastActivatedCbookId: _get(data, 'meta.lastActivatedCbookId', null),
        lastLogin: _get(data, 'meta.lastLogin', new Date()),
        isActive: _get(data, 'meta.isActive', true),
      }
      : {};
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of ['isActive', 'nicename', 'birth', 'phone', 'meta']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  static fromJSON (data) {
    return super.fromJSON(data);
  }

  get meta () {
    return this._meta;
  }

  set meta (x) {}
}

export default User;
