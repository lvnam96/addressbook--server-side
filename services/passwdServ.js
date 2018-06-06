const bcrypt = require('bcrypt');
const saltRounds = 10;

// I won't use async/await version of bcrypt
// because of the hash & comparing time, the main reason
// makes bcrypt safer when being brute-force attacked

function getHash (rawPasswd, cb) {
    return bcrypt.hash(rawPasswd, saltRounds)
        .then(cb)
        .catch(err => console.error(err));
}

function isRawMatchHashedPasswd (rawPasswd, hashedPasswd, cb) {
    return bcrypt.compare(rawPasswd, hashedPasswd)
        .then(cb)
        .catch(err => console.error(err));
}

module.exports = {
    getHash,
    isRawMatchHashedPasswd
};
