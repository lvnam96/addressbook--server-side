const express = require('express');
const router = express.Router();

// GET '/signin' route
router.get('/', (req, res, next) => {
	res.render('signin', {
		title: 'Login | Address Book',
		isFailed: false
	});
});

// POST '/signin' route
router.post('/', (req, res, next) => {
	if (req.body.user === '1' && req.body.pass === '2') {
		res.redirect('/');
	} else {
		res.render('signin', {
			title: 'Login | Address Book',
			isFailed: true
		});
	}
});

module.exports = router;
