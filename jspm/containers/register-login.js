'use strict';
/* eslint  import/no-unresolved:0 */
import React, { PropTypes } from 'react';
import Dialog from '../components/dialog';

class Register extends Dialog {
  getData() {
    const refs = this.refs;
    return {
      account: (refs.account.value || '').trim(),
      password: (refs.password.value || '').trim(),
    };
  }
  handleSubmit() {
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
    this.props.onSubmit(account, password);
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
            onChange={() => this.handleChange()}
            ref="password"
          />
        </div>
        <div className="pure-controls">
          <a
            href="#"
            className="pure-button pure-button-primary submit"
            onClick={() => this.handleSubmit()}
          >Submit</a>
        </div>
        {this.getError()}
      </fieldset></form>
    );
  }
}

Register.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Register;
