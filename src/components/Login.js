import React, { Component } from 'react';
import 'babel-polyfill';
import { Link } from 'react-router';

import '../styles/Login.css';

class Login extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.signIn = this.signIn.bind(this);
  }

  signIn() {
    console.log('signIn clicked.');
  }

  render() {
    return (
      <div className="container">
        <form action="./api/formSignIn" method="post" className="form-signin" role="form">
          <h2 className="form-signin-heading">登入</h2>
          <div className="form-group">
            <label htmlFor="inputEmail">電子信箱</label>
            <input type="email" name="inputEmail" className="form-control" placeholder="Email" required autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword">密碼</label>
            <input type="password" name="inputPassword" className="form-control" placeholder="Password" required />
          </div>
          <div className="form-suffix">
            <Link to="/register">還沒有帳號</Link> 或是 <Link to="/forget">忘記密碼？</Link>
          </div>
          <button className="btn btn-lg btn-block btn-login" type="submit">登入</button>
        </form>
      </div>
    );
  }
}

export default Login;
