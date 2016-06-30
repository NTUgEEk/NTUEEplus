import React, { Component } from 'react';
import 'babel-polyfill';

class Support extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    user: React.PropTypes.object,
    setUser: React.PropTypes.func,
    fetchJSON: React.PropTypes.func,
  }

  render() {
    if (this.props.user === null) return null;
    return (
      <div className="container">
        <div className="jumbotron">
          <h2 className="text-center">Support</h2>
        </div>
      </div>
    );
  }
}

export default Support;
