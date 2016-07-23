import React, { Component } from 'react';

class Carrier extends Component {
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
          <h2 className="text-center">Carrier information</h2>
        </div>
      </div>
    );
  }
}

export default Carrier;
