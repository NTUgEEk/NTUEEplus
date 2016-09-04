import React, { Component } from 'react';
import { connect } from 'react-redux';

class Settings extends Component {
  // All TODO: Finish this page
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    user: React.PropTypes.object,
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h2 className="text-center">Account Settings</h2>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Settings);
