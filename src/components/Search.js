import React, { Component, PropTypes } from 'react';

import ProfileCard from './ProfileCard';
import { fetchJSON } from '../utils';

class Search extends Component {
  // All TODO: Finish this page
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      result: []
    };
  }

  performSearch(nextKey) {
    let key = nextKey || this.state.query;
    fetchJSON(
      '/api/search',
      {
        searchText: key,
      },
      (json) => {
        console.log('Search result: ', json);
        this.setState({ result: json });
      }
    );
  }

  componentWillMount() {
    this.setState({ query: this.props.location.query.key });
  }

  componentDidMount() {
    this.performSearch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ query: nextProps.location.query.key });
    this.performSearch(nextProps.location.query.key);
  }

  renderResult() {
    let list = [];
    for(const i in this.state.result) {
      list.push(<ProfileCard key={i} user={this.state.result[i]} />);
    }
    return list;
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h2 className="text-center">{`搜尋： ${this.state.query}`}</h2>
          <p>共 {this.state.result.length} 筆結果</p>
          {this.renderResult()}
        </div>
      </div>
    );
  }
}

export default Search;
