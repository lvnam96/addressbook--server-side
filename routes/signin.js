const express = require('express');
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const React = require('react'); // required for ssr
const signinFormHTMLString = require('../views/ssr/Signin.ssr.js').default;
// const adbk = require('../classes/adbk');
// const { getStrongCryptoRandomStr } = require('../helpers/random');
const { authenticate } = require('../middlewares/auth');

// '/signin' route

router.get('/', (req, res, next) => {
  const query = req.query;
  return res.render('signin', {
    returnedUser: query.returnedUser || null,
    ssr: signinFormHTMLString || '',
    // title: 'Sign In | Contacts Book'
  });
});

router.post('/', authenticate);

module.exports = router;
