const bcrypt = require('bcryptjs');
const globalPepper = '*#)FsaS#$()sf(Sa';
const saltRounds = 10;

function getHash(saltedRawPasswd, cb) {
  return bcrypt.hash(saltedRawPasswd, saltRounds, (err, hash) => {
    if (err) return console.error(err);
    return cb(hash);
  });
}

function isRawMatchHashedPasswd(saltedRawPasswd, hashedPasswd, cb) {
  return bcrypt.compare(saltedRawPasswd, hashedPasswd, (err, res) => {
    if (err) return console.error(err);
    return cb(res);
  });
}

module.exports = {
  getHash,
  isRawMatchHashedPasswd,
};
