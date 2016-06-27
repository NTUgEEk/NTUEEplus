import React, { Component } from 'react';
import 'babel-polyfill';

import Login from './Login';
import Header from './Header';

export default class Routing extends Component {
  constructor(context) {
    super(context);
    this.state = {
      user: this.get_user(__INITIAL_USER__),
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    if(this.state.user === null)
      this.context.router.push('/login');
  }

  get_user(session_id) {
    console.log(session_id);
    // TODO: Check if session id is available on server
    // Temp solution: dummy user
    if(session_id === null) return null;
    else return {/*dummy for now*/};
  }

  Children() {
    const children = React.Children.map(this.props.children,
          (child) => React.cloneElement(child, {
            user: this.state.user,
          }));
      return children;
  }

  render() {
    return (
      <div>
        {this.Children()}
      </div>
    )
  }
}