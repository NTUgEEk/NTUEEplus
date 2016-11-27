import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import '../styles/ProfileCard.css';

class ProfileCard extends Component { 

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

    this.context.router.push('/profile?id=' + this.props.user.id);
  }

  render() {
    return (
      // UI TODO: Add more content
      <div className="well profile-card" onClick={this.onClick}>
        <h3>{this.props.user.name}</h3>
        <ul>
          <li>{this.props.user.school_id}</li>
          <li>{this.props.user.email}</li>
          <li>{this.props.user.mobile || '未填寫手機'}</li>
        </ul>
      </div>
    );
  }

}

export default ProfileCard;
