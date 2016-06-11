'use strict';
import React, { PropTypes, Component } from 'react';
import * as User from '../actions/user';


class MainHeader extends Component {
  constructor() {
    super();
    this.state = {
      isMounted: false,
    };

  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(User.fetch());
    this.state.isMounted = true;
  }
  renderUserInfo() {
    const { user, showRegister, showLogin, logout } = this.props;
    const { isMounted } = this.state;
    if (!isMounted) {
      return;
    }
    const getError = () => {
      if (user.status) {
        return (
          <span className='warning'>
            <i className='fa fa-exclamation-triangle' aria-hidden="true"></i>
            {user.message}
          </span>
        );
      }
    }
    if (user.status === 'fetching') {
      return (
        <li>
          <i className='fa fa-spinner mright5' aria-hidden='true'></i>
            Loading...
        </li>
      );
    }
    if (user.account) {
      return (
        <li>
          <span>{user.account}</span>
          <a href='javascript:;' onClick={logout}>
            <i className='fa fa-sign-out' aria-hidden='true'></i>
            logout</a>
          {getError()}
        </li>
      );
    }
    return (
      <li>
        <a href='javascript:;' className='mright5' onClick={showRegister}>
          <i className='fa fa-user' aria-hidden='true'></i>
          register</a>
        <a href='javascript:;' onClick={showLogin}>
          <i className='fa fa-sign-in' aria-hidden='true'></i>
          login</a>
        {getError()}
      </li>
    );
  }

  render() {
    const { user } = this.props;
    return (
      <header className='mainHeader'>
        <ul className="pullRight">
          {this.renderUserInfo()}
          <li className="version">Version 3.x</li>
        </ul>
      </header>
    );
  }
};

MainHeader.propTypes = {
  showRegister: PropTypes.func.isRequired,
  showLogin: PropTypes.func.isRequired,
};



export default MainHeader;