function restrictNonUserMiddleware (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/signin');
}

function restrictUserMiddleware (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    restrictNonUserMiddleware,
    restrictUserMiddleware
};
