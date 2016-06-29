const Router = require('express').Router;
const router = new Router();

const bcrypt = require('bcrypt');

const mysql = require('./mysql');

const getBcrypt = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
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
    const hash = getBcrypt(req.body.password);
    console.log('hash', hash);
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

// Login endpoint
router.post('/login', (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const dummy = null;
  console.log(req.body);
  res.json(dummy);
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

router.get('/logOut', (req, res) => {
  const email = req.cookies.email;
  console.log('logOut email', email);
  res.cookie('email', 'undefined');
  res.send('logOut success!');
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
