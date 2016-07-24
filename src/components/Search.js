import React, { Component } from 'react';

class Search extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    user: React.PropTypes.object,
    setUser: React.PropTypes.func,
  }

  render() {
    if (this.props.user === null) return null;
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
