const { pool, query: dbQuery } = require('./pool');
const passwdServ = require('../services/passwdServ');

// const chance = require('chance');
// chance.string({ length: 10 });
//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const randomStr = (string_length) => {
    let text = "";
    const POSSIBLE = "!@#$%^&*()_+-=?|:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          POSSIBLE_SCOPE = POSSIBLE.length;

    for (let i = 0; i < string_length; i += 1) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
    }

    return text;
};

// map data from account table in database
// to obj with right props which class User needs
function mapData (userDataFromDB) {
    const { id, username, password, email, facebook_id, birth, phone, nicename, created_on, last_login, salt } = userDataFromDB;
    return {
        id,
        uname: username,
        passwd: password,
        fbid: facebook_id,
        email,
        nicename,
        birth,
        phone,
        created_on,
        last_login,
        salt
    };
}

function regNewAcc (userData, cb) {
    const randStr = randomStr(10);
    passwdServ.getHash(userData.passwd + randStr, hashedPasswd => {
        const queryStr = `INSERT INTO account (
            username,
            password,
            facebook_id,
            birth,
            email,
            phone,
            nicename,
            created_on,
            last_login,
            salt
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *`,
            queryPara = [
                userData.uname,
                hashedPasswd,
                userData.fbid ? userData.fbid : undefined,
                userData.birth ? userData.birth : undefined,
                userData.email ? userData.email : undefined,
                userData.phone ? userData.phone : undefined,
                userData.dispname ? userData.dispname : undefined,
                new Date(),
                undefined,
                randStr
            ];
        dbQuery(queryStr, queryPara, (err, res) => {
            cb(err, mapData(res.rows[0]));
        });
    });
}

function isUnameUsed (uname, cb) {
    console.log(uname);
    dbQuery(
        'SELECT username FROM account WHERE username = $1',
        [uname],
        (err, res) => {
            console.log(res);
            const result = res.rows.length > 0 && res.rows[0] !== undefined;
            cb(err, result);
        }
    );
}

function changeUname (id, newUname, cb) {
    dbQuery(
        'UPDATE account SET username = $1 WHERE id = $2',
        [newUname, id],
        (err, res) => {
            if (err) console.error(err);
            cb(mapData(res.rows[0]));
        }
    );
}

function changePasswd (id, newPasswd, cb) {
    const randStr = randomStr(10);
    passwdServ.getHash(newPasswd + randStr, hashedPasswd => {
        dbQuery(
            'UPDATE account SET password = $1, salt = $2 WHERE id = $3',
            [hashedPasswd, randStr, id],
            (err, res) => {
                cb(err, mapData(res.rows[0]));
            }
        );
    });
}

function findById (id, cb) {
    dbQuery(
        `SELECT * FROM account WHERE id = $1`,
        [id],
        (err, res) => {
            if (err) {
                // please do something on UI to let user know about
                // this f*cking error while querrying database
                return cb(err);
            }
            if (!res.rows[0]) {
                return cb(new Error(`User ID ${id} is not found!`));
            }
            return cb(null, mapData(res.rows[0]));
        }
    );
}

function findByUname (uname, cb) {
    pool.query(
        `SELECT * FROM account WHERE username = $1`,
        [uname],
        (err, res) => {
            if (err) {
                // please do something on UI to let user know about
                // this f*cking error while querrying database
                return cb(err);
            }
            if (!res.rows[0]) {
                return cb(new Error(`Username ${uname} is not found!`));
            }
            return cb(null, mapData(res.rows[0]));
        }
    );
}

module.exports = {
    regNewAcc,
    findById,
    findByUname,
    isUnameUsed,
    changeUname,
    changePasswd
};
