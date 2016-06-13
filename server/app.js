'use strict'

const express = require('express');
const path = require('path');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Router = require('express').Router;
const router = new Router();

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

router.use((err, req, res) => {
  // console.log("error occurs: " + err.message);
  res.status(err.status || 500);
  res.send(err);
});

app.use('/api', router);
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
