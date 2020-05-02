const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const adbk = require('../../classes/adbk');

// '/backdoor/cbook' route

// TESTED
router.post('/create', (req, res, next) => {
  adbk.cbook
    .create(req.body.cbook)
    .then((cbook) => {
      cbook = cbook.toJSON();
      res.json({ res: true, cbook });
      return cbook;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/update', (req, res, next) => {
  adbk.cbook
    .update(req.user, req.body.cbook)
    .then((cbook) => {
      cbook = cbook.toJSON();
      res.json({ res: true, cbook });
      return cbook;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/delete', (req, res, next) => {
  adbk.cbook
    .delete(req.user, req.body.cbook)
    .then((cbook) => {
      cbook = cbook.toJSON();
      res.json({ res: true, cbook });
      return cbook;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// get data of querying user's default cbook
router.get('/', (req, res, next) => {
  res.sendStatus(403);
});

module.exports = router;
