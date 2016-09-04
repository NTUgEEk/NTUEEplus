import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchJSON } from '../utils';
import { setUser } from '../redux/actions';

import '../styles/Register.css';

class Signup extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    setUser: React.PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirm: '',
      existed: false,
      invalid: false,
      error: false,
    };
    this.register = this.register.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
  }

  register(e) {
    // Backend TODO: Implement the API for register
    e.preventDefault();
    if (this.state.password !== this.state.confirm) {
      this.setState({ invalid: true });
    } else {
      fetchJSON(
        '/api/register',
        {
          email: this.state.email,
          password: this.state.password,
        },
        (json) => {
          switch (json.result) {
            case 'exist':
              this.setState({ existed: true });
              break;
            case 'success':
              this.context.router.push('/login');
              break;
            default:
              this.setState({ error: true });
          } }
      );
    }
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleConfirmChange(e) {
    this.setState({ confirm: e.target.value });
  }

  render() {
    // UI TODO: Implement UI changes for existing account, confirm incorrect, and register error
    return (
      <div className="container">
        <form className="form-signin" role="form" onSubmit={this.register}>
          <h2 className="form-signin-heading">註冊</h2>
          <div className="form-group">
            <label htmlFor="inputEmail">電子信箱</label>
            <input
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword">密碼</label>
            <input
              type="password"
              name="inputPassword"
              className="form-control"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputConfirm">確認密碼</label>
            <input
              type="password"
              name="inputPassword"
              className="form-control"
              placeholder="Type password again"
              value={this.state.confirm}
              onChange={this.handleConfirmChange}
              required
            />
          </div>
          <button className="btn btn-lg btn-block btn-reg" type="submit">立即註冊</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(null, mapDispatchToProps)(Signup);
