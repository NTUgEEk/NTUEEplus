const Router = require('express').Router;
const router = new Router();

const mysql = require('mysql');

// First you need to create a connection to the db
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4h4a4r4v4e4y4',
  database: 'testDB',
});

con.connect(err => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
  con.query('SELECT * FROM employees', (err2, rows) => {
    if (err2) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
  });
});

router.use((err, req, res) => {
  // console.log('error occurs: ' + err.message);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
