import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

// import LogIn from './components/LogIn';
// import Lobby from './components/Lobby';
// import NotFoundPage from './components/NotFoundPage';

import Routing from './components/Routing';
import Login from './components/Login';
import Header from './components/Header';
import Signup from './components/Signup';
import UserInfo from './components/UserInfo';
import Aboutme from './components/Aboutme';
import Abroad from './components/Abroad';
import Carrier from './components/Carrier';
import Support from './components/Support';

import NotFoundPage from './components/NotFoundPage';


export default (
  <Route path="/" component={Routing}>
    <Route component={Header}>
      <IndexRoute component={Aboutme} />
      <Route path="abroad" component={Abroad} />
      <Route path="carrier" component={Carrier} />
      <Route path="support" component={Support} />
      <Route path="user">
        <Route path=":userid" component={UserInfo} />
      </Route>
    </Route>
    <Route path="login" component={Login} />
    <Route path="signup" component={Signup} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
