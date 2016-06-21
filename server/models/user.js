const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', next => {
  const user = this;
  console.log('this', this);
  if (this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      console.log('salt', salt);
      bcrypt.hash(user.password, salt, (err2, hash) => {
        if (err2) {
          return next(err);
        }
        user.password = hash;
        console.log('user.password', user.password);
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = (passw, passw2, next) => {
  bcrypt.compare(passw, passw2, (err, res) => {
    next(err, res);
  });
};

module.exports = mongoose.model('User', UserSchema);
