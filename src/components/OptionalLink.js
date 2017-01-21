import React, { PropTypes, Component } from 'react';

class OptionalLink extends Component {
  
  static propTypes = {
    href: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    let prefix = this.props.href.substr(0, 7);
    if(prefix == 'http://' || prefix == 'https:/') {
      return (<a target="_blank" href={this.props.href}>{this.props.href}</a>);
    } else {
      return (<span>{this.props.href}</span>);
    }
  }

}

export default OptionalLink;
