'use strict'

const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const api = require('./api');

const cookieParser = require('cookie-parser');

const app = express();

const server = require('http').createServer(app);

const bcrypt = require('bcrypt');
const elasticsearch = require('./elasticsearch');

const getUserByEmail = (email, next) => {
  elasticsearch.getUserByAttr('email', email, (err, user) => {
    if (user !== null) {
      user._source.id = user._id; // eslint-disable-line
      next(user._source); // eslint-disable-line
    } else {
      next(null);
      console.log('can\'t find user with email: ', email);
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

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api', api);

app.get('Logout', (req, res) => {
  res.render('Logout');
});

app.use('*', (req, res) => {
  console.log('cookies: ', req.cookies);
  if (req.cookies !== undefined && req.cookies.email !== undefined && req.cookies.sessionId) {
    const email = req.cookies.email;
    const sessionId = req.cookies.sessionId;
    console.log('email: ', email, 'sessionId: ', sessionId);

    getUserByEmail(email, (user) => {
      if (user === null) res.render('index', { server: 'null' });
      else {
        bcrypt.compare(sessionId, user.hashedSessionId, (err, result) => {
          console.log('sessionId: ', sessionId, 'ans: ', user.hashedSessionId);
          if ((!err && result) || sessionId === user.hashedSessionId) {
            const extracted = extractUser(user);
            res.render('index', { server: `${JSON.stringify(extracted)}` });
          } else {
            res.render('index', { server: 'null' });
          }
        });
      }
    });
  } else {
    res.render('index', { server: 'null' });
  }
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
} else if (app.get('env') === 'production') {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: 'None',
    });
  });
}

module.exports = server;
