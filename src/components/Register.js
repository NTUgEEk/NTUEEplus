import React, { Component } from 'react';
import 'babel-polyfill';
import { Link } from 'react-router';

import '../styles/Register.css'

export default class Signup extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="container">
        <form className="form-signin" role="form">
          <h2 className="form-signin-heading">註冊</h2>
          <div className="form-group">
            <label for="inputEmail">電子信箱</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email" required autoFocus />
          </div>
          <div className="form-group">
            <label for="inputPassword">密碼</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
          </div>
          <div className="form-group">
            <label for="inputPassword">確認密碼</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Type password again" required />
          </div>
          <button className="btn btn-lg btn-block btn-reg" type="submit">立即註冊</button>
        </form>
      </div>
    )
  }
}