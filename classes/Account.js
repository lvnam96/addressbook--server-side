const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');

// NOTE: below findBy...() methods all have same behavior:
// because db.acc.findBy...() can be false positive, means searching in database was success but found nothing (empty array of rows), therfore then()'s callback will get a falsy argument (null)
// we need to check for the truthy of the argument wherever these methods are used

class Account extends Factory {
  constructor(data) {
    super(data);
    this._id = data.id;
    // this._uname = data.uname || data.username;
    // this._passwd = data.passwd || data.password;
    // this.fbId = data.fbId || data.facebookId || data.facebookid || data.facebook_id || null;
    // this.email = data.email || null;
    this._uname = data.uname;
    this._passwd = data.passwd;
    this.fbId = data.fbId || null;
    this.email = data.email || null;
    this.createdOn = data.createdOn;
    this._salt = data.salt;
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of ['id', 'uname', 'passwd', 'fbId', 'email', 'createdOn', 'salt']) {
      // passwd & salt is needed when creating new account OR changing passwd
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toJSON() {
    const json = super.toJSON();
    delete json.passwd; // SECURITY: never send pwd to client
    delete json.salt; // SECURITY: never send pwd to client
    return json;
  }

  static fromJSON(json) {
    return super.fromJSON(json);
  }

  static fromDB(data) {
    return super.fromDB(data);
  }

  toDB() {
    const json = super.toDB();
    // passwd & salt is needed when creating new account OR changing passwd
    return json;
  }

  get id() {
    return this._id;
  }

  get uname() {
    return this._uname;
  }

  async changePasswd(newPasswd) {
    const { passwd, salt } = await serv.passwd.getSaltedPasswd(newPasswd);
    const hashedPasswd = await serv.passwd.bcrypt.hash(passwd);
    const user = await db.acc.changePasswd(this._id, hashedPasswd, salt);
    this._passwd = user.passwd;
  }

  get passwd() {
    return this._passwd;
  }

  get meta() {
    return this._meta;
  }

  get salt() {
    return this._salt;
  }

  static findBy(type, val) {
    const CurrentClass = this;
    return db.acc.findBy(type, val).then((res) => {
      return res instanceof Object ? new CurrentClass(res) : null;
    });
  }

  static async signUp(json) {
    const { passwd, salt } = await serv.passwd.getSaltedPasswd(json.passwd);
    json.passwd = await serv.passwd.bcrypt.hash(passwd);
    json.salt = salt;
    const CurrentClass = this;
    const userData = new CurrentClass(json).toDB();
    return new Promise((resolve, reject) => {
      db.acc.regAcc(userData, (err, rawUserData) => {
        if (err) reject(err);
        else resolve(rawUserData);
      });
    });
  }
}

module.exports = Account;
