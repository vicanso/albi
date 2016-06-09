'use strict';
import React, { Component, PropTypes } from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Actions from '../actions/index';
import Register from './register';
import * as User from '../services/user';

class App extends Component {
  register(data) {
    this.setState({
      register: {
        show: false,
        status: 'doing',
      },
    });
    User.add(data).then(user => {

    }).catch(err => {

    });
  }
  showRegister() {
    this.setState({
      register: {
        show: true,
      },
    });
  }
  componentWillMount() {
    this.setState({
      register: {
        show: false,
        status: '',
      }
    });
  }
  render() {
    const state = this.state || {};
    return (
      <div>
        <a href="javascript:;" onClick={this.showRegister.bind(this)}>Register</a>
        { state.register.show &&
          <Register
            onClose={() => this.setState({register: false})}
            onSubmit={this.register.bind(this)} />
        }
      </div>
    );
  }
}

App.propTypes = {
  register: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    register: state.register,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: Redux.bindActionCreators(Actions, dispatch),
  };
}

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);