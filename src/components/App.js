import React, { Component } from 'react';
import { fetchJSON, readCookie } from '../utils';

import Header from './Header';

class App extends Component {
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
    };
    this.setUser = this.setUser.bind(this);
  }

  componentWillMount() {
    fetchJSON(
      '/api/session',
      { id: readCookie('session') },
      json => this.setState({ user: json, fetchDone: true })
    );
  }

  setUser(_user) {
    this.setState({ user: _user });
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

  children() {
    const children = React.Children.map(this.props.children,
           (child) => React.cloneElement(child, {
             user: this.state.user,
             setUser: this.setUser,
           }));
    return children;
  }

  render() {
    if (this.state.fetchDone) {
      this.redirectPage();
      return (
        <div>
          <Header user={this.state.user} location={this.props.location}>
            {this.children()}
          </Header>
        </div>
      );
    } else return null;
  }
}

export default App;
