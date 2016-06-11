'use strict';
import React, { Component, PropTypes } from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Actions from '../actions/index';
import RegisterLogin from './register-login';
import MainHeader from './main-header';
import * as User from '../actions/user';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  register(data) {
    // this.setState({
    //   register: {
    //     show: false,
    //     status: 'doing',
    //   },
    // });
    // User.add(data).then(user => {

    // }).catch(err => {

    // });
  }
  showRegister() {
    this.setState({
      showRegister: true,
    });
  }
  componentWillMount() {
    // const { dispatch } = this.props;
    // dispatch(User.fetch());
  }
  renderMainHeader() {
    const { user, dispatch } = this.props;
    return (
      <MainHeader
        dispatch={dispatch}
        user={user}
        showRegister={() => {
          this.setState({
            showRegister: true,
          })
        }}
        showLogin={() => {
          this.setState({
            showLogin: true,
          })
        }}
        logout={() => {
          dispatch(User.logout());
        }}
      />
    );
  }
  renderRegister() {
    const { dispatch } = this.props;
    const { showRegister } = this.state;
    if (showRegister) {
      return (
        <RegisterLogin
          type={"register"}
          onClose={() => this.setState({showRegister: false})}
          onSubmit={(account, password) => {
            this.setState({
              showRegister: false,
            });
            dispatch(User.register(account, password));
          }}
        />
      )
    }
  }
  renderLogin() {
    const { dispatch } = this.props;
    const { showLogin } = this.state;
    if (showLogin) {
      return (
        <RegisterLogin
          type={"login"}
          onClose={() => this.setState({showLogin: false})}
          onSubmit={(account, password) => {
            this.setState({showLogin: false});
            dispatch(User.login(account, password));
          }}
        />
      )
    }
  }
  render() {
    return (
      <div>
        { this.renderMainHeader() }
        { this.renderRegister() }
        { this.renderLogin() }
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: Redux.bindActionCreators(Actions, dispatch),
    dispatch,
  };
}

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);