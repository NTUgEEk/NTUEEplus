import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class Logout extends Component {
  static propTypes = {
    setUser: React.PropTypes.func,
  }
  componentWillMount() {
    // TODO: Remove session id from server
    window.location = '/';
  }
  render() {
    return null;
  }
}
export default Logout;
