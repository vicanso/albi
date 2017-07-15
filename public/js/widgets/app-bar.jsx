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


const styleSheet = createStyleSheet('CustomAppBar', {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
});

class CustomAppBar extends Component {
  static get defaultProps() {
    return {
      user: null,
      title: '',
    };
  }
  render() {
    const {
      classes,
      title,
      user,
    } = this.props;
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
            <Button color="contrast">Login</Button>
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
};

export default withStyles(styleSheet)(CustomAppBar);
