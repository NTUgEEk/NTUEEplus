import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import LogIn from './components/LogIn';
import Lobby from './components/Lobby';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/">
    <IndexRoute component={LogIn} />
    <Route path="lobby" component={Lobby} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
