import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import UserInfo from './components/UserInfo';
import Aboutme from './components/Aboutme';
import Abroad from './components/Abroad';
import Carrier from './components/Carrier';
import Support from './components/Support';
import Logout from './components/Logout';
import NotFoundPage from './components/NotFoundPage';


export default (
  <Route path="/" component={Header}>
    <IndexRoute component={Aboutme} />
    <Route path="abroad" component={Abroad} />
    <Route path="carrier" component={Carrier} />
    <Route path="user">
      <Route path=":userid" component={UserInfo} />
    </Route>
    <Route path="support" component={Support} />
    <Route path="login" component={Login} />
    <Route path="register" component={Register} />
    <Route path="logout" component={Logout} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
