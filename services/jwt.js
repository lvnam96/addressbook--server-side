const fs = require('fs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = fs.readFileSync('./bin/jwt-secret.key', { encoding: 'utf-8' });
const JWT_SALT = 'bcc423e1af8783bfce204f94573afd23'; // never change this line, otherwise the jwt payload from old users will be invalid after each time the server restarts
const signJwt = (payload = {}, secret = SECRET_KEY, opts = {}) => {
  secret = secret || SECRET_KEY;
  opts = opts || {};
  opts.algorithm = opts.algorithm || 'HS256'; // need to be changed to RS256 to meet Google requirement
  return new Promise((resolve, reject) => {
    jwt.sign({ ...payload, salt: JWT_SALT }, secret, opts, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};
const verifyJwt = (token, secret = SECRET_KEY, opts = {}) => {
  secret = secret || SECRET_KEY;
  opts = opts || {};
  opts.algorithms = Array.isArray(opts.algorithms) ? opts.algorithms : ['RS256', 'HS256'];
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, opts, (err, decodedPayload) => {
      if (err) reject(err);
      else if (decodedPayload.salt === JWT_SALT) resolve(decodedPayload);
      else reject(new Error('Fake JWT token, check this access!!'));
    });
  });
};

module.exports = {
  SECRET_KEY,
  sign: signJwt,
  verify: verifyJwt,
};
