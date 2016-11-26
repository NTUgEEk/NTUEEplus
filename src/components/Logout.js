import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchJSON, readCookie } from '../utils';
import { setUser } from '../redux/actions';

class Logout extends Component {
  static propTypes = {
    setUser: React.PropTypes.func,
  }
  componentWillMount() {
    //console.log(readCookie('session'));
    // Backend TODO: Implement API for removing session id from server
    // Remeber to change it to POST :)
    fetchJSON(
      '/api/logout',
      {
        session: readCookie('session'),
      },
      (json) => {
        this.props.setUser(null);
        location.href = '/';
      }
    );
  }
  render() {
    // UI TODO: Maybe add a transition page?
    return null;
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(null, mapDispatchToProps)(Logout);
