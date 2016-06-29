const bcrypt = require('bcrypt');

exports.createUser = (con, data, next) => {
  con.query('INSERT INTO USER SET ?', data, next);
};

exports.checkPassword = (con, email, password, next) => {
  con.query('SELECT EMAIL, PASSWORD FROM USER WHERE EMAIL = ?', [email], (err, rows) => {
    if (err || !rows || rows.length > 1) {
      next(err, false);
    } else if (rows.length !== 1) {
      next(null, false);
    } else {
      bcrypt.compare(password, rows[0].PASSWORD, next);
    }
  });
};

exports.checkExist = (con, email, next) => {
  con.query('SELECT Email FROM USER WHERE EMAIL = ? LIMIT 1', [email], (err, rows) => {
    if (err || !rows || rows.length > 1) {
      next(err, false);
    } else if (rows.length !== 1) {
      next(null, false);
    } else {
      next(null, true);
    }
  });
};

exports.updateUser = (con, email, data, next) => {
  con.query('UDPATE USER SET ? WHERE EMAIL = ?', [data, email], next);
};
