const express = require('express');
const router = express.Router();
const passport = require('passport');
const Account = require('../classes/Account');
const auth = require('../services/auth');

// '/signup' route

router.get('/', auth.restrictUserMiddleware, (req, res, next) => {
    res.render('signup', {
        title: 'Sign Up page'
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
    Account.signUp(signupData, (err, userObj) => {
        if (err) {
            // dev perpose
            // res.set('Access-Control-Allow-Origin', 'http://localhost:2805');
            // res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
            // res.set('Access-Control-Allow-Headers', 'Content-Type');

            return res.json({ res: false });
        } else {
            // dev perpose
            // res.set('Access-Control-Allow-Origin', 'http://localhost:2805');
            // res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
            // res.set('Access-Control-Allow-Headers', 'Content-Type');

            return res.json({ res: true });// res.json() is more convinient way to do:
                                           // res.set('Content-Type', 'application/json'); res.send(<json>);
        }
    });
});

module.exports = router;
