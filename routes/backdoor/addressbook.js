const express = require('express');
const router = express.Router();
const db = require('../../db/index');

// '/backdoor/addressbook' route

// router.post('/add', (req, res, next) => {
//     req.user.addAdrsbook(req.body.adrsbook).then(res => {
//         res.json({ res: true, adrsbook: res.adrsbook });
//     });
// });

router.get('/', (req, res, next) => {
    console.log('GET request to /backdoor/addressbook');
});

module.exports = router;
