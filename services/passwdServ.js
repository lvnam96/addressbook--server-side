const bcrypt = require('bcryptjs');
const saltRounds = 10;

// I won't use async/await version of bcrypt
// because of the hash & comparing time, the main reason
// makes bcrypt safer when being brute-force attacked

function getHash (rawPasswd, cb) {
    return bcrypt.hash(rawPasswd, saltRounds, (err, hash) => {
        if (err) return console.error(err);
        return cb(hash);
    });
}

function isRawMatchHashedPasswd (rawPasswd, hashedPasswd, cb) {
    return bcrypt.compare(rawPasswd, hashedPasswd, (err, res) => {
        if (err) return console.error(err);
        return cb(res);
    });
}

module.exports = {
    getHash,
    isRawMatchHashedPasswd
};
