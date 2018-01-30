var express = require('express');
var router = express.Router();

// '/' route

router.get('/', function(req, res, next) {
    if (req.cookies.isSignedIn === 'true') {
        res.render('index', {
            title: 'Express',
            isSignedIn: true
        });
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;
