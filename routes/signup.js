const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../classes/User');
const auth = require('../services/auth');

// '/signup' route

router.get('/', auth.restrictUserMiddleware(), (req, res, next) => {
    res.render('signup', {
        title: 'Sign Up page'
    });
});

router.post('/', auth.restrictUserMiddleware(), (req, res, next) => {
    if (req.body.uname.match(/[^a-z0-9]/gm) !== null) {// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
        return res.render('signup', {
            errMsg: 'Username can only contains alphabet lowercase letters & numbers.'
        });
    }
    req.body.uname = req.body.uname.toLowerCase();
    User.register(req.body, (err, userObj) => {
        if (err) {
            return next(err);
        } else {
            return res.redirect(303, '/signin?returnedUser=' + userObj.uname);// https://stackoverflow.com/questions/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
        }
    });
});

module.exports = router;
