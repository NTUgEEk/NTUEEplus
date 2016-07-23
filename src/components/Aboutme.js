import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import '../styles/Aboutme.css';

class Aboutme extends Component {
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
          <img
            className="img-responsive center-block img-circle profile-pic"
            alt=""
            src={'/public/users/' + this.props.user.id + '/profile.png'}
          />
          <h2 className="text-center">{this.props.user.name}</h2>
        </div>
      </div>
    );
  }
}

export default Aboutme;
