const cookieParser = require('cookie-parser');

const isValidXsrfToken = (xsrfTokenFromHeader, xsrfTokenInJWT) => xsrfTokenFromHeader === xsrfTokenInJWT;

const extractXsrfTokenFromHeader = (req) => {
  const xsrfTokenCookieFromHeader = req.get('X-XSRF-TOKEN');
  const xsrfTokenFromHeader = cookieParser.signedCookie(xsrfTokenCookieFromHeader, req.app.locals.cookieSecret);
  return xsrfTokenFromHeader;
};

const extractAndValidateXsrfToken = (req, res, next) => {
  const xsrfTokenFromHeader = extractXsrfTokenFromHeader(req);
  // res.locals.xsrfTokenFromHeader = xsrfTokenFromHeader;

  if (isValidXsrfToken(xsrfTokenFromHeader, res.locals.jwt.xsrfToken)) next();
  else return next(new Error('Fake XSRF Token. Blocked!'));
};

module.exports = {
  extractAndValidateXsrfToken,
};
