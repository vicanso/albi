import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import * as userAction from '../actions/user';
import * as navigationAction from '../actions/navigation';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      error: '',
    };
  }
  getData() {
    const refs = this.refs;
    return {
      account: (refs.account.value || '').trim(),
      password: (refs.password.value || '').trim(),
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    const {
      status,
    } = this.state;
    if (status === 'submitting') {
      return;
    }
    const { dispatch } = this.props;
    const { account, password } = this.getData();
    let error = '';
    if (!account || !password) {
      error = 'Account and Password can\'t be empty';
    } else {
      // if (password.length < 6) {
      //   error = 'Password catn\'t be less than 6 character!';
      // }
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
    this.setState({
      status: 'submitting',
    });
    dispatch(userAction.login(account, password))
      .then(() => {
        dispatch(navigationAction.back());
      })
      .catch((err) => {
        this.setState({
          status: '',
          error: err.response.body.message,
        });
      });
  }
  handleChange() {
    const state = this.state;
    if (state.error) {
      this.setState({
        error: '',
      });
    }
  }
  renderError() {
    const {
      error,
    } = this.state;
    if (!error) {
      return null;
    }
    return (
      <div
        className="flash flash-error"
      >
        {error}
      </div>
    );
  }
  render() {
    const {
      status,
    } = this.state;
    const submitOptions = {
      value: 'Sign in',
      cls: {
        btn: true,
        'btn-primary': true,
        'btn-block': true,
      },
    };
    if (status === 'submitting') {
      submitOptions.value = 'Signing in...';
      submitOptions.cls.disabled = true
    }

    return (
      <div className="login-container">
        <h3 className="tac">Sign in to Albi</h3>
        {
          this.renderError()
        }
        <form
          className="pure-form pure-form-aligned"
          onSubmit={e => this.handleSubmit(e)}
        >
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="account">Username or email address</label>
              <input
                id="account"
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus="true"
                type="text"
                tabIndex="1"
                ref="account"
                onChange={() => this.handleChange()}
              />
            </div>
            <div className="pure-control-group">
              <label htmlFor="password">Password
                <a
                  className="pull-right font12"
                  href="javascript:;"
                  tabIndex="4"
                >Forgot password?</a>
              </label>
              <input
                id="password"
                autoCapitalize="off"
                autoCorrect="off"
                type="password"
                tabIndex="2"
                ref="password"
                onChange={() => this.handleChange()}
              />
            </div>
            <div className="pure-control-group">
              <input
                type="submit"
                className={classnames(submitOptions.cls)}
                value={submitOptions.value}
                tabIndex="3"
              />
            </div>
          </fieldset>
        </form>
        <a
          href="javascript:;"
          className="create-account"
        >Create an account.</a>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default Login;
