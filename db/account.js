const { pool, query: dbQuery } = require('./pool');
const passwdServ = require('../services/passwdServ');

function mapData (userDataFromDB) {
    // map data from account table in database
    // to obj with right props which class User needs
    const { id, username, password, email, facebook_id, birth, phone, nicename, created_on, last_login } = userDataFromDB;
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
        last_login
    };
}

function regNewAcc (userData, cb) {
    const queryStr = `INSERT INTO account (
        username,
        password,
        facebook_id,
        birth,
        email,
        phone,
        nicename,
        created_on,
        last_login
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *`;
    passwdServ.getHash(userData.passwd, hashedPasswd => {
        const queryPara = [
            userData.uname,
            hashedPasswd,
            userData.fbid ? userData.fbid : undefined,
            userData.birth ? userData.birth : undefined,
            userData.email ? userData.email : undefined,
            userData.phone ? userData.phone : undefined,
            userData.dispname ? userData.dispname : undefined,
            new Date(),
            undefined
        ];
        dbQuery(queryStr, queryPara, (err, res) => {
            cb(err, mapData(res.rows[0]));
        });
    });
}

// async function isUnameUsed (uname) {
//     const { rows } = await pool.query('SELECT id, username FROM account WHERE username = $1', [uname]);
//     return (rows.length !== 0);
// }
//
// function changeUname (id, newUname, cb) {
//     dbQuery('UPDATE account SET username = $1 WHERE id = $2', [newUname, id], (err, res) => {
//         cb(res.rows[0]);
//     });
// }
//
// function changePasswd (id, newPasswd, cb) {
//     dbQuery('UPDATE account SET password = $1 WHERE id $2', [newPasswd, id], (err, res) => {
//         cb(res.rows[0]);
//     });
// }

function findById (id, cb) {
    dbQuery(`SELECT * FROM account WHERE id = $1`, [id], (err, res) => {
        if (err) {
            // please do something on UI to let user know about
            // this f*cking error while querrying database
            return cb(err);
        }
        if (!res.rows[0]) {
            return cb(new Error('User is not found!'));
        }
        return cb(null, mapData(res.rows[0]));
    });
}

function findByUname (uname, cb) {
    pool.query(`SELECT * FROM account WHERE username = $1`, [uname], (err, res) => {
        if (err) {
            // please do something on UI to let user know about
            // this f*cking error while querrying database
            return cb(err);
        }
        if (!res.rows[0]) {
            return cb(new Error(`Username ${uname} is not found!`));
        }
        return cb(null, mapData(res.rows[0]));
    });
}

module.exports = {
    regNewAcc,
    findById,
    findByUname,
    // isUnameUsed,
    // changeUname,
    // changePasswd
};
