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
import APIView from './api-view';

import * as navigationAction from '../actions/navigation';
import * as userAction from '../actions/user';
import * as http from '../helpers/http';

class App extends Component {
  constructor(props) {
    super(props);
    const dispatch = props.dispatch;
    globals.set('onpopstate', () => {
      dispatch(navigationAction.back());
    });
    this.state = {
      isFetchingUserInfo: true,
      showTimingView: false,
    };
    dispatch(userAction.me()).then(() => {
      this.setState({
        isFetchingUserInfo: false,
      });
    }).catch((err) => {
      this.setState({
        isFetchingUserInfo: false,
      });
      console.error(err);
    });
    this.handleLink = this.handleLink.bind(this);
  }
  handleLink(url) {
    const {
      dispatch,
    } = this.props;
    return (e) => {
      e.preventDefault();
      dispatch(navigationAction.to(url));
    };
  }
  renderAPIView() {
    const {
      dispatch,
    } = this.props;
    return (
      <APIView
        dispatch={dispatch}
      />
    );
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
  renderTimingView() {
    const {
      showTimingView,
    } = this.state;
    if (!showTimingView) {
      return (
        <button
          style={{
            position: 'fixed',
            left: 0,
            bottom: 0,
          }}
          onClick={() => {
            this.setState({
              showTimingView: true,
            });
          }}
        >Timing</button>
      );
    }
    return (
      <div
        className="timing-wrapper"
      >
        <button
          onClick={() => {
            this.setState({
              showTimingView: false,
            });
          }}
        >X</button>
        <div
          /* eslint react/no-danger:0 */
          dangerouslySetInnerHTML={{
            __html: http.getTimingView(),
          }}
        />
      </div>
    );
  }
  render() {
    const {
      isFetchingUserInfo,
    } = this.state;
    const {
      user,
      navigation,
      dispatch,
    } = this.props;
    const {
      handleLink,
    } = this;
    return (
      <div>
        <MainHeader
          user={user}
          isFetchingUserInfo={isFetchingUserInfo}
          handleLink={handleLink}
          dispatch={dispatch}
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
          <Route
            path="*"
            component={() => this.renderAPIView()}
          />
        </Router>
        {this.renderTimingView()}
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
  mapDispatchToProps)(App);
