import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import ProfileDetail from './ProfileDetail';
import '../styles/Aboutme.css';

const Aboutme = ({ user }) => (
  <ProfileDetail user={user} self={true} />
);

Aboutme.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(Aboutme);
