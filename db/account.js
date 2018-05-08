const { Client } = require('pg');
const clientConfig = require('./dbInfo');
const passwdServ = require('../services/passwdService');

const regNewAcc = (userData) => {
    const client = new Client(clientConfig);
    client.connect();
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
        $1, $2, $3, $4, $5, $6, $7, to_timestamp(${Date.now() / 1000.0}), $8
    ) RETURNING *`;

    passwdServ.hashPasswd(userData.passwd)
        .then(sendQueryRegAcc)
        .catch(err => console.log(err));

    function sendQueryRegAcc (hashedPasswd) {
        const queryPara = [
            userData.uname,
            hashedPasswd,
            userData.fbid ? userData.fbid : null,
            userData.birth ? userData.birth : null,
            userData.email ? userData.email : null,
            userData.phone ? userData.phone : null,
            userData.dispname ? userData.dispname : null,
            null
        ];
        client.query(queryStr, queryPara)
            .then(res => {
                console.dir(res.rows[0]);
                client.end();
            })
            .catch(err => {
                console.log(err.stack);
                client.end();
            });
    }
};

module.exports = {
    regNewAcc,
};
