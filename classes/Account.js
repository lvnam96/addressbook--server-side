const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');

class Account extends Factory {
  constructor (data) {
    super(data);
    this._id = data.id;
    this._uname = data.uname || data.username;
    this._passwd = data.passwd || data.password;
    this.fbId = data.fbId || data.facebookId || data.facebookid || data.facebook_id || null;
    this.email = data.email || null;
    this.lastLogin = data.last_login || data.lastLogin || Date.now();
    this.createdOn = data.created_on || data.createdOn;
    this._salt = data.salt;
    this._isSerializable = this._isSerializable || new Set();
    for (let keyname of ['id', 'uname', 'passwd', 'fbId', 'email', 'lastLogin', 'createdOn']) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toJSON () {
    const json = super.toJSON();
    delete json.passwd; // SECURITY: never send pwd to client
    return json;
  }

  static fromJSON (json) {
    return super.fromJSON(json);
  }

  static fromDB (data) {
    return super.fromDB(data);
  }

  toDB () {
    const json = super.toDB();
    json.username = json._uname;
    json.password = json._passwd;
    json.facebook_id = json.fbId;
    json.last_login = json.lastLogin;
    json.created_on = json.createdOn;
    // never allow updating these infos into database:
    // json.id = json._id;
    // json.salt = json._salt;
    return json;
  }

  get id () {
    return this._id;
  }

  set id (x) {

  }

  get uname () {
    return this._uname;
  }

  // do NOT allow to change username at the moment
  // set uname (newUname) {
  //     Account.isUnameUsed(newUname, (err, isUsed) => {
  //         if (err) {
  //             return console.error(err);
  //         }
  //         if (isUsed) {
  //             throw new Error(`Username ${newUname} exists. Please choose another one.`);
  //         } else {
  //             db.acc.changeUname(this._id, newUname, user => {
  //                 this._uname = newUname;
  //             });
  //         }
  //     });
  // }

  set passwd (newPasswd) {
    this.changePasswd(newPasswd)
      .then()
      .catch();
  }

  changePasswd (newPasswd) {
    return db.acc.changePasswd(this._id, newPasswd, (err, user) => {
      if (err) {
        return console.error(err);
      }
      this._passwd = user.passwd;
    });
  }

  get passwd () {
    return this._passwd;
  }

  get salt () {
    return this._salt;
  }

  set salt (x) {

  }

  static isUnameUsed (uname, cb) {
    return db.acc.isUnameUsed(uname, (err, bool) => {
      const errMsg = err ? 'Error occured while querying database.' : null;
      cb(errMsg, bool);
    });
  }

  static signIn (uname, rawPasswd, cb) {
    const CurrentClass = this;
    CurrentClass.findByUname(uname, cb);
  }

  static signOut () {}

  static findById (id, cb) {
    const CurrentClass = this;
    db.acc.findById(id, (err, userDataConvertedFromDB) =>
      err ? cb(err) : cb(null, new CurrentClass(userDataConvertedFromDB))
    );
  }

  static findByUname (uname, cb) {
    const CurrentClass = this;
    db.acc.findByUname(uname, (err, userDataConvertedFromDB) =>
      err ? cb(err) : cb(null, new CurrentClass(userDataConvertedFromDB))
    );
  }

  static signUp (data, cb) {
    // const CurrentClass = this;
    return db.acc.regNewAcc(data, cb);
  }
}

module.exports = Account;
