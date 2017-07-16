/* eslint import/no-extraneous-dependencies:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';

const styleSheet = createStyleSheet('LoginDialog', {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

class LoginDialog extends Component {
  static get defaultProps() {
    return {
      open: true,
    };
  }
  render() {
    const classes = this.props.classes;
    const {
      open,
    } = this.props;
    return (
      <Dialog
        fullScreen
        open={open}
        transition={<Slide direction="up" />}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Button color="contrast">
              login
            </Button>
          </Toolbar>
        </AppBar>
        <span>ABCD</span>
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styleSheet)(LoginDialog);
