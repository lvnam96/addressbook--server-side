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

router.use('/users', require('./users'));
router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));
router.use('/settings', require('./settings'));
router.use('/backdoor', require('./backdoor/index'));
router.get('/signout', (req, res, next) => {
  req.logout();
  res.redirect('/signin');
});

module.exports = router;
