var express = require('express');
var router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');

// '/' route

router.get('/', auth.restrictNonUserMiddleware(), (req, res, next) => {
    res.render('index', {
        title: 'Address Book',
        isSignedIn: true
    });
});

module.exports = router;
