const Factory = require('./Factory');
const ContactsList = require('./ContactsList');

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     contacts: iterable.isRequired,
//     id | _id: string.isRequired,
//     accountId | accountid | account_id: string.isRequired,
//     name: string.isRequired,
//     color: string.isRequired,
// }

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     contacts: iterable.isRequired.jsonizable,
//     id: string.isRequired.jsonizable,
//     accountId: string.isRequired.jsonizable,
//     name: string.jsonizable,
//     color: string.jsonizable,
// }

class Addressbook extends Factory {
  constructor (data) {
    super(data);
    this._contactsList = new ContactsList(data.contacts);
    this._id = data.id || data._id;
    this._accountId = data.accountId || data.accountid || data.account_id;
    this._name = data.name || null;
    this._color = data.color || null;
    this._isSerializable = this._isSerializable || new Set();
    for (let keyname of ['id', 'accountId', 'name', 'color', 'contacts']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  static fromJSON (json) {
    return super.fromJSON(json);
  }

  static fromDB (data) {
    return super.fromDB(data);
  }

  get contacts () {
    return this._contactsList;
  }

  set contacts (contacts) {
    this._contactsList = new ContactsList(contacts);
  }

  get id () {
    return this._id;
  }

  set id (x) {}

  get accountId () {
    return this._accountId;
  }

  set accountId (x) {}

  get name () {
    return this._name;
  }

  set name (newName) {
    // let server know to modify adrsbook's name
    // then set
    // this._name = newName;
  }

  get color () {
    return this._color;
  }

  set color (newColor) {
    // let server know to modify adrsbook's color
    // then set
    // this._color = newColor;
  }

  // _loadData () {
  //     axios.get('/').then().catch();
  //     return this;
  // }

  addContact (newData) {
    this._contactsList = this._contactsList.add(newData);
    return this;
  }

  rmContact (id) {
    this._contactsList = this._contactsList.remove(id);
    return this;
  }
}

module.exports = Addressbook;
