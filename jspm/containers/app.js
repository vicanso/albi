'use strict';
/* eslint import/no-unresolved:0 */
import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-enroute';
import * as ReactRedux from 'react-redux';
import RegisterLogin from './register-login';
import MainHeader from './main-header';
import MainNav from './main-nav';
import * as User from '../actions/user';
import * as urls from '../constants/urls';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderRegister() {
    const { dispatch } = this.props;
    return <RegisterLogin
      type={"register"}
      onClose={() => this.setState({
        showRegister: false,
      })}
      onSubmit={(account, password) => {
        this.setState({
          showRegister: false,
        });
        dispatch(User.register(account, password));
      }}
    />
  }
  renderLogin() {
    const { dispatch } = this.props;
    const { showLogin } = this.state;
    if (showLogin) {
      return (
        <RegisterLogin
          type={"login"}
          onClose={() => this.setState({
            showLogin: false,
          })}
          onSubmit={(account, password) => {
            this.setState({
              showLogin: false,
            });
            dispatch(User.login(account, password));
          }}
        />
      );
    }
    return null;
  }
  render() {
    const { user, navigation, dispatch } = this.props;
    return <div>
      <MainHeader
        dispatch={dispatch}
        user={user}
      />
      <MainNav />
      <Router {...navigation}>
        <Route path={urls.REGISTER} component={this.renderRegister.bind(this)} />
      </Router>
    </div>
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    navigation: state.navigation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
