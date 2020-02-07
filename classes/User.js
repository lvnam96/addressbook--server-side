const _get = require('lodash/get');
const serv = require('../services/');
const db = require('../db/');
const Account = require('./Account');
const Cbook = require('./Contactsbook');
const Clist = require('./ContactsList');

class User extends Account {
  constructor(data) {
    super(data);
    this.nicename = data.nicename || null;
    this.birth = data.birth || null;
    this.phone = data.phone || null;
    this.cbooks = data.cbooks || [];
    if (data.meta) {
      this._meta = {
        lastActivatedCbookId: _get(data, 'meta.lastActivatedCbookId', null),
        lastLogin: _get(data, 'meta.lastLogin', new Date()),
        isActive: _get(data, 'meta.isActive', true),
      };
    } else {
      this._meta = {};
    }
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of ['isActive', 'nicename', 'birth', 'phone', 'cbooks', 'meta']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toDB() {
    const json = super.toDB();
    return json;
  }

  static fromJSON(json) {
    return super.fromJSON(json);
  }

  static fromDB(data) {
    return super.fromDB(data);
  }

  get meta() {
    return this._meta;
  }

  async setDefaultCbook(cbookId) {
    return db.data.updateDefaultCbook(this.id, cbookId);
  }

  static findBy(...args) {
    return super.findBy(...args);
  }

  static signUp(...args) {
    return super.signUp(...args);
  }
}

module.exports = User;
