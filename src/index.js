import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'babel-polyfill';

import routes from './routes';
import reducer from './redux/reducers';

let store = createStore(reducer);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes(store)} />
  </Provider>,
  document.getElementById('root')
);
