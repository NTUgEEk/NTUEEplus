const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = (passport) => {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ name: username }, (err, user) => {
        console.log('user', user);
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.comparePassword(password, user.password, (err2, res) => {
          console.log('res', res);
          console.log('err2', err2);
          if (res && !err2) done(null, user);
          else done(null, false, { message: 'Incorrect password.' });
        });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) { return done(err); }
      done(null, user);
    });
  });
};
