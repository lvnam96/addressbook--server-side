var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { pool } = require('./db/pool');
const User = require('./classes/User');

var index = require('./routes/index');
var users = require('./routes/users');
var signin = require('./routes/signin');
var signup = require('./routes/signup');

var app = express();

passport.use(new LocalStrategy({
    usernameField: 'uname',
    passwordField: 'passwd',
    passReqToCallback: true,
    session: true
}, (req, uname, passwd, done) => {
    User.signIn(uname, passwd, done);
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const cookiesConfig = { maxAge: 30 * 24 * 60 * 60 * 1000 };// 30 days
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);// trust first proxy
  cookiesConfig.secure = true;// serve secure cookies
}
app.use(session({
    store: new (require('connect-pg-simple')(session))({ pool }),
    secret: '@$^#c(&)#cn)(#cn#mx)e(#@)',
    saveUninitialized: false,
    resave: false,
    cookie: cookiesConfig
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, userObj) => {
        done(err, userObj);
    });
});

app.use('/', index);
app.use('/users', users);
app.use('/signin', signin);
app.use('/signup', signup);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
