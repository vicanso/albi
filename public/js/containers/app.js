import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-enroute';
import * as ReactRedux from 'react-redux';

import {
  VIEW_LOGIN,
} from '../constants/urls';
import Login from './login';


class App extends Component {
  renderLogin() {
    const { dispatch } = this.props;
    return (
      <Login
        dispatch={dispatch}
      />
    );
  }
  render() {
    const { user, navigation } = this.props;
    return (
      <div>
        <Router {...navigation}>
          <Route
            path={VIEW_LOGIN}
            component={() => this.renderLogin()}
          />
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
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