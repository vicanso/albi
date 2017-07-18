/* eslint import/no-extraneous-dependencies:0 */
import * as _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


import {
  VIEW_LOGIN,
  VIEW_REGISTER,
  VIEW_ADMIN,
} from '../constants/urls';
import bootstrap from '../bootstrap';
import * as globals from '../helpers/globals';
import store from '../store';
import navigationReducer from '../reducers/navigation';
import userReducer from '../reducers/user';
import AppBar from '../widgets/app-bar';
import LoginRegisterDalog from '../widgets/login-register-dialog';
import * as userAction from '../actions/user';


class App extends Component {
  static get defaultProps() {
    return {
      user: null,
    };
  }
  constructor(props) {
    super(props);
    const {
      dispatch,
    } = props;
    dispatch(userAction.me()).catch((err) => {
      console.error(err);
    });
  }
  renderAppBar() {
    const {
      dispatch,
      user,
    } = this.props;
    return (
      <AppBar
        dispatch={dispatch}
        user={user}
        title={'Admin'}
      />
    );
  }
  renderLoginRegisterDialog(type) {
    const {
      dispatch,
    } = this.props;
    return (
      <LoginRegisterDalog
        type={type}
        dispatch={dispatch}
      />
    );
  }
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route
              path={VIEW_ADMIN}
              component={() => this.renderAppBar()}
            />
            <Route
              path={VIEW_LOGIN}
              component={() => this.renderLoginRegisterDialog('login')}
            />
            <Route
              path={VIEW_REGISTER}
              component={() => this.renderLoginRegisterDialog('register')}
            />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}


App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape(),
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

function initRender() {
  const Provider = ReactRedux.Provider;
  const View = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps)(App);
  const adminStore = store({
    navigation: navigationReducer,
    user: userReducer,
  });
  ReactDOM.render(
    <Provider store={adminStore}>
      <View />
    </Provider>,
    globals.get('document').getElementById('rootContainer'));
}

_.defer(() => {
  initRender();
  bootstrap();
});
