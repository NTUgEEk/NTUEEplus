const Mysql = require('mysql');

const User = require('./models/user');
const WorkExperience = require('./models/work_experience');

const con = Mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4h4a4r4v4e4y4',
  database: 'testDB',
});
try {
  con.connect(err => {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
    con.query('SELECT * FROM USER', (err2, rows) => {
      if (err2) throw err2;

      console.log('Data received from Db:\n');
      console.log(rows);
    });
  });
} catch (err) {
  console.log('Mysql conneciton error', err);
}


exports.user_createUser = (data, next) => {
  User.createUser(con, data, next);
};

exports.user_checkPassword = (email, password, next) => {
  User.checkPassword(con, email, password, next);
};

exports.user_checkExist = (email, next) => {
  User.checkExist(con, email, next);
};

exports.user_updateUser = (email, data, next) => {
  User.updateUser(con, email, data, next);
};

exports.work_experience_createWorkExperience = (data, next) => {
  WorkExperience.createWorkExperience(con, data, next);
};
