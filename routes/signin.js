const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');

// '/signin' route

router.get('/', auth.restrictUserMiddleware(), (req, res, next) => {
    const query = req.query;
    if (query.returnedUser) {
        return res.render('signin', {
            title: 'Sign In | Address Book',
            returnedUser: query.returnedUser
        });
    }
    res.render('signin', {
        title: 'Sign In | Address Book'
    });
});

router.post('/', auth.restrictUserMiddleware(), passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: "/signin"
}));

module.exports = router;
