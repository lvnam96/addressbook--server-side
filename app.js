const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { pool } = require('./db/pool');
const adbk = require('./classes/adbk');
const compression = require('compression');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');

const isDev = adbk.dev.isDev;

const router = require('./routes/index');

const app = express();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'uname',
      passwordField: 'passwd',
      passReqToCallback: true,
      session: true,
    },
    adbk.user.signIn
  )
);
// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromBodyField('jwt'),
//       secretOrKey: adbk.jwt.SECRET_KEY,
//     },
//     (jwtPayload, next) => {
//       adbk.user.findById(jwtPayload.id, (err, user) => {
//         if (err) {
//           console.error(err);
//           next(err);
//         } else if (user) {
//           next(null, user);
//         } else {
//           next(null, false);
//         }
//       });
//     }
//   )
// );
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(adbk.user.findById);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view cache', true); // default: true (production) || undefined
app.set('x-powered-by', false); // disable the "X-Powered-By: Express" HTTP header
app.set('case sensitive routing', false); // disable case sensitivity routing ('/Foo' = '/foo')
app.set('env', process.env.NODE_ENV || 'production');
app.set('strict routing', false);
app.set('subdomain offset', 3); // default: 2 for first level subdomains (e.g: a.b.com => a will be extracted). Our subdmains will be second-level subdomains (e.g: c.a.b.com => c will be extracted). Change this if app's domain is changed

app.locals.cookieSecret = app.locals.cookieSecret || adbk.secret.cookie;
// app.locals.coreCSS = fs.readFileSync('./public/core.css', { encoding: 'utf-8' }); // do not inline CSS because of advantages of HTTP caching using CSS files

// do not enable CORS in production (to prevent XSRF attacks), unless for a specific route with a "must" reason & carefully unit tests
// if CORS is enabled, remember to note the reason in documentation
if (isDev) {
  const corsOptions = {};
  // process.env variables provided by ./nodemon.json
  corsOptions.origin = [
    'http://localhost:' + process.env.FE_DEV_PORT,
    'http://localhost:' + (process.env.PORT || 3000),
  ];
  app.use(cors(corsOptions));
  // eslint-disable-next-line no-console
  console.log('CORS is set up for', corsOptions.origin); // notify deployer
}

if (!isDev) app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(isDev ? 'dev' : 'common'));
app.use(compression()); // put compression middleware before any files serving middleware
app.use(express.static(path.join(__dirname, 'public'))); // express.static === require('serve-static')
app.use(cookieParser(app.locals.cookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: isDev })); // parse application/x-www-form-urlencoded for easier testing with Postman or plain HTML form in dev env

const A_MONTH_IN_MILISECS = 30 * 24 * 60 * 60 * 1000;
const cookiesConfig = { maxAge: A_MONTH_IN_MILISECS }; // 30 days
if (!isDev) {
  app.set('trust proxy', 1); // trust first proxy
  cookiesConfig.secure = true; // serve secure cookies (force sending cookies only via https protocol)
}
app.use(
  session({
    name: 'session.sid',
    // see https://www.npmjs.com/package/express-session#options for more details of props
    store: new (require('connect-pg-simple')(session))({ pool }),
    // Note Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work. This module now directly reads and writes cookies on req/res. Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser:
    secret: [app.locals.cookieSecret, '@$^#c(&)#cn)(#cn#mx)e(#@)'], // use first element to sign, use all to verify
    saveUninitialized: false,
    resave: false,
    cookie: cookiesConfig,
    rolling: true, // for reset maxAge of session on every request
  })
); // this session() middleware must be used BEFORE passport.session()
app.use(passport.initialize());
app.use(passport.session());

app.use(
  '*',
  function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !isDev) {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  },
  function filterRequestsFromAllowedHost(req, res, next) {
    const host = req.get('host');
    const prodDomains = ['contacts.garyle.me', 'cbook-garyle.herokuapp.com'];
    if (isDev) {
      prodDomains.push('localhost:' + process.env.FE_DEV_PORT, 'localhost:' + (process.env.PORT || 3000));
    }
    if (prodDomains.includes(host)) {
      next();
    } else {
      next(new Error('This request is sent from a not-allowed domain. Blocked!'));
    }
  }
);
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // express error handler requires 4 arguments
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {};
  adbk.handleError(err); // TO-DO: check Sentry for error reporting in production
  if (res.headersSent) {
    return next(err);
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
