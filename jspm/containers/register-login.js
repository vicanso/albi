'use strict';
/* eslint  import/no-unresolved:0 */
import React, { PropTypes } from 'react';
import Dialog from '../components/dialog';
import * as userAction from '../actions/user';
import * as navigationAction from '../actions/navigation';

class RegisterLogin extends Dialog {
  onClose(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(navigationAction.home());
  }
  getData() {
    const refs = this.refs;
    return {
      account: (refs.account.value || '').trim(),
      password: (refs.password.value || '').trim(),
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const { account, password } = this.getData();
    let error = '';
    const type = this.props.type || 'login';
    if (type === 'login') {
      if (!password || !account) {
        error = 'Account and Password can\'t be empty';
      }
    } else {
      if (password.length < 6) {
        error = 'Password catn\'t be less than 6 character!';
      }
      if (account.length < 4) {
        error = 'Password catn\'t be less than 4 character!';
      }
    }
    if (error) {
      this.setState({
        error,
      });
      return;
    }
    let action;
    if (type === 'register') {
      action = userAction.register(account, password);
    } else {
      action = userAction.login(account, password);
    }
    dispatch(action).then(user => {
      dispatch(navigationAction.home());
    }).catch(err => {
      this.setState({
        error: err.response.body.message,
      });
    });
  }
  onKeyUp(e) {
    if (e.keyCode === 0x0d) {
      this.handleSubmit(e);
    }
  }
  getError() {
    const state = this.state;
    if (!state.error) {
      return null;
    }
    return (
      <div
        className="warning"
        style={{
          marginTop: '10px',
        }}
      >
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        <span>{state.error}</span>
      </div>
    );
  }
  handleChange() {
    const state = this.state;
    if (state.error) {
      this.setState({
        error: '',
      });
    }
  }
  componentWillMount() {
    const type = this.props.type || 'login';
    const title = type === 'login' ? 'Login' : 'Register';
    this.state = {
      classes: {
        registerLoginDialog: true,
      },
      title,
      style: {
        marginTop: '-120px',
      },
    };
  }
  getContent() {
    return (
      <form className="pure-form pure-form-aligned"><fieldset>
        <div className="pure-control-group">
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            autoFocus="true"
            placeholder="Username"
            onKeyUp={e => this.onKeyUp(e)}
            onChange={() => this.handleChange()}
            ref="account"
          />
        </div>
        <div className="pure-control-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            onKeyUp={e => this.onKeyUp(e)}
            onChange={() => this.handleChange()}
            ref="password"
          />
        </div>
        <div className="pure-controls">
          <a
            href="#"
            className="pure-button pure-button-primary submit"
            onClick={e => this.handleSubmit(e)}
          >Submit</a>
        </div>
        {this.getError()}
      </fieldset></form>
    );
  }
}

RegisterLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default RegisterLogin;
