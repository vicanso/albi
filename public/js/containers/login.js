import React, { PropTypes, Component } from 'react';

class Login extends Component {
  render() {
    return (
      <div className="login-container">
        <form className="pure-form pure-form-aligned">
          <h3 className="tac">Sign in to Albi</h3>
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
              />
            </div>
            <div className="pure-control-group">
              <input
                type="submit"
                className="btn btn-primary btn-block"
                value="Sign in"
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
