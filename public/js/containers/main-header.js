import React, { PropTypes, Component } from 'react';

class MainHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      user,
    } = this.props;
    console.dir(user);
    return (
      <header
        className="main-header"
      >
        <span>{user.account}</span>
      </header>
    );
  }
}

export default MainHeader;
