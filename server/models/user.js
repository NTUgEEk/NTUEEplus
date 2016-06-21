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

UserSchema.methods.comparePassword = (passw, passw2, next) => {
  bcrypt.compare(passw, passw2, (err, res) => {
    next(err, res);
  });
};

module.exports = mongoose.model('User', UserSchema);
