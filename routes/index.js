const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');

var users = require('./users');
var signin = require('./signin');
var signup = require('./signup');
var backdoor = require('./backdoor/index');

// '/' route

router.get('/', auth.allowUserAccessing, (req, res, next) => {
  res.render('index', {
    // title: 'Contacts Book',
    isSignedIn: true,
  });
});

router.use('/users', users);
router.use('/signin', signin);
router.use('/signup', signup);
router.use('/backdoor', backdoor);
router.get('/signout', (req, res, next) => {
  req.logout();
  res.redirect('/signin');
});

module.exports = router;
