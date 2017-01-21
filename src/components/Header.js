import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import { fetchJSON } from '../utils';

import '../styles/Header.css';

class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    user: React.PropTypes.object,
    children: React.PropTypes.node,
    location: React.PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchType: 'name',
      searchKey: '',
    };
    this.search = this.search.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
  }

  search(e) {
    e.preventDefault();
    this.context.router.push(`/search?type=${this.state.searchType}&key=${this.state.searchKey}`);
  }

  handleSearchTypeChange(e) {
    this.setState({ searchType: e.target.value });
  }

  handleSearchKeyChange(e) {
    this.setState({ searchKey: e.target.value });
  }

  navbarItem() {
    const path = this.props.location.pathname;
    if (this.props.user === null) {
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
                  src={`/public/resource/default_profile.jpg`}
                />
                {this.props.user.name}
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

  render() {
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
        <div className="mainPage">{this.props.children}</div>
      </div>
      );
  }
}

export default Header;
