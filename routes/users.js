const express = require('express');
const router = express.Router();

// '/users' route

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
