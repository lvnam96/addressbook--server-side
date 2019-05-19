const express = require('express');
const router = express.Router();
const User = require('../../classes/User');
const auth = require('../../services/auth');
const db = require('../../db/index');
const adrsbkRouter = require('./addressbook');
const contactsRouter = require('./contacts');
const adbk = require('../../classes/adbk');

// '/backdoor' route

router.get('/is-uname-used', (req, res, next) => {
  User.isUnameUsed(req.query.uname, (customErrMsg, result) => {
    if (customErrMsg) {
      console.log('Error on server');
    }
    res.json({ res: result });
  });
});

router.get('/get-all-data', auth.allowUserAccessing, (req, res, next) => {
  adbk.user
    .loadAll(req.user.id)
    .then((data) => {
      data = {
        user: data.user.toJSON(),
        adrsbook: data.adrsbook.toJSON(),
      };
      res.json({ res: true, data });
    })
    .catch((err) => {
      console.error(err);
      res.json({ res: false });
    });
});

router.use('/addressbook', auth.allowUserAccessing, adrsbkRouter);

router.use('/contacts', auth.allowUserAccessing, contactsRouter);

router.get('/', auth.allowUserAccessing, (req, res, next) => {
  console.log('GET request to /backdoor');
});

module.exports = router;
