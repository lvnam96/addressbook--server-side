const express = require('express');
const router = express.Router();
const passport = require('passport');
const { account: accountsDB } = require('../db/');

// '/signup' route

router.get('/', (req, res, next) => {
    if (req.cookies.isSignedIn === 'true') {
        if (req.query.signout === 'true') {
            res.clearCookie('isSignedIn');
        }
        res.redirect('/');
    } else {
        res.render('signup', {
            title: 'Login'
        });
    }
});

router.post('/', (req, res, next) => {
    accountsDB.regNewAcc(req.body);
    // res.set('Content-Type', 'text/json');
    res.render('signup', {
        title: 'Login'
    });
});

module.exports = router;
