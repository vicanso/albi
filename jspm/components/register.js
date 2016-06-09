'use strict';
import React, { PropTypes, Component } from 'react';
import Dialog from './dialog';

class Register extends Dialog {
  getData() {
    const refs = this.refs;
    return {
      account: (refs.account.value || '').trim(),
      password: (refs.password.value || '').trim(),
    };
  }
  handleSubmit(e) {
    const data = this.getData();
    let error = '';
    if (data.password.length < 6) {
      error = 'Password catn\'t be less than 6 character!';
    }
    if (data.account.length < 4) {
      error = 'Password catn\'t be less than 4 character!';
    }
    if (error) {
      this.setState({'error': error});
      return;
    }
    this.props.onSubmit(data);
  }
  getError() {
    const state = this.state;
    if (!state.error) {
      return;
    }
    return (
      <div className="warning" style={{marginTop: "10px"}}>
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        <span>{state.error}</span> 
      </div>
    );
  }
  handleChange() {
    const state = this.state;
    if (state.error) {
      this.setState({error: ''});
    }
  }
  getContent() {
    return (
      <form className="pure-form pure-form-aligned"><fieldset>
        <div className="pure-control-group">
          <label for="name">Username</label>
          <input id="name"
            type="text"
            placeholder="Username"
            onChange={this.handleChange.bind(this)}
            ref="account" />
        </div>
        <div className="pure-control-group">
            <label for="password">Password</label>
            <input id="password"
              type="password"
              placeholder="Password"
              onChange={this.handleChange.bind(this)}
              ref="password"  />
        </div>
        <div className="pure-controls">
            <a href="javascript:;" className="pure-button pure-button-primary submit"
              onClick={this.handleSubmit.bind(this)}
            >Submit</a>
        </div>
        {this.getError()}
      </fieldset></form>
    );
  }
  constructor() {
    super();
    this.state = {
      classes: {
        registerDialog: true,
      },
      title: 'Register',
      style: {
        marginTop: '-120px',
      },
    };
  }
}

Register.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Register;
