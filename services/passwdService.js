const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPasswd (rawPasswd, cb) {
    return bcrypt.hash(rawPasswd, saltRounds);
}

function isRawMatchHashedPasswd (rawPasswd, hashedPasswd) {
    let bool;
    bcrypt.compare(rawPasswd, hashedPasswd)
        .then(res => (bool = res))
        .catch(err => console.log(err));
    return bool;
}

module.exports = {
    hashPasswd,
    isRawMatchHashedPasswd
};
