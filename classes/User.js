const serv = require('../services/');
const db = require('../db/');
const Account = require('./Account');
const Addressbook = require('./Addressbook');
const ContactsList = require('./ContactsList');

class User extends Account {
  constructor (data) {
    super(data);
    this._adrsbook = data.adrsbook || null;
    this.isActive = data.isActive || data.is_active || true;
    this.nicename = data.nicename || null;
    this.birth = data.birth || null;
    this.phone = data.phone || null;
    this._isSerializable = this._isSerializable || new Set();
    for (let keyname of ['isActive', 'nicename', 'birth', 'phone']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toDB () {
    const json = super.toDB();
    // json.adrsbook = json._adrsbook;// not needed
    json.is_active = json.isActive;
    return json;
  }

  static fromJSON (json) {
    return super.fromJSON(json);
  }

  static fromDB (data) {
    return super.fromDB(data);
  }

  get adrsbook () {
    return this._adrsbook;
  }

  init () {
    return this.loadData()
      .then((data) => {
        this._adrsbook = data.adrsbook;
      })
      .catch();
  }

  // loadAllContacts (cb) {// load all contacts of all adrsbook of current user
  //     return db.data.getAllContacts(this.id, cb);
  // }

  static signIn (uname, rawPasswd, cb) {
    super.signIn(uname, rawPasswd, cb);
  }

  static isUnameUsed (uname, cb) {
    super.isUnameUsed(uname, cb);
  }

  static findById (id, cb) {
    super.findById(id, cb);
  }

  static findByUname (uname, cb) {
    super.findByUname(uname, cb);
  }

  static signUp (data, cb) {
    return super.signUp(data, cb);
  }
}

module.exports = User;
