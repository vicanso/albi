'use strict';
/* eslint import/no-unresolved:0 */
import React, { PropTypes, Component } from 'react';
import * as userAction from '../actions/user';
import * as navigationAction from '../actions/navigation';

class MainHeader extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(userAction.fetch());
  }
  register(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(navigationAction.register());
  }
  renderUserInfo() {
    const { user, dispatch } = this.props;
    const getError = () => {
      if (user.status) {
        return (
          <span className="warning">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            {user.message}
          </span>
        );
      }
      return null;
    };
    if (user.status === 'fetching') {
      return (
        <li>
          <i className="fa fa-spinner mright5" aria-hidden="true"></i>
            Loading...
        </li>
      );
    }
    if (user.account) {
      return (
        <li>
          <span>{user.account}</span>
          <a href="#">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          logout</a>
          {getError()}
        </li>
      );
    }
    return (
      <li>
        <a href="#" className="mright5" onClick={e => this.register(e)}>
          <i className="fa fa-user" aria-hidden="true"></i>
        register</a>
        <a href="#">
          <i className="fa fa-sign-in" aria-hidden="true"></i>
        login</a>
        {getError()}
      </li>
    );
  }

  render() {
    return (
      <header className="mainHeader">
        <ul className="pullRight">
          {this.renderUserInfo()}
          <li className="version">Version 3.x</li>
        </ul>
      </header>
    );
  }
}

MainHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default MainHeader;
