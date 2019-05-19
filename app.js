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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression()); // put compression middleware before any files serving middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cookiesConfig = { maxAge: 30 * 24 * 60 * 60 * 1000 }; // 30 days
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  cookiesConfig.secure = true; // serve secure cookies
}
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({ pool }),
    secret: '@$^#c(&)#cn)(#cn#mx)e(#@)', // change this in production
    saveUninitialized: false,
    resave: false,
    cookie: cookiesConfig,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(adbk.user.findById);

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
  res.locals.error = req.app.get('NODE_ENV') === 'production' ? {} : err;
  // TO-DO: check Sentry for error reporting in production
  if (res.headersSent) {
    return next(err);
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
