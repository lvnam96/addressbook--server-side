import Factory from './Factory';
import Contact from './Contact';

class ContactsList extends Factory {
  constructor (rawContacts) {
    super(rawContacts);
    if (rawContacts instanceof ContactsList) {
      this._data = rawContacts.data.map((contact) => new Contact(contact)) || [];
    } else if (Array.isArray(rawContacts)) {
      this._data = rawContacts.map((contact) => new Contact(contact)) || [];
    } else {
      this._data = [];
    }
    this._isSerializable = this._isSerializable || new Set();
    for (let keyname of ['data']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toJSON () {
    const jsoned = super.toJSON();
    jsoned.data = this._data.map((contact) => contact.toJSON());
    return jsoned;
  }

  static fromJSON (json) {
    return super.fromJSON(json);
  }

  static fromInstanceJSON (jsonOfOldInstance) {
    return this.fromJSON(jsonOfOldInstance.data);
  }

  get data () {
    return this._data;
  }

  // add (newContact) {
  //   this._data.concat(new Contact(newContact));
  //   return this;
  // }

  // remove (contactId) {
  //   this._data.find((contact) => contact.id === contactId).del();
  //   return this;
  // }
}

export default ContactsList;
