const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');
const React = require('react');// required for ssr
const signinFormHTMLString = require('../views/ssr/Signin.ssr.js').default;

// '/signin' route

router.get('/', auth.allowNonUserAccessing, (req, res, next) => {
    const query = req.query;
    return res.render('signin', {
        returnedUser: query.returnedUser || null,
        ssr: signinFormHTMLString || '',
        // title: 'Sign In | Contacts Book'
    });
});

router.post('/',
    auth.allowNonUserAccessing,
    (req, res, next) => {//https://github.com/jaredhanson/passport-local/issues/4#issuecomment-4521526
        req.body.uname = req.body.uname.trim().toLowerCase();
        passport.authenticate('local', (err, user, info) => {
            if (err) {// uname is not found
                return res.json({ res: false });
            }
            if (!user) {// wrong password
                return res.json({ res: false });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.json({ res: true });
            });
        })(req, res, next);
    }
);

module.exports = router;
