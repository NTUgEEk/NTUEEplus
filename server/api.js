const Router = require('express').Router;
const router = new Router();

const bcrypt = require('bcrypt');

const elasticsearch = require('./elasticsearch');
const studentdata = require('./studentdata');

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

const getUserByEmail = (email, next) => {
  elasticsearch.getUserByAttr('email', email, (err, user) => {
    console.log(user);
    if (err) {
      next(err);
      return;
    }
    if (user !== null) {
      user._source.id = user._id; // eslint-disable-line
      next(null, user._source); // eslint-disable-line
    } else {
      next(null, null);
    }
  });
};

const setUserInfoByEmail = (email, key, value) => {
  const doc = {};
  doc[key] = value;
  getUserByEmail(email, (err, user) => {
    if (user !== null) {
      elasticsearch.updateUserById(user.id, doc, (err2, resp) => {
        console.log('setUserInfoByEmail, udpate: ', err2, resp);
      });
    } else {
      console.log('setUserInfoByEmail user: ', user);
    }
  });
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

const auth = (req, res, next) => {
  const email = req.cookies.email;
  const sessionId = req.cookies.sessionId;
  console.log('auth email, sessionId', email, sessionId);
  if (!email || email === 'undefined') {
    res.sendStatus(401);
  } else {
    getUserByEmail(email, (err, user) => {
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
    });
  }
};

router.post('/checkEmail', (req, res) => {
  const email = req.body.email;

  if(!email) {
    res.json({ result: 'fail', msg: 'invalid request' });
    return;
  }

  getUserByEmail(email, (err, user) => {
    if(err) {
      res.json({ result: 'fail' });
      return;
    }
    if(user !== null) {
      console.log(user);
      res.json({ result: 'exist' });
      return;
    }
    res.json({ result: 'ok' });
  });
});

router.post('/register', (req, res) => {
  const email = req.body.email;

  if (!email || !req.body.password || !req.body.school_id || !req.body.name) {
    res.json({ result: 'fail', msg: 'invalid request' });
  } else {
    getUserByEmail(email, (err, user) => {
      if(err) {
        res.json({ result: 'fail' });
        return;
      }
      if(user) {
        res.json({ result: 'exist' });
        return;
      }
      elasticsearch.getUserByAttr('school_id', req.body.school_id, (err, user) => {
        if(err) {
          res.json({ result: 'fail' });
          return;
        }
        if(user) {
          res.json({ result: 'exist' });
          return;
        }
        studentdata.verify(req.body.school_id, req.body.name, (err, valid) => {
          if(err) {
            res.json({ result: 'fail' });
            return;
          }
          if(!valid) {
            res.json({ result: 'invalid' });
            return;
          }
          getBcrypt(req.body.password, (hashed) => {
            const newUser = {
              name: req.body.name,
              email: email, // eslint-disable-line
              hashedPassword: hashed,
              school_id: req.body.school_id
            };
            elasticsearch.createUser(newUser, (err) => {
              if(err) {
                res.json({ result: 'fail' });
                return;
              }
              res.json({ result: 'success' });
            });
          });
        });
      });
    });
  }
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  getUserByEmail(email, (err, user) => {
    if (user !== null) {
      console.log('user: ', user);
      bcrypt.compare(password, user.hashedPassword, (err, result) => {
        console.log('password: ', password, 'hashedPassword: ', user.hashedPassword);
        if ((!err && result === true) || password === user.hashedPassword) {
          const sessionId = Math.random().toString(36).substring(15);
          res.cookie('email', email, { expires: new Date(Date.now() + 900000), httpOnly: true });
          res.cookie('sessionId', sessionId, { expires: new Date(Date.now() + 900000), httpOnly: true });
          res.json(extractUser(user));
          console.log('hash generated.');
          getBcrypt(sessionId, (hash) => {
            console.log('sessionId, hash: ', sessionId, hash);
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
});

router.post('/session', (req, res) => {
  const email = req.body.email;
  const id = req.body.id;

  getUserByEmail(email, (err, user) => {
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
});

router.post('/logout', (req, res) => {
  const email = req.cookies.email;

  // res.cookie('email', undefined);
  // res.cookie('sessionId', undefined);
  res.clearCookie('email');
  res.clearCookie('sessionId');

  getUserByEmail(email, (err, user) => {
    if (user === null) res.send('user not found');
    else {
      res.json({ status: 'success' });
      setUserInfoByEmail(email, 'hashedSessionId', undefined);
    }
  });
});

router.get('/content', auth, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

router.post('/formSignIn', (req, res) => {
  // console.log('req: ', req);
  console.log('password:', req.body.inputPassword);
  res.send('Succeed');
});

router.post('/search', (req, res) => {
  console.log('in search, cookies: ', req.cookies);
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
