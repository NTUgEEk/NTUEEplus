import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import classNames from 'classnames';
import fetch from 'isomorphic-fetch';

import '../styles/Header.css';

class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: null,
      fetchDone: false,
      searchType: 'name',
      searchKey: '',
    };
    this.setUser = this.setUser.bind(this);
    this.search = this.search.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
  }

  componentWillMount() {
    this.fetchJSON(
      '/api/session',
      { id: this.readCookie('session') },
      json => this.setState({ user: json, fetchDone: true })
    );
  }

  setUser(_user) {
    this.setState({ user: _user });
  }

  // API for fetching json
  // Send reqJSON to url, get json response, and use jsonFunc to set states or other process
  // Remember to bind "this" to jsonFunc, or use ()=>{}, just like what I did in several places

  fetchJSON(url, reqJSON, jsonFunc) {
    fetch(url, {
      credentials: 'include',
      method: 'post',
      headers: {
        Accept: 'basic, application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqJSON),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('Fetched JSON:', json);
        jsonFunc(json);
      });
  }

  redirectPage() {
    const path = this.props.location.pathname;
    if (path === '/login' || path === '/register') {
      if (this.state.user !== null) {
        this.context.router.push('/');
      }
    } else if (this.state.user === null) {
      this.context.router.push('/login');
    }
  }

  // Read cookie with name, quite obvious :)

  readCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  search(e) {
    e.preventDefault();
    console.log('fuck');
    this.context.router.push(`/search?type=${this.state.searchType}&key=${this.state.searchKey}`);
    // this.props.fetchJSON(
    //   '/api/login',
    //   {
    //     email: this.state.email,
    //     password: this.state.password,
    //   },
    //   json => {
    //     if (json !== null) {
    //       this.props.setUser(json);
    //       this.context.router.push('/');
    //     } else this.setState({ invalid: true }); }
    // );
  }

  handleSearchTypeChange(e) {
    this.setState({ searchType: e.target.value });
  }

  handleSearchKeyChange(e) {
    this.setState({ searchKey: e.target.value });
  }

  navbarItem() {
    const path = this.props.location.pathname;
    if (this.state.user === null) {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li className={classNames({ active: path === '/login' })}>
            <Link to="/login">登入</Link>
          </li>
          <li className={classNames({ active: path === '/register' })}>
            <Link to="/register">註冊</Link>
          </li>
        </ul>
      );
    } else { // Return user status, search bar etc.
      return (
        <div>
          <form className="navbar-form navbar-left" onSubmit={this.search}>
            <div className="form-group">
              <select
                className="form-control search-switch"
                value={this.state.searchType}
                onChange={this.handleSearchTypeChange}
              >
                <option value="name">姓名</option>
                <option value="school_id">學號</option>
                <option value="res">研究</option>
                <option value="field">領域</option>
                <option value="work">工作</option>
              </select>
            </div>
            <div className="form-group search-bar">
              <input
                type="text"
                placeholder="輸入關鍵字"
                className="form-control search-input"
                value={this.state.searchKey}
                onChange={this.handleSearchKeyChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">搜尋</button>
          </form>
          <ul className="nav navbar-nav navbar-right">
            <li className="active">
              <a
                href="#"
                className="dropdown-toggle navbar-name"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  alt=""
                  src={'/public/users/' + this.state.user.id + '/profile.png'}
                />
                {this.state.user.name}
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/">個人簡歷</Link></li>
                <li><Link to="/abroad">留學交流</Link></li>
                <li><Link to="/carrier">人才媒合</Link></li>
                <li role="separator" className="divider"></li>
                {/* <li className="dropdown-header">Nav header</li> */}
                <li><Link to="/support">客服專區</Link></li>
                <li><Link to="/settings">帳號設定</Link></li>
                <li><Link to="/logout">登出</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  }

  children() {
    const children = React.Children.map(this.props.children,
           (child) => React.cloneElement(child, {
             user: this.state.user,
             setUser: this.setUser,
             fetchJSON: this.fetchJSON,
           }));
    return children;
  }

  render() {
    if (this.state.fetchDone) {
      this.redirectPage();
      return (
        <div>
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#navbar"
                >
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  <img
                    alt=""
                    src="/public/resource/eesa-white.png"
                    style={{ maxHeight: '55px' }}
                  />
                </a>
              </div>
              <div className="collapse navbar-collapse" id="navbar">
                {this.navbarItem()}
              </div>
            </div>
          </nav>
          <div className="mainPage">{this.children()}</div>
        </div>
      );
    } else return null;
  }
}

export default Header;
