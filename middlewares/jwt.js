const adbk = require('../classes/adbk');

const extractJWT = (req, res, next) => {
  adbk.jwt
    .verify(req.signedCookies.jsonWToken)
    .then((payload) => {
      if (payload.userId !== req.user.id) {
        throw new Error('Wrong user ID in JWT');
      }
      res.locals.jwt = payload;
      return next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  extractJWT,
};
