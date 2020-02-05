const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const xsrfMiddleware = require('../middlewares/csrf');

// '/' route

router.get('/', auth.allowUserAccessing, (req, res, next) => {
  res.render('index', {
    // title: 'Contacts Book',
    isSignedIn: true,
  });
});

router.use('/users', auth.allowUserAccessing, require('./users'));
router.use('/cbooks', auth.allowUserAccessing, require('./cbooks'));
router.use('/signin', auth.allowNonUserAccessing, xsrfMiddleware, require('./signin'));
router.use('/signup', auth.allowNonUserAccessing, xsrfMiddleware, require('./signup'));
router.use('/settings', auth.allowUserAccessing, require('./settings'));
router.use('/backdoor', require('./backdoor/index'));
router.get('/signout', auth.allowUserAccessing, (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      // see route /signin to know which cookies are set
      res
        .clearCookie('session.sid', { path: '/' })
        .clearCookie('xsrf-jwt', { path: '/' })
        .clearCookie('XSRF-TOKEN', { path: '/' })
        .redirect('/signin');
    }
  });
});

module.exports = router;
