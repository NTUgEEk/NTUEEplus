import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import ProfileDetail from './ProfileDetail';
import { fetchJSON } from '../utils';

class Profile extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    fetchJSON(
      '/api/profile',
      {
        id: this.props.location.query.id
      },
      (json) => {
        if(json.status !== 'success') return;
        this.setState({ user: json.user });
      }
    );
  }

  render() {
    return (<ProfileDetail user={this.state.user} self={false} />);
  }

}

export default Profile;
