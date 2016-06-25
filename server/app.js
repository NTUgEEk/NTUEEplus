const express = require('express');
const path = require('path');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const api = require('./api');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

mongoose.connect(require('./config/database').database);

app.use(cookieParser());

app.use(session({
  secret: 'WebProgrammingFinalHarveyAndJohn',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 3600,
  }),
  cookie: { secure: true },
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));


const mysql = require('./mysql');

const getBcrypt = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const auth = (req, res, next) => {
  const email = req.cookies.email;
  console.log('email', email);
  if (!email) {
    res.sendStatus(401);
  } else {
    mysql.user_checkExist(email, (err, exist) => {
      if (err || !exist) { res.sendStatus(401); }
      next();
    });
  }
};

app.post('/api/register', (req, res) => {
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
      } else {
        res.cookie('email', newUser.email);
        res.send('Succeed.');
      }
    });
  }
});

// Login endpoint
app.post('/api/signIn', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.send('login failed');
  } else {
    mysql.user_checkPassword(email, password, (err, res2) => {
      console.log('err', err);
      console.log('res', res2);
      if (!err && res) {
        res.cookie('email', email);
        res.send('Succeed.');
      } else {
        res.send(err);
      }
    });
  }
});

// Logout endpoint
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('logout success!');
});

// Get content endpoint
app.get('/api/content', auth, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

app.get('/api/dropDatabase', (req, res) => {
  console.log('get drop...');
  mongoose.connection.db.dropDatabase('User', (err, result) => {
    console.log('err', err);
    console.log('result', result);
    res.send(result);
  });
});




app.use('/api', api);

app.get('Logout', (req, res) => {
  res.render('Logout');
});

app.use('*', (req, res) => {
  res.render('index');
  // res.sendFile(path.join(__dirname, '..', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });

  socket.on('disconnect', () => {
    console.log('disconnected...');
  });
});

// error handlers

// development error handler
// will print stacktrace
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
