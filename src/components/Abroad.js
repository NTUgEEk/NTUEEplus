import React, { Component } from 'react';
import 'babel-polyfill';

class Abroad extends Component {
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
          <h2 className="text-center">舊的EEChain會接在這裡</h2>
          <h2 className="text-center">所以這裡先不用做</h2>
        </div>
      </div>
    );
  }
}

export default Abroad;
