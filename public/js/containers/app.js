import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-enroute';
import * as ReactRedux from 'react-redux';

import * as globals from '../helpers/globals';

import {
  VIEW_LOGIN,
  VIEW_REGISTER,
} from '../constants/urls';

import Login from './login';
import Register from './register';
import MainHeader from './main-header';

import * as navigationAction from '../actions/navigation';
import * as userAction from '../actions/user';

class App extends Component {
  constructor(props) {
    super(props);
    const dispatch = props.dispatch;
    globals.set('onpopstate', () => {
      dispatch(navigationAction.back());
    });
    dispatch(userAction.me());
  }
  renderLogin() {
    const { dispatch } = this.props;
    return (
      <Login
        dispatch={dispatch}
      />
    );
  }
  renderRegister() {
    const { dispatch } = this.props;
    return (
      <Register
        dispatch={dispatch}
      />
    );
  }
  render() {
    const { user, navigation } = this.props;
    return (
      <div>
        <MainHeader
          user={user}
        />
        <Router {...navigation}>
          <Route
            path={VIEW_LOGIN}
            component={() => this.renderLogin()}
          />
          <Route
            path={VIEW_REGISTER}
            component={() => this.renderRegister()}
          />
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
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
