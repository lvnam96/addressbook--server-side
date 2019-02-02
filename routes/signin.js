const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../services/auth');
const React = require('react');
const signinFormHTMLString = require('../views/ssr/Signin.ssr.js').default;

// '/signin' route

router.get('/', auth.restrictUserMiddleware, (req, res, next) => {
    const query = req.query;
    // if (query.returnedUser) {
    //     return res.render('signin', {
    //         ssr: renderToString(React.createElement(AppSSR)) || '',
    //         title: 'Sign In | Address Book',
    //         returnedUser: query.returnedUser
    //     });
    // }
    res.render('signin', {
        ssr: signinFormHTMLString || '',
        title: 'Sign In | Address Book'
    });
});

router.post('/',
    auth.restrictUserMiddleware,
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
