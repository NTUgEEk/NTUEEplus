import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

class Logout extends Component {
  static propTypes = {
    setUser: React.PropTypes.func,
    fetchJSON: React.PropTypes.func,
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
