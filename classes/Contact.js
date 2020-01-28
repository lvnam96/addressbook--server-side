const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');
const { isIterable } = require('../helpers/');

// only for class on server:
// Contact.fromDB() & this.toDB()

class Contact extends Factory {
  constructor (rawData) {
    super(rawData);
    if (!Array.isArray(rawData.labels)) {
      // prepare for bugs with labels
    }
    this._id = rawData.id;
    this.cbookId = rawData.cbookId || null;
    this.accId = rawData.accId || null;
    this.name = rawData.name || null;
    this._labels = new Set(rawData.labels); // if rawData.labels is null OR undefined, this Set will be empty
    this.birth = rawData.birth ? new Date(Date.parse(rawData.birth)) : null;
    this.note = rawData.note || null;
    this.email = rawData.email || null;
    this.website = rawData.website || null;
    this.phone = rawData.phone || null;
    this.color = rawData.color || null;
    this.avatarURL = rawData.avatarURL || null;
    for (const keyname of [
      'id',
      'cbookId',
      'accId',
      'name',
      'labels',
      'birth',
      'note',
      'email',
      'website',
      'phone',
      'color',
      'avatarURL',
    ]) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  static fromJSON (json) {
    return super.fromJSON(json);
  }

  toJSON () {
    const birth = this.birth;
    const json = super.toJSON();
    json.birth = birth;
    return json;
  }

  toDB () {
    try {
      const jsoned = this.toJSON();
      jsoned.labels = JSON.stringify(jsoned.labels);
      jsoned.phone = JSON.stringify(jsoned.phone);
      // may not need this because queries can be formatted
      // jsoned.cbook_id = jsoned.cbookId;
      // jsoned.acc_id = jsoned.accId;
      // jsoned.avatar_url = jsoned.avatarURL;
      return jsoned;
    } catch (err) {
      console.error(err);
    }
  }

  static fromDB (data) {
    if (typeof data === 'undefined') throw new Error('Argument data is required!');
    data.cbookId = data.cbookId || data.cbook_id;
    data.accId = data.accId || data.acc_id;
    data.labels = typeof data.labels === 'string' ? JSON.parse(data.labels) : data.labels;
    data.phone = typeof data.phone === 'string' ? JSON.parse(data.phone) : data.phone;
    return super.fromDB(data);
  }

  get id () {
    return this._id;
  }

  set id (x) {}

  get labels () {
    return Array.from(this._labels);
  }

  set labels (labels) {
    if (isIterable(labels) && typeof labels !== 'string') {
      this._labels = new Set(labels);
    } else {
      throw new Error('labels is not iterable or is a string');
    }
  }

  selfDelete () {
    // delete this contact in db
    // return promise
    return db.data
      .removeContact(this.toDB())
      .then((contactRawData) => Contact.fromDB(contactRawData))
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  update (data) {
    // update some props, not all: (is there any use case for this??? if not, just use static update method)
    // this.name = 'abc';
    // then update this inst into db:
    // return db.data.editContact(this.toDB()).then().catch();
  }

  static update (json) {
    const contact = Contact.fromJSON(json);
    return db.data
      .editContact(contact.toDB())
      .then((contactRawData) => Contact.fromDB(contactRawData))
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  static create (json) {
    const newContact = new Contact(json);
    return db.data
      .addContact(newContact.toDB())
      .then((contactRawData) => Contact.fromDB(contactRawData))
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  static read (json) {
    return Contact.fromDB(json);
  }

  static async delete (accId, ids) {
    return db.data
      .removeMultiContacts(accId, ids)
      .then((rows) => {
        return rows.map((rawData) => Contact.fromDB(rawData));
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  static deleteAll (accId, cbookId) {
    return db.data
      .removeAllContacts(accId, cbookId)
      .then((rows) => {
        return rows.map((rawData) => Contact.fromDB(rawData));
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }
}

module.exports = Contact;
