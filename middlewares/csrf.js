/* eslint-disable promise/no-callback-in-promise */
const cookieParser = require('cookie-parser');
const adbk = require('../classes/adbk');
const { getStrongCryptoRandomStr } = require('../helpers/random');

const extractAndValidateXsrfToken = async (req) => {
  const validateXsrfToken = (xsrfTokenFromHeader, xsrfTokenInJWT) => xsrfTokenFromHeader === xsrfTokenInJWT;
  const extractXsrfTokenFromHeader = (req) => {
    const xsrfTokenCookieFromHeader = req.get('X-XSRF-TOKEN');
    const cookieSecret = req.app.locals.cookieSecret || adbk.secret.cookie;
    const xsrfTokenFromHeader = cookieParser.signedCookie(xsrfTokenCookieFromHeader, cookieSecret); // parse signed cookie manually (from X-XSRF-TOKEN header, so it doesnt go through cookie-parser middleware)
    return xsrfTokenFromHeader;
  };
  const extractXsrfTokenFromCookie = async (req) => {
    const payload = await adbk.jwt.verify(req.signedCookies['xsrf-jwt']);
    return payload.xsrfToken;
  };
  const xsrfTokenFromHeader = extractXsrfTokenFromHeader(req);
  const xsrfTokenFromCookie = await extractXsrfTokenFromCookie(req);

  return validateXsrfToken(xsrfTokenFromHeader, xsrfTokenFromCookie);
};

const xsrfMiddleware = async (req, res, next) => {
  try {
    if (req.method.toUpperCase() !== 'GET') {
      // all GET requests dont modify data, only validate XSRF on other methods, e.g: POST
      // because all POST requests should be create by JS -> XSRF token will be available & included in header
      const isValidXsrfToken = await extractAndValidateXsrfToken(req);
      if (!isValidXsrfToken) {
        throw new Error('Fake XSRF Token. Blocked!');
      }
    }

    // refresh new XSRF token:
    const xsrfToken = getStrongCryptoRandomStr(32); // improve
    const jsonToken = await adbk.jwt.sign({ xsrfToken });
    res
      .cookie('xsrf-jwt', jsonToken, adbk.jwt.cookieOption) // this gonna be sent with browser when submit a <form>
      .cookie('XSRF-TOKEN', xsrfToken, adbk.xsrf.cookieOption); // for client to inject X-XSRF-TOKEN header on every request

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = xsrfMiddleware;
