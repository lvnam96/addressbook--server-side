const helmet = require('helmet');
const adbk = require('../classes/adbk');
const uuidv1 = require('uuid/v1');
const forceSSL = require('express-force-ssl');

const A_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
const helmetOptions = {
  permittedCrossDomainPolicies: true, // set X-Permitted-Cross-Domain-Policies header to 'none'
  featurePolicy: {
    // https://helmetjs.github.io/docs/feature-policy/
    features: {
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      camera: ["'none'"],
      documentDomain: ["'self'"],
      documentWrite: ["'none'"],
      fontDisplayLateSwap: ["'self'"],
      fullscreen: ["'self'"],
      geolocation: ["'self'"],
      microphone: ["'none'"],
      notifications: ["'none'"],
      payment: ["'none'"],
      vibrate: ["'self'"],
    },
  },
  hsts: {
    maxAge: A_YEAR_IN_SECONDS,
    includeSubDomains: true,
  },
};

// middlewares:
const setupCSP = (req, res, next) => {
  // see https://content-security-policy.com/ for CSP directives referrence
  // see https://helmetjs.github.io/docs/csp/ for supported CSP directives
  // this follows strict policy by Gogle: https://csp.withgoogle.com/docs/strict-csp.html
  const setupDirectives = (nonce) => {
    const directives = {
      upgradeInsecureRequests: !adbk.dev.isDev,
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.ipgeolocation.io', 'https://restcountries.eu'],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      scriptSrc: [
        "'self'",
        // "'strict-dynamic'",
        'https://unpkg.com',
        'https://browser.sentry-cdn.com',
        "'unsafe-inline'",
        `'nonce-${nonce}'`,
      ],
      styleSrc: ["'self'", 'fonts.googleapis.com', "'unsafe-inline'"],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      // prefetchSrc: ["'self'"],
      // formAction: ["'self'"],
      // frameAncestors: ["'self'"],
      // manifestSrc: ["'self'"],
      // workerSrc: ["'self'"],
      // childSrc: ["'self'"],
      reportUri: 'https://contacts.garyle.me/log/csp-report',
    };
    if (adbk.dev.isDev) {
      directives.scriptSrc.push("'unsafe-eval'");
      directives.reportUri = `http://${req.get('host')}/log/csp-report`;
      // directives.styleSrc.push(`'nonce-${nonce}'`);
    }
    return directives;
  };
  const nonce = Buffer.from(uuidv1()).toString('base64');
  res.locals.nonce = nonce; // for later middlewares
  const directives = setupDirectives(nonce);
  helmet.contentSecurityPolicy({
    directives,
    browserSniff: false,
    reportOnly: true,
  })(req, res, next);
};

// requireHTTPS is still used due to upgradeInsecureRequests option of CSP doesnt support the very-first request from client
const requireHTTPS = (req, res, next) => {
  req.app.set('forceSSLOptions', {
    // options referrence : https://github.com/battlejj/express-force-ssl#as-of-v030-there-are-some-configuration-options
    enable301Redirects: true,
    trustXFPHeader: true,
    // httpsPort: 443,
    // sslRequiredMessage: 'SSL Required.',
  });
  forceSSL(req, res, next);
};

// NOTE: update this middleware when develop mobile app
// see https://www.npmjs.com/package/host-validation#what-is-dns-rebinding-and-why-should-i-care
const filterRequestsFromAllowedHost = () => {
  const validDomains = ['contacts.garyle.me', 'cbook-garyle.herokuapp.com'];
  if (adbk.dev.isDev) {
    validDomains.push('localhost:' + process.env.FE_DEV_PORT, 'localhost:' + (process.env.PORT || 3000));
  }
  return (req, res, next) => {
    const host = req.get('host');
    if (validDomains.includes(host)) {
      next();
    } else {
      next(new Error('This request is sent from a not-allowed domain. Blocked!'));
    }
  };
};

const middlewares = [requireHTTPS, filterRequestsFromAllowedHost(), helmet(helmetOptions), setupCSP];
if (adbk.dev.isDev) {
  middlewares.shift(); // dev env doesnt support HTTPS
}
module.exports = middlewares;
