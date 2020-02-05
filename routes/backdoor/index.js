const express = require('express');
const router = express.Router();
const User = require('../../classes/User');
const { allowUserAccessing } = require('../../middlewares/auth');
const cbookRouter = require('./cbook');
const contactsRouter = require('./contacts');
const userRouter = require('./user');
const adbk = require('../../classes/adbk');
const xsrfMiddleware = require('../../middlewares/csrf');

// '/backdoor' route

const middlewares = [allowUserAccessing, xsrfMiddleware];

// this route need to be secured (using token) & limited on the amount of requests
router.get('/is-uname-used', (req, res, next) => {
  User.findByUname(req.query.uname)
    .then((user) => {
      res.json({ res: !!user });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/is-email-used', (req, res, next) => {
  User.findByEmail(req.query.email)
    .then((user) => {
      res.json({ res: !!user });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/get-all-data', ...middlewares, (req, res, next) => {
  adbk.user
    .loadAll(req.user.id)
    .then((resData) => {
      const json = {
        res: true,
        data: {
          ...resData,
          user: resData.user.toJSON(),
          contacts: resData.contacts.toJSON(),
        },
      };
      res.json(json);
      return json;
    })
    .catch((err) => {
      console.error(err);
      res.json({ res: false });
    });
});

router.use('/cbook', ...middlewares, cbookRouter);

router.use('/contacts', ...middlewares, contactsRouter);

router.use('/user', ...middlewares, userRouter);

router.get('/', ...middlewares, (req, res, next) => {
  res.sendStatus(403);
  res.end();
});

module.exports = router;
