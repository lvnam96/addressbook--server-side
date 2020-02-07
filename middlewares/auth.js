const passport = require('passport');

const allowUserAccessing = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/signin');
};

const allowNonUserAccessing = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};

const authenticate = (req, res, next) => {
  // https://github.com/jaredhanson/passport-local/issues/4#issuecomment-4521526
  req.body.uname = req.body.uname.trim().toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // uname is not found or error happens
      return res.json({ res: false });
    }
    if (!user) {
      // wrong password
      return res.json({ res: false });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json({ res: true });
    });
  })(req, res, next);
};

module.exports = {
  allowUserAccessing,
  allowNonUserAccessing,
  authenticate,
};
