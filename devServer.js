/* eslint no-console: 0 */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxy = require('proxy-middleware');
const config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

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

require('./server/config/passport')(passport);

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static('public'));
app.use('/api', proxy(`http://localhost:${API_PORT}/api`));

app.post('/register', (req, res, next) => {
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
      console.log('err', err);
      console.log('user', req.user);
      req.logIn(newUser, (err2) => {
        if (err2) {
          console.log('err2', err2);
          return next(err);
        }
        console.log('user', req.user);
        return res.redirect('/lobby');
      });
    });
  }
});

app.post('/signIn',
  passport.authenticate('local', {
    successRedirect: '/lobby',
    failureRedirect: '/login',
  }));

app.get('/logOut',
  (req, res) => {
    console.log(req.user);
    req.logout();
    console.log(req.user);
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    console.log('req.session', req.session);
    res.render('profile', { user: req.user });
  });

app.get('/Logout', (req, res) => {
  res.render('Logout');
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
