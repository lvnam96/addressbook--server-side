const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');

// '/' route

router.get('/', auth.allowUserAccessing, (req, res, next) => {
  res.render('index', {
    // title: 'Contacts Book',
    isSignedIn: true,
  });
});

router.use('/users', auth.allowUserAccessing, require('./users'));
router.use('/cbooks', auth.allowUserAccessing, require('./cbooks'));
router.use('/signin', auth.allowNonUserAccessing, require('./signin'));
router.use('/signup', auth.allowNonUserAccessing, require('./signup'));
router.use('/settings', auth.allowUserAccessing, require('./settings'));
router.use('/backdoor', require('./backdoor/index'));
router.get('/signout', auth.allowUserAccessing, (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      res.end();
    } else {
      // see route /signin to know which cookies are set
      res
        .clearCookie('connect.sid', { path: '/' })
        .clearCookie('jsonWToken', { path: '/' })
        .clearCookie('XSRF-TOKEN', { path: '/' })
        .redirect('/signin');
    }
  });
});

module.exports = router;
