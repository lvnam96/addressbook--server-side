const express = require('express');
const router = express.Router();
const passport = require('passport');
const Account = require('../classes/Account');
const auth = require('../services/auth');

router.get('/', auth.restrictUserMiddleware, (req, res, next) => {

});

module.exports = router;
