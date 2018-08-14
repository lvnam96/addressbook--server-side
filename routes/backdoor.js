const express = require('express');
const router = express.Router();
const passport = require('passport');
const Account = require('../classes/Account');
const auth = require('../services/auth');

// '/backdoor' route

router.get('/isUnameUsed', (req, res, next) => {
    Account.isUnameUsed(req.query.uname, (customErrMsg, result) => {
        res.json({ res: result });
    });
});

module.exports = router;
