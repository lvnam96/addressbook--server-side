const express = require('express');
const router = express.Router();

// '/settings' route

router.get('/', (req, res, next) => {
  res.sendStatus(404);
  next();
});

module.exports = router;
