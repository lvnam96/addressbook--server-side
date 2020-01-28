const express = require('express');
const router = express.Router();
const adbk = require('../classes/adbk');
const { checkValidUUID } = require('../helpers/checker');

// '/cbooks' route

router.get('/:cbookId', (req, res, next) => {
  const isValidUUID = checkValidUUID(req.params.cbookId);
  if (isValidUUID) {
    adbk.cbook
      .setDefault(req.user, req.params.cbookId)
      .then(() => {
        res.render('index', {
          // title: 'Contacts Book',
          isSignedIn: true,
          cbookId: req.params.cbookId,
        });
      })
      .catch((err) => {
        console.error(err);
        next();
      });
  } else {
    console.error(new Error(`Forbiden request to /cbooks/:cbookId with wrong cbook id: ${req.params.cbookId}`));
    next();
  }
});

module.exports = router;
