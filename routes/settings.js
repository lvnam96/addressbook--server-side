const express = require('express');
const router = express.Router();
const auth = require('../services/auth');

// '/settings' route

router.get('/', auth.allowUserAccessing, (req, res, next) => {
  res.redirect('/');
  // res.render('index', {
  //   // title: 'Contacts Book',
  //   isSignedIn: true,
  // });
});

module.exports = router;
