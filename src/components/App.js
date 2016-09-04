import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from './Header';

const App = ({ user, location, children }) => (
  <div>
    <Header user={user} location={location}>
      {children}
    </Header>
  </div>
);

App.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(App);
