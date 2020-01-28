const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');
const { getStrongCryptoRandomStr } = require('../helpers/random');

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

  changePasswd(newPasswd) {
    const salt = getStrongCryptoRandomStr();
    return db.acc.changePasswd(this._id, newPasswd, salt, (err, user) => {
      if (err) {
        return console.error(err);
      }
      this._passwd = user.passwd;
    });
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

  static signIn(uname, rawPasswd, cb) {
    const CurrentClass = this;
    const flash = { errMsg: 'Wrong username/password' };
    CurrentClass.findByUname(uname)
      .then((user) => {
        if (user instanceof CurrentClass) {
          serv.passwd.isRawMatchHashedPasswd(rawPasswd + user.salt, user.passwd, (isMatched) => {
            if (!isMatched) cb(null, false, flash);
            else cb(null, user);
          });
        } else {
          cb(null, false, flash);
        }
        return user;
      })
      .catch((err) => {
        console.error(err);
        return cb(err, false, flash);
      });
  }

  static signOut() {}

  static findById(id, cb) {
    const CurrentClass = this;
    return db.acc.findById(id, (err, userDataConvertedFromDB) => {
      return err ? cb(err) : cb(null, new CurrentClass(userDataConvertedFromDB));
    });
  }

  static findByUname(uname) {
    const CurrentClass = this;
    return db.acc.findByUname(uname).then((res) => {
      return res instanceof Object ? new CurrentClass(res) : res;
    });
  }

  static findByEmail(email) {
    const CurrentClass = this;
    return db.acc.findByEmail(email).then((res) => {
      return res instanceof Object ? new CurrentClass(res) : res;
    });
  }

  static signUp(json, cb) {
    json.salt = getStrongCryptoRandomStr();
    const CurrentClass = this;
    const newUser = new CurrentClass(json);
    return db.acc.regAcc(newUser.toDB(), cb);
  }
}

module.exports = Account;
