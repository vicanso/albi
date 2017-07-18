/* eslint import/no-extraneous-dependencies:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import {
  Link,
} from 'react-router-dom';

import {
  USER_LOGIN,
} from '../constants/action-type';
import {
  VIEW_LOGIN,
} from '../constants/urls';

const styleSheet = createStyleSheet('CustomAppBar', {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  login: {
    color: '#fff',
    'text-decoration': 'none',
  },
});

class CustomAppBar extends Component {
  static get defaultProps() {
    return {
      user: null,
      title: '',
    };
  }
  handleLogin() {
    const dispatch = this.props.dispatch;
    dispatch({
      type: USER_LOGIN,
    });
  }
  render() {
    const {
      classes,
      title,
      user,
    } = this.props;
    const fetching = user.status === 'fetching';
    return (
      <div className={classes.root}>
        <AppBar
          position="static"
        >
          <Toolbar>
            <IconButton color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography
              type="title"
              color="inherit"
              className={classes.flex}
            >
              {title}
            </Typography>
            {
              fetching && <span>fetching...</span>
            }
            {
              !fetching && !user.account && <Button
                color="contrast"
              >
                <Link
                  to={VIEW_LOGIN}
                  className={classes.login}
                >Login</Link>
              </Button>
            }
            {
              user.account && <span>{user.account}</span>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

CustomAppBar.propTypes = {
  classes: PropTypes.shape({
    flex: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string,
  user: PropTypes.shape(),
  dispatch: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(CustomAppBar);
