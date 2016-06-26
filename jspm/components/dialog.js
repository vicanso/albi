'use strict';
/* eslint import/no-unresolved:0 */
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

class Dialog extends Component {
  getContent() {
    return;
  }
  render() {
    const state = this.state;
    return (
      <div className={classnames(state.classes)}>
        <div className="maskContainer"></div>
        <div className="dialog" style={state.style}>
          <h3 className="title">
            <a className="close tac" href="#" onClick={e => this.onClose(e)}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </a>
            {state.title || ''}
          </h3>
          <div className="content">
            {this.getContent()}
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
