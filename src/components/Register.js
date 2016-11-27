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
      name: '',
      id: '',
      existed: false,
      passwordInvalid: false,
      identityInvalid: false,
      error: false,
      step: 1
    };
    this.registerSecond = this.registerSecond.bind(this);
    this.registerFirst = this.registerFirst.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  registerFirst(e) {
    e.preventDefault();
    this.setState({
      existed: false,
      passwordInvalid: false,
      identityInvalid: false,
      error: false
    });
    if (this.state.password !== this.state.confirm) {
      this.setState({ passwordInvalid: true });
    } else {
      fetchJSON('/api/checkEmail',
      {
        email: this.state.email
      },
      (json) => {
        if(json.result === 'exist') this.setState({ existed: true });
        else if(json.result === 'ok') this.setState({ step: 2 });
        else this.setState({ error: true });
      });
    }
  }

  registerSecond(e) {
    // Backend TODO: Implement the API for register
    e.preventDefault();
    this.setState({
      existed: false,
      passwordInvalid: false,
      identityInvalid: false,
      error: false
    });
    fetchJSON(
      '/api/register',
      {
        email: this.state.email,
        password: this.state.password,
        school_id: this.state.id,
        name: this.state.name
      },
      (json) => {
        switch (json.result) {
          case 'exist':
            this.setState({ existed: true });
            break;
          case 'invalid':
            this.setState({ identityInvalid: true });
            break;
          case 'success':
            location.href = '/support';
            break;
          default:
            this.setState({ error: true });
        } }
    );
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

  handleIdChange(e) {
    this.setState({ id: e.target.value });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  renderError() {
    if(this.state.passwordInvalid) {
      return (
        <p className="text-danger">兩次輸入的密碼不符合！</p>
      );
    } else if(this.state.identityInvalid) {
      return (
        <p className="text-danger">查無此人！註冊失敗！</p>
      );
    } else if(this.state.existed) {
      return (
        <p className="text-danger">資料重複！您是否已經註冊過？</p>
      );
    } else if(this.state.error) {
      return (
        <p className="text-danger">伺服器發生錯誤！</p>
      );
    } else {
      return null;
    }
  }

  render() {
    // UI TODO: Implement UI changes for existing account, confirm incorrect, and register error
    if(this.state.step == 1) {
      return (
        <div className="container">
          <form className="form-signin" role="form" onSubmit={this.registerFirst}>
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
            {this.renderError()}
            <button className="btn btn-lg btn-block btn-reg" type="submit">立即註冊</button>
          </form>
        </div>
      );
    } else {
      return (
        <div className="container">
          <form className="form-signin" role="form" onSubmit={this.registerSecond}>
            <h2 className="form-signin-heading">身份驗證</h2>
            <div className="form-group">
              <label htmlFor="inputEmail">學號</label>
              <input
                type="text"
                id="inputId"
                className="form-control"
                placeholder="學號"
                value={this.state.id}
                onChange={this.handleIdChange}
                required autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputEmail">姓名</label>
              <input
                type="text"
                id="inputName"
                className="form-control"
                placeholder="姓名"
                value={this.state.name}
                onChange={this.handleNameChange}
                required autoFocus
              />
            </div>
            {this.renderError()}
            <button className="btn btn-lg btn-block btn-reg" type="submit">進行驗證</button>
          </form>
        </div>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(null, mapDispatchToProps)(Signup);
