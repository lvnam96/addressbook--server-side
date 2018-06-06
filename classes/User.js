const serv = require('../services/');
const db = require('../db/');
const { pool } = db.poolInitiator;

module.exports = class User {
    constructor (data) {
        this._id = data.id;
        this._uname = data.uname;
        this._passwd = data.passwd;
        this.fbid = data.fbid;
        this.email = data.email;
        this.nicename = data.nicename;
        this.birth = data.birth;
        this.phone = data.phone;
        this.last_login = data.last_login;
        this.created_on = data.created_on;
    }

    get id () {
        return this._id;
    }

    // do NOT allow to change ID
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

    // set passwd (newPasswd) {
    //     db.acc.changePasswd(this._id, newPasswd, res => {
    //
    //     });
    // }

    get passwd () {
        return this._passwd;
    }

    static signOut () {

    }

    static signIn (uname, rawPasswd, cb) {
        User.findByUname(uname, (err, userObj) => {
            if (err) {
                return cb(err);
            }

            const wrongErr = new Error('Wrong username/password');
            serv.passwd.isRawMatchHashedPasswd(rawPasswd, userObj.passwd, isMatched => {
                if (isMatched) {
                    return cb(null, userObj);
                }
                console.error(wrongErr);
                return cb(null, false);
            });
        });
    }

    static signUp () {
        return this;
    }

    static findById (id, cb) {
        db.acc.findById(id, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new User(userDataConvertedFromDB))
        ));
    }

    static findByUname (uname, cb) {
        db.acc.findByUname(uname, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new User(userDataConvertedFromDB))
        ));
        pool.query(`SELECT * FROM account WHERE username = $1`, [uname])
            .then(res => {
                if (!res.rows[0]) {
                    return cb(new Error(`Username ${uname} is not found!`));
                }
                const { id, username, password, email, facebook_id, birth, phone, nicename, created_on, last_login } = res.rows[0];
                return cb(null, new User({
                    id,
                    uname: username,
                    passwd: password,
                    fbid: facebook_id,
                    email,
                    nicename,
                    birth,
                    created_on,
                    last_login
                }));
            })
            .catch(err => console.error(err));
    }

    static register (data, cb) {
        db.acc.regNewAcc(data, (err, userDataConvertedFromDB) => (
            err ?
            cb(err)
            :
            cb(null, new User(userDataConvertedFromDB))
        ));
    }
};
