const express = require('express');
const router = express.Router();
const adbk = require('../classes/adbk');

//  '/log' route

router.post('/csp-report', express.json, (req, res, next) => {
  adbk.dev.debug(`Blocked file: ${req.body['csp-report']['source-file']}`);
  adbk.dev.debug(`Blocked URI: ${req.body['csp-report']['blocked-uri']}`);
  adbk.dev.debug(`Violated directive: ${req.body['csp-report']['violated-directive']}`);
  res.status(200).end('Logged');
});

module.exports = router;
