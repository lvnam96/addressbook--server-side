// const app = require('../app');
// const http = require('http');
const request = require('supertest');
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const adbk = require('../classes/adbk');
const compression = require('compression');
const router = require('./index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression()); // put compression middleware before any files serving middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('NODE_ENV') === 'production' ? {} : err;
  if (res.headersSent) {
    return next(err);
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const cookiesConfig = { maxAge: 30 * 24 * 60 * 60 * 1000 }; // 30 days
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  cookiesConfig.secure = true; // serve secure cookies
}

describe('Test the root path', () => {
  test('It should response the GET method', async (done) => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(302);
    done();
  });
});

describe('Non-user paths test suite', () => {
  it('should response 200 to the GET /signin', (done) => {
    request(app)
      .get('/signin')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  it('should response 200 to the GET /signup', (done) => {
    request(app)
      .get('/signup')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
