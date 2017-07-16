/* eslint import/no-extraneous-dependencies:0 */
import * as _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';


import * as globals from '../helpers/globals';
import store from '../store';
import navigationReducer from '../reducers/navigation';
import userReducer from '../reducers/user';
import AppBar from '../widgets/app-bar';
import LoginDalog from '../widgets/login-dialog';
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
    globals.set('onpopstate', () => {
      console.dir('onpopstate');
    });
    dispatch(userAction.me()).then(() => {

    }).catch((err) => {
      console.error(err);
    });
  }
  render() {
    const {
      user,
      dispatch,
    } = this.props;
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            dispatch={dispatch}
            user={user}
            title={'My Test'}
          />
          <LoginDalog
            open={user.status === 'login'}
          />
        </div>
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
  injectTapEventPlugin();
  initRender();
});
