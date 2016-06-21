/* eslint no-console: 0 */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxy = require('proxy-middleware');
const config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const User = require('./server/models/user');

require('./server/run');

const API_PORT = 8080;
const DEV_PORT = 3000;

const app = express();
const compiler = webpack(config);

function getBcrypt(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

app.use(cookieParser());

app.use(session({
  secret: 'WebProgrammingFinalHarveyAndJohn',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore(),
  cookie: { secure: true },
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

mongoose.connect(require('./server/config/database').database);

app.use('/public', express.static('public'));
app.use('/api', proxy(`http://localhost:${API_PORT}/api`));

const auth = (req, res, next) => {
  const username = req.session.cookie.username;
  console.log('session', req.session);
  console.log('username', username);
  if (username) {
    res.sendStatus(401);
  } else {
    User.findOne({ name: username }, (err, user) => {
      if (err || !user) { res.sendStatus(401); }
      next();
      // user.comparePassword(password, user.password, (err2, res2) => {
      //   if (res2 && !err2) {
      //     next();
      //   } else {
      //     res.sendStatus(401);
      //   }
      // });
    });
  }
};

app.post('/register', (req, res) => {
  console.log('body', req.body);
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: 'Please pass name and password.' });
  } else {
    const hash = getBcrypt(req.body.password);
    console.log('hash', hash);
    const newUser = new User({
      name: req.body.username,
      password: hash,
    });

    console.log('create new user: ', newUser);
    newUser.save((err) => {
      if (err) {
        res.json({ success: false, msg: 'Username already exists.' });
      }
      req.session.username = newUser.name;
      res.send('Succeed.');
    });
  }
});

// Login endpoint
app.post('/signIn', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('body', req.body);
  if (!username || !password) {
    res.send('login failed');
  } else {
    User.findOne({ name: username }, (err, user) => {
      console.log('user', user);
      if (err) { res.send(err); }
      if (!user) { res.send('Incorrect username.'); }
      user.comparePassword(password, user.password, (err2, res2) => {
        console.log('res', res2);
        console.log('err2', err2);
        if (res2 && !err2) {
          console.log('session', req.session);
          req.session.cookie.username = username;
          console.log('session', req.session);
          req.session.save((err4) => {
            console.log('save err: ', err4);
          });
          res.send('login success!');
        } else {
          console.log('Incorrect password.');
        }
      });
    });
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('logout success!');
});

// Get content endpoint
app.get('/content', auth, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

app.get('/Logout', (req, res) => {
  res.render('Logout');
});

app.get('/dropDatabase', (req, res) => {
  console.log('get drop...');
  mongoose.connection.db.dropDatabase('User', (err, result) => {
    console.log('err', err);
    console.log('result', result);
    res.send(result);
  });
});

app.get('*', (req, res) => {
  res.render('index');
  // res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(DEV_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
