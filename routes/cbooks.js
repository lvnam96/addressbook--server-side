const express = require('express');
const router = express.Router();
const adbk = require('../classes/adbk');
const { isValidUUID } = require('../helpers/checker');

// '/cbooks' route

// regexp explaination: (simple match of uuid) OR (notthing)
// tested, see https://regex101.com/r/8ncUEA/2/tests
router.get('/:cbookId', async (req, res, next) => {
  const cbookId = req.params.cbookId;
  if (isValidUUID(cbookId)) {
    try {
      await adbk.cbook.setDefault(req.user, cbookId);
      res.render('index', {
        // title: 'Contacts Book',
        isSignedIn: true,
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(403);
  }
});

router.get('/', async (req, res, next) => {
  res.redirect('/');
});

module.exports = router;
