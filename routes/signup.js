const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../classes/User');
const auth = require('../services/auth');
const adbk = require('../classes/adbk');
const React = require('react');
const signupFormHTMLString = require('../views/ssr/Signup.ssr.js').default;

// '/signup' route

router.get('/', auth.restrictUserMiddleware, (req, res, next) => {
    res.render('signup', {
        ssr: signupFormHTMLString || '',
        title: 'Sign Up | Address Book'
    });
});

router.post('/', auth.restrictUserMiddleware, (req, res, next) => {
    const signupData = req.body;
    signupData.uname = signupData.uname.toLowerCase();
    if (signupData.uname.match(/[^a-z0-9]/gm) !== null) {// null === null -> true
        return res.render('signup', {
            errMsg: 'Username can only contains alphabet lowercase letters & numbers.'
        });
    }
    adbk.user.signUp(signupData, (err, user) => {
        if (err) {
            // dev perpose
            // res.set('Access-Control-Allow-Origin', 'http://localhost:2805');
            // res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
            // res.set('Access-Control-Allow-Headers', 'Content-Type');
            console.error(err);
            return res.json({ res: false });
        } else {
            return res.json({ res: true, user });
        }
    });
});

module.exports = router;
