import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

const socket = io.connect('http://localhost:8080/');
console.log(socket);
socket.on('msg', (data) => {
  console.log(data); // eslint-disable-line no-console
});
socket.on('news', (data) => {
  console.log(data); // eslint-disable-line no-console
  socket.emit('my other event', { my: 'data' });
});
render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('root')
);
