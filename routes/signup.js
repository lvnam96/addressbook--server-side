const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../classes/User');
const adbk = require('../classes/adbk');
const React = require('react'); // required for ssr
const signupFormHTMLString = require('../views/ssr/Signup.ssr.js').default;

// '/signup' route

router.get('/', (req, res, next) => {
  return res.render('signup', {
    ssr: signupFormHTMLString || '',
    nonce: res.locals.nonce,
  });
});

router.post('/', (req, res, next) => {
  const signupData = req.body;
  signupData.uname = signupData.uname.trim().toLowerCase();
  if (signupData.uname.match(/[^a-z0-9@.-]/gm) !== null) {
    return next(new Error('Username can only contains alphabet lowercase letters & numbers.'));
  }

  adbk.user
    .signUp(signupData)
    .then((user) => {
      // to have user automatically signed in after registered successfully: http://www.passportjs.org/docs/login/
      // req.login(user, function (err) {
      //   if (err) {
      //     return next(err);
      //   }
      //   return res.redirect('/users/' + req.user.username);
      // });
      const json = {
        res: true,
        redirectLocation: '/signin?returnedUser=' + user.uname,
      };
      if (user instanceof User) {
        json.user = user.toJSON(); // at the moment front-end app is not using this
      }
      return res.json(json);
    })
    .catch(() => {
      // dev perpose
      // res.set('Access-Control-Allow-Origin', 'http://localhost:2805');
      // res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
      // res.set('Access-Control-Allow-Headers', 'Content-Type');
      // error is output in console already in adbk.user.signUp
      return res.json({ res: false });
    });
});

module.exports = router;
