/* eslint import/no-extraneous-dependencies:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import {
  Link,
} from 'react-router-dom';

import {
  VIEW_LOGIN,
  VIEW_REGISTER,
} from '../constants/urls';
import * as globals from '../helpers/globals';
import * as userAction from '../actions/user';
import {
  convertError,
} from '../helpers/utils';

const styleSheet = createStyleSheet('LoginDialog', theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  container: {
    width: 200,
    margin: '0 auto',
  },
  link: {
    'text-align': 'right',
  },
  progress: {
    color: '#fff',
  },
}));

function close() {
  globals.get('history').back();
}

class LoginRegisterDialog extends Component {
  static get defaultProps() {
    return {
      open: true,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
      email: '',
      status: '',
    };
    if (props.type === 'register') {
      this.text = {
        title: 'User Register',
        submit: 'register',
        link: 'Login',
      };
    } else {
      this.text = {
        title: 'User Login',
        submit: 'login',
        link: 'Register',
      };
    }
  }
  handleSubmit() {
    const {
      dispatch,
      type,
    } = this.props;
    const {
      account,
      password,
      email,
      status,
    } = this.state;
    if (status === 'submitting') {
      return;
    }
    let fn;
    if (type === 'register') {
      fn = userAction.register(account, password, email);
    } else {
      fn = userAction.login(account, password);
    }
    this.setState({
      status: 'submitting',
      error: '',
    });
    dispatch(fn).then(close).catch((err) => {
      this.setState({
        status: '',
        error: convertError(err),
      });
    });
  }
  render() {
    const classes = this.props.classes;
    const {
      open,
      type,
    } = this.props;
    const {
      title,
      submit,
      link,
    } = this.text;
    const {
      status,
      error,
    } = this.state;
    return (
      <Dialog
        fullScreen
        open={open}
        transition={<Slide direction="up" />}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="contrast"
              aria-label="Close"
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              type="title"
              color="inherit"
              className={classes.flex}
            >
              { title }
            </Typography>
            {
              status !== 'submitting' && <Button
                color="contrast"
                onClick={() => this.handleSubmit()}
              >
                { submit }
              </Button>
            }
            {
              status === 'submitting' &&
              <CircularProgress
                className={classes.progress}
                size={25}
              />
            }
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <TextField
            id="account"
            label="Account"
            required
            className={classes.input}
            onChange={e => this.setState({ account: e.target.value })}
            marginForm
          />
          {
            type === 'register' && <TextField
              id="email"
              label="Email"
              required
              className={classes.input}
              onChange={e => this.setState({ email: e.target.value })}
              marginForm
            />
          }
          <TextField
            id="password"
            label="Password"
            className={classes.input}
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
            marginForm
          />
          <div className={classes.link}>
            <Link
              replace
              to={type === 'register' ? VIEW_LOGIN : VIEW_REGISTER}
            >
              {link}
            </Link>
          </div>
          {
            error && <p>{error}</p>
          }
        </div>
      </Dialog>
    );
  }
}

LoginRegisterDialog.propTypes = {
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(LoginRegisterDialog);
