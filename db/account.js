const { pool, query } = require('./pool');
const { addAdrsbook, addAccountAdrsbookRelationship } = require('./data');
const passwdServ = require('../services/passwdServ');
const { random: { getRandomStr, getRandomColor }, dbUtils: { mapUserData } } = require('../helpers/index');
const waterfall = require('async/waterfall');

function createNewAccount (userData, cb) {
    const randStr = getRandomStr(10);
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
        ) RETURNING *;`,
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
        // return query(queryStr, queryPara);
        query(queryStr, queryPara, (err, res) => {
            cb(err, res.rows[0]);
        });
    });
}

function regNewAcc (userData, callback) {
    waterfall([
        (cb) => {
            createNewAccount(userData, (err, rawData) => {
                cb(err, mapUserData(rawData));
            });
        },
        (user, cb) => {
            addAdrsbook({
                name: 'Your Address Book',
                color: getRandomColor()
            }, (err, res) => {
                cb(err, {
                    user,
                    adrsbook: res.rows[0]
                });
            });
        },
        (data, cb) => {
            addAccountAdrsbookRelationship(data.user.id, data.adrsbook.id, (err, res) => {
                cb(err, data);
            });
        }
    ], (err, data) => {
        callback(err, data.user);
    });
}

function isUnameUsed (uname, cb) {
    query(
        'SELECT username FROM account WHERE username = $1',
        [uname],
        (err, res) => {
            const result = res.rows.length > 0 && res.rows[0] !== undefined;
            cb(err, result);
        }
    );
}

function changeUname (id, newUname, cb) {
    query(
        'UPDATE account SET username = $1 WHERE id = $2 RETURNING *',
        [newUname, id],
        (err, res) => {
            if (err) console.error(err);
            cb(mapUserData(res.rows[0]));
        }
    );
}

function changePasswd (id, newPasswd, cb) {
    const randStr = getRandomStr(10);
    passwdServ.getHash(newPasswd + randStr, hashedPasswd => {
        query(
            'UPDATE account SET password = $1, salt = $2 WHERE id = $3 RETURNING *',
            [hashedPasswd, randStr, id],
            (err, res) => {
                cb(err, mapUserData(res.rows[0]));
            }
        );
    });
}

function findById (id, cb) {
    query(
        'SELECT * FROM account WHERE id = $1',
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
            return cb(null, mapUserData(res.rows[0]));
        }
    );
}

function findByUname (uname, cb) {
    pool.query(
        // 'SELECT * FROM account WHERE username = $1',
        'UPDATE account SET last_login = $2 WHERE username = $1 RETURNING *',
        [uname, new Date()],
        (err, res) => {
            if (err) {
                // please do something on UI to let user know about
                // this f*cking error while querrying database
                return cb(err);
            }
            if (!res.rows[0]) {
                return cb(new Error(`Username ${uname} is not found!`));
            }
            return cb(null, mapUserData(res.rows[0]));
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
