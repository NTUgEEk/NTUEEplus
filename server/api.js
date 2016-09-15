'use strict'

const Router = require('express').Router;
const router = new Router();

const bcrypt = require('bcrypt');

const mysql = require('./mysql');

const elasticsearch = require('./elasticsearch');
// const googlesheet = require('./googlesheet');

const saltRounds = 10;

const getBcrypt = (password, next) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) next(password);
    else {
      bcrypt.hash(password, salt, (err2, hash) => {
        if (err2) next(password);
        else next(hash);
      });
    }
  });
};

const dummy = {
  id: 0,  // This should be added for internal usage!
  email: 'dummy@dummy',
  hashedPassword: 'dummy',
  hashedSessionId: 0,
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

const users = [
  dummy,
];

const getUserByEmail = (email) => {
  for (let i = 0; i < users.length; ++i) {
    if (email === users[i].email) return users[i];
  }
  return null;
};

const setUserInfoByEmail = (email, key, value) => {
  for (let i = 0; i < users.length; ++i) {
    if (email === users[i].email) {
      users[i][key] = value;
      break;
    }
  }
};

const extractUser = (user) => {
  const clonedUser = {};
  Object.keys(user).forEach((key) => {
    if (user.hasOwnProperty(key)) {
      clonedUser[key] = user[key];
    }
  });
  clonedUser.hashedPassword = undefined;
  clonedUser.hashedSessionId = undefined;
  return clonedUser;
};

const auth = (req, res, next) => {
  const email = req.cookies.email;
  const sessionId = req.cookies.sessionId;
  console.log('auth email, sessionId', email, sessionId);
  if (!email || email === 'undefined') {
    res.sendStatus(401);
  } else {
    const user = getUserByEmail(email);
    if (user === null) res.sendStatus(401);
    else {
      bcrypt.compare(sessionId, user.hashedSessionId, (err, result) => {
        if ((!err && result) || sessionId === user.hashedSessionId) {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }
  }
};

router.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ result: 'Fail', msg: 'Please pass email and password.' });
  } else {
    const user = getUserByEmail(req.body.email);
    if (user !== null) {
      res.json({ result: 'exist' });
    } else {
      getBcrypt(req.body.password, (hashed) => {
        const newUser = {
          email: req.body.email,
          hashedPassword: hashed,
        };
        users.push(newUser);
        res.json({ result: 'success' });
      });
    }
  }
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email);
  if (user !== null) {
    bcrypt.compare(password, user.hashedPassword, (err, result) => {
      if ((!err && result === true) || password === user.hashedPassword) {
        const sessionId = Math.random().toString(36).substring(15);
        res.cookie('email', email);
        res.cookie('sessionId', sessionId);
        res.json(extractUser(user));
        console.log('hash generated.');
        getBcrypt(sessionId, (hash) => {
          setUserInfoByEmail(email, 'hashedSessionId', hash);
        });
      } else {
        res.json(null);
      }
    });
  } else {
    res.json(null);
  }
});

router.post('/session', (req, res) => {
  const email = req.body.email;
  const id = req.body.id;

  const user = getUserByEmail(email);
  if (user === null) res.json(null);
  else {
    bcrypt.compare(id, user.hashedSessionId, (err, result) => {
      if ((!err && result === true) || id === user.hashedSessionId) {
        res.json(extractUser(user));
      } else {
        res.json(null);
      }
    });
  }
});

router.post('/logout', (req, res) => {
  const email = req.cookies.email;
  const user = getUserByEmail(email);

  res.cookie('email', undefined);
  res.cookie('sessionId', undefined);

  if (user === null) res.send('user not found');
  else {
    res.send('logout success!');
    setUserInfoByEmail(email, 'hashedSessionId', undefined);
  }
});

router.get('/content', auth, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

router.post('/formSignIn', (req, res) => {
  // console.log('req: ', req);
  console.log('password:', req.body.inputPassword);
  res.send('Succeed');
});

const stringToArray = (string) => {
  const array = string.split(' ');
  for (let i = 0, length = array.length; i < length; ++i) {
    if (array[i].length === 0) {
      array.splice(i, 1);
      --i;
      --length;
    }
  }
  return array;
};

router.post('/search', (req, res) => {
  elasticsearch.search(stringToArray(req.body.searchText), (err, hits) => {
    if (err) {
      res.json(null);
    } else {
      res.json(hits);
    }
  });
});

router.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
