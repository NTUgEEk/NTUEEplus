/* eslint no-console: 0 */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxy = require('proxy-middleware');
const config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const logger = require('morgan');

require('./server/run');

const API_PORT = 8080;
const DEV_PORT = 3000;

const app = express();
const compiler = webpack(config);

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

app.use('/public', express.static('public'));
app.use('/api', proxy(`http://localhost:${API_PORT}/api`));

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
