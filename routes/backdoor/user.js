const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const adbk = require('../../classes/adbk');

// '/backdoor/user' route

// TESTED
router.post('/meta/set-default-cbook', (req, res, next) => {
  adbk.cbook
    .setDefault(req.user, req.body.cbookId)
    // eslint-disable-next-line promise/always-return
    .then(() => {
      res.json({ res: true });
    })
    .catch((err) => {
      console.error(err);
      res.json({ res: false });
    });
});

router.get('/', (req, res, next) => {
  res.sendStatus(403);
});

module.exports = router;
