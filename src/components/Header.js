import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import classNames from 'classnames';

import '../styles/Header.css';

class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: this.getUser(__INITIAL_USER__),
    };
  }

  componentWillMount() {
    const path = this.props.location.pathname;
    console.log(path);
    if (path === '/login' || path === '/register') {
      if (this.state.user !== null) {
        this.context.router.push('/');
      }
    } else if (this.state.user === null) {
      this.context.router.push('/login');
    }
  }

  getUser(sessionId) {
    console.log('Session ID: ', sessionId);
    // TODO: Check if session id is available on server
    // Temp solution: dummy user
    if (sessionId === null) return null;
    else return { /*dummy for now*/ };
  }

  navbarItem() {
    const path = this.props.location.pathname;
    if (this.state.user === null) {
      return (
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="nav navbar-nav navbar-right">
            <li className={classNames({ active: path === '/login' })}><Link to="/login">登入</Link></li>
            <li className={classNames({ active: path === '/register' })}><Link to="/register">註冊</Link></li>
          </ul>
        </div>
      );
    } else { // Return user status, search bar etc.
      return (
        // TODO
        null
      );
    }
  }

  children() {
    const children = React.Children.map(this.props.children,
           (child) => React.cloneElement(child, {
             user: this.state.user,
           }));
    return children;
  }

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
                <img alt="" src="/public/resource/eesa-white.png" style={{ maxHeight: '55px' }} />
              </a>
            </div>
            {this.navbarItem()}
          </div>
        </nav>
        <div className="mainPage">{this.children()}</div>
      </div>
    );
  }
}

export default Header;
