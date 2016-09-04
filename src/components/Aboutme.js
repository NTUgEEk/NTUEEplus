import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import '../styles/Aboutme.css';

const Aboutme = ({ user }) => (
  // UI TODO: Add more content
  <div className="container">
    <div className="jumbotron">
      <img
        className="img-responsive center-block img-circle profile-pic"
        alt=""
        src={`/public/users/${user.id}/profile.png`}
      />
      <h2 className="text-center">{user.name}</h2>
    </div>
  </div>
);

Aboutme.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Aboutme);
