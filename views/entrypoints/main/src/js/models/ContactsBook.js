import _get from 'lodash/get';
import Factory from './Factory';
import ContactsList from './ContactsList';
import { isIterable } from '../helpers/checkHelper';
import { randomUUID, getRandomHexColor } from '../helpers/utilsHelper';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     contacts: iterable.isRequired,
//     id | _id: string.isRequired,
//     accId | accountid | account_id: string.isRequired,
//     name: string.isRequired,
//     color: string.isRequired,
// }

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     contacts: iterable.isRequired.jsonizable,
//     id: string.isRequired.jsonizable,
//     accId: string.isRequired.jsonizable,
//     name: string.jsonizable,
//     color: string.jsonizable,
// }

// private fields (props, methods) feature is coming with Babel 7 https://stackoverflow.com/a/52237988/5805244
class ContactsBook extends Factory {
  constructor (data) {
    super(data);
    if (data.contacts) {
      this._contactsList = data.contacts.data
        ? ContactsList.fromInstanceJSON(data.contacts)
        : ContactsList.fromJSON(data.contacts);
    }
    this._data = data;
    this._id = data.id;
    this._accId = data.accId;
    this._name = data.name || '';
    this._color = data.color || null;
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of ['id', 'accId', 'name', 'color', 'contacts']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  static fromJSON (data) {
    return super.fromJSON(data);
  }

  get contacts () {
    return _get(this, '_contactsList.data');
  }

  set contacts (contacts) {
    if (isIterable(contacts)) {
      this._contactsList = new ContactsList(contacts);
    }
  }

  get id () {
    return this._id;
  }

  set id (x) {}

  get accId () {
    return this._accId;
  }

  set accId (x) {}

  get name () {
    return this._name;
  }

  set name (x) {}

  get color () {
    return this._color;
  }

  set color (x) {}

  get isShowed () {
    return this._isShowed;
  }

  set isShowed (x) {}

  // addContact (newData) {
  //   this._contactsList = this._contactsList.add(newData);
  //   return this;
  // }

  // rmContact (id) {
  //   this._contactsList = this._contactsList.remove(id);
  //   return this;
  // }

  static fromScratch () {
    return this.fromJSON({
      id: randomUUID(),
      name: '',
      color: getRandomHexColor(),
    });
  }
}

export default ContactsBook;
