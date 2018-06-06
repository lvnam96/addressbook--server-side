module.exports.restrictNonUserMiddleware = () => (
    function restrictNonUserMiddleware (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }
);

module.exports.restrictUserMiddleware = () => (
    function restrictUserMiddleware (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        return next();
    }
);
