'use strict'

const Router = require('express').Router;
const router = new Router();

const bcrypt = require('bcrypt');

const mysql = require('./mysql');

const elasticsearch = require('./elasticsearch');
const googlesheet = require('./googlesheet');

const getBcrypt = (password, next) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(password);
    else {
      bcrypt.hash(password, salt, (err2, hash) => {
        if (err2) next(password);
        else next(hash);
      });
    }
  });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

let sessionId = 0;

const dummy = {
  id: 0,  // This should be added for internal usage!
  email: 'dummy@dummy',
  name: 'Dummy',
  // password: String, // Do not send the password back to client!!
  bio: 'I\'m dummy',
  address: 'Somewhere on the planet',
  phone: '02-8888-8888',
  mobile: '0900-000-000',
  personal_website: 'http://topjohnwu.github.io/donate/',
  facebook: 'http://topjohnwu.github.io/donate/',
  linkin: 'http://topjohnwu.github.io/donate/',
  ms: '',
  phd: '',
  searching_area: '',
};

const auth = (req, res, next) => {
  const email = req.cookies.email;
  console.log('auth email', email);
  if (!email || email === 'undefined') {
    res.sendStatus(401);
  } else {
    mysql.user_checkExist(email, (err, exist) => {
      if (err || !exist) {
        res.sendStatus(401);
      } else { next(); }
    });
  }
};

router.post('/api/register', (req, res) => {
  console.log('body', req.body);
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, msg: 'Please pass email and password.' });
  } else {
    getBcrypt(req.body.password, (hash) => {
      if (hash === req.body.password) {
        console.log('bcrypt err...!');
        res.send('Bcrypt Error.');
      } else {
        const newUser = {
          EMAIL: req.body.email,
          PASSWORD: hash,
        };

        console.log('create new user: ', newUser);
        mysql.user_createUser(newUser, (err, result) => {
          console.log('err', err);
          console.log('result', result);
          if (err) {
            console.log(err);
            res.send(err);
          } else if (!result) {
            res.send(result);
          } else {
            res.cookie('email', newUser.email);
            res.send('Succeed.');
          }
        });
      }
    });
  }
});


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // TODO: Should be replaced by proper session id generation

  sessionId = Math.floor((Math.random() * 1000) + 1); // Fake session id

  // TODO: Should check database and fetch the user data

  if (email === 'dummy@dummy' && password === 'dummy') {
    res.cookie('session', sessionId);
    res.json(dummy);
  } else res.json(null);

  // if (!email || !password) {
  //   res.send('login failed');
  // } else {
  //   mysql.user_checkPassword(email, password, (err, res2) => {
  //     console.log('err', err);
  //     console.log('res', res2);
  //     if (!err && res) {
  //       res.cookie('email', email);
  //       res.send('Succeed.');
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // }
});

router.post('/session', (req, res) => {
  const id = req.body.id;

  // TODO: Should be replaced by proper session check

  if (id == sessionId) res.json(dummy);

  // "==" is intended, don't change it as eslint suggest!!
  // Cookies can only be stored as strings, to compare
  // the strings with numbers, we have to use "=="

  else res.json(null);
});

router.get('/logout', (req, res) => {

  // TODO: Proper session id removal

  sessionId = 0;

  // const email = req.cookies.email;
  // console.log('logOut email', email);
  // res.cookie('email', 'undefined');
  // res.send('logOut success!');
});

router.get('/content', auth, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

router.post('/formSignIn', (req, res) => {
  // console.log('req: ', req);
  console.log('password:', req.body.inputPassword);
  res.send('Succeed');
});

router.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
