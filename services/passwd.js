const bcryptJS = require('bcryptjs');
// const globalPepper = '*#)FsaS#$()sf(Sa'; // also used for AES256, should save it in a .key file or database
// var forge = require('node-forge');
const { getStrongCryptoRandomStrAsync } = require('../helpers/random');

const bcrypt = {
  hash: (raw) => {
    // raw: raw password + salt
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
      bcryptJS.hash(raw, saltRounds, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  },
  compare: (raw, hash) => {
    // raw: raw password + salt
    // hash: password string in database
    return new Promise((resolve, reject) => {
      bcryptJS.compare(raw, hash, (err, bool) => {
        if (err) reject(err);
        else resolve(bool);
      });
    });
  },
};

const getSaltedPasswd = async (passwd, salt) => {
  if (!passwd || typeof passwd !== 'string') throw new Error('"passwd" argument is invalid');
  salt = salt || (await getStrongCryptoRandomStrAsync());
  return {
    passwd: passwd + salt,
    salt,
  };
};

module.exports = {
  bcrypt,
  getSaltedPasswd,
};
