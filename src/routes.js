import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import LogIn from './components/LogIn';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/">
    <IndexRoute component={LogIn} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
