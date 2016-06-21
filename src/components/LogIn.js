import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

import './LogIn.css';

class LogIn extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      err: '',
    };

    this.signIn = this.signIn.bind(this);
    this.register = this.register.bind(this);
    this.request = this.request.bind(this);
    this.check = this.check.bind(this);
    this.logOut = this.logOut.bind(this);
    // this.succeed = this.succeed.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  signIn() {
    this.request(true);
  }

  register() {
    this.request(false);
  }

  request(signIn) {
    const username = ReactDOM.findDOMNode(this.refs.username).value;
    const password = ReactDOM.findDOMNode(this.refs.password).value;
    console.log('signIn', signIn);
    let url = '/register';
    if (signIn) url = '/signIn';

    fetch(url, {
      credentials: 'include',
      method: 'post',
      headers: {
        Accept: 'basic',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, // username: username
        password, // password: password
      }),
    })
      .then((res) => {
        console.log('status: ', res.status);
        console.log('res', res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  check() {
    fetch('/profile')
      .then((res) => {
        console.log('status: ', res.status);
        console.log('res', res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  logOut() {
    fetch('/logOut')
      .then((res) => {
        console.log('status: ', res.status);
        console.log('res', res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="form-page__wrapper">
        <div className="form-page__form-wrapper">
          <div className="form-page__form-header">
            <h2 className="form-page__form-heading">Login</h2>
          </div>
          <div className="form">
            <div className={classNames('form__error-wrapper', { hidden: (this.state.err === '') })}>
              <p className="form__error form__error--username-taken">
                {
                  this.state.err
                }
              </p>
            </div>
            <div className="form__field-wrapper">
              <input
                ref="username"
                className="form__field-input"
                type="text"
                placeholder="frank.underwood"
              />
              <label className="form__field-label" htmlFor="username">Username</label>
            </div>
            <div className="form__field-wrapper">
              <input
                ref="password"
                className="form__field-input"
                type="password"
                placeholder="••••••••••"
              />
              <label className="form__field-label" htmlFor="password">Password</label>
            </div>
            <div className="form__submit-btn-wrapper">
              <button className="form__submit-btn" onClick={this.signIn}>SignIn</button>
              <button className="form__submit-btn" onClick={this.register}>Register</button>
              <button className="form__submit-btn" onClick={this.check}>Check</button>
              <button className="form__submit-btn" onClick={this.logOut}>LogOut</button>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default LogIn;
