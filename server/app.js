const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const api = require('./api');

const cookieParser = require('cookie-parser');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('connected and emitting...'); // eslint-disable-line no-console
  socket.emit('news', { hello: 'world' });

  socket.on('disconnect', () => {
    console.log('disconnected...');
  });
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
