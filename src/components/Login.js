import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { fetchJSON } from '../utils';
import { setUser } from '../redux/actions';

import '../styles/Login.css';

class Login extends Component {
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
      invalid: false,
    };
    this.signIn = this.signIn.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  signIn(e) {
    e.preventDefault();
    fetchJSON(
      '/api/login',
      {
        email: this.state.email,
        password: this.state.password,
      },
      (json) => {
        if (json !== null) {
          this.props.setUser(json);
          this.context.router.push('/');
        } else this.setState({ invalid: true }); }
    );
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <div className="row-container row">
          <div className="col-lg-6">
            <p className="intro-text">NTUEE+ 希望成為電機系專屬的人脈網。</p>
            <p>這個網站是系友專屬的通訊錄。<br />經過學號姓名認證後，您可以透過條件搜尋，舉例來說：<br />「美國加州（居住地）」、「機器學習（專業領域）」、「Facebook（就職公司）」、「b03901023（學號）」<br />就像 LinkedIn 一樣，搜尋到最符合您條件的人選。</p>
          </div>
          <form className="col-lg-6" role="form" onSubmit={this.signIn}>
            <h2 className="form-signin-heading">登入</h2>
            <div className="form-group">
              <label htmlFor="inputEmail">電子信箱</label>
              <input
                type="email"
                name="inputEmail"
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
            <div className={classNames('form-error', { error: this.state.invalid })}>
              密碼錯誤或是帳號不存在！
            </div>
            <div className="form-suffix">
              <Link to="/register">還沒有帳號</Link> 或是 <Link to="/forget">忘記密碼？</Link>｜<Link to="/policy">隱私權政策</Link>
            </div>
            <button className="btn btn-lg btn-block btn-login" type="submit">登入</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(null, mapDispatchToProps)(Login);
