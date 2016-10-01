/* eslint no-console: 0 */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxy = require('proxy-middleware');
const config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const logger = require('morgan');

const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');
const elasticsearch = require('./server/elasticsearch');

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

require('./server/run');

const API_PORT = 8080;
const DEV_PORT = 3000;

const app = express();
const compiler = webpack(config);

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

app.use(logger('dev'));

app.use('/public', express.static('public'));
app.use('/api', proxy(`http://localhost:${API_PORT}/api`));

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

app.listen(DEV_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
