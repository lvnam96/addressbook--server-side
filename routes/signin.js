const express = require('express');
const router = express.Router();

// '/signin' route

router.get('/', (req, res, next) => {
    if (req.cookies.isSignedIn === 'true') {
        if (req.query.signout === 'true') {
            res.clearCookie('isSignedIn');
        }
        res.redirect('/');
    } else {
        res.render('signin', {
    		title: 'Login | Address Book'
    	});
    }
});

router.post('/', (req, res, next) => {
	if (req.body.user === '1' && req.body.pass === '2') {
        res.cookie('isSignedIn', true);
		res.redirect('/');
	} else {
        res.render('signin', {
    		title: 'Login | Address Book',
            isFailed: true
    	});
	}
});

module.exports = router;
