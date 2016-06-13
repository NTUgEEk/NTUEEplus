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

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.request = this.request.bind(this);
    // this.succeed = this.succeed.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  login() {
    this.request(true);
  }

  register() {
    this.request(false);
  }

  request(login) {
    const username = ReactDOM.findDOMNode(this.refs.username).value;
    const password = ReactDOM.findDOMNode(this.refs.password).value;
    const thisArg = this;

    fetch('/api/users', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, // username: username
        password, // password: password
        login,
      }),
    })
      .then((res) => {
        console.log('status: ', res.status);
        return res.json();
      })
      .then((json) => {
        if (login) {
          if (json === 'Succeed login.') {
            this.succeed(username);
          } else {
            thisArg.setState({ err: json });
          }
        } else {
          if (json === 'Succeed register.') {
            this.succeed(username);
          } else {
            thisArg.setState({ err: json });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // succeed(username) {
  //   console.log('succeedLogIn: ', username);
  //   const { router } = this.context;
  //   router.push(`/${username}`);
  // }

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
              <button className="form__submit-btn" onClick={this.login}>LogIn</button>
              <button className="form__submit-btn" onClick={this.register}>Register</button>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default LogIn;
