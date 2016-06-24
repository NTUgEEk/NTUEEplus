const bcrypt = require('bcrypt');

exports.createUser = (con, data, next) => {
  console.log('data', data);
  con.query('INSERT INTO USER SET ?', data, next);
};

exports.checkPassword = (con, email, password, next) => {
  console.log('email', email);
  console.log('password', password);
  con.query('SELECT EMAIL, PASSWORD FROM USER WHERE Email = ?', [email], (err, rows) => {
    if (err || !rows || rows.length > 1) {
      next(err, false);
    } else if (rows.length !== 1) {
      console.log(`checkPassword: User not found with email: ${email}`);
      next(null, false);
    } else {
      bcrypt.compare(password, rows[0].PASSWORD, next);
    }
  });
};

exports.checkExist = (con, email, next) => {
  con.query('SELECT Email FROM USER WHERE Email = ? LIMIT 1', [email], (err, rows) => {
    if (err || !rows || rows.length > 1) {
      next(err, false);
    } else if (rows.length !== 1) {
      console.log(`checkExist: User not found with email: ${email}`);
      next(null, false);
    } else {
      next(null, true);
    }
  });
};
