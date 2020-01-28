const crypto = require('crypto');
const randomColor = require('randomcolor');

const getRandomColor = (format = 'hex') => {
  // const h = Math.floor(Math.random() * 360);
  // const s = Math.floor(Math.random() * 100) + '%';
  // const l = Math.floor(Math.random() * 60) + 20 + '%';
  // return `hsl(${h},${s},${l})`;
  return randomColor({
    format,
    alpha: 1,
    luminosity: 'dark',
  });
};

// const chance = require('chance');
// chance.string({ length: 10 });
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const getRandomStr = (stringLength) => {
  let text = '';
  const POSSIBLE = '!@#$%^&*()_+-=?|:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const POSSIBLE_SCOPE = POSSIBLE.length;

  for (let i = 0; i < stringLength; i += 1) {
    text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
  }

  return text;
};

const DEFAULT_CRYPTO_STR_LENGTH = 16;
const getStrongCryptoRandomStr = (size = DEFAULT_CRYPTO_STR_LENGTH) => crypto.randomBytes(size).toString('hex');
const getStrongCryptoRandomStrAsync = (size = DEFAULT_CRYPTO_STR_LENGTH) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (err) reject(err);
      else resolve(buf.toString('hex'));
    });
  });

module.exports = {
  getRandomStr,
  getStrongCryptoRandomStr,
  getStrongCryptoRandomStrAsync,
  getRandomColor,
};
