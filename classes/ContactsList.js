const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');
const Contact = require('./Contact');

class ContactsList extends Factory {
  constructor (contactsList) {
    super(contactsList);
    this._data =
      Array.isArray(contactsList) && contactsList.length > 0 ? contactsList.map((contact) => new Contact(contact)) : [];
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of ['data']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toJSON () {
    const json = super.toJSON();
    json.data = this._data.map((contact) => contact.toJSON());
    return json;
  }

  toDB () {
    return this.toJSON();
  }

  static fromJSON (json) {
    // json: instance of ContactsList
    return super.fromJSON(json.data);
  }

  static fromDB (data) {
    // data: array of contacts data from db
    if (Array.isArray(data)) {
      const preparedData = data.map((contactData) => Contact.fromDB(contactData));
      return super.fromDB(preparedData);
    } else throw new Error('Data passed to ContactsList.fromDB() is not an array');
  }

  get data () {
    return this._data;
  }

  isEmpty () {
    return Array.isArray(this._data) && this._data.length > 0;
  }

  find (contactId) {
    return this.isEmpty() ? this._data.find((elem, idx) => elem.id === contactId) : undefined;
  }

  delContact (contactId) {
    return this.isEmpty() ? this.find(contactId).del() : undefined;
  }

  delMultiContact (contacts) {
    if (this.isEmpty()) {
      const err = new Error('Contacts list is empty! Cannot delete contacts.');
      console.error(err);
      return Promise.reject(err);
    } else {
      const accId = contacts[0].accId;
      const cbookId = contacts[0].cbookId;
      const contactIds = contacts.map((contact) => contact.id);
      return db.data
        .removeMultiContacts(accId, cbookId, contactIds)
        .then((rows) => {
          return rows.map((rawData) => Contact.fromJSON(rawData));
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  }

  static delMultiContact (contacts) {
    const accId = contacts[0].accId;
    const cbookId = contacts[0].cbookId;
    const contactIds = contacts.map((contact) => contact.id);
    return db.data
      .removeMultiContacts(accId, cbookId, contactIds)
      .then((rows) => {
        return rows.map((rawData) => Contact.fromJSON(rawData));
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  delAllContact () {
    if (this.isEmpty()) {
      const err = new Error('Contacts list is empty! Cannot delete contacts.');
      console.error(err);
      return Promise.reject(err);
    } else {
      const accId = this._data[0].accId;
      const cbookId = this._data[0].cbookId;
      return ContactsList.delAllContact(accId, cbookId);
    }
  }

  // static delAllContact (accId, cbookId) {
  //   return Contact.deleteAll(accId, cbookId);
  // }

  // editContact (contact) {
  //   return this.find(contact.id).update(contact);
  // }

  // addContact (contactJson) {
  //   const newContact = new Contact(contactJson);
  //   return db.data
  //     .addContact(newContact.toDB())
  //     .then((contactRawData) => {
  //       const contact = Contact.fromDB(contactRawData);
  //       this._data = [...this._data, contact];
  //       return contact;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       throw err;
  //     });
  // }
}

module.exports = ContactsList;
