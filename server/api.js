const Router = require('express').Router;
const router = new Router();

const bcrypt = require('bcrypt');

const mysql = require('./mysql');

const randomString = () => {
  return Math.random().toString(36);
};

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

const user_MysqlToJson = (user) => {
  const jsonUser = {
    id: user.ID,
    email: user.EMAIL,
    name: user.NAME,
    bio: user.BIO,
    address: user.ADDRESS,
    phone: user.PHONE,
    mobile: user.MOBILE,
    personal_website: user.PERSONAL_WEBSITE,
    facebook: user.FACEBOOK,
    linkin: user.LINKIN,
    ms: user.MS,
    phd: user.PHD,
    searching_area: user.SEARCHING_AREA,
  };
  return jsonUser;
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
  const email = req.body.email;
  if (!email || !req.body.password) {
    res.json({ success: false, msg: 'Please pass email and password.' });
  } else {
    getBcrypt(req.body.password, (hash) => {
      if (hash === req.body.password) {
        console.log('bcrypt err...!');
        res.send('Bcrypt Error.');
      } else {
        const newUser = {
          EMAIL: email,
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
            // res.cookie('email', newUser.email);
            // res.send('Succeed.');
            const sessionId = randomString();
            mysql.user_updateUser(email, { sessionId }, (err2, result2) => {
              if (err2 || !result2) {
                res.json(null);
              } else {
                res.cookie('session', sessionId);
                res.json(user_MysqlToJson({ email }));
              }
            });
          }
        });
      }
    });
  }
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  mysql.user_checkPassword(email, password, (err, result, user) => {
    if (err || !result) {
      req.json(null);
    } else {
      const sessionId = randomString();
      mysql.user_updateUser(email, { sessionId }, (err2, result2) => {
        if (err2 || !result2) {
          res.json(null);
        } else {
          res.cookie('session', sessionId);
          res.json(user_MysqlToJson(user));
        }
      });
    }
  });
});

router.post('/session', (req, res) => { // get
  const sessionId = req.body.id; // req.cookies.session

  mysql.user_fetchBySessionId(sessionId, (err, user) => {
    if (err || !user) {
      res.json(null);
    } else {
      res.json(user_MysqlToJson(user));
    }
  });
});

router.get('/logout', (req, res) => {
  const sessionId = req.cookies.session;

  mysql.user_logOut(sessionId, (err, result) => {
    if (err) {
      res.send(err);
    } else if (!result) {
      res.json('Logout error');
    } else {
      res.cookie('session', null);
      res.json('Succeed logout.');
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

router.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
