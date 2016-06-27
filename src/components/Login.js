import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';

import '../styles/Login.css'

export default class Login extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">
                <img src="/public/resource/eesa-white.png" style={{"maxHeight": "55px"}} />
              </a>
            </div>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="nav navbar-nav navbar-right">
                <li className="active"><a href="/login">登入</a></li>
                <li><a href="/register">註冊</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <form className="form-signin" role="form">
            <h2 className="form-signin-heading">登入</h2>
            <div className="form-group">
              <label for="inputEmail">電子信箱</label>
              <input type="email" id="inputEmail" className="form-control" placeholder="Email" required autoFocus />
            </div>
            <div className="form-group">
              <label for="inputPassword">密碼</label>
              <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
            </div>
            <button className="btn btn-lg btn-block" type="submit">登入</button>
          </form>
        </div>
      </div>
    )
  }
}
