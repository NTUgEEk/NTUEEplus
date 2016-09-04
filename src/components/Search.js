import React, { Component, PropTypes } from 'react';

class Search extends Component {
  // All TODO: Finish this page
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h2 className="text-center">{`Type: ${this.props.location.query.type}`}</h2>
          <h2 className="text-center">{`Keyword: ${this.props.location.query.key}`}</h2>
        </div>
      </div>
    );
  }
}

export default Search;
