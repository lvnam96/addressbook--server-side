const bcrypt = require('bcryptjs');
const saltRounds = 10;

// I won't use async/await version of bcrypt
// because of the hash & comparing time, the main reason
// makes bcrypt safer when being brute-force attacked

function getHash (saltedRawPasswd, cb) {
    return bcrypt.hash(saltedRawPasswd, saltRounds, (err, hash) => {
        if (err) return console.error(err);
        return cb(hash);
    });
}

function isRawMatchHashedPasswd (saltedRawPasswd, hashedPasswd, cb) {
    return bcrypt.compare(saltedRawPasswd, hashedPasswd, (err, res) => {
        if (err) return console.error(err);
        return cb(res);
    });
}

module.exports = {
    getHash,
    isRawMatchHashedPasswd
};
