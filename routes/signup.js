const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../classes/User');
const auth = require('../services/auth');
const adbk = require('../classes/adbk');
const React = require('react');// required for ssr
const signupFormHTMLString = require('../views/ssr/Signup.ssr.js').default;

// '/signup' route

router.get('/', auth.allowNonUserAccessing, (req, res, next) => {
    return res.render('signup', {
        ssr: signupFormHTMLString || '',
        // title: 'Sign Up | Contacts Book'
    });
});

router.post('/', auth.allowNonUserAccessing, (req, res, next) => {
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
            // error is output in console already in adbk.user.signUp
            return res.json({ res: false });
        } else {
            if (user instanceof User) {
                user = user.toJSON();
            }
            return res.json({
                res: true,
                user,// at the moment front-end app is not using this
                redirectLocation: '/signin?returnedUser=' + user.uname,
            });
        }
    });
});

module.exports = router;
