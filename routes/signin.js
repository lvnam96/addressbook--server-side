const express = require('express');
const router = express.Router();
const passport = require('passport');
// eslint-disable-next-line no-unused-vars
const React = require('react'); // required for ssr
const signinFormHTMLString = require('../views/ssr/Signin.ssr.js').default;
const adbk = require('../classes/adbk');
const { getStrongCryptoRandomStr } = require('../helpers/random');

// const A_MONTH_IN_MILISECS = 30 * 24 * 60 * 60 * 1000;
const A_DAY_IN_MILISECS = 24 * 60 * 60 * 1000;
const TWO_DAY_IN_MILISECS = 2 * A_DAY_IN_MILISECS;

// '/signin' route

router.get('/', (req, res, next) => {
  const query = req.query;
  return res.render('signin', {
    returnedUser: query.returnedUser || null,
    ssr: signinFormHTMLString || '',
    // title: 'Sign In | Contacts Book'
  });
});

router.post('/', (req, res, next) => {
  // https://github.com/jaredhanson/passport-local/issues/4#issuecomment-4521526
  req.body.uname = req.body.uname.trim().toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // uname is not found
      return res.json({ res: false });
    }
    if (!user) {
      // wrong password
      return res.json({ res: false });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const xsrfToken = getStrongCryptoRandomStr(32);
      // eslint-disable-next-line promise/no-promise-in-callback
      adbk.jwt
        .sign({ userId: user.id, xsrfToken })
        .then((jsonToken) => {
          const json = { res: true };
          return res
            .status(200)
            .cookie('jsonWToken', jsonToken, {
              signed: true,
              secure: !(process.env.NODE_ENV === 'development'),
              path: '/',
              maxAge: TWO_DAY_IN_MILISECS,
              httpOnly: true,
            })
            .cookie('XSRF-TOKEN', xsrfToken, {
              signed: true,
              // secure: !(process.env.NODE_ENV === 'development'),
              path: '/',
              maxAge: TWO_DAY_IN_MILISECS,
              httpOnly: false,
            })
            .json(json);
        })
        .catch((err) => {
          adbk.handleError(err);
          // eslint-disable-next-line promise/no-callback-in-promise
          next(new Error('Cannot sign new JWT'));
        });
    });
  })(req, res, next);
});

module.exports = router;
