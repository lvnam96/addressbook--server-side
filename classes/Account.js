const User = require('./User');
const serv = require('../services/');
const db = require('../db/');
const { pool } = db.poolInitiator;
const randomStr = 0;

class Account {
    constructor (data) {
        this._id = data.id;
        this._uname = data.uname;
        this._passwd = data.passwd;
        this.fbid = data.fbid;
        this.email = data.email;
        this.last_login = data.last_login;
        this.created_on = data.created_on;
        this._salt = data.salt;
    }

    get id () {
        return this._id;
    }

    set id (x) { return; }

    get uname () {
        return this._uname;
    }

    // do NOT allow to change username at the moment
    // set uname (newUname) {
    //     if (db.acc.isUnameUsed(newUname)) {
    //         throw new Error(`Username ${newUname} exists. Please choose another one.`);
    //     } else {
    //         db.acc.changeUname(this._id, newUname, user => {
    //
    //         });
    //     }
    // }

    set passwd (newPasswd) {
        db.acc.changePasswd(this._id, newPasswd, res => {
            this._passwd = res.passwd;
        });
    }

    get passwd () {
        return this._passwd;
    }

    get salt () {
        return this._salt;
    }

    set salt (x) { return; }

    static isUnameUsed (uname, cb) {
        return db.acc.isUnameUsed(uname, (err, bool) => {
            let errMsg;
            if (err) {
                errMsg = 'Error occured while querying database.';
            }
            cb(errMsg, bool);
        });
    }

    static signIn (uname, rawPasswd, cb) {
        Account.findByUname(uname, (err, userInst) => {
            if (err) {
                return cb(err, false, { errMsg: 'Wrong username/password' });
            }

            serv.passwd.isRawMatchHashedPasswd(rawPasswd + userInst.salt, userInst.passwd, isMatched => {
                if (!isMatched) {
                    console.error(new Error('Wrong username/password'));
                    return cb(null, false, { errMsg: 'Wrong username/password' });
                }
                return cb(null, userInst);
            });
        });
    }

    static signOut () {

    }

    static findById (id, cb) {
        db.acc.findById(id, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new Account(userDataConvertedFromDB))
        ));
    }

    static findByUname (uname, cb) {
        db.acc.findByUname(uname, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new Account(userDataConvertedFromDB))
        ));
    }

    static signUp (data, cb) {
        db.acc.regNewAcc(data, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new Account(userDataConvertedFromDB))
        ));
    }
}

module.exports = Account;
