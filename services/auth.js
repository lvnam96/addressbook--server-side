function allowUserAccessing (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/signin');
}

function allowNonUserAccessing (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    allowUserAccessing,
    allowNonUserAccessing
};
